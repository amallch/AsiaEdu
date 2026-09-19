const mongoose = require("mongoose");


const lessonProgressSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
            required: true
        },

        status: {
            type: String,
            enum: [
                "Not Started",
                "Started"
            ],
            default: "Not Started"
        }
    },
    {
        timestamps: true
    }
);


/*
=====================================================
ONE PROGRESS RECORD PER STUDENT + LESSON
=====================================================
*/

lessonProgressSchema.index(
    {
        student: 1,
        lesson: 1
    },
    {
        unique: true
    }
);


module.exports =
    mongoose.model(
        "LessonProgress",
        lessonProgressSchema
    );