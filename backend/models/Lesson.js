const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
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

        content: {
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

        resources: [
            {
                type: String
            }
        ],

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

module.exports = mongoose.model("Lesson", lessonSchema);