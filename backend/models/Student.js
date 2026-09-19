const mongoose = require("mongoose");


// =====================================================
// STUDENT COURSE SCHEMA
// =====================================================

const studentCourseSchema = new mongoose.Schema(
    {
        enrollmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        name: {
            type: String,
            required: true
        },

        level: {
            type: String,
            required: true
        },

        language: {
            type: String,
            required: true
        },

        session: {
            type: String,
            default: ""
        },

        teacher: {
            type: String,
            required: true
        },

        startDate: {
            type: String,
            required: true
        },

        duration: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        programType: {
            type: String,
            required: true
        },

        status: {
            type: String,
            default: "Active"
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);


// =====================================================
// STUDENT SCHEMA
// =====================================================

const studentSchema = new mongoose.Schema(
    {
        // =================================================
        // USER RELATIONSHIP
        // =================================================

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },


        // =================================================
        // STUDENT ID
        // =================================================

        studentId: {
            type: String,
            required: true,
            unique: true
        },


        // =================================================
        // STUDENT INFORMATION
        // =================================================

        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        phone: {
            type: String,
            required: true
        },

        phone2: {
            type: String,
            default: ""
        },


        // =================================================
        // COURSES
        // =================================================

        courses: {
            type: [studentCourseSchema],
            default: []
        },


        // =================================================
        // STATUS
        // =================================================

        status: {
            type: String,
            default: "Active"
        }
    },

    {
        timestamps: true
    }
);


module.exports =
    mongoose.model(
        "Student",
        studentSchema
    );