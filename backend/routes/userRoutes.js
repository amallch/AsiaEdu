const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const router = express.Router();


// =====================================================
// CREATE USER
// =====================================================

router.post("/", async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;


        // Check required fields
        if (!firstName || !lastName || !email || !password) {

            return res.status(400).json({
                message: "Please fill in all required fields"
            });

        }


        // Check if email already exists
        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {

            return res.status(400).json({
                message: "User with this email already exists"
            });

        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // =================================================
        // PUBLIC SIGNUP ALWAYS CREATES A STUDENT
        // =================================================

        const newUser = new User({

            firstName,

            lastName,

            email,

            password: hashedPassword,

            role: "student"

        });


        await newUser.save();


        // Send response
        res.status(201).json({

            message: "User created successfully",

            user: {

                id: newUser._id,

                firstName: newUser.firstName,

                lastName: newUser.lastName,

                email: newUser.email,

                role: newUser.role

            }

        });

    } catch (error) {

        res.status(500).json({

            message: "Error creating user",

            error: error.message

        });

    }

});



// =====================================================
// GET ALL USERS
// ADMIN ONLY
// =====================================================

router.get(
    "/",
    async (req, res) => {

        try {

            const users = await User
                .find()
                .select("-password");


            res.status(200).json(users);

        } catch (error) {

            res.status(500).json({

                message: "Error getting users",

                error: error.message

            });

        }

    }
);



// =====================================================
// LOGIN USER
// =====================================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check required fields
        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Please enter your email and password"

            });

        }


        // Find user by email
        const user = await User.findOne({
            email
        });


        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        // =================================================
        // FIND STUDENT PROFILE
        // =================================================

        const student =
            await Student.findOne({
                userId: user._id
            });


        // =================================================
        // FIND TEACHER PROFILE
        // =================================================

        const teacher =
            await Teacher.findOne({
                userId: user._id
            });


        // =================================================
        // CREATE JWT TOKEN
        // =================================================

        const token =
            jwt.sign(

                {
                    id: user._id,
                    role: user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }

            );


        // =================================================
        // LOGIN SUCCESSFUL
        // =================================================

        res.status(200).json({

            message:
                "Login successful",

            token: token,

            user: {

                id: user._id,

                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                email:
                    user.email,

                role:
                    user.role,

                studentStatus:
                    student
                        ? student.status
                        : null,

                teacherStatus:
                    teacher
                        ? teacher.status
                        : null

            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({

            message:
                "Error logging in",

            error:
                error.message

        });

    }

});



// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post("/forgot-password", async (req, res) => {

    try {

        const { email } = req.body;


        // Check email
        if (!email) {

            return res.status(400).json({

                message:
                    "Please enter your email address"

            });

        }


        // Find user
        const user =
            await User.findOne({
                email
            });


        if (!user) {

            return res.status(404).json({

                message:
                    "No account found with this email"

            });

        }


        // Generate reset token
        const resetToken =
            crypto
                .randomBytes(32)
                .toString("hex");


        // Set token expiration to 15 minutes
        const resetTokenExpires =
            new Date(
                Date.now() +
                15 * 60 * 1000
            );


        // Save token and expiration
        user.resetPasswordToken =
            resetToken;

        user.resetPasswordExpires =
            resetTokenExpires;


        await user.save();


        // Send response
        res.status(200).json({

            message:
                "Password reset token generated successfully",

            resetToken:
                resetToken

        });

    } catch (error) {

        res.status(500).json({

            message:
                "Error processing forgot password request",

            error:
                error.message

        });

    }

});



// =====================================================
// RESET PASSWORD
// =====================================================

router.post("/reset-password", async (req, res) => {

    try {

        const {
            token,
            newPassword
        } = req.body;


        // Check required fields
        if (!token || !newPassword) {

            return res.status(400).json({

                message:
                    "Token and new password are required"

            });

        }


        // Find user with valid reset token
        const user =
            await User.findOne({

                resetPasswordToken:
                    token,

                resetPasswordExpires: {
                    $gt: new Date()
                }

            });


        // Check if token is valid
        if (!user) {

            return res.status(400).json({

                message:
                    "Invalid or expired reset token"

            });

        }


        // Hash new password
        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        // Update password
        user.password =
            hashedPassword;


        // Remove reset token
        user.resetPasswordToken =
            undefined;

        user.resetPasswordExpires =
            undefined;


        await user.save();


        res.status(200).json({

            message:
                "Password reset successfully"

        });

    } catch (error) {

        res.status(500).json({

            message:
                "Error resetting password",

            error:
                error.message

        });

    }

});



// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;