const mongoose = require("mongoose");


const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        instructions: {
            type: String,
            required: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true
        },

        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        },

        dueDate: {
            type: Date,
            required: true
        },

        maxScore: {
            type: Number,
            required: true,
            default: 100
        },

        resources: {
            type: [String],
            default: []
        },

        attachments: [
            {
                name: {
                    type: String,
                    required: true
                },

                url: {
                    type: String
                }
            }
        ]
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "Assignment",
    assignmentSchema
);