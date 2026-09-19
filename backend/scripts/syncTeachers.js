const mongoose = require("mongoose");

const Teacher = require("../models/Teacher");
const Session = require("../models/Session");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");


// =========================================================
// MONGODB CONNECTION
// =========================================================

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {

    console.error(
        "MONGO_URI is missing from your .env file."
    );

    process.exit(1);
}


// =========================================================
// SYNC ONE TEACHER
// =========================================================

async function syncTeacher(teacher) {

    console.log(
        `\nSyncing teacher: ${teacher.name} (${teacher.teacherId})`
    );


    // =====================================================
    // GET ALL SESSIONS FOR THIS TEACHER
    // =====================================================

    const sessions = await Session.find({
        instructor: teacher._id
    }).populate("course");


    console.log(
        `Sessions found: ${sessions.length}`
    );


    // =====================================================
    // NO SESSIONS
    // =====================================================

    if (sessions.length === 0) {

        teacher.courses = [];

        teacher.students = 0;

        await teacher.save();

        console.log(
            `No sessions found. Teacher reset to 0 courses / 0 students.`
        );

        return;
    }


    // =====================================================
    // UNIQUE COURSES
    // =====================================================

    const courseMap = new Map();


    for (const session of sessions) {

        if (!session.course) {
            continue;
        }


        const courseId =
            session.course._id.toString();


        if (!courseMap.has(courseId)) {

            courseMap.set(
                courseId,
                {
                    course:
                        session.course,

                    sessions: []
                }
            );
        }


        courseMap
            .get(courseId)
            .sessions
            .push(session);
    }


    // =====================================================
    // GET ALL CONFIRMED ENROLLMENTS
    // =====================================================

    const sessionIds =
        sessions.map(
            session => session._id
        );


    const enrollments =
        await Enrollment.find({

            sessionId: {
                $in: sessionIds
            },

            status: "Confirmed"

        });


    console.log(
        `Confirmed enrollments found: ${enrollments.length}`
    );


    // =====================================================
    // BUILD TEACHER COURSES
    // =====================================================

    const teacherCourses = [];

    const allStudentIds = new Set();


    for (const [courseId, data] of courseMap) {

        const course =
            data.course;


        const courseSessions =
            data.sessions;


        // -------------------------------------------------
        // Sessions belonging to this course
        // -------------------------------------------------

        const courseSessionIds =
            courseSessions.map(
                session => session._id.toString()
            );


        // -------------------------------------------------
        // Confirmed enrollments for this course
        // -------------------------------------------------

        const courseEnrollments =
            enrollments.filter(
                enrollment =>
                    courseSessionIds.includes(
                        enrollment.sessionId.toString()
                    )
            );


        // -------------------------------------------------
        // Unique students for this course
        // -------------------------------------------------

        const courseStudentIds =
            new Set();


        for (
            const enrollment
            of courseEnrollments
        ) {

            const studentId =
                enrollment.userId.toString();


            courseStudentIds.add(
                studentId
            );


            allStudentIds.add(
                studentId
            );
        }


        // -------------------------------------------------
        // Preserve existing numeric course ID
        // -------------------------------------------------

        const existingCourse =
            teacher.courses.find(
                existing =>
                    existing.courseId === courseId
            );


        let numericId;


        if (existingCourse) {

            numericId =
                existingCourse.id;

        } else {

            numericId =
                teacherCourses.length + 1;
        }


        // -------------------------------------------------
        // Get first session
        // -------------------------------------------------

        const firstSession =
            courseSessions[0];


        // -------------------------------------------------
        // Teacher course object
        // -------------------------------------------------

        teacherCourses.push({

            id: numericId,

            courseId: courseId,

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
                firstSession.group ||
                "",

            teacher:
                teacher.name,

            startDate:
                firstSession.startDate ||
                course.startDate ||
                "",

            duration:
                course.duration ||
                "",

            price:
                course.price || 0,

            programType:
                firstSession.programType ||
                "Normal",

            status:
                "Active",

            students:
                courseStudentIds.size,

            createdAt:
                existingCourse?.createdAt ||
                new Date()
        });
    }


    // =====================================================
    // SAVE TEACHER
    // =====================================================

    teacher.courses =
        teacherCourses;


    teacher.students =
        allStudentIds.size;


    await teacher.save();


    // =====================================================
    // RESULT
    // =====================================================

    console.log(
        `Courses: ${teacher.courses.length}`
    );

    console.log(
        `Students: ${teacher.students}`
    );

    console.log(
        "Teacher synchronized successfully."
    );
}


// =========================================================
// MAIN
// =========================================================

async function main() {

    try {

        console.log(
            "Connecting to MongoDB..."
        );


        await mongoose.connect(
            MONGO_URI
        );


        console.log(
            "MongoDB connected."
        );


        const teachers =
            await Teacher.find();


        console.log(
            `Teachers found: ${teachers.length}`
        );


        for (const teacher of teachers) {

            await syncTeacher(
                teacher
            );
        }


        console.log(
            "\nAll teachers synchronized successfully."
        );


        await mongoose.disconnect();


        process.exit(0);

    } catch (error) {

        console.error(
            "\nSync failed:"
        );

        console.error(
            error
        );


        await mongoose.disconnect();


        process.exit(1);
    }
}


main();