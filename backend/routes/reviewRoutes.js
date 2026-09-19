const express = require("express");
const router = express.Router();

const Review = require("../models/Review");


/* =========================================================
   POST - CREATE REVIEW
   PUBLIC
   POST /api/reviews
========================================================= */

router.post("/", async (req, res) => {

    try {

        const review = new Review({
            name: req.body.name,
            role: req.body.role,
            rating: req.body.rating,
            message: req.body.message
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