const express = require("express");

const Course = require("../models/Course");

const Session = require("../models/Session");

const Enrollment = require("../models/Enrollment");

const router = express.Router();


/* =========================================================
   CREATE COURSE
   ADMIN ONLY
========================================================= */

router.post(
    "/",
    async (req, res) => {

        try {

            /* =====================================================
               FIND HIGHEST NUMERIC COURSE ID
            ===================================================== */

            const lastCourse =
                await Course.findOne({
                    id: {
                        $exists: true,
                        $ne: null
                    }
                })
                .sort({
                    id: -1
                });


            let nextId = 1;


            if (
                lastCourse &&
                typeof lastCourse.id === "number"
            ) {

                nextId =
                    lastCourse.id + 1;

            }


            /* =====================================================
               CREATE COURSE
            ===================================================== */

            const newCourse =
                new Course({

                    id: nextId,

                    language:
                        req.body.language,

                    level:
                        req.body.level,

                    title:
                        req.body.title,

                    duration:
                        req.body.duration,

                    startDate:
                        req.body.startDate || "",

                    price:
                        req.body.price,

                    description:
                        req.body.description || "",

                    learnPoints:
                        req.body.learnPoints || [],

                    syllabus:
                        req.body.syllabus || []

                });


            await newCourse.save();


            res.status(201).json({

                message:
                    "Course created successfully",

                course:
                    newCourse

            });

        }

        catch (error) {

            console.error(
                "Error creating course:",
                error
            );


            res.status(500).json({

                message:
                    "Error creating course",

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   GET ALL COURSES
   PUBLIC
========================================================= */

router.get(
    "/",
    async (req, res) => {

        try {

            const courses =
                await Course.find()
                    .sort({
                        id: 1
                    });


            res.status(200).json(
                courses
            );

        }

        catch (error) {

            console.error(
                "Error getting courses:",
                error
            );


            res.status(500).json({

                message:
                    "Error getting courses",

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   GET ONE COURSE
   PUBLIC
========================================================= */

router.get(
    "/:id",
    async (req, res) => {

        try {

            const courseId =
                Number(req.params.id);


            if (Number.isNaN(courseId)) {

                return res.status(400).json({

                    message:
                        "Invalid course ID"

                });

            }


            const course =
                await Course.findOne({

                    id: courseId

                });


            if (!course) {

                return res.status(404).json({

                    message:
                        "Course not found"

                });

            }


            res.status(200).json(
                course
            );

        }

        catch (error) {

            console.error(
                "Error getting course:",
                error
            );


            res.status(500).json({

                message:
                    "Error getting course",

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   UPDATE COURSE
   ADMIN ONLY
========================================================= */

router.put(
    "/:id",
    async (req, res) => {

        try {

            const courseId =
                Number(req.params.id);


            if (Number.isNaN(courseId)) {

                return res.status(400).json({

                    message:
                        "Invalid course ID"

                });

            }


            /* =====================================================
               UPDATE ONLY COURSE FIELDS
            ===================================================== */

            const updateData = {

                language:
                    req.body.language,

                level:
                    req.body.level,

                title:
                    req.body.title,

                duration:
                    req.body.duration,

                startDate:
                    req.body.startDate || "",

                price:
                    req.body.price,

                description:
                    req.body.description || "",

                learnPoints:
                    req.body.learnPoints || [],

                syllabus:
                    req.body.syllabus || []

            };


            const updatedCourse =
                await Course.findOneAndUpdate(

                    {
                        id: courseId
                    },

                    updateData,

                    {
                        new: true,

                        runValidators: true

                    }

                );


            if (!updatedCourse) {

                return res.status(404).json({

                    message:
                        "Course not found"

                });

            }


            res.status(200).json({

                message:
                    "Course updated successfully",

                course:
                    updatedCourse

            });

        }

        catch (error) {

            console.error(
                "Error updating course:",
                error
            );


            res.status(500).json({

                message:
                    "Error updating course",

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   DELETE COURSE
   ADMIN ONLY
========================================================= */

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const courseId =
                Number(req.params.id);


            if (Number.isNaN(courseId)) {

                return res.status(400).json({

                    message:
                        "Invalid course ID"

                });

            }


            /* =====================================================
               FIND COURSE
            ===================================================== */

            const course =
                await Course.findOne({

                    id: courseId

                });


            if (!course) {

                return res.status(404).json({

                    message:
                        "Course not found"

                });

            }


            /* =====================================================
               CHECK SESSIONS
            ===================================================== */

            const sessionCount =
                await Session.countDocuments({

                    course: course._id

                });


            if (sessionCount > 0) {

                return res.status(400).json({

                    message:
                        "Cannot delete this course because it still has sessions. Delete its sessions first."

                });

            }


            /* =====================================================
               CHECK ENROLLMENTS
            ===================================================== */

            const enrollmentCount =
                await Enrollment.countDocuments({

                    courseId: course._id

                });


            if (enrollmentCount > 0) {

                return res.status(400).json({

                    message:
                        "Cannot delete this course because it has enrollment history."

                });

            }


            /* =====================================================
               DELETE COURSE
            ===================================================== */

            const deletedCourse =
                await Course.findOneAndDelete({

                    id: courseId

                });


            if (!deletedCourse) {

                return res.status(404).json({

                    message:
                        "Course not found"

                });

            }


            res.status(200).json({

                message:
                    "Course deleted successfully",

                course:
                    deletedCourse

            });

        }

        catch (error) {

            console.error(
                "Error deleting course:",
                error
            );


            res.status(500).json({

                message:
                    "Error deleting course",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;