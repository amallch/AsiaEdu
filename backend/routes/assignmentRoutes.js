const express = require("express");
const path = require("path");
const multer = require("multer");

const router = express.Router();

const Assignment = require("../models/Assignment");
const Session = require("../models/Session");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");


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
// UPLOAD ASSIGNMENT ATTACHMENTS
// TEACHER / ADMIN
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


        }

        catch (error) {

            console.error(
                "Upload assignment files error:",
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
// CREATE AN ASSIGNMENT
// TEACHER / ADMIN
// =====================================================

router.post(
    "/",
    async (req, res) => {

        try {

            const {
                title,
                description,
                instructions,
                course,
                session,
                teacher,
                dueDate,
                maxScore,
                resources,
                attachments
            } = req.body;


            /* =================================================
               CHECK REQUIRED FIELDS
            ================================================= */

            if (
                !title ||
                !description ||
                !instructions ||
                !course ||
                !session ||
                !teacher ||
                !dueDate
            ) {

                return res.status(400).json({

                    message:
                        "Please provide all required fields"

                });

            }


            /* =================================================
               CHECK TEACHER
            ================================================= */

            const existingTeacher =
                await Teacher.findById(
                    teacher
                );


            if (!existingTeacher) {

                return res.status(404).json({

                    message:
                        "Teacher not found"

                });

            }


            /* =================================================
               CHECK SESSION
            ================================================= */

            const existingSession =
                await Session.findById(
                    session
                );


            if (!existingSession) {

                return res.status(404).json({

                    message:
                        "Session not found"

                });

            }


            /* =================================================
               CHECK SESSION TEACHER
            ================================================= */

            if (
                existingSession.instructor &&
                String(
                    existingSession.instructor
                ) !==
                String(
                    teacher
                )
            ) {

                return res.status(400).json({

                    message:
                        "The selected session does not belong to this teacher"

                });

            }


            /* =================================================
               CREATE ASSIGNMENT
            ================================================= */

            const assignment =
                new Assignment({

                    title,

                    description,

                    instructions,

                    course,

                    session,

                    teacher,

                    dueDate,

                    maxScore:
                        maxScore || 100,

                    resources:
                        resources || [],

                    attachments:
                        attachments || []

                });


            /* =================================================
               SAVE ASSIGNMENT
            ================================================= */

            await assignment.save();


            /* =================================================
               POPULATE ASSIGNMENT
            ================================================= */

            const populatedAssignment =
                await Assignment.findById(
                    assignment._id
                )
                .populate("course")
                .populate("session")
                .populate(
                    "teacher",
                    "name email teacherId"
                );


            /* =================================================
               RESPONSE
            ================================================= */

            res.status(201).json({

                message:
                    "Assignment created successfully",

                assignment:
                    populatedAssignment

            });


        }

        catch (error) {

            console.error(
                "Create assignment error:",
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
// GET ALL ASSIGNMENTS FOR ADMIN
// =====================================================

router.get(
    "/admin",
    async (req, res) => {

        try {

            const assignments =
                await Assignment.find()
                    .populate("course")
                    .populate("session")
                    .populate(
                        "teacher",
                        "name email teacherId"
                    )
                    .sort({
                        createdAt: -1
                    });


            res.status(200).json({

                message:
                    "Admin assignments retrieved successfully",

                assignments:
                    assignments

            });

        }

        catch (error) {

            console.error(
                "Get admin assignments error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get admin assignments",

                error:
                    error.message

            });

        }

    }
);



// =====================================================
// GET ASSIGNMENTS FOR A TEACHER
// =====================================================

router.get(
    "/teacher/:teacherId",
    async (req, res) => {

        try {

            const teacher =
                await Teacher.findById(
                    req.params.teacherId
                );


            /* =============================================
               CHECK TEACHER
            ============================================= */

            if (!teacher) {

                return res.status(404).json({

                    message:
                        "Teacher not found"

                });

            }


            /* =============================================
               GET TEACHER ASSIGNMENTS
            ============================================= */

            const assignments =
                await Assignment.find({

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
                    createdAt: -1
                });


            /* =============================================
               RESPONSE
            ============================================= */

            res.status(200).json({

                message:
                    "Teacher assignments retrieved successfully",

                assignments:
                    assignments

            });

        }

        catch (error) {

            console.error(
                "Get teacher assignments error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get teacher assignments",

                error:
                    error.message

            });

        }

    }
);



// =====================================================
// GET ASSIGNMENTS FOR A STUDENT
// =====================================================

router.get(
    "/student/:studentId",
    async (req, res) => {

        try {

            const student =
                await Student.findById(
                    req.params.studentId
                );


            /* =============================================
               CHECK STUDENT
            ============================================= */

            if (!student) {

                return res.status(404).json({

                    message:
                        "Student not found"

                });

            }


            /* =============================================
               GET THE COURSES OF THE STUDENT
            ============================================= */

            const courseIds =
                student.courses.map(
                    (course) =>
                        course.courseId
                );


            /* =============================================
               GET ASSIGNMENTS BELONGING TO THESE COURSES
            ============================================= */

            const assignments =
                await Assignment.find({

                    course: {
                        $in:
                            courseIds
                    }

                })
                .populate("course")
                .populate("session")
                .populate(
                    "teacher",
                    "name email teacherId"
                )
                .sort({
                    dueDate: 1
                });


            /* =============================================
               RESPONSE
            ============================================= */

            res.status(200).json({

                message:
                    "Student assignments retrieved successfully",

                assignments:
                    assignments

            });

        }

        catch (error) {

            console.error(
                "Get student assignments error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get student assignments",

                error:
                    error.message

            });

        }

    }
);



// =====================================================
// GET ONE ASSIGNMENT
// =====================================================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const assignment =
                await Assignment.findById(
                    req.params.id
                )
                .populate("course")
                .populate("session")
                .populate(
                    "teacher",
                    "name email teacherId"
                );


            /* =============================================
               CHECK ASSIGNMENT
            ============================================= */

            if (!assignment) {

                return res.status(404).json({

                    message:
                        "Assignment not found"

                });

            }


            /* =============================================
               RESPONSE
            ============================================= */

            res.status(200).json({

                message:
                    "Assignment retrieved successfully",

                assignment:
                    assignment

            });

        }

        catch (error) {

            console.error(
                "Get assignment error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get assignment",

                error:
                    error.message

            });

        }

    }
);



// =====================================================
// UPDATE AN ASSIGNMENT
// =====================================================

router.put(
    "/:id",
    async (req, res) => {

        try {

            const assignment =
                await Assignment.findById(
                    req.params.id
                );


            /* =============================================
               CHECK ASSIGNMENT
            ============================================= */

            if (!assignment) {

                return res.status(404).json({

                    message:
                        "Assignment not found"

                });

            }


            const {
                title,
                description,
                instructions,
                course,
                session,
                teacher,
                dueDate,
                maxScore,
                resources,
                attachments
            } = req.body;


            /* =============================================
               CHECK NEW TEACHER
            ============================================= */

            if (
                teacher !== undefined
            ) {

                const newTeacher =
                    await Teacher.findById(
                        teacher
                    );


                if (
                    !newTeacher
                ) {

                    return res.status(404).json({

                        message:
                            "Teacher not found"

                    });

                }


                assignment.teacher =
                    teacher;

            }


            /* =============================================
               CHECK NEW SESSION
            ============================================= */

            if (
                session !== undefined
            ) {

                const newSession =
                    await Session.findById(
                        session
                    );


                if (
                    !newSession
                ) {

                    return res.status(404).json({

                        message:
                            "Session not found"

                    });

                }


                const finalTeacher =
                    teacher !== undefined
                        ? teacher
                        : assignment.teacher;


                if (
                    newSession.instructor &&
                    String(
                        newSession.instructor
                    ) !==
                    String(
                        finalTeacher
                    )
                ) {

                    return res.status(400).json({

                        message:
                            "The selected session does not belong to this teacher"

                    });

                }


                assignment.session =
                    session;

            }


            /* =============================================
               UPDATE FIELDS
            ============================================= */

            if (title !== undefined) {

                assignment.title =
                    title;

            }


            if (description !== undefined) {

                assignment.description =
                    description;

            }


            if (instructions !== undefined) {

                assignment.instructions =
                    instructions;

            }


            if (course !== undefined) {

                assignment.course =
                    course;

            }


            if (dueDate !== undefined) {

                assignment.dueDate =
                    dueDate;

            }


            if (maxScore !== undefined) {

                assignment.maxScore =
                    maxScore;

            }


            if (resources !== undefined) {

                assignment.resources =
                    resources;

            }


            if (attachments !== undefined) {

                assignment.attachments =
                    attachments;

            }


            /* =============================================
               SAVE UPDATED ASSIGNMENT
            ============================================= */

            await assignment.save();


            /* =============================================
               POPULATE UPDATED ASSIGNMENT
            ============================================= */

            const updatedAssignment =
                await Assignment.findById(
                    assignment._id
                )
                .populate("course")
                .populate("session")
                .populate(
                    "teacher",
                    "name email teacherId"
                );


            /* =============================================
               RESPONSE
            ============================================= */

            res.status(200).json({

                message:
                    "Assignment updated successfully",

                assignment:
                    updatedAssignment

            });

        }

        catch (error) {

            console.error(
                "Update assignment error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to update assignment",

                error:
                    error.message

            });

        }

    }
);



// =====================================================
// DELETE AN ASSIGNMENT
// =====================================================

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const assignment =
                await Assignment.findById(
                    req.params.id
                );


            /* =============================================
               CHECK ASSIGNMENT
            ============================================= */

            if (!assignment) {

                return res.status(404).json({

                    message:
                        "Assignment not found"

                });

            }


            /* =============================================
               DELETE
            ============================================= */

            await Assignment.findByIdAndDelete(
                req.params.id
            );


            /* =============================================
               RESPONSE
            ============================================= */

            res.status(200).json({

                message:
                    "Assignment deleted successfully",

                assignment:
                    assignment

            });

        }

        catch (error) {

            console.error(
                "Delete assignment error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to delete assignment",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;