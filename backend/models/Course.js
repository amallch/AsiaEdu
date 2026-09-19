const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema(
    {
        /* =================================================
           NUMERIC COURSE ID
        ================================================= */

        id: {
            type: Number,
            unique: true
        },


        /* =================================================
           BASIC INFORMATION
        ================================================= */

        language: {
            type: String,
            required: true,
            trim: true
        },

        level: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced"
            ],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        duration: {
            type: String,
            required: true,
            trim: true
        },

        startDate: {
            type: String,
            default: ""
        },

        price: {
            type: Number,
            required: true
        },

        description: {
            type: String,
            default: ""
        },


        /* =================================================
           LEARNING POINTS
        ================================================= */

        learnPoints: {
            type: [String],
            default: []
        },


        /* =================================================
           SYLLABUS
        ================================================= */

        syllabus: {
            type: Array,
            default: []
        }
    },

    {
        timestamps: true
    }
);


const Course =
    mongoose.model(
        "Course",
        courseSchema
    );


module.exports = Course;