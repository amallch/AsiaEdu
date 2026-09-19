const express = require("express");

const router = express.Router();

const Student = require("../models/Student");


// =====================================================
// GET ALL STUDENTS
// ADMIN ONLY
// =====================================================

router.get(
    "/",
    async (req, res) => {

        try {

            const students = await Student.find();

            res.status(200).json(students);

        } catch (error) {

            res.status(500).json({
                message: "Failed to get students",
                error: error.message
            });

        }

    }
);


// =====================================================
// GET STUDENT BY USER ID
// =====================================================

router.get(
    "/user/:userId",
    async (req, res) => {

        try {

            const student = await Student.findOne({
                userId: req.params.userId
            });


            if (!student) {

                return res.status(404).json({
                    message: "Student not found for this user"
                });

            }


            res.status(200).json(student);

        } catch (error) {

            res.status(500).json({
                message: "Failed to get student",
                error: error.message
            });

        }

    }
);


// =====================================================
// GET ONE STUDENT
// =====================================================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const student =
                await Student.findById(req.params.id);


            if (!student) {

                return res.status(404).json({
                    message: "Student not found"
                });

            }


            res.status(200).json(student);

        } catch (error) {

            res.status(500).json({
                message: "Failed to get student",
                error: error.message
            });

        }

    }
);


// =====================================================
// CREATE STUDENT
// ADMIN ONLY
// =====================================================

router.post(
    "/",
    async (req, res) => {

        try {

            const student =
                new Student(req.body);


            const savedStudent =
                await student.save();


            res.status(201).json({

                message:
                    "Student created successfully",

                student:
                    savedStudent

            });

        } catch (error) {

            res.status(500).json({

                message:
                    "Failed to create student",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// UPDATE STUDENT
// ADMIN ONLY
// =====================================================

router.put(
    "/:id",
    async (req, res) => {

        try {

            const student =
                await Student.findByIdAndUpdate(

                    req.params.id,

                    req.body,

                    {
                        new: true,
                        runValidators: true
                    }

                );


            if (!student) {

                return res.status(404).json({
                    message: "Student not found"
                });

            }


            res.status(200).json({

                message:
                    "Student updated successfully",

                student:
                    student

            });

        } catch (error) {

            res.status(500).json({

                message:
                    "Failed to update student",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// DELETE STUDENT
// ADMIN ONLY
// =====================================================

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const student =
                await Student.findByIdAndDelete(
                    req.params.id
                );


            if (!student) {

                return res.status(404).json({
                    message: "Student not found"
                });

            }


            res.status(200).json({

                message:
                    "Student deleted successfully"

            });

        } catch (error) {

            res.status(500).json({

                message:
                    "Failed to delete student"

            });

        }

    }
);


module.exports = router;