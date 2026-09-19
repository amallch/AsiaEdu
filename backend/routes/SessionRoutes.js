const express = require("express");

const router = express.Router();


const Session =
    require("../models/Session");

const Course =
    require("../models/Course");

const Teacher =
    require("../models/Teacher");

const Enrollment =
    require("../models/Enrollment");


// =====================================================
// ADD / UPDATE COURSE ON TEACHER
// =====================================================

const addCourseToTeacher = async (
    teacherId,
    course
) => {

    const teacher =
        await Teacher.findById(
            teacherId
        );


    if (!teacher) {
        return;
    }


    // =================================================
    // FIND EXISTING COURSE
    // =================================================

    const existingCourse =
        teacher.courses.find(
            item =>
                String(
                    item.courseId
                ) ===
                String(
                    course._id
                )
        );


    // =================================================
    // GET NUMERIC COURSE ID
    // =================================================

    let numericCourseId = 1;


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

        const existingIds =
            teacher.courses
                .map(
                    item =>
                        Number(
                            item.id
                        )
                )
                .filter(
                    id =>
                        Number.isFinite(id)
                );


        if (
            existingIds.length > 0
        ) {

            numericCourseId =
                Math.max(
                    ...existingIds
                ) + 1;

        }

    }


    // =================================================
    // COURSE DATA
    // =================================================

    const courseData = {

        id:
            numericCourseId,

        courseId:
            String(
                course._id
            ),

        enrollmentId:
            existingCourse
                ? existingCourse.enrollmentId || ""
                : "",

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
            existingCourse
                ? existingCourse.session || ""
                : "",

        teacher:
            teacher.name,

        startDate:
            course.startDate ||
            "",

        duration:
            course.duration ||
            "",

        price:
            course.price ||
            0,

        programType:
            existingCourse
                ? existingCourse.programType || "Normal"
                : "Normal",

        status:
            existingCourse
                ? existingCourse.status || "Active"
                : "Active",

        students:
            existingCourse
                ? existingCourse.students || 0
                : 0,

        createdAt:
            existingCourse &&
            existingCourse.createdAt
                ? existingCourse.createdAt
                : (
                    course.createdAt ||
                    new Date()
                )

    };


    // =================================================
    // ADD OR UPDATE COURSE
    // =================================================

    if (existingCourse) {

        existingCourse.id =
            courseData.id;

        existingCourse.courseId =
            courseData.courseId;

        existingCourse.name =
            courseData.name;

        existingCourse.language =
            courseData.language;

        existingCourse.level =
            courseData.level;

        existingCourse.teacher =
            courseData.teacher;

        existingCourse.startDate =
            courseData.startDate;

        existingCourse.duration =
            courseData.duration;

        existingCourse.price =
            courseData.price;

        if (
            !existingCourse.programType
        ) {

            existingCourse.programType =
                courseData.programType;

        }

        if (
            !existingCourse.status
        ) {

            existingCourse.status =
                courseData.status;

        }

        if (
            existingCourse.students ===
            undefined
        ) {

            existingCourse.students =
                courseData.students;

        }

    }

    else {

        teacher.courses.push(
            courseData
        );

    }


    // =================================================
    // UPDATE TEACHER LANGUAGES
    // =================================================

    const languages = [];


    teacher.courses.forEach(
        item => {

            if (
                item.language &&
                !languages.includes(
                    item.language
                )
            ) {

                languages.push(
                    item.language
                );

            }

        }
    );


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

};


// =====================================================
// REMOVE COURSE FROM TEACHER IF NO LONGER TEACHING IT
// =====================================================

const removeCourseFromTeacherIfUnused = async (
    teacherId,
    courseId
) => {

    // =================================================
    // CHECK IF ANOTHER SESSION STILL USES COURSE
    // =================================================

    const remainingSession =
        await Session.findOne({

            instructor:
                teacherId,

            course:
                courseId

        });


    if (remainingSession) {

        return;

    }


    // =================================================
    // FIND TEACHER
    // =================================================

    const teacher =
        await Teacher.findById(
            teacherId
        );


    if (!teacher) {

        return;

    }


    // =================================================
    // REMOVE COURSE
    // =================================================

    teacher.courses =
        teacher.courses.filter(
            course =>
                String(
                    course.courseId
                ) !==
                String(
                    courseId
                )
        );


    // =================================================
    // REBUILD TEACHER LANGUAGES
    // =================================================

    const languages = [];


    teacher.courses.forEach(
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

    else {

        teacher.language =
            "";

    }


    // =================================================
    // SAVE
    // =================================================

    await teacher.save();

};


// =====================================================
// GET ALL SESSIONS
// =====================================================

router.get("/", async (req, res) => {

    try {

        const sessions =
            await Session.find()
                .populate("course")
                .populate("instructor");


        res.status(200).json(
            sessions
        );

    }

    catch (error) {

        console.error(
            "GET SESSIONS ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to get sessions",

            error:
                error.message

        });

    }

});


// =====================================================
// GET ONE SESSION
// =====================================================

router.get("/:id", async (req, res) => {

    try {

        const session =
            await Session.findById(
                req.params.id
            )
            .populate("course")
            .populate("instructor");


        if (!session) {

            return res.status(404).json({

                message:
                    "Session not found"

            });

        }


        res.status(200).json(
            session
        );

    }

    catch (error) {

        console.error(
            "GET SESSION ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to get session",

            error:
                error.message

        });

    }

});


// =====================================================
// GET SESSION DETAILS WITH ENROLLED STUDENTS
// =====================================================

router.get("/:id/details", async (req, res) => {

    try {

        // =================================================
        // FIND SESSION
        // =================================================

        const session =
            await Session.findById(
                req.params.id
            )
            .populate("course")
            .populate("instructor");


        if (!session) {

            return res.status(404).json({

                message:
                    "Session not found"

            });

        }


        // =================================================
        // FIND ENROLLMENTS FOR THIS SESSION
        // =================================================

        const enrollments =
            await Enrollment.find({

                sessionId:
                    session._id

            });


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({

            session:
                session,

            enrollments:
                enrollments

        });

    }

    catch (error) {

        console.error(
            "GET SESSION DETAILS ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to get session details",

            error:
                error.message

        });

    }

});


// =====================================================
// CREATE SESSION
// =====================================================

router.post("/", async (req, res) => {

    try {

        const {
            course,
            group,
            instructor,
            startDate,
            programType,
            capacity,
            enrolled
        } = req.body;


        // =================================================
        // REQUIRED FIELDS
        // =================================================

        if (
            !course ||
            !group ||
            !instructor ||
            !startDate ||
            !programType ||
            capacity === undefined
        ) {

            return res.status(400).json({

                message:
                    "Course, group, instructor, start date, program type and capacity are required"

            });

        }


        // =================================================
        // FIND COURSE
        // =================================================

        const courseExists =
            await Course.findById(
                course
            );


        if (!courseExists) {

            return res.status(404).json({

                message:
                    "Course not found"

            });

        }


        // =================================================
        // FIND TEACHER
        // =================================================

        const teacherExists =
            await Teacher.findById(
                instructor
            );


        if (!teacherExists) {

            return res.status(404).json({

                message:
                    "Instructor not found"

            });

        }


        // =================================================
        // VALIDATE CAPACITY
        // =================================================

        const capacityValue =
            Number(capacity);


        const enrolledValue =
            enrolled === undefined
                ? 0
                : Number(enrolled);


        if (
            Number.isNaN(
                capacityValue
            ) ||
            capacityValue < 1
        ) {

            return res.status(400).json({

                message:
                    "Capacity must be at least 1"

            });

        }


        if (
            Number.isNaN(
                enrolledValue
            ) ||
            enrolledValue < 0
        ) {

            return res.status(400).json({

                message:
                    "Enrolled cannot be negative"

            });

        }


        if (
            enrolledValue >
            capacityValue
        ) {

            return res.status(400).json({

                message:
                    "Enrolled cannot be greater than capacity"

            });

        }


        // =================================================
        // CREATE SESSION
        // =================================================

        const newSession =
            new Session({

                course:
                    course,

                group:
                    group.trim(),

                instructor:
                    instructor,

                startDate:
                    startDate,

                programType:
                    programType,

                capacity:
                    capacityValue,

                enrolled:
                    enrolledValue,

                status:
                    "Active"

            });


        const savedSession =
            await newSession.save();


        // =================================================
        // ADD COURSE TO TEACHER
        // =================================================

        await addCourseToTeacher(
            instructor,
            courseExists
        );


        // =================================================
        // POPULATE RESPONSE
        // =================================================

        const populatedSession =
            await Session.findById(
                savedSession._id
            )
            .populate("course")
            .populate("instructor");


        // =================================================
        // RESPONSE
        // =================================================

        res.status(201).json({

            message:
                "Session created successfully",

            session:
                populatedSession

        });

    }

    catch (error) {

        console.error(
            "CREATE SESSION ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to create session",

            error:
                error.message

        });

    }

});


// =====================================================
// UPDATE SESSION STATUS
// =====================================================

router.put("/:id/status", async (req, res) => {

    try {

        const {
            status
        } = req.body;


        // =================================================
        // VALIDATE STATUS
        // =================================================

        if (
            status !== "Active" &&
            status !== "Inactive"
        ) {

            return res.status(400).json({

                message:
                    "Status must be Active or Inactive"

            });

        }


        // =================================================
        // FIND SESSION
        // =================================================

        const session =
            await Session.findById(
                req.params.id
            );


        if (!session) {

            return res.status(404).json({

                message:
                    "Session not found"

            });

        }


        // =================================================
        // OLD DATABASE DOCUMENTS
        // =================================================

        const currentStatus =
            session.status || "Active";


        // =================================================
        // ALREADY SAME STATUS
        // =================================================

        if (
            currentStatus === status
        ) {

            return res.status(200).json({

                message:
                    `Session is already ${status}`,

                session:
                    session

            });

        }


        // =================================================
        // DEACTIVATE SESSION
        // =================================================

        if (
            status === "Inactive"
        ) {

            session.status =
                "Inactive";


            await session.save();


            const populatedSession =
                await Session.findById(
                    session._id
                )
                .populate("course")
                .populate("instructor");


            return res.status(200).json({

                message:
                    "Session deactivated successfully",

                session:
                    populatedSession

            });

        }


        // =================================================
        // ACTIVATE SESSION
        // =================================================

        if (
            status === "Active"
        ) {

            if (
                session.enrolled >=
                session.capacity
            ) {

                return res.status(400).json({

                    message:
                        "Cannot activate this session because it is full"

                });

            }


            session.status =
                "Active";


            await session.save();


            const populatedSession =
                await Session.findById(
                    session._id
                )
                .populate("course")
                .populate("instructor");


            return res.status(200).json({

                message:
                    "Session activated successfully",

                session:
                    populatedSession

            });

        }

    }

    catch (error) {

        console.error(
            "UPDATE SESSION STATUS ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to update session status",

            error:
                error.message

        });

    }

});


// =====================================================
// UPDATE SESSION
// =====================================================

router.put("/:id", async (req, res) => {

    try {

        const {
            course,
            group,
            instructor,
            startDate,
            programType,
            capacity,
            enrolled
        } = req.body;


        // =================================================
        // FIND SESSION
        // =================================================

        const session =
            await Session.findById(
                req.params.id
            );


        if (!session) {

            return res.status(404).json({

                message:
                    "Session not found"

            });

        }


        // =================================================
        // SAVE OLD VALUES
        // =================================================

        const oldCourse =
            session.course;

        const oldInstructor =
            session.instructor;


        // =================================================
        // REQUIRED FIELDS
        // =================================================

        if (
            !course ||
            !group ||
            !instructor ||
            !startDate ||
            !programType ||
            capacity === undefined ||
            enrolled === undefined
        ) {

            return res.status(400).json({

                message:
                    "Course, group, instructor, start date, program type, capacity and enrolled are required"

            });

        }


        // =================================================
        // FIND COURSE
        // =================================================

        const courseExists =
            await Course.findById(
                course
            );


        if (!courseExists) {

            return res.status(404).json({

                message:
                    "Course not found"

            });

        }


        // =================================================
        // FIND TEACHER
        // =================================================

        const teacherExists =
            await Teacher.findById(
                instructor
            );


        if (!teacherExists) {

            return res.status(404).json({

                message:
                    "Instructor not found"

            });

        }


        // =================================================
        // VALIDATE CAPACITY
        // =================================================

        const capacityValue =
            Number(capacity);


        const enrolledValue =
            Number(enrolled);


        if (
            Number.isNaN(
                capacityValue
            ) ||
            capacityValue < 1
        ) {

            return res.status(400).json({

                message:
                    "Capacity must be at least 1"

            });

        }


        if (
            Number.isNaN(
                enrolledValue
            ) ||
            enrolledValue < 0
        ) {

            return res.status(400).json({

                message:
                    "Enrolled cannot be negative"

            });

        }


        if (
            enrolledValue >
            capacityValue
        ) {

            return res.status(400).json({

                message:
                    "Enrolled cannot be greater than capacity"

            });

        }


        // =================================================
        // UPDATE SESSION
        // =================================================

        session.course =
            course;

        session.group =
            group.trim();

        session.instructor =
            instructor;

        session.startDate =
            startDate;

        session.programType =
            programType;

        session.capacity =
            capacityValue;

        session.enrolled =
            enrolledValue;


        await session.save();


        // =================================================
        // ADD COURSE TO NEW TEACHER
        // =================================================

        await addCourseToTeacher(
            instructor,
            courseExists
        );


        // =================================================
        // REMOVE OLD COURSE IF NO LONGER USED
        // =================================================

        if (
            String(oldInstructor) ===
            String(instructor)
        ) {

            if (
                String(oldCourse) !==
                String(course)
            ) {

                await removeCourseFromTeacherIfUnused(
                    instructor,
                    oldCourse
                );

            }

        }

        else {

            await removeCourseFromTeacherIfUnused(
                oldInstructor,
                oldCourse
            );

        }


        // =================================================
        // POPULATE RESPONSE
        // =================================================

        const updatedSession =
            await Session.findById(
                session._id
            )
            .populate("course")
            .populate("instructor");


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({

            message:
                "Session updated successfully",

            session:
                updatedSession

        });

    }

    catch (error) {

        console.error(
            "UPDATE SESSION ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to update session",

            error:
                error.message

        });

    }

});


// =====================================================
// DELETE SESSION
// =====================================================

router.delete("/:id", async (req, res) => {

    try {

        const session =
            await Session.findById(
                req.params.id
            );


        if (!session) {

            return res.status(404).json({

                message:
                    "Session not found"

            });

        }


        // =================================================
        // SAVE TEACHER AND COURSE
        // =================================================

        const teacherId =
            session.instructor;

        const courseId =
            session.course;


        // =================================================
        // CHECK ENROLLMENTS
        // =================================================

        const enrollmentCount =
            await Enrollment.countDocuments({

                sessionId:
                    session._id

            });


        if (enrollmentCount > 0) {

            return res.status(400).json({

                message:
                    "Cannot delete a session that has enrolled students. Deactivate it instead."

            });

        }


        // =================================================
        // DELETE SESSION
        // =================================================

        await Session.findByIdAndDelete(
            req.params.id
        );


        // =================================================
        // REMOVE COURSE FROM TEACHER
        // ONLY IF NO OTHER SESSION USES IT
        // =================================================

        await removeCourseFromTeacherIfUnused(
            teacherId,
            courseId
        );


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({

            message:
                "Session deleted successfully",

            session:
                session

        });

    }

    catch (error) {

        console.error(
            "DELETE SESSION ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to delete session",

            error:
                error.message

        });

    }

});


module.exports = router;