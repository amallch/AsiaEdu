const express = require("express");

const mongoose = require("mongoose");

const TutorApplication =
    require("../models/TutorApplication");

const Teacher =
    require("../models/Teacher");

const User =
    require("../models/User");


const router = express.Router();


// =========================================================
// CREATE TUTOR APPLICATION
// PUBLIC
// =========================================================

router.post("/", async (req, res) => {

    try {

        const application =
            new TutorApplication(
                req.body
            );


        const savedApplication =
            await application.save();


        res.status(201).json({

            message:
                "Tutor application submitted successfully",

            application:
                savedApplication

        });

    }

    catch (error) {

        console.error(
            "Error creating tutor application:",
            error
        );


        res.status(500).json({

            message:
                "Failed to submit tutor application",

            error:
                error.message

        });

    }

});


// =========================================================
// GET ALL TUTOR APPLICATIONS
// ADMIN ONLY
// =========================================================

router.get(
    "/",
    async (req, res) => {

        try {

            const applications =
                await TutorApplication.find()
                    .populate(
                        "userId",
                        "firstName lastName email role"
                    )
                    .populate(
                        "teacherId",
                        "teacherId name email"
                    )
                    .sort({
                        createdAt: -1
                    });


            res.status(200).json(
                applications
            );

        }

        catch (error) {

            console.error(
                "Error getting tutor applications:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get tutor applications",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// GET ONE TUTOR APPLICATION
// ADMIN ONLY
// =========================================================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const application =
                await TutorApplication.findById(
                    req.params.id
                )
                .populate(
                    "userId",
                    "firstName lastName email role"
                )
                .populate(
                    "teacherId",
                    "teacherId name email"
                );


            if (!application) {

                return res.status(404).json({

                    message:
                        "Tutor application not found"

                });

            }


            res.status(200).json(
                application
            );

        }

        catch (error) {

            console.error(
                "Error getting tutor application:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to get tutor application",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// CONFIRM / UPDATE APPLICATION STATUS
// ADMIN ONLY
// =========================================================

router.put(
    "/:id",
    async (req, res) => {

        try {

            const application =
                await TutorApplication.findById(
                    req.params.id
                );


            if (!application) {

                return res.status(404).json({

                    message:
                        "Tutor application not found"

                });

            }


            // =================================================
            // PREVENT RE-CONFIRMING
            // =================================================

            if (
                application.status === "Confirmed" &&
                req.body.status === "Confirmed"
            ) {

                return res.status(400).json({

                    message:
                        "This tutor application has already been confirmed.",

                    application:
                        application

                });

            }


            // =================================================
            // PREVENT CHANGING CREATED APPLICATION
            // =================================================

            if (
                application.teacherCreated === true &&
                req.body.status &&
                req.body.status !== "Confirmed"
            ) {

                return res.status(400).json({

                    message:
                        "This application has already been converted into a teacher and cannot be changed.",

                    application:
                        application

                });

            }


            application.status =
                req.body.status;


            await application.save();


            res.status(200).json({

                message:
                    "Tutor application updated successfully",

                application:
                    application

            });

        }

        catch (error) {

            console.error(
                "Error updating tutor application:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to update tutor application",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// CREATE / REUSE TEACHER FROM TUTOR APPLICATION
// ADMIN ONLY
// =========================================================

router.post(
    "/:id/create-teacher",
    async (req, res) => {

        const session =
            await mongoose.startSession();


        try {

            session.startTransaction();


            // =================================================
            // FIND APPLICATION
            // =================================================

            const application =
                await TutorApplication.findById(
                    req.params.id
                ).session(session);


            if (!application) {

                await session.abortTransaction();

                return res.status(404).json({

                    message:
                        "Tutor application not found"

                });

            }


            // =================================================
            // CHECK APPLICATION STATUS
            // =================================================

            if (
                application.status !== "Confirmed"
            ) {

                await session.abortTransaction();

                return res.status(400).json({

                    message:
                        "The tutor application must be confirmed before creating a teacher."

                });

            }


            // =================================================
            // PREVENT DUPLICATE CONVERSION
            // =================================================

            if (
                application.teacherCreated === true ||
                application.teacherId
            ) {

                await session.abortTransaction();

                return res.status(409).json({

                    message:
                        "A teacher has already been created from this application.",

                    teacherId:
                        application.teacherId

                });

            }


            // =================================================
            // FIND USER
            // =================================================

            let user = null;


            if (
                application.userId
            ) {

                user =
                    await User.findById(
                        application.userId
                    ).session(session);

            }


            // =================================================
            // SECURITY CHECK
            //
            // If the application contains a userId,
            // make sure that user's email matches the
            // tutor application's email.
            // =================================================

            if (
                user &&
                user.email &&
                application.email
            ) {

                if (
                    user.email.toLowerCase() !==
                    application.email.toLowerCase()
                ) {

                    user = null;

                }

            }


            // =================================================
            // FALLBACK:
            // FIND USER BY APPLICATION EMAIL
            // =================================================

            if (
                !user &&
                application.email
            ) {

                user =
                    await User.findOne({

                        email:
                            application.email.toLowerCase()

                    }).session(session);

            }


            // =================================================
            // REQUIRE USER
            // =================================================

            if (!user) {

                await session.abortTransaction();

                return res.status(400).json({

                    message:
                        "No matching user account was found for this tutor application."

                });

            }


            // =================================================
            // FIND EXISTING TEACHER
            // =================================================

            let teacher =
                await Teacher.findOne({
                    userId: user._id
                }).session(session);


            // =================================================
            // REUSE EXISTING TEACHER
            // =================================================

            if (teacher) {

                // =============================================
                // BASIC INFORMATION
                // =============================================

                teacher.name =
                    req.body.name ||
                    `${application.firstName} ${application.lastName}`.trim();


                teacher.email =
                    req.body.email ||
                    application.email;


                teacher.phone =
                    req.body.phone ||
                    application.phone;


                teacher.phone2 =
                    req.body.phone2 ||
                    teacher.phone2 ||
                    "";


                // =============================================
                // MERGE LANGUAGES
                // =============================================

                const existingLanguages = [];


                if (
                    teacher.language
                ) {

                    teacher.language
                        .split(",")
                        .forEach(
                            language => {

                                const cleanLanguage =
                                    language.trim();


                                if (
                                    cleanLanguage &&
                                    !existingLanguages.includes(
                                        cleanLanguage
                                    )
                                ) {

                                    existingLanguages.push(
                                        cleanLanguage
                                    );

                                }

                            }
                        );

                }


                const newLanguage =
                    req.body.language ||
                    application.language;


                if (
                    newLanguage
                ) {

                    newLanguage
                        .split(",")
                        .forEach(
                            language => {

                                const cleanLanguage =
                                    language.trim();


                                if (
                                    cleanLanguage &&
                                    !existingLanguages.includes(
                                        cleanLanguage
                                    )
                                ) {

                                    existingLanguages.push(
                                        cleanLanguage
                                    );

                                }

                            }
                        );

                }


                teacher.language =
                    existingLanguages.join(", ");


                // =============================================
                // PROFESSIONAL INFORMATION
                // =============================================

                teacher.experience =
                    req.body.experience ||
                    application.experience ||
                    teacher.experience;


                teacher.education =
                    req.body.education ||
                    application.education ||
                    teacher.education;


                // =============================================
                // KEEP ORIGINAL JOINED DATE
                // =============================================

                if (
                    !teacher.joinedDate
                ) {

                    teacher.joinedDate =
                        req.body.joinedDate ||
                        new Date()
                            .toISOString()
                            .split("T")[0];

                }


                // =============================================
                // REACTIVATE TEACHER
                // =============================================

                teacher.status =
                    "Active";


                // =============================================
                // MERGE COURSES
                // =============================================

                if (
                    Array.isArray(
                        req.body.courses
                    )
                ) {

                    const existingCourses =
                        Array.isArray(
                            teacher.courses
                        )
                            ? teacher.courses
                            : [];


                    const mergedCourses =
                        [...existingCourses];


                    // =========================================
                    // FIND NEXT NUMERIC COURSE ID
                    // =========================================

                    let nextCourseId = 1;


                    const existingIds =
                        mergedCourses
                            .map(
                                course =>
                                    Number(
                                        course.id
                                    )
                            )
                            .filter(
                                id =>
                                    Number.isFinite(
                                        id
                                    ) &&
                                    id > 0
                            );


                    if (
                        existingIds.length > 0
                    ) {

                        nextCourseId =
                            Math.max(
                                ...existingIds
                            ) + 1;

                    }


                    // =========================================
                    // ADD NEW COURSES
                    // =========================================

                    for (
                        const newCourse
                        of req.body.courses
                    ) {

                        let alreadyExists =
                            false;


                        // =====================================
                        // CHECK COURSE ID
                        // =====================================

                        if (
                            newCourse.courseId
                        ) {

                            alreadyExists =
                                mergedCourses.some(
                                    existingCourse => {

                                        if (
                                            !existingCourse.courseId
                                        ) {

                                            return false;

                                        }


                                        return (
                                            String(
                                                existingCourse.courseId
                                            ) ===
                                            String(
                                                newCourse.courseId
                                            )
                                        );

                                    }
                                );

                        }


                        // =====================================
                        // FALLBACK: COURSE NAME
                        // =====================================

                        if (
                            !alreadyExists &&
                            newCourse.name
                        ) {

                            alreadyExists =
                                mergedCourses.some(
                                    existingCourse => {

                                        if (
                                            !existingCourse.name
                                        ) {

                                            return false;

                                        }


                                        return (
                                            existingCourse.name
                                                .trim()
                                                .toLowerCase() ===
                                            newCourse.name
                                                .trim()
                                                .toLowerCase()
                                        );

                                    }
                                );

                        }


                        // =====================================
                        // ADD ONLY NEW COURSE
                        // =====================================

                        if (
                            !alreadyExists
                        ) {

                            const courseToAdd = {

                                id:
                                    Number(
                                        newCourse.id
                                    ) ||
                                    nextCourseId,

                                courseId:
                                    newCourse.courseId
                                        ? String(
                                            newCourse.courseId
                                        )
                                        : "",

                                enrollmentId:
                                    newCourse.enrollmentId ||
                                    "",

                                name:
                                    newCourse.name ||
                                    "",

                                language:
                                    newCourse.language ||
                                    "",

                                level:
                                    newCourse.level ||
                                    "",

                                session:
                                    newCourse.session ||
                                    "",

                                teacher:
                                    teacher.name,

                                startDate:
                                    newCourse.startDate ||
                                    "",

                                duration:
                                    newCourse.duration ||
                                    "",

                                price:
                                    Number(
                                        newCourse.price
                                    ) || 0,

                                programType:
                                    newCourse.programType ||
                                    "Normal",

                                status:
                                    newCourse.status ||
                                    "Active",

                                students:
                                    Number(
                                        newCourse.students
                                    ) || 0,

                                createdAt:
                                    newCourse.createdAt ||
                                    new Date()

                            };


                            mergedCourses.push(
                                courseToAdd
                            );


                            nextCourseId++;

                        }

                    }


                    teacher.courses =
                        mergedCourses;

                }


                // =============================================
                // DO NOT RESET STUDENTS
                // =============================================

                await teacher.save({
                    session
                });

            }

            else {

                // =================================================
                // GENERATE NEW TEACHER ID
                // =================================================

                const lastTeacher =
                    await Teacher.findOne()
                        .sort({
                            teacherId: -1
                        })
                        .session(session);


                let teacherNumber = 1;


                if (
                    lastTeacher &&
                    lastTeacher.teacherId
                ) {

                    const lastNumber =
                        parseInt(
                            lastTeacher.teacherId.replace(
                                "TCH-",
                                ""
                            ),
                            10
                        );


                    if (
                        !isNaN(
                            lastNumber
                        )
                    ) {

                        teacherNumber =
                            lastNumber + 1;

                    }

                }


                const teacherId =
                    `TCH-${String(
                        teacherNumber
                    ).padStart(
                        3,
                        "0"
                    )}`;


                // =================================================
                // CREATE NEW TEACHER
                // =================================================

                teacher =
                    new Teacher({

                        userId:
                            user._id,

                        teacherId:
                            teacherId,

                        name:
                            req.body.name ||
                            `${application.firstName} ${application.lastName}`.trim(),

                        email:
                            req.body.email ||
                            application.email,

                        phone:
                            req.body.phone ||
                            application.phone,

                        phone2:
                            req.body.phone2 ||
                            "",

                        language:
                            req.body.language ||
                            application.language,

                        experience:
                            req.body.experience ||
                            application.experience,

                        education:
                            req.body.education ||
                            application.education,

                        joinedDate:
                            req.body.joinedDate ||
                            new Date()
                                .toISOString()
                                .split("T")[0],

                        status:
                            "Active",

                        students:
                            0,

                        courses:
                            Array.isArray(
                                req.body.courses
                            )
                                ? req.body.courses
                                : []

                    });


                await teacher.save({
                    session
                });

            }


            // =================================================
            // UPDATE USER ROLE
            // =================================================

            user.role =
                "teacher";


            await user.save({
                session
            });


            // =================================================
            // UPDATE APPLICATION
            // =================================================

            application.status =
                "Confirmed";


            application.teacherCreated =
                true;


            application.teacherId =
                teacher._id;


            await application.save({
                session
            });


            // =================================================
            // COMMIT TRANSACTION
            // =================================================

            await session.commitTransaction();


            res.status(201).json({

                message:
                    "Teacher profile created or reactivated successfully",

                teacher:
                    teacher,

                application:
                    application,

                user:
                    user

            });

        }

        catch (error) {

            await session.abortTransaction();


            console.error(
                "Error creating or reactivating teacher from application:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to create or reactivate teacher from application",

                error:
                    error.message

            });

        }

        finally {

            await session.endSession();

        }

    }
);


// =========================================================
// DELETE TUTOR APPLICATION
// ADMIN ONLY
// =========================================================

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const application =
                await TutorApplication.findByIdAndDelete(
                    req.params.id
                );


            if (!application) {

                return res.status(404).json({

                    message:
                        "Tutor application not found"

                });

            }


            res.status(200).json({

                message:
                    "Tutor application deleted successfully",

                application:
                    application

            });

        }

        catch (error) {

            console.error(
                "Error deleting tutor application:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to delete tutor application",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;