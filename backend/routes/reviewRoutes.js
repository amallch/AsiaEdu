const express = require("express");
const router = express.Router();

const Review = require("../models/Review");


/* =========================================================
   POST - CREATE REVIEW
   PUBLIC
   POST /api/reviews
   ONE REVIEW PER STUDENT PER COURSE
========================================================= */

router.post("/", async (req, res) => {

    try {

        const {
            studentId,
            name,
            courseName,
            rating,
            message
        } = req.body;


        if (!studentId) {

            return res.status(400).json({
                message: "Student ID is required"
            });

        }


        if (!courseName) {

            return res.status(400).json({
                message: "Course name is required"
            });

        }


        /* =================================================
           CHECK IF STUDENT ALREADY REVIEWED THIS COURSE
        ================================================= */

        const existingReview =
            await Review.findOne({
                studentId,
                courseName
            });


        if (existingReview) {

            return res.status(400).json({
                message: "You have already reviewed this course"
            });

        }


        /* =================================================
           CREATE THE REVIEW
        ================================================= */

        const review = new Review({
            studentId,
            name,
            courseName,
            rating,
            message
        });


        const savedReview = await review.save();


        res.status(201).json({
            message: "Review added successfully",
            review: savedReview
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to add review",
            error: error.message
        });

    }

});


/* =========================================================
   GET - GET ALL REVIEWS
   PUBLIC
   GET /api/reviews
========================================================= */

router.get("/", async (req, res) => {

    try {

        const reviews = await Review.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            reviews: reviews
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to retrieve reviews",
            error: error.message
        });

    }

});


/* =========================================================
   GET BY STUDENT ID - GET ALL REVIEWS BY ONE STUDENT
   PUBLIC
   GET /api/reviews/student/:studentId
========================================================= */

router.get("/student/:studentId", async (req, res) => {

    try {

        const reviews =
            await Review.find({
                studentId: req.params.studentId
            })
            .sort({ createdAt: -1 });


        res.status(200).json({
            reviews: reviews
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to retrieve student reviews",
            error: error.message
        });

    }

});


/* =========================================================
   GET BY ID - GET ONE REVIEW
   PUBLIC
   GET /api/reviews/:id
========================================================= */

router.get("/:id", async (req, res) => {

    try {

        const review =
            await Review.findById(
                req.params.id
            );


        if (!review) {

            return res.status(404).json({
                message: "Review not found"
            });

        }


        res.status(200).json({
            review: review
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to retrieve review",
            error: error.message
        });

    }

});


/* =========================================================
   DELETE - DELETE REVIEW
   ADMIN ONLY
   DELETE /api/reviews/:id
========================================================= */

router.delete("/:id", async (req, res) => {

    try {

        const deletedReview =
            await Review.findByIdAndDelete(
                req.params.id
            );


        if (!deletedReview) {

            return res.status(404).json({
                message: "Review not found"
            });

        }


        res.status(200).json({
            message: "Review deleted successfully",
            review: deletedReview
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete review",
            error: error.message
        });

    }

});


module.exports = router;