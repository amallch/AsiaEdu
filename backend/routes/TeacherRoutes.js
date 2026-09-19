const express = require("express");

const Teacher = require("../models/Teacher");

const router = express.Router();


/* =====================================================
   CREATE TEACHER
   ADMIN ONLY
===================================================== */

router.post(
    "/",
    async (req, res) => {

        try {

            /* =================================================
               GENERATE TEACHER ID
            ================================================= */

            const lastTeacher =
                await Teacher.findOne()
                    .sort({
                        teacherId: -1
                    });


            let teacherNumber = 1;


            if (
                lastTeacher &&
                lastTeacher.teacherId
            ) {

                const lastNumber =
                    parseInt(
                        lastTeacher.teacherId.replace(
                            "TCH-",
                            ""
                        ),
                        10
                    );


                if (!isNaN(lastNumber)) {

                    teacherNumber =
                        lastNumber + 1;

                }

            }


            const teacherId =
                `TCH-${String(teacherNumber).padStart(3, "0")}`;


            /* =================================================
               CREATE TEACHER
            ================================================= */

            const teacher =
                new Teacher({

                    ...req.body,

                    teacherId: teacherId

                });


            const savedTeacher =
                await teacher.save();


            /* =================================================
               RESPONSE
            ================================================= */

            res.status(201).json({

                message:
                    "Teacher created successfully",

                teacher:
                    savedTeacher

            });

        }

        catch (error) {

            console.error(
                "Error creating teacher:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to create teacher",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   GET ALL TEACHERS
   ADMIN ONLY
===================================================== */

router.get(
    "/",
    async (req, res) => {

        try {

            const teachers =
                await Teacher.find()
                    .sort({
                        teacherId: 1
                    });


            res.status(200).json(
                teachers
            );

        }

        catch (error) {

            console.error(
                "Error getting teachers:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get teachers",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   GET TEACHER BY USER ID
===================================================== */

router.get(
    "/user/:userId",
    async (req, res) => {

        try {

            const teacher =
                await Teacher.findOne({

                    userId:
                        req.params.userId

                });


            if (!teacher) {

                return res.status(404).json({

                    message:
                        "Teacher not found for this user"

                });

            }


            res.status(200).json(
                teacher
            );

        }

        catch (error) {

            console.error(
                "Error getting teacher by user ID:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get teacher",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   UPDATE TEACHER COURSE STATUS
   ADMIN ONLY
===================================================== */

router.put(
    "/:id/course-status",
    async (req, res) => {

        try {

            const {
                courseId,
                status
            } = req.body;


            /* =================================================
               VALIDATION
            ================================================= */

            if (!courseId) {

                return res.status(400).json({

                    message:
                        "Course ID is required"

                });

            }


            if (
                status !== "Active" &&
                status !== "Inactive"
            ) {

                return res.status(400).json({

                    message:
                        "Status must be Active or Inactive"

                });

            }


            /* =================================================
               FIND TEACHER
            ================================================= */

            const teacher =
                await Teacher.findById(
                    req.params.id
                );


            if (!teacher) {

                return res.status(404).json({

                    message:
                        "Teacher not found"

                });

            }


            /* =================================================
               FIND TEACHER COURSE
            ================================================= */

            const teacherCourse =
                teacher.courses.find(
                    (course) =>
                        String(course.courseId) ===
                        String(courseId)
                );


            if (!teacherCourse) {

                return res.status(404).json({

                    message:
                        "This course is not assigned to this teacher"

                });

            }


            /* =================================================
               SAME STATUS
            ================================================= */

            if (
                teacherCourse.status === status
            ) {

                return res.status(200).json({

                    message:
                        `Teacher course is already ${status}`,

                    teacher:
                        teacher

                });

            }


            /* =================================================
               UPDATE COURSE STATUS
            ================================================= */

            teacherCourse.status =
                status;


            await teacher.save();


            /* =================================================
               RESPONSE
            ================================================= */

            res.status(200).json({

                message:
                    status === "Inactive"
                        ? "Teacher course deactivated successfully"
                        : "Teacher course activated successfully",

                teacher:
                    teacher

            });

        }

        catch (error) {

            console.error(
                "Error updating teacher course status:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to update teacher course status",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   GET ONE TEACHER
===================================================== */

router.get(
    "/:id",
    async (req, res) => {

        try {

            const teacher =
                await Teacher.findById(
                    req.params.id
                );


            if (!teacher) {

                return res.status(404).json({

                    message:
                        "Teacher not found"

                });

            }


            res.status(200).json(
                teacher
            );

        }

        catch (error) {

            console.error(
                "Error getting teacher:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get teacher",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   UPDATE TEACHER
   ADMIN ONLY
===================================================== */

router.put(
    "/:id",
    async (req, res) => {

        try {

            /*
             * Do not allow the frontend to change
             * the generated teacherId.
             */

            const updateData = {
                ...req.body
            };


            delete updateData.teacherId;


            const teacher =
                await Teacher.findByIdAndUpdate(

                    req.params.id,

                    updateData,

                    {
                        new: true,

                        runValidators: true

                    }

                );


            if (!teacher) {

                return res.status(404).json({

                    message:
                        "Teacher not found"

                });

            }


            res.status(200).json({

                message:
                    "Teacher updated successfully",

                teacher:
                    teacher

            });

        }

        catch (error) {

            console.error(
                "Error updating teacher:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to update teacher",

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   DELETE TEACHER
   ADMIN ONLY
===================================================== */

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const teacher =
                await Teacher.findByIdAndDelete(
                    req.params.id
                );


            if (!teacher) {

                return res.status(404).json({

                    message:
                        "Teacher not found"

                });

            }


            res.status(200).json({

                message:
                    "Teacher deleted successfully",

                teacher:
                    teacher

            });

        }

        catch (error) {

            console.error(
                "Error deleting teacher:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to delete teacher",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;