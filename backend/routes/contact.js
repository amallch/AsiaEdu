const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");


/* =========================================================
   POST - CREATE CONTACT MESSAGE
   PUBLIC
   POST /api/contact
========================================================= */

router.post("/", async (req, res) => {

    try {

        const contact = new Contact({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            subject: req.body.subject,
            message: req.body.message
        });

        const savedContact = await contact.save();

        res.status(201).json({
            message: "Message sent successfully",
            contact: savedContact
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to send message",
            error: error.message
        });

    }

});


/* =========================================================
   GET - GET ALL CONTACT MESSAGES
   ADMIN ONLY
   GET /api/contact
========================================================= */

router.get(
    "/",
    async (req, res) => {

        try {

            const contacts = await Contact.find()
                .sort({ createdAt: -1 });

            res.status(200).json({
                contacts: contacts
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to retrieve contact messages",
                error: error.message
            });

        }

    }
);


/* =========================================================
   GET BY ID - GET ONE CONTACT MESSAGE
   ADMIN ONLY
   GET /api/contact/:id
========================================================= */

router.get(
    "/:id",
    async (req, res) => {

        try {

            const contact =
                await Contact.findById(
                    req.params.id
                );

            if (!contact) {

                return res.status(404).json({
                    message: "Contact message not found"
                });

            }

            res.status(200).json({
                contact: contact
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to retrieve contact message",
                error: error.message
            });

        }

    }
);


/* =========================================================
   PUT - UPDATE CONTACT MESSAGE
   ADMIN ONLY
   PUT /api/contact/:id
========================================================= */

router.put(
    "/:id",
    async (req, res) => {

        try {

            const updatedContact =
                await Contact.findByIdAndUpdate(
                    req.params.id,
                    {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        phone: req.body.phone,
                        subject: req.body.subject,
                        message: req.body.message
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );

            if (!updatedContact) {

                return res.status(404).json({
                    message: "Contact message not found"
                });

            }

            res.status(200).json({
                message: "Contact message updated successfully",
                contact: updatedContact
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to update contact message",
                error: error.message
            });

        }

    }
);


/* =========================================================
   DELETE - DELETE CONTACT MESSAGE
   ADMIN ONLY
   DELETE /api/contact/:id
========================================================= */

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const deletedContact =
                await Contact.findByIdAndDelete(
                    req.params.id
                );

            if (!deletedContact) {

                return res.status(404).json({
                    message: "Contact message not found"
                });

            }

            res.status(200).json({
                message: "Contact message deleted successfully",
                contact: deletedContact
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to delete contact message",
                error: error.message
            });

        }

    }
);


module.exports = router;