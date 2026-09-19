const mongoose = require("mongoose");


const teacherSchema = new mongoose.Schema(
    {

        /* =====================================================
           USER CONNECTION
        ===================================================== */

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        /* =====================================================
           TEACHER ID
        ===================================================== */

        teacherId: {
            type: String,
            required: true,
            unique: true
        },


        /* =====================================================
           BASIC INFORMATION
        ===================================================== */

        name: {
            type: String,
            required: true,
            trim: true
        },


        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },


        phone: {
            type: String,
            default: ""
        },


        phone2: {
            type: String,
            default: ""
        },


        /* =====================================================
           PROFESSIONAL INFORMATION
        ===================================================== */

        language: {
            type: String,
            required: true,
            trim: true
        },


        experience: {
            type: String,
            default: ""
        },


        education: {
            type: String,
            default: ""
        },


        joinedDate: {
            type: String,
            required: true
        },


        /* =====================================================
           TEACHER STATUS
        ===================================================== */

        status: {
            type: String,
            enum: [
                "Active",
                "Inactive"
            ],
            default: "Active"
        },


        /* =====================================================
           STATISTICS
        ===================================================== */

        students: {
            type: Number,
            default: 0
        },


        /* =====================================================
           COURSES
        =====================================================

        IMPORTANT:

        A teacher does NOT need a course to exist.

        This array is kept for existing student/enrollment
        information used by your current dashboard.

        The actual Teacher ↔ Course relationship will be
        stored in Course.teacherId.

        ===================================================== */

        courses: [
            {

                id: {
                    type: Number
                },

                courseId: {
                    type: String
                },

                enrollmentId: {
                    type: String,
                    default: ""
                },

                name: {
                    type: String
                },

                language: {
                    type: String
                },

                level: {
                    type: String
                },

                session: {
                    type: String,
                    default: ""
                },

                teacher: {
                    type: String
                },

                startDate: {
                    type: String
                },

                duration: {
                    type: String
                },

                price: {
                    type: Number
                },

                programType: {
                    type: String,
                    default: "normal"
                },

                status: {
                    type: String,
                    default: "Active"
                },

                students: {
                    type: Number,
                    default: 0
                },

                createdAt: {
                    type: Date,
                    default: Date.now
                }

            }
        ]

    },

    {
        timestamps: true
    }

);


const Teacher =
    mongoose.model(
        "Teacher",
        teacherSchema
    );


module.exports = Teacher;