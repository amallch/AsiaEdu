const express = require("express");
const router = express.Router();

const path = require("path");
const multer = require("multer");

const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Enrollment = require("../models/Enrollment");


// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            path.join(__dirname, "../uploads")
        );

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1000000) +
            path.extname(file.originalname);

        cb(
            null,
            uniqueName
        );

    }

});


const upload = multer({
    storage: storage
});


// =====================================================
// UPLOAD LESSON ATTACHMENTS
// TEACHER ONLY
// =====================================================

router.post(
    "/upload",
    upload.array("files"),
    async (req, res) => {

        try {

            if (
                !req.files ||
                req.files.length === 0
            ) {

                return res.status(400).json({

                    message:
                        "No files uploaded"

                });

            }


            const attachments =
                req.files.map((file) => {

                    return {

                        name:
                            file.originalname,

                        url:
                            "https://asiaedu-backend.onrender.com/uploads/" +
                            file.filename

                    };

                });


            res.status(200).json({

                message:
                    "Files uploaded successfully",

                attachments:
                    attachments

            });


        } catch (error) {

            console.error(
                "Upload files error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to upload files",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// CREATE A LESSON
// TEACHER ONLY
// =====================================================

router.post(
    "/",
    async (req, res) => {

        try {

            const {
                title,
                description,
                content,
                course,
                session,
                teacher,
                resources,
                attachments
            } = req.body;


            // =================================================
            // CHECK REQUIRED FIELDS
            // =================================================

            if (
                !title ||
                !description ||
                !content ||
                !course ||
                !session ||
                !teacher
            ) {

                return res.status(400).json({

                    message:
                        "Please provide all required fields"

                });

            }


            // =================================================
            // CREATE LESSON
            // =================================================

            const lesson = new Lesson({

                title,
                description,
                content,
                course,
                session,
                teacher,

                resources:
                    resources || [],

                attachments:
                    attachments || []

            });


            // =================================================
            // SAVE LESSON
            // =================================================

            await lesson.save();


            // =================================================
            // RETURN CREATED LESSON
            // =================================================

            const populatedLesson =
                await Lesson.findById(
                    lesson._id
                )
                .populate("course")
                .populate("session")
                .populate(
                    "teacher",
                    "name email teacherId"
                );


            res.status(201).json({

                message:
                    "Lesson created successfully",

                lesson:
                    populatedLesson

            });


        } catch (error) {

            console.error(
                "Create lesson error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// GET ALL LESSONS FOR ADMIN
// =====================================================

router.get(
    "/admin",
    async (req, res) => {

        try {

            const lessons =
                await Lesson.find()
                    .populate("course")
                    .populate("session")
                    .populate(
                        "teacher",
                        "name email teacherId"
                    );


            res.status(200).json({

                message:
                    "Admin lessons retrieved successfully",

                lessons:
                    lessons

            });


        } catch (error) {

            console.error(
                "Get admin lessons error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get admin lessons",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// GET LESSONS FOR A TEACHER
// =====================================================

router.get(
    "/teacher/:teacherId",
    async (req, res) => {

        try {

            // =================================================
            // CHECK TEACHER
            // =================================================

            const teacher =
                await Teacher.findById(
                    req.params.teacherId
                );


            if (!teacher) {

                return res.status(404).json({

                    message:
                        "Teacher not found"

                });

            }


            // =================================================
            // GET LESSONS
            // =================================================

            const lessons =
                await Lesson.find({

                    teacher:
                        teacher._id

                })
                .populate("course")
                .populate("session")
                .populate(
                    "teacher",
                    "name email teacherId"
                )
                .sort({

                    createdAt:
                        -1

                });


            // =================================================
            // RESPONSE
            // =================================================

            res.status(200).json({

                message:
                    "Teacher lessons retrieved successfully",

                lessons:
                    lessons

            });


        } catch (error) {

            console.error(
                "Get teacher lessons error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get teacher lessons",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// GET LESSONS FOR A STUDENT
// =====================================================

router.get(
    "/student/:studentId",
    async (req, res) => {

        try {

            // =================================================
            // CHECK STUDENT
            // =================================================

            const student =
                await Student.findById(
                    req.params.studentId
                );


            if (!student) {

                return res.status(404).json({

                    message:
                        "Student not found"

                });

            }


            // =================================================
            // GET CONFIRMED ENROLLMENTS
            // =================================================

            const enrollments =
                await Enrollment.find({

                    userId:
                        student.userId,

                    status:
                        "Confirmed"

                });


            // =================================================
            // CHECK ENROLLMENTS
            // =================================================

            if (
                enrollments.length === 0
            ) {

                return res.status(200).json({

                    message:
                        "Student has no confirmed enrollments",

                    lessons:
                        []

                });

            }


            // =================================================
            // GET SESSION IDS
            // =================================================

            const sessionIds =
                enrollments
                    .map(
                        (enrollment) => {

                            return enrollment.sessionId;

                        }
                    )
                    .filter(Boolean);


            // =================================================
            // GET LESSONS
            // =================================================

            const lessons =
                await Lesson.find({

                    session: {

                        $in:
                            sessionIds

                    }

                })
                .populate("course")
                .populate("session")
                .populate(
                    "teacher",
                    "name email teacherId"
                )
                .sort({

                    createdAt:
                        -1

                });


            // =================================================
            // GET STUDENT PROGRESS
            // =================================================

            const progressRecords =
                await LessonProgress.find({

                    student:
                        student._id,

                    lesson: {

                        $in:
                            lessons.map(
                                (lesson) => {

                                    return lesson._id;

                                }
                            )

                    }

                });


            // =================================================
            // ADD STATUS TO EACH LESSON
            // =================================================

            const lessonsWithProgress =
                lessons.map(
                    (lesson) => {

                        const progress =
                            progressRecords.find(
                                (item) => {

                                    return (
                                        item.lesson.toString() ===
                                        lesson._id.toString()
                                    );

                                }
                            );


                        let status =
                            "Not Started";


                        if (progress) {

                            status =
                                progress.status;

                        }


                        return {

                            ...lesson.toObject(),

                            status:
                                status

                        };

                    }
                );


            // =================================================
            // RESPONSE
            // =================================================

            res.status(200).json({

                message:
                    "Student lessons retrieved successfully",

                lessons:
                    lessonsWithProgress

            });


        } catch (error) {

            console.error(
                "Get student lessons error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get student lessons",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// START A LESSON
// STUDENT ONLY
// =====================================================

router.post(
    "/progress/:studentId/:lessonId",
    async (req, res) => {

        try {

            const {
                studentId,
                lessonId
            } = req.params;


            // =================================================
            // CHECK STUDENT
            // =================================================

            const student =
                await Student.findById(
                    studentId
                );


            if (!student) {

                return res.status(404).json({

                    message:
                        "Student not found"

                });

            }


            // =================================================
            // CHECK LESSON
            // =================================================

            const lesson =
                await Lesson.findById(
                    lessonId
                );


            if (!lesson) {

                return res.status(404).json({

                    message:
                        "Lesson not found"

                });

            }


            // =================================================
            // CREATE OR UPDATE PROGRESS
            // =================================================

            const progress =
                await LessonProgress.findOneAndUpdate(

                    {
                        student:
                            studentId,

                        lesson:
                            lessonId

                    },

                    {

                        status:
                            "Started"

                    },

                    {

                        new:
                            true,

                        upsert:
                            true,

                        runValidators:
                            true

                    }

                );


            // =================================================
            // RESPONSE
            // =================================================

            res.status(200).json({

                message:
                    "Lesson started successfully",

                progress:
                    progress

            });


        } catch (error) {

            console.error(
                "Start lesson error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to start lesson",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// UPDATE A LESSON
// =====================================================

router.put(
    "/:id",
    async (req, res) => {

        try {

            // =================================================
            // CHECK LESSON
            // =================================================

            const lesson =
                await Lesson.findById(
                    req.params.id
                );


            if (!lesson) {

                return res.status(404).json({

                    message:
                        "Lesson not found"

                });

            }


            const {
                title,
                description,
                content,
                course,
                session,
                resources,
                attachments
            } = req.body;


            // =================================================
            // CHECK REQUIRED FIELDS
            // =================================================

            if (
                !title ||
                !description ||
                !content ||
                !course ||
                !session
            ) {

                return res.status(400).json({

                    message:
                        "Please provide all required fields"

                });

            }


            // =================================================
            // UPDATE LESSON
            // =================================================

            const updatedLesson =
                await Lesson.findByIdAndUpdate(

                    req.params.id,

                    {

                        title,
                        description,
                        content,
                        course,
                        session,

                        resources:
                            resources || [],

                        attachments:
                            attachments || []

                    },

                    {

                        new:
                            true,

                        runValidators:
                            true

                    }

                )
                .populate("course")
                .populate("session")
                .populate(
                    "teacher",
                    "name email teacherId"
                );


            // =================================================
            // RESPONSE
            // =================================================

            res.status(200).json({

                message:
                    "Lesson updated successfully",

                lesson:
                    updatedLesson

            });


        } catch (error) {

            console.error(
                "Update lesson error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to update lesson",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// DELETE A LESSON
// =====================================================

router.delete(
    "/:id",
    async (req, res) => {

        try {

            // =================================================
            // CHECK LESSON
            // =================================================

            const lesson =
                await Lesson.findById(
                    req.params.id
                );


            if (!lesson) {

                return res.status(404).json({

                    message:
                        "Lesson not found"

                });

            }


            // =================================================
            // DELETE
            // =================================================

            await Lesson.findByIdAndDelete(
                req.params.id
            );


            // =================================================
            // RESPONSE
            // =================================================

            res.status(200).json({

                message:
                    "Lesson deleted successfully",

                lesson:
                    lesson

            });


        } catch (error) {

            console.error(
                "Delete lesson error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to delete lesson"

            });

        }

    }
);


// =====================================================
// GET ALL LESSONS
// ADMIN ONLY
// =====================================================

router.get(
    "/",
    async (req, res) => {

        try {

            const lessons =
                await Lesson.find()
                    .populate("course")
                    .populate("session")
                    .populate(
                        "teacher",
                        "name email teacherId"
                    )
                    .sort({

                        createdAt:
                            -1

                    });


            res.status(200).json({

                message:
                    "All lessons retrieved successfully",

                lessons:
                    lessons

            });


        } catch (error) {

            console.error(
                "Get all lessons error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get lessons",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;