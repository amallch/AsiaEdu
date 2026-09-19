const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true
        },

        answer: {
            type: String,
            default: ""
        },

        attachments: [
            {
                name: {
                    type: String,
                    required: true
                },

                url: {
                    type: String,
                    default: ""
                }
            }
        ],

        submittedAt: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: [
                "Submitted",
                "Graded",
                "Late"
            ],
            default: "Submitted"
        },

        grade: {
            type: Number,
            default: null
        },

        feedback: {
            type: String,
            default: ""
        },

        correction: {
            type: String,
            default: ""
        },

        correctionAttachment: {
            name: {
                type: String,
                default: ""
            },

            url: {
                type: String,
                default: ""
            }
        }
    },
    {
        timestamps: true
    }
);

submissionSchema.index(
    {
        student: 1,
        assignment: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "Submission",
    submissionSchema
);