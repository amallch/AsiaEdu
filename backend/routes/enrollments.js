const express = require("express");

const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Session = require("../models/Session");
const Teacher = require("../models/Teacher");

const router = express.Router();


// =========================================================
// SYNC TEACHER DATA
// =========================================================

async function syncTeacherData(teacherId) {

    try {

        const teacher =
            await Teacher.findById(teacherId);

        if (!teacher) {
            return;
        }


        // =================================================
        // GET ALL SESSIONS FOR THIS TEACHER
        // =================================================

        const sessions =
            await Session.find({
                instructor: teacher._id
            }).populate("course");


        // =================================================
        // GET ALL SESSION IDS
        // =================================================

        const sessionIds =
            sessions.map(
                session => session._id
            );


        // =================================================
        // GET ACTIVE CONFIRMED ENROLLMENTS
        // =================================================

        let confirmedEnrollments = [];

        if (sessionIds.length > 0) {

            confirmedEnrollments =
                await Enrollment.find({
                    sessionId: {
                        $in: sessionIds
                    },
                    status: "Confirmed",
                    enrollmentStatus: "Active"
                });

        }


        // =================================================
        // UNIQUE TEACHER STUDENTS
        // =================================================

        const uniqueStudentIds =
            new Set();


        confirmedEnrollments.forEach(
            enrollment => {

                if (
                    enrollment.userId
                ) {

                    uniqueStudentIds.add(
                        String(
                            enrollment.userId
                        )
                    );

                }

            }
        );


        // =================================================
        // BUILD UNIQUE COURSES
        // =================================================

        const courseMap =
            new Map();


        sessions.forEach(
            session => {

                if (!session.course) {
                    return;
                }


                const course =
                    session.course;


                const courseId =
                    String(
                        course._id
                    );


                if (
                    !courseMap.has(
                        courseId
                    )
                ) {

                    courseMap.set(
                        courseId,
                        {
                            course: course,
                            sessions: [session]
                        }
                    );

                } else {

                    courseMap
                        .get(courseId)
                        .sessions
                        .push(session);

                }

            }
        );


        // =================================================
        // BUILD TEACHER COURSES
        // =================================================

        const teacherCourses = [];

        let nextCourseNumber = 1;


        for (
            const [
                courseId,
                courseData
            ]
            of courseMap
        ) {

            const course =
                courseData.course;


            const courseSessions =
                courseData.sessions;


            // =============================================
            // FIND ACTIVE CONFIRMED STUDENTS FOR THIS COURSE
            // =============================================

            const courseSessionIds =
                courseSessions.map(
                    session =>
                        String(
                            session._id
                        )
                );


            const courseStudentIds =
                new Set();


            confirmedEnrollments.forEach(
                enrollment => {

                    if (
                        !enrollment.sessionId
                    ) {

                        return;

                    }


                    const enrollmentSessionId =
                        String(
                            enrollment.sessionId
                        );


                    if (
                        courseSessionIds.includes(
                            enrollmentSessionId
                        )
                    ) {

                        if (
                            enrollment.userId
                        ) {

                            courseStudentIds.add(
                                String(
                                    enrollment.userId
                                )
                            );

                        }

                    }

                }
            );


            // =============================================
            // USE FIRST SESSION FOR COURSE DETAILS
            // =============================================

            const firstSession =
                courseSessions[0];


            // =============================================
            // TRY TO KEEP EXISTING NUMERIC COURSE ID
            // =============================================

            const existingCourse =
                Array.isArray(
                    teacher.courses
                )
                    ? teacher.courses.find(
                        existing => {

                            if (
                                !existing.courseId
                            ) {

                                return false;

                            }


                            return (
                                String(
                                    existing.courseId
                                ) === courseId
                            );

                        }
                    )
                    : null;


            let numericCourseId = 0;


            if (
                existingCourse &&
                existingCourse.id !== undefined &&
                existingCourse.id !== null
            ) {

                numericCourseId =
                    Number(
                        existingCourse.id
                    );

            }


            if (
                !Number.isFinite(
                    numericCourseId
                ) ||
                numericCourseId <= 0
            ) {

                numericCourseId =
                    nextCourseNumber;

            }


            // Make sure the next generated number
            // does not duplicate an existing number.

            if (
                numericCourseId >=
                nextCourseNumber
            ) {

                nextCourseNumber =
                    numericCourseId + 1;

            }


            // =============================================
            // BUILD TEACHER COURSE
            // =============================================

            const teacherCourse = {

                id:
                    numericCourseId,

                courseId:
                    courseId,

                enrollmentId:
                    "",

                name:
                    course.title ||
                    course.name ||
                    "",

                language:
                    course.language ||
                    "",

                level:
                    course.level ||
                    "",

                session:
                    firstSession
                        ? firstSession.group || ""
                        : "",

                teacher:
                    teacher.name,

                startDate:
                    firstSession &&
                    firstSession.startDate
                        ? firstSession.startDate
                        : (
                            course.startDate ||
                            ""
                        ),

                duration:
                    course.duration ||
                    "",

                price:
                    course.price ||
                    0,

                programType:
                    firstSession &&
                    firstSession.programType
                        ? firstSession.programType
                        : "Normal",

                status:
                    "Active",

                students:
                    courseStudentIds.size,

                createdAt:
                    course.createdAt ||
                    new Date()

            };


            teacherCourses.push(
                teacherCourse
            );

        }


        // =================================================
        // UPDATE TEACHER COURSES
        // =================================================

        teacher.courses =
            teacherCourses;


        // =================================================
        // UPDATE TEACHER STUDENT COUNT
        // =================================================

        teacher.students =
            uniqueStudentIds.size;


        // =================================================
        // UPDATE TEACHER LANGUAGES
        // =================================================

        const languages = [];


        teacherCourses.forEach(
            course => {

                if (
                    course.language &&
                    !languages.includes(
                        course.language
                    )
                ) {

                    languages.push(
                        course.language
                    );

                }

            }
        );


        if (
            languages.length > 0
        ) {

            teacher.language =
                languages.join(", ");

        }


        // =================================================
        // SAVE TEACHER
        // =================================================

        await teacher.save();

    }

    catch (error) {

        console.error(
            "Error syncing teacher data:",
            error
        );

    }

}


// =========================================================
// CREATE ENROLLMENT
// STUDENT
// =========================================================

router.post(
    "/",
    async (req, res) => {

        try {

            const {
                userId,
                fullName,
                email,
                phone,
                phone2,
                courseId,
                sessionId
            } = req.body;


            // =============================================
            // VALIDATION
            // =============================================

            if (
                !userId ||
                !fullName ||
                !email ||
                !phone ||
                !courseId ||
                !sessionId
            ) {

                return res.status(400).json({
                    message:
                        "Please provide all required enrollment information."
                });

            }


            // =============================================
            // FIND COURSE
            // =============================================

            const course =
                await Course.findById(
                    courseId
                );


            if (!course) {

                return res.status(404).json({
                    message:
                        "Course not found."
                });

            }


            // =============================================
            // FIND SESSION
            // =============================================

            const session =
                await Session.findById(
                    sessionId
                ).populate(
                    "instructor"
                );


            if (!session) {

                return res.status(404).json({
                    message:
                        "Session not found."
                });

            }


            // =============================================
            // VERIFY SESSION COURSE
            // =============================================

            if (
                String(
                    session.course
                ) !==
                String(
                    course._id
                )
            ) {

                return res.status(400).json({
                    message:
                        "The selected session does not belong to this course."
                });

            }


            // =============================================
            // VERIFY TEACHER
            // =============================================

            if (
                !session.instructor
            ) {

                return res.status(400).json({
                    message:
                        "This session does not have a teacher assigned."
                });

            }


            const teacherName =
                session.instructor.name;


            // =============================================
            // CHECK DUPLICATE ENROLLMENT
            // =============================================

            const existingEnrollment =
                await Enrollment.findOne({

                    userId:
                        userId,

                    courseId:
                        courseId,

                    status: {
                        $in: [
                            "Pending",
                            "Confirmed"
                        ]
                    }

                });


            if (
                existingEnrollment
            ) {

                return res.status(400).json({
                    message:
                        "You are already enrolled in this course."
                });

            }


            // =============================================
            // CHECK SESSION CAPACITY
            // =============================================

            if (
                session.enrolled >=
                session.capacity
            ) {

                return res.status(400).json({
                    message:
                        "This session is full."
                });

            }


            // =============================================
            // CREATE ENROLLMENT
            // =============================================

            const enrollment =
                new Enrollment({

                    userId:
                        userId,

                    fullName:
                        fullName,

                    email:
                        email,

                    phone:
                        phone,

                    phone2:
                        phone2 || "",

                    courseId:
                        course._id,

                    sessionId:
                        session._id,

                    courseTitle:
                        course.title,

                    language:
                        course.language,

                    level:
                        course.level,

                    teacher:
                        teacherName,

                    startDate:
                        session.startDate ||
                        course.startDate,

                    duration:
                        course.duration,

                    price:
                        course.price,

                    programType:
                        course.programType ||
                        session.programType,

                    status:
                        "Pending",

                    enrollmentStatus:
                        "Active"

                });


            await enrollment.save();


            // =============================================
            // UPDATE SESSION ENROLLED COUNT
            // =============================================

            session.enrolled =
                session.enrolled + 1;


            await session.save();


            // =============================================
            // SYNC TEACHER
            // =============================================

            await syncTeacherData(
                session.instructor._id
            );


            return res.status(201).json(
                enrollment
            );

        }

        catch (error) {

            console.error(
                "Create enrollment error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to create enrollment.",
                error:
                    error.message
            });

        }

    }
);


// =========================================================
// GET ALL ENROLLMENTS
// ADMIN
// =========================================================

router.get(
    "/",
    async (req, res) => {

        try {

            const enrollments =
                await Enrollment.find()
                    .populate(
                        "courseId"
                    )
                    .populate(
                        "sessionId"
                    )
                    .sort({
                        createdAt: -1
                    });


            return res.json(
                enrollments
            );

        }

        catch (error) {

            console.error(
                "Get enrollments error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to fetch enrollments.",
                error:
                    error.message
            });

        }

    }
);


// =========================================================
// GET ENROLLMENTS FOR ONE STUDENT
// PUBLIC
// GET /api/enrollments/student/:userId
// =========================================================

router.get(
    "/student/:userId",
    async (req, res) => {

        try {

            const enrollments =
                await Enrollment.find({
                    userId: req.params.userId,
                    status: "Confirmed",
                    enrollmentStatus: "Active"
                })
                .sort({ createdAt: -1 });


            return res.json({
                enrollments: enrollments
            });

        }

        catch (error) {

            console.error(
                "Get student enrollments error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to fetch student enrollments.",
                error:
                    error.message
            });

        }

    }
);


// =========================================================
// GET ONE ENROLLMENT
// ADMIN
// =========================================================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const enrollment =
                await Enrollment.findById(
                    req.params.id
                )
                .populate(
                    "courseId"
                )
                .populate(
                    "sessionId"
                );


            if (!enrollment) {

                return res.status(404).json({
                    message:
                        "Enrollment not found."
                });

            }


            return res.json(
                enrollment
            );

        }

        catch (error) {

            console.error(
                "Get enrollment error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to fetch enrollment.",
                error:
                    error.message
            });

        }

    }
);


// =========================================================
// UPDATE ENROLLMENT COURSE STATUS
// ADMIN
// =========================================================

router.put(
    "/:id/status",
    async (req, res) => {

        try {

            const {
                enrollmentStatus
            } = req.body;


            // =============================================
            // VALIDATE STATUS
            // =============================================

            if (
                enrollmentStatus !== "Active" &&
                enrollmentStatus !== "Inactive"
            ) {

                return res.status(400).json({
                    message:
                        "Invalid enrollment status."
                });

            }


            // =============================================
            // FIND ENROLLMENT
            // =============================================

            const enrollment =
                await Enrollment.findById(
                    req.params.id
                );


            if (!enrollment) {

                return res.status(404).json({
                    message:
                        "Enrollment not found."
                });

            }


            // =============================================
            // ONLY CONFIRMED ENROLLMENTS
            // =============================================

            if (
                enrollment.status !==
                "Confirmed"
            ) {

                return res.status(400).json({
                    message:
                        "Only confirmed enrollments can be activated or deactivated."
                });

            }


            // =============================================
            // NOTHING TO CHANGE
            // =============================================

            if (
                enrollment.enrollmentStatus ===
                enrollmentStatus
            ) {

                return res.status(200).json({

                    message:
                        "Enrollment status is already " +
                        enrollmentStatus,

                    enrollment:
                        enrollment

                });

            }


            // =============================================
            // FIND SESSION
            // =============================================

            const session =
                await Session.findById(
                    enrollment.sessionId
                ).populate(
                    "instructor"
                );


            if (!session) {

                return res.status(404).json({
                    message:
                        "Session not found."
                });

            }


            // =============================================
            // DEACTIVATE COURSE
            // =============================================

            if (
                enrollmentStatus ===
                "Inactive"
            ) {

                if (
                    session.enrolled > 0
                ) {

                    session.enrolled =
                        session.enrolled - 1;

                }


                await session.save();

            }


            // =============================================
            // ACTIVATE COURSE
            // =============================================

            if (
                enrollmentStatus ===
                "Active"
            ) {

                if (
                    session.enrolled >=
                    session.capacity
                ) {

                    return res.status(400).json({
                        message:
                            "This session is already full."
                    });

                }


                session.enrolled =
                    session.enrolled + 1;


                await session.save();

            }


            // =============================================
            // UPDATE ENROLLMENT
            // =============================================

            enrollment.enrollmentStatus =
                enrollmentStatus;


            await enrollment.save();


            // =============================================
            // UPDATE STUDENT COURSE
            // =============================================

            const student =
                await Student.findOne({
                    userId:
                        enrollment.userId
                });


            if (student) {

                const studentCourse =
                    student.courses.find(
                        course => {

                            if (
                                !course.enrollmentId
                            ) {

                                return false;

                            }


                            return (
                                String(
                                    course.enrollmentId
                                ) ===
                                String(
                                    enrollment._id
                                )
                            );

                        }
                    );


                if (studentCourse) {

                    studentCourse.status =
                        enrollmentStatus;

                    await student.save();

                }

            }


            // =============================================
            // SYNC TEACHER
            // =============================================

            if (
                session.instructor &&
                session.instructor._id
            ) {

                await syncTeacherData(
                    session.instructor._id
                );

            }


            // =============================================
            // RESPONSE
            // =============================================

            return res.status(200).json({

                message:
                    enrollmentStatus ===
                    "Active"

                        ? "Student activated for this course."

                        : "Student deactivated from this course.",

                enrollment:
                    enrollment

            });

        }

        catch (error) {

            console.error(
                "Enrollment status update error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to update enrollment status.",
                error:
                    error.message
            });

        }

    }
);


// =========================================================
// UPDATE ENROLLMENT
// ADMIN
// =========================================================

router.put(
    "/:id",
    async (req, res) => {

        try {

            const enrollment =
                await Enrollment.findById(
                    req.params.id
                );


            if (!enrollment) {

                return res.status(404).json({
                    message:
                        "Enrollment not found."
                });

            }


            // =============================================
            // SAVE OLD DATA
            // =============================================

            const oldStatus =
                enrollment.status;


            const oldSessionId =
                enrollment.sessionId;


            // =============================================
            // UPDATE ENROLLMENT
            // =============================================

            Object.keys(
                req.body
            ).forEach(
                key => {

                    if (
                        req.body[key] !==
                        undefined
                    ) {

                        enrollment[key] =
                            req.body[key];

                    }

                }
            );


            await enrollment.save();


            // =============================================
            // IF CONFIRMED
            // =============================================

            if (
                enrollment.status ===
                "Confirmed"
            ) {

                const student =
                    await Student.findOne({
                        userId:
                            enrollment.userId
                    });


                const selectedSession =
                    await Session.findById(
                        enrollment.sessionId
                    ).populate(
                        "instructor"
                    );


                if (
                    selectedSession
                ) {

                    const studentCourse = {

                        enrollmentId:
                            enrollment._id,

                        courseId:
                            enrollment.courseId,

                        name:
                            enrollment.courseTitle,

                        level:
                            enrollment.level,

                        language:
                            enrollment.language,

                        session:
                            selectedSession.group ||
                            "",

                        teacher:
                            enrollment.teacher,

                        startDate:
                            enrollment.startDate,

                        duration:
                            enrollment.duration,

                        price:
                            enrollment.price,

                        programType:
                            enrollment.programType,

                        status:
                            enrollment.enrollmentStatus ||
                            "Active",

                        createdAt:
                            new Date()

                    };


                    // =====================================
                    // EXISTING STUDENT
                    // =====================================

                    if (
                        student
                    ) {

                        const existingCourse =
                            student.courses.find(
                                course => {

                                    return (
                                        course.enrollmentId &&
                                        String(
                                            course.enrollmentId
                                        ) ===
                                        String(
                                            enrollment._id
                                        )
                                    );

                                }
                            );


                        if (
                            !existingCourse
                        ) {

                            student.courses.push(
                                studentCourse
                            );

                        } else {

                            existingCourse.status =
                                enrollment.enrollmentStatus ||
                                "Active";

                        }


                        await student.save();

                    }

                    // =====================================
                    // CREATE STUDENT
                    // =====================================

                    else {

                        const user =
                            await require(
                                "../models/User"
                            ).findById(
                                enrollment.userId
                            );


                        if (
                            user
                        ) {

                            const studentCount =
                                await Student.countDocuments();


                            const newStudent =
                                new Student({

                                    userId:
                                        enrollment.userId,

                                    studentId:
                                        `STD-${String(
                                            studentCount + 1
                                        ).padStart(
                                            3,
                                            "0"
                                        )}`,

                                    name:
                                        enrollment.fullName,

                                    email:
                                        enrollment.email,

                                    phone:
                                        enrollment.phone,

                                    phone2:
                                        enrollment.phone2 ||
                                        "",

                                    courses: [
                                        studentCourse
                                    ],

                                    status:
                                        "Active"

                                });


                            await newStudent.save();

                        }

                    }

                }

            }


            // =============================================
            // GET OLD SESSION TEACHER
            // =============================================

            let oldTeacherId = null;


            if (
                oldSessionId
            ) {

                const oldSession =
                    await Session.findById(
                        oldSessionId
                    );


                if (
                    oldSession &&
                    oldSession.instructor
                ) {

                    oldTeacherId =
                        oldSession.instructor;

                }

            }


            // =============================================
            // GET NEW SESSION TEACHER
            // =============================================

            let newTeacherId = null;


            if (
                enrollment.sessionId
            ) {

                const newSession =
                    await Session.findById(
                        enrollment.sessionId
                    );


                if (
                    newSession &&
                    newSession.instructor
                ) {

                    newTeacherId =
                        newSession.instructor;

                }

            }


            // =============================================
            // SYNC OLD TEACHER
            // =============================================

            if (
                oldTeacherId
            ) {

                await syncTeacherData(
                    oldTeacherId
                );

            }


            // =============================================
            // SYNC NEW TEACHER
            // =============================================

            if (
                newTeacherId &&
                String(
                    newTeacherId
                ) !==
                String(
                    oldTeacherId
                )
            ) {

                await syncTeacherData(
                    newTeacherId
                );

            }


            return res.json(
                enrollment
            );

        }

        catch (error) {

            console.error(
                "Update enrollment error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to update enrollment.",
                error:
                    error.message
            });

        }

    }
);


// =========================================================
// DELETE ENROLLMENT
// ADMIN
// =========================================================

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const enrollment =
                await Enrollment.findById(
                    req.params.id
                );


            if (!enrollment) {

                return res.status(404).json({
                    message:
                        "Enrollment not found."
                });

            }


            // =============================================
            // GET SESSION
            // =============================================

            const session =
                await Session.findById(
                    enrollment.sessionId
                );


            let teacherId = null;


            if (
                session &&
                session.instructor
            ) {

                teacherId =
                    session.instructor;

            }


            // =============================================
            // DECREASE SESSION COUNT
            // ONLY IF COURSE WAS ACTIVE
            // =============================================

            if (
                session &&
                enrollment.enrollmentStatus !==
                "Inactive" &&
                session.enrolled > 0
            ) {

                session.enrolled =
                    session.enrolled - 1;


                await session.save();

            }


            // =============================================
            // DELETE ENROLLMENT
            // =============================================

            await Enrollment.findByIdAndDelete(
                req.params.id
            );


            // =============================================
            // SYNC TEACHER
            // =============================================

            if (
                teacherId
            ) {

                await syncTeacherData(
                    teacherId
                );

            }


            return res.json({
                message:
                    "Enrollment deleted successfully."
            });

        }

        catch (error) {

            console.error(
                "Delete enrollment error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to delete enrollment.",
                error:
                    error.message
            });

        }

    }
);


module.exports = router;