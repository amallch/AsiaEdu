const mongoose = require("mongoose");


const sessionSchema = new mongoose.Schema(
    {

        /* =====================================================
           COURSE
        ===================================================== */

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },


        /* =====================================================
           GROUP
        ===================================================== */

        group: {
            type: String,
            required: true,
            trim: true
        },


        /* =====================================================
           INSTRUCTOR
        ===================================================== */

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        },


        /* =====================================================
           START DATE
        ===================================================== */

        startDate: {
            type: String,
            required: true
        },


        /* =====================================================
           PROGRAM TYPE
        ===================================================== */

        programType: {
            type: String,
            enum: [
                "Normal",
                "Summer Camp"
            ],
            required: true
        },


        /* =====================================================
           CAPACITY
        ===================================================== */

        capacity: {
            type: Number,
            required: true,
            min: 1
        },


        /* =====================================================
           ENROLLED
        ===================================================== */

        enrolled: {
            type: Number,
            default: 0,
            min: 0
        }

    },

    {
        timestamps: true
    }
);


/* =========================================================
   AVAILABLE SEATS
========================================================= */

sessionSchema.virtual("available").get(function () {

    return this.capacity - this.enrolled;

});


/* =========================================================
   FULL STATUS
========================================================= */

sessionSchema.virtual("isFull").get(function () {

    return this.enrolled >= this.capacity;

});


/* =========================================================
   INCLUDE VIRTUALS IN JSON
========================================================= */

sessionSchema.set(
    "toJSON",
    {
        virtuals: true
    }
);


sessionSchema.set(
    "toObject",
    {
        virtuals: true
    }
);


/* =========================================================
   MODEL
========================================================= */

const Session =
    mongoose.model(
        "Session",
        sessionSchema
    );


module.exports = Session;