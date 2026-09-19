const express = require("express");
const path = require("path");
const multer = require("multer");

const router = express.Router();

const Submission = require("../models/Submission");
const Student = require("../models/Student");
const Assignment = require("../models/Assignment");


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
// UPLOAD SUBMISSION FILES
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
                "Upload submission files error:",
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
// CREATE SUBMISSION
// =====================================================

router.post(
    "/",
    async (req, res) => {

        try {

            const {
                student,
                assignment,
                answer,
                attachments
            } = req.body;


            // =================================================
            // REQUIRED FIELDS
            // =================================================

            if (
                !student ||
                !assignment
            ) {

                return res.status(400).json({

                    message:
                        "Student and assignment are required"

                });

            }


            // =================================================
            // CHECK STUDENT
            // =================================================

            const existingStudent =
                await Student.findById(
                    student
                );


            if (!existingStudent) {

                return res.status(404).json({

                    message:
                        "Student not found"

                });

            }


            // =================================================
            // CHECK ASSIGNMENT
            // =================================================

            const existingAssignment =
                await Assignment.findById(
                    assignment
                );


            if (!existingAssignment) {

                return res.status(404).json({

                    message:
                        "Assignment not found"

                });

            }


            // =================================================
            // CHECK DUPLICATE SUBMISSION
            // =================================================

            const existingSubmission =
                await Submission.findOne({

                    student:
                        student,

                    assignment:
                        assignment

                });


            if (
                existingSubmission
            ) {

                return res.status(400).json({

                    message:
                        "You have already submitted this assignment"

                });

            }


            // =================================================
            // CREATE SUBMISSION
            // =================================================

            const submission =
                new Submission({

                    student,

                    assignment,

                    answer:
                        answer || "",

                    attachments:
                        attachments || []

                });


            await submission.save();


            // =================================================
            // POPULATE
            // =================================================

            const populatedSubmission =
                await Submission.findById(
                    submission._id
                )
                .populate(
                    "student"
                )
                .populate(
                    "assignment"
                );


            res.status(201).json({

                message:
                    "Submission created successfully",

                submission:
                    populatedSubmission

            });

        }

        catch (error) {

            console.error(
                "Create submission error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to create submission",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// GET ALL SUBMISSIONS FOR ADMIN
// =====================================================

router.get(
    "/admin",
    async (req, res) => {

        try {

            const submissions =
                await Submission.find()
                    .populate("student")
                    .populate("assignment")
                    .sort({
                        createdAt: -1
                    });


            res.status(200).json({

                message:
                    "Admin submissions retrieved successfully",

                submissions:
                    submissions

            });

        }

        catch (error) {

            console.error(
                "Get admin submissions error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get submissions",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// GET SUBMISSIONS FOR A STUDENT
// =====================================================

router.get(
    "/student/:studentId",
    async (req, res) => {

        try {

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


            const submissions =
                await Submission.find({

                    student:
                        student._id

                })
                .populate("student")
                .populate("assignment")
                .sort({
                    createdAt: -1
                });


            res.status(200).json({

                message:
                    "Student submissions retrieved successfully",

                submissions:
                    submissions

            });

        }

        catch (error) {

            console.error(
                "Get student submissions error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get student submissions",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// GET ALL SUBMISSIONS FOR AN ASSIGNMENT
// =====================================================

router.get(
    "/assignment/:assignmentId",
    async (req, res) => {

        try {

            const assignment =
                await Assignment.findById(
                    req.params.assignmentId
                );


            if (!assignment) {

                return res.status(404).json({

                    message:
                        "Assignment not found"

                });

            }


            const submissions =
                await Submission.find({

                    assignment:
                        assignment._id

                })
                .populate("student")
                .populate("assignment")
                .sort({
                    createdAt: -1
                });


            res.status(200).json({

                message:
                    "Assignment submissions retrieved successfully",

                submissions:
                    submissions

            });

        }

        catch (error) {

            console.error(
                "Get assignment submissions error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get assignment submissions",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// GET ONE SUBMISSION
// =====================================================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const submission =
                await Submission.findById(
                    req.params.id
                )
                .populate("student")
                .populate("assignment");


            if (!submission) {

                return res.status(404).json({

                    message:
                        "Submission not found"

                });

            }


            res.status(200).json({

                message:
                    "Submission retrieved successfully",

                submission:
                    submission

            });

        }

        catch (error) {

            console.error(
                "Get submission error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get submission",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// UPDATE SUBMISSION
// =====================================================

router.put(
    "/:id",
    async (req, res) => {

        try {

            const submission =
                await Submission.findById(
                    req.params.id
                );


            if (!submission) {

                return res.status(404).json({

                    message:
                        "Submission not found"

                });

            }


            // =================================================
            // UPDATE FIELDS
            // =================================================

            const {
                answer,
                attachments,
                status,
                grade,
                feedback,
                correction,
                correctionAttachment
            } = req.body;


            if (
                answer !== undefined
            ) {

                submission.answer =
                    answer;

            }


            if (
                attachments !== undefined
            ) {

                submission.attachments =
                    attachments;

            }


            if (
                status !== undefined
            ) {

                submission.status =
                    status;

            }


            if (
                grade !== undefined
            ) {

                submission.grade =
                    grade;

            }


            if (
                feedback !== undefined
            ) {

                submission.feedback =
                    feedback;

            }


            if (
                correction !== undefined
            ) {

                submission.correction =
                    correction;

            }


            if (
                correctionAttachment !== undefined
            ) {

                submission.correctionAttachment =
                    correctionAttachment;

            }


            // =================================================
            // SAVE
            // =================================================

            await submission.save();


            // =================================================
            // POPULATE
            // =================================================

            const updatedSubmission =
                await Submission.findById(
                    submission._id
                )
                .populate("student")
                .populate("assignment");


            res.status(200).json({

                message:
                    "Submission updated successfully",

                submission:
                    updatedSubmission

            });

        }

        catch (error) {

            console.error(
                "Update submission error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to update submission",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// DELETE SUBMISSION
// =====================================================

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const submission =
                await Submission.findById(
                    req.params.id
                );


            if (!submission) {

                return res.status(404).json({

                    message:
                        "Submission not found"

                });

            }


            // =================================================
            // DELETE
            // =================================================

            await Submission.findByIdAndDelete(
                req.params.id
            );


            res.status(200).json({

                message:
                    "Submission deleted successfully",

                submission:
                    submission

            });

        }

        catch (error) {

            console.error(
                "Delete submission error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to delete submission"

            });

        }

    }
);


module.exports = router;