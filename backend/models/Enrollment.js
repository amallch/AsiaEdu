const mongoose = require("mongoose");


const enrollmentSchema = new mongoose.Schema(
    {

        // =====================================================
        // USER RELATIONSHIP
        // =====================================================

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // =====================================================
        // STUDENT INFORMATION
        // =====================================================

        fullName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        phone2: {
            type: String,
            default: ""
        },


        // =====================================================
        // COURSE RELATIONSHIP
        // =====================================================

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },


        // =====================================================
        // SESSION RELATIONSHIP
        // =====================================================

        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true
        },


        // =====================================================
        // COURSE INFORMATION
        // =====================================================

        courseTitle: {
            type: String,
            required: true
        },

        language: {
            type: String,
            required: true
        },

        level: {
            type: String,
            required: true
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


        // =====================================================
        // ENROLLMENT APPROVAL STATUS
        // =====================================================

        status: {
            type: String,
            enum: ["Pending", "Confirmed"],
            default: "Pending"
        },


        // =====================================================
        // COURSE RELATIONSHIP STATUS
        // =====================================================

        enrollmentStatus: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }

    },

    {
        timestamps: true
    }
);


module.exports =
    mongoose.model(
        "Enrollment",
        enrollmentSchema
    );