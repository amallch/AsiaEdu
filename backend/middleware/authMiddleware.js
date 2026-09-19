const jwt = require("jsonwebtoken");


// =====================================================
// AUTHENTICATE TOKEN
// =====================================================

const authenticateToken = (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;


        // Check if authorization header exists
        if (!authHeader) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // Expected format:
        // Bearer TOKEN

        const parts =
            authHeader.split(" ");


        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {

            return res.status(401).json({

                message:
                    "Invalid authorization format"

            });

        }


        const token =
            parts[1];


        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Store decoded user
        // so the next middleware/route can use it

        req.user =
            decoded;


        next();

    } catch (error) {

        console.error(
            "AUTHENTICATION ERROR:",
            error
        );


        return res.status(401).json({

            message:
                "Invalid or expired token"

        });

    }

};



// =====================================================
// REQUIRE ADMIN
// =====================================================

const requireAdmin = (req, res, next) => {

    if (
        !req.user ||
        req.user.role !== "admin"
    ) {

        return res.status(403).json({

            message:
                "Admin access required"

        });

    }


    next();

};



// =====================================================
// REQUIRE TEACHER
// =====================================================

const requireTeacher = (req, res, next) => {

    if (
        !req.user ||
        req.user.role !== "teacher"
    ) {

        return res.status(403).json({

            message:
                "Teacher access required"

        });

    }


    next();

};



// =====================================================
// REQUIRE STUDENT
// =====================================================

const requireStudent = (req, res, next) => {

    if (
        !req.user ||
        req.user.role !== "student"
    ) {

        return res.status(403).json({

            message:
                "Student access required"

        });

    }


    next();

};



// =====================================================
// EXPORT
// =====================================================

module.exports = {

    authenticateToken,

    requireAdmin,

    requireTeacher,

    requireStudent

};