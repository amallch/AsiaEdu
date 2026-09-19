const mongoose = require("mongoose");


const tutorApplicationSchema = new mongoose.Schema({


    /* =====================================================
       USER CONNECTION
    ===================================================== */

    /*
        Stores the MongoDB ID of the user
        who submitted this tutor application.

        This creates the connection:

        User → TutorApplication
    */

    userId: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null
    },


    /* =====================================================
       PERSONAL INFORMATION
    ===================================================== */

    firstName: {
        type: String,

        required: true
    },


    lastName: {
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


    /* =====================================================
       TEACHING INFORMATION
    ===================================================== */

    language: {
        type: String,

        required: true
    },


    level: {
        type: String,

        required: true
    },


    experience: {
        type: String,

        required: true
    },


    education: {
        type: String,

        required: true
    },


    /* =====================================================
       ABOUT THE TUTOR
    ===================================================== */

    bio: {
        type: String,

        required: true
    },


    /* =====================================================
       AVAILABILITY
    ===================================================== */

    availability: {
        type: String,

        required: true
    },


    /* =====================================================
       APPLICATION STATUS
    ===================================================== */

    status: {
        type: String,

        enum: [
            "Pending",
            "Confirmed",
            "Rejected"
        ],

        default: "Pending"
    },


    /* =====================================================
       TEACHER CREATION
    ===================================================== */

    teacherCreated: {
        type: Boolean,

        default: false
    },


    /*

        Stores the MongoDB ID of the teacher
        created from this application.

        This creates the connection:

        TutorApplication → Teacher

    */

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Teacher",

        default: null
    }


}, {

    timestamps: true

});


module.exports = mongoose.model(
    "TutorApplication",
    tutorApplicationSchema
);