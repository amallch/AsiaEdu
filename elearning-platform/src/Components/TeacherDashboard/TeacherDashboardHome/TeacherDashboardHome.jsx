import "./TeacherDashboardHome.css";

import { useEffect, useState } from "react";


function Dashboard() {

    const [teacher, setTeacher] =
        useState(null);

    const [courses, setCourses] =
        useState([]);

    const [students, setStudents] =
        useState([]);

    const [lessons, setLessons] =
        useState([]);

    const [assignments, setAssignments] =
        useState([]);

    const [sessions, setSessions] =
        useState([]);

    const [submissions, setSubmissions] =
        useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =====================================================
       LOAD DASHBOARD
    ===================================================== */

    useEffect(() => {

        async function loadDashboard() {

            try {

                setIsLoading(true);

                setError("");


                /* =================================================
                   GET LOGGED-IN USER
                ================================================= */

                const storedUser =
                    localStorage.getItem("user");


                if (!storedUser) {

                    throw new Error(
                        "Please log in again."
                    );

                }


                const user =
                    JSON.parse(storedUser);


                const userId =
                    user.id ||
                    user._id;


                if (!userId) {

                    throw new Error(
                        "User information is missing."
                    );

                }


                /* =================================================
                   GET TEACHER
                ================================================= */

                const teacherResponse =
                    await fetch(
                        `https://asiaedu-backend.onrender.com/api/teachers/user/${userId}`
                    );


                const teacherData =
                    await teacherResponse.json();


                if (!teacherResponse.ok) {

                    throw new Error(
                        teacherData.message ||
                        "Failed to get teacher information."
                    );

                }


                const currentTeacher =
                    teacherData.teacher ||
                    teacherData;


                if (!currentTeacher._id) {

                    throw new Error(
                        "Teacher ID is missing."
                    );

                }


                setTeacher(
                    currentTeacher
                );


                const teacherId =
                    currentTeacher._id;


                /* =================================================
                   GET ALL DATA
                ================================================= */

                const [
                    coursesResponse,
                    studentsResponse,
                    lessonsResponse,
                    assignmentsResponse,
                    sessionsResponse
                ] = await Promise.all([

                    fetch(
                        "https://asiaedu-backend.onrender.com/api/courses"
                    ),

                    fetch(
                        "https://asiaedu-backend.onrender.com/api/students"
                    ),

                    fetch(
                        `https://asiaedu-backend.onrender.com/api/lessons/teacher/${teacherId}`
                    ),

                    fetch(
                        `https://asiaedu-backend.onrender.com/api/assignments/teacher/${teacherId}`
                    ),

                    fetch(
                        "https://asiaedu-backend.onrender.com/api/sessions"
                    )

                ]);


                /* =================================================
                   COURSES
                ================================================= */

                const coursesData =
                    await coursesResponse.json();


                if (!coursesResponse.ok) {

                    throw new Error(
                        coursesData.message ||
                        "Failed to get courses."
                    );

                }


                const allCourses =
                    Array.isArray(coursesData)
                        ? coursesData
                        : coursesData.courses || [];


                /* =================================================
                   STUDENTS
                ================================================= */

                const studentsData =
                    await studentsResponse.json();


                if (!studentsResponse.ok) {

                    throw new Error(
                        studentsData.message ||
                        "Failed to get students."
                    );

                }


                const allStudents =
                    Array.isArray(studentsData)
                        ? studentsData
                        : studentsData.students || [];


                /* =================================================
                   LESSONS
                ================================================= */

                const lessonsData =
                    await lessonsResponse.json();


                if (!lessonsResponse.ok) {

                    throw new Error(
                        lessonsData.message ||
                        "Failed to get lessons."
                    );

                }


                const teacherLessons =
                    lessonsData.lessons ||
                    (
                        Array.isArray(lessonsData)
                            ? lessonsData
                            : []
                    );


                /* =================================================
                   ASSIGNMENTS
                ================================================= */

                const assignmentsData =
                    await assignmentsResponse.json();


                if (!assignmentsResponse.ok) {

                    throw new Error(
                        assignmentsData.message ||
                        "Failed to get assignments."
                    );

                }


                const teacherAssignments =
                    assignmentsData.assignments ||
                    (
                        Array.isArray(assignmentsData)
                            ? assignmentsData
                            : []
                    );


                /* =================================================
                   SESSIONS
                ================================================= */

                const sessionsData =
                    await sessionsResponse.json();


                let allSessions = [];


                if (
                    sessionsResponse.ok
                ) {

                    allSessions =
                        Array.isArray(sessionsData)
                            ? sessionsData
                            : sessionsData.sessions || [];

                }


                /* =================================================
                   TEACHER COURSE IDS
                =================================================
                   We collect course IDs from:
                   1. Teacher.courses
                   2. Course.teacherId
                   3. Course.teacher
                   4. Course.teacher._id
                   5. Sessions where this teacher is the instructor
                ================================================= */

                const teacherCourseIds =
                    new Set();


                /* =================================================
                   FROM TEACHER PROFILE
                ================================================= */

                if (
                    Array.isArray(
                        currentTeacher.courses
                    )
                ) {

                    currentTeacher.courses.forEach(
                        (teacherCourse) => {

                            if (
                                !teacherCourse ||
                                !teacherCourse.courseId
                            ) {

                                return;

                            }


                            const courseId =
                                typeof teacherCourse.courseId === "object"
                                    ? teacherCourse.courseId._id
                                    : teacherCourse.courseId;


                            if (courseId) {

                                teacherCourseIds.add(
                                    String(courseId)
                                );

                            }

                        }
                    );

                }


                /* =================================================
                   CHECK COURSE TEACHER
                ================================================= */

                allCourses.forEach(
                    (course) => {

                        if (!course) {

                            return;

                        }


                        const possibleTeacherIds = [];


                        /* =========================
                           teacherId
                        ========================= */

                        if (
                            course.teacherId
                        ) {

                            if (
                                typeof course.teacherId === "object"
                            ) {

                                possibleTeacherIds.push(
                                    course.teacherId._id
                                );

                            }
                            else {

                                possibleTeacherIds.push(
                                    course.teacherId
                                );

                            }

                        }


                        /* =========================
                           teacher
                        ========================= */

                        if (
                            course.teacher
                        ) {

                            if (
                                typeof course.teacher === "object"
                            ) {

                                possibleTeacherIds.push(
                                    course.teacher._id
                                );

                            }
                            else {

                                possibleTeacherIds.push(
                                    course.teacher
                                );

                            }

                        }


                        /* =========================
                           teacher._id
                        ========================= */

                        if (
                            course.teacher?._id
                        ) {

                            possibleTeacherIds.push(
                                course.teacher._id
                            );

                        }


                        /* =========================
                           MATCH TEACHER
                        ========================= */

                        const belongsToTeacher =
                            possibleTeacherIds.some(
                                (id) =>
                                    id &&
                                    String(id) ===
                                    String(teacherId)
                            );


                        if (
                            belongsToTeacher
                        ) {

                            teacherCourseIds.add(
                                String(course._id)
                            );

                        }

                    }
                );


                /* =================================================
                   CHECK SESSIONS
                =================================================
                   A teacher can teach multiple courses through
                   different sessions. We use the session instructor
                   and session course relationship as another source.
                ================================================= */

                allSessions.forEach(
                    (session) => {

                        if (!session) {

                            return;

                        }


                        /* =========================
                           GET SESSION INSTRUCTOR
                        ========================= */

                        let sessionInstructorId = null;


                        if (
                            session.instructor
                        ) {

                            if (
                                typeof session.instructor === "object"
                            ) {

                                sessionInstructorId =
                                    session.instructor._id;

                            }
                            else {

                                sessionInstructorId =
                                    session.instructor;

                            }

                        }


                        /* =========================
                           MATCH TEACHER
                        ========================= */

                        if (
                            !sessionInstructorId ||
                            String(sessionInstructorId) !==
                            String(teacherId)
                        ) {

                            return;

                        }


                        /* =========================
                           GET SESSION COURSE
                        ========================= */

                        let sessionCourseId = null;


                        if (
                            session.course
                        ) {

                            if (
                                typeof session.course === "object"
                            ) {

                                sessionCourseId =
                                    session.course._id;

                            }
                            else {

                                sessionCourseId =
                                    session.course;

                            }

                        }


                        /* =========================
                           ADD COURSE
                        ========================= */

                        if (
                            sessionCourseId
                        ) {

                            teacherCourseIds.add(
                                String(sessionCourseId)
                            );

                        }

                    }
                );


                /* =================================================
                   MATCH TEACHER COURSES
                ================================================= */

                const teacherCourses =
                    allCourses.filter(
                        (course) => {

                            if (!course?._id) {

                                return false;

                            }


                            return teacherCourseIds.has(
                                String(course._id)
                            );

                        }
                    );


                /* =================================================
                   GET SUBMISSIONS
                ================================================= */

                let teacherSubmissions = [];


                if (
                    teacherAssignments.length > 0
                ) {

                    const submissionResponses =
                        await Promise.all(

                            teacherAssignments.map(
                                async (assignment) => {

                                    try {

                                        const response =
                                            await fetch(
                                                `https://asiaedu-backend.onrender.com/api/submissions/assignment/${assignment._id}`
                                            );


                                        if (
                                            !response.ok
                                        ) {

                                            return [];

                                        }


                                        const data =
                                            await response.json();


                                        return (
                                            data.submissions ||
                                            []
                                        );

                                    }

                                    catch (error) {

                                        console.error(
                                            "Assignment submissions error:",
                                            error
                                        );


                                        return [];

                                    }

                                }
                            )

                        );


                    submissionResponses.forEach(
                        (assignmentSubmissions) => {

                            teacherSubmissions =
                                teacherSubmissions.concat(
                                    assignmentSubmissions
                                );

                        }
                    );

                }


                /* =================================================
                   SET DATA
                ================================================= */

                setCourses(
                    teacherCourses
                );

                setStudents(
                    allStudents
                );

                setLessons(
                    teacherLessons
                );

                setAssignments(
                    teacherAssignments
                );

                setSessions(
                    allSessions
                );

                setSubmissions(
                    teacherSubmissions
                );

            }

            catch (error) {

                console.error(
                    "Teacher dashboard error:",
                    error
                );


                setError(
                    error.message ||
                    "Failed to load dashboard."
                );

            }

            finally {

                setIsLoading(false);

            }

        }


        loadDashboard();

    }, []);


    /* =====================================================
       GET STUDENTS FOR COURSE
    ===================================================== */

    function getCourseStudents(courseId) {

        if (!courseId) {

            return [];

        }


        return students.filter(
            (student) => {

                const studentCourses =
                    student.courses || [];


                return studentCourses.some(
                    (studentCourse) => {

                        if (
                            !studentCourse ||
                            !studentCourse.courseId
                        ) {

                            return false;

                        }


                        const studentCourseId =
                            typeof studentCourse.courseId === "object"
                                ? studentCourse.courseId._id
                                : studentCourse.courseId;


                        return (
                            String(studentCourseId) ===
                            String(courseId)
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       GET STUDENTS FOR SESSION
    ===================================================== */

    function getSessionStudents(
        session,
        courseId
    ) {

        if (!session) {

            return [];

        }


        /* =================================================
           FIRST: SESSION HAS ITS OWN STUDENTS ARRAY
        ================================================= */

        if (
            Array.isArray(session.students)
        ) {

            return session.students;

        }


        /* =================================================
           SESSION ID
        ================================================= */

        const sessionId =
            session._id;


        /* =================================================
           SESSION NAME / GROUP
        ================================================= */

        const sessionName =
            session.group ||
            session.title ||
            session.name ||
            "";


        const courseStudents =
            getCourseStudents(
                courseId
            );


        /* =================================================
           FIND STUDENTS CONNECTED TO THIS SESSION
        ================================================= */

        const sessionStudents =
            courseStudents.filter(
                (student) => {

                    const studentCourses =
                        student.courses || [];


                    return studentCourses.some(
                        (studentCourse) => {

                            if (
                                !studentCourse ||
                                !studentCourse.courseId
                            ) {

                                return false;

                            }


                            const studentCourseId =
                                typeof studentCourse.courseId === "object"
                                    ? studentCourse.courseId._id
                                    : studentCourse.courseId;


                            if (
                                String(studentCourseId) !==
                                String(courseId)
                            ) {

                                return false;

                            }


                            /* =========================
                               SESSION ID
                            ========================= */

                            const studentSessionId =
                                studentCourse.sessionId ||
                                studentCourse.session;


                            if (
                                studentSessionId
                            ) {

                                const actualSessionId =
                                    typeof studentSessionId === "object"
                                        ? studentSessionId._id
                                        : studentSessionId;


                                return (
                                    String(
                                        actualSessionId
                                    ) ===
                                    String(
                                        sessionId
                                    )
                                );

                            }


                            /* =========================
                               SESSION NAME / GROUP
                            ========================= */

                            const studentSessionName =
                                studentCourse.sessionName ||
                                studentCourse.group ||
                                studentCourse.sessionTitle;


                            if (
                                studentSessionName &&
                                sessionName
                            ) {

                                return (
                                    String(
                                        studentSessionName
                                    ).toLowerCase() ===
                                    String(
                                        sessionName
                                    ).toLowerCase()
                                );

                            }


                            return false;

                        }
                    );

                }
            );


        /* =================================================
           ONLY RETURN STUDENTS ACTUALLY CONNECTED
           TO THIS SESSION
        ================================================= */

        return sessionStudents;

    }


    /* =====================================================
       GET LESSONS FOR COURSE
    ===================================================== */

    function getCourseLessons(courseId) {

        if (!courseId) {

            return [];

        }


        return lessons.filter(
            (lesson) => {

                if (!lesson.course) {

                    return false;

                }


                const lessonCourseId =
                    typeof lesson.course === "object"
                        ? lesson.course._id
                        : lesson.course;


                return (
                    String(lessonCourseId) ===
                    String(courseId)
                );

            }
        );

    }


    /* =====================================================
       GET ALL SESSIONS FOR COURSE
    ===================================================== */

    function getCourseSessions(courseId) {

        if (!courseId) {

            return [];

        }


        return sessions.filter(
            (session) => {

                if (!session.course) {

                    return false;

                }


                const sessionCourseId =
                    typeof session.course === "object"
                        ? session.course._id
                        : session.course;


                return (
                    String(sessionCourseId) ===
                    String(courseId)
                );

            }
        );

    }


    /* =====================================================
       GET COURSE TITLE
    ===================================================== */

    function getCourseTitle(course) {

        if (!course) {

            return "Course";

        }


        if (typeof course === "object") {

            return (
                course.title ||
                course.name ||
                "Course"
            );

        }


        const foundCourse =
            courses.find(
                (item) =>
                    String(item._id) ===
                    String(course)
            );


        if (foundCourse) {

            return (
                foundCourse.title ||
                foundCourse.name ||
                "Course"
            );

        }


        return "Course";

    }


    /* =====================================================
       GET SESSION NAME
    ===================================================== */

    function getSessionName(session) {

        if (!session) {

            return "Session";

        }


        return (
            session.group ||
            session.title ||
            session.name ||
            "Session"
        );

    }


    /* =====================================================
       GET SESSION START DATE
    ===================================================== */

    function getSessionDay(session) {

        if (!session) {

            return "Not set";

        }


        return (
            session.startDate ||
            "Not set"
        );

    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(date) {

        if (!date) {

            return "";

        }


        const formattedDate =
            new Date(date);


        if (
            Number.isNaN(
                formattedDate.getTime()
            )
        ) {

            return "";

        }


        return formattedDate.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       RECENT LESSONS
    ===================================================== */

    const recentLessons =
        [...lessons]
            .sort(
                (firstLesson, secondLesson) => {

                    const firstDate =
                        new Date(
                            firstLesson.createdAt ||
                            firstLesson.updatedAt ||
                            0
                        );


                    const secondDate =
                        new Date(
                            secondLesson.createdAt ||
                            secondLesson.updatedAt ||
                            0
                        );


                    return (
                        secondDate.getTime() -
                        firstDate.getTime()
                    );

                }
            )
            .slice(0, 2);


    /* =====================================================
       RECENT ASSIGNMENTS
    ===================================================== */

    const recentAssignments =
        [...assignments]
            .sort(
                (
                    firstAssignment,
                    secondAssignment
                ) => {

                    const firstDate =
                        new Date(
                            firstAssignment.createdAt ||
                            firstAssignment.updatedAt ||
                            0
                        );


                    const secondDate =
                        new Date(
                            secondAssignment.createdAt ||
                            secondAssignment.updatedAt ||
                            0
                        );


                    return (
                        secondDate.getTime() -
                        firstDate.getTime()
                    );

                }
            )
            .slice(0, 2);


    /* =====================================================
       RECENT SUBMISSIONS
       ONLY NON-GRADED SUBMISSIONS
    ===================================================== */

    const recentSubmissions =
        [...submissions]
            .filter(
                (submission) =>
                    submission.status !== "Graded"
            )
            .sort(
                (
                    firstSubmission,
                    secondSubmission
                ) => {

                    const firstDate =
                        new Date(
                            firstSubmission.submittedAt ||
                            firstSubmission.createdAt ||
                            0
                        );


                    const secondDate =
                        new Date(
                            secondSubmission.submittedAt ||
                            secondSubmission.createdAt ||
                            0
                        );


                    return (
                        secondDate.getTime() -
                        firstDate.getTime()
                    );

                }
            )
            .slice(0, 3);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const teacherCourseIdsForStats =
        new Set();


    courses.forEach(
        (course) => {

            if (
                course?._id
            ) {

                teacherCourseIdsForStats.add(
                    String(course._id)
                );

            }

        }
    );


    const teacherStudents =
        students.filter(
            (student) => {

                const studentCourses =
                    student.courses || [];


                return studentCourses.some(
                    (studentCourse) => {

                        if (
                            !studentCourse ||
                            !studentCourse.courseId
                        ) {

                            return false;

                        }


                        const studentCourseId =
                            typeof studentCourse.courseId === "object"
                                ? studentCourse.courseId._id
                                : studentCourse.courseId;


                        return teacherCourseIdsForStats.has(
                            String(
                                studentCourseId
                            )
                        );

                    }
                );

            }
        );


    const STATS = [
        {
            label: "My Courses",
            value: courses.length,
            icon: "fa-solid fa-book-open"
        },
        {
            label: "Total Students",
            value: teacherStudents.length,
            icon: "fa-solid fa-users"
        },
        {
            label: "Lessons",
            value: lessons.length,
            icon: "fa-solid fa-chalkboard-user"
        },
        {
            label: "Assignments",
            value: assignments.length,
            icon: "fa-solid fa-file-lines"
        }
    ];


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <section className="TeacherDashboardHome">

                <div className="TeacherDashboardHome-container">

                    <div className="TeacherDashboardHome-welcome">

                        <div>

                            <span className="TeacherDashboardHome-welcome-label">

                                <i className="fa-solid fa-chalkboard-user"></i>

                                Teacher Dashboard

                            </span>


                            <h2>
                                Loading dashboard...
                            </h2>


                            <p>
                                Please wait while we load your courses and students.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        return (

            <section className="TeacherDashboardHome">

                <div className="TeacherDashboardHome-container">

                    <div className="TeacherDashboardHome-errorCard">

                        <div className="TeacherDashboardHome-errorIcon">

                            <i className="fa-solid fa-triangle-exclamation"></i>

                        </div>


                        <h3>
                            Unable to load dashboard
                        </h3>


                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            </section>

        );

    }


    return (

        <section className="TeacherDashboardHome">

            <div className="TeacherDashboardHome-container">


                {/* =================================================
                    WELCOME
                ================================================= */}

                <div className="TeacherDashboardHome-welcome">

                    <div className="TeacherDashboardHome-welcomeContent">

                        <span className="TeacherDashboardHome-welcome-label">

                            <i className="fa-solid fa-chalkboard-user"></i>

                            Teacher Dashboard

                        </span>


                        <h2>

                            Welcome back,{" "}

                            {teacher?.name ||
                                "Teacher"}

                            !

                        </h2>


                        <p>

                            Here's what's happening with your courses and students today.

                        </p>

                    </div>


                    <div className="TeacherDashboardHome-welcomeDecoration">

                        <i className="fa-solid fa-chalkboard-user"></i>

                    </div>

                </div>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="TeacherDashboardHome-statistics">

                    {STATS.map(
                        (stat) => (

                            <div
                                className="TeacherDashboardHome-statCard"
                                key={stat.label}
                            >

                                <div className="TeacherDashboardHome-statIcon">

                                    <i
                                        className={
                                            stat.icon
                                        }
                                    ></i>

                                </div>


                                <div className="TeacherDashboardHome-statInfo">

                                    <p>
                                        {stat.label}
                                    </p>


                                    <h3>
                                        {stat.value}
                                    </h3>

                                </div>

                            </div>

                        )
                    )}

                </div>


                {/* =================================================
                    MY COURSES
                ================================================= */}

                <div className="TeacherDashboardHome-section">

                    <div className="TeacherDashboardHome-sectionHeading">

                        <div>

                            <h3>

                                <span className="TeacherDashboardHome-headingIcon">

                                    <i className="fa-solid fa-book-open"></i>

                                </span>

                                My Courses

                            </h3>


                            <p>
                                Your courses and their scheduled sessions.
                            </p>

                        </div>

                    </div>


                    {courses.length === 0 ? (

                        <div className="TeacherDashboardHome-empty">

                            <div className="TeacherDashboardHome-emptyIcon">

                                <i className="fa-solid fa-book-open"></i>

                            </div>


                            <h4>
                                No courses yet
                            </h4>


                            <p>
                                Your assigned courses will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="TeacherDashboardHome-courseList">

                            {courses.map(
                                (course) => {

                                    const courseSessions =
                                        getCourseSessions(
                                            course._id
                                        );


                                    const courseLevel =
                                        course.level ||
                                        "Beginner";


                                    return (

                                        <div
                                            className="TeacherDashboardHome-courseCard"
                                            key={course._id}
                                        >

                                            {/* COURSE TITLE */}

                                            <div className="TeacherDashboardHome-courseHeader">

                                                <h4>

                                                    {course.title ||
                                                        course.name ||
                                                        "Course"}

                                                </h4>


                                                <span
                                                    className={`TeacherDashboardHome-level TeacherDashboardHome-level-${String(courseLevel).toLowerCase().replace(/\s+/g, "-")}`}
                                                >

                                                    {courseLevel}

                                                </span>

                                            </div>


                                            {/* SESSION TABLE HEADER */}

                                            <div className="TeacherDashboardHome-sessionHeader">

                                                <span>
                                                    SESSION
                                                </span>


                                                <span>
                                                    START DATE
                                                </span>


                                                <span>
                                                    STUDENTS
                                                </span>

                                            </div>


                                            {/* SESSIONS */}

                                            {courseSessions.length === 0 ? (

                                                <div className="TeacherDashboardHome-noSession">

                                                    No sessions scheduled yet.

                                                </div>

                                            ) : (

                                                <div className="TeacherDashboardHome-sessionList">

                                                    {courseSessions.map(
                                                        (session) => {

                                                            const enrolledStudents =
                                                                session.enrolled ||
                                                                (
                                                                    Array.isArray(
                                                                        session.students
                                                                    )
                                                                        ? session.students.length
                                                                        : 0
                                                                );


                                                            return (

                                                                <div
                                                                    className="TeacherDashboardHome-sessionRow"
                                                                    key={session._id}
                                                                >

                                                                    <span className="TeacherDashboardHome-sessionName">

                                                                        {getSessionName(
                                                                            session
                                                                        )}

                                                                    </span>


                                                                    <span className="TeacherDashboardHome-sessionDay">

                                                                        {getSessionDay(
                                                                            session
                                                                        )}

                                                                    </span>


                                                                    <span className="TeacherDashboardHome-sessionStudents">

                                                                        {enrolledStudents}{" "}

                                                                        {enrolledStudents === 1
                                                                            ? "student"
                                                                            : "students"}

                                                                    </span>

                                                                </div>

                                                            );

                                                        }
                                                    )}

                                                </div>

                                            )}

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    RECENT LESSONS + ASSIGNMENTS
                ================================================= */}

                <div className="TeacherDashboardHome-twoColumns">


                    {/* =========================
                        RECENT LESSONS
                    ========================= */}

                    <div className="TeacherDashboardHome-smallSection">

                        <div className="TeacherDashboardHome-smallHeading">

                            <div>

                                <h3>

                                    <span className="TeacherDashboardHome-headingIcon">

                                        <i className="fa-solid fa-chalkboard"></i>

                                    </span>

                                    Recent Lessons

                                </h3>


                                <p>
                                    Your latest created lessons.
                                </p>

                            </div>

                        </div>


                        {recentLessons.length === 0 ? (

                            <div className="TeacherDashboardHome-empty">

                                <div className="TeacherDashboardHome-emptyIcon">

                                    <i className="fa-solid fa-chalkboard"></i>

                                </div>


                                <h4>
                                    No lessons yet
                                </h4>


                                <p>
                                    Your newest lessons will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="TeacherDashboardHome-recentList">

                                {recentLessons.map(
                                    (lesson) => (

                                        <div
                                            className="TeacherDashboardHome-recentItem"
                                            key={lesson._id}
                                        >

                                            <div className="TeacherDashboardHome-recentIcon">

                                                <i className="fa-solid fa-book"></i>

                                            </div>


                                            <div className="TeacherDashboardHome-recentInfo">

                                                <h4>
                                                    {lesson.title}
                                                </h4>


                                                <span>

                                                    {getCourseTitle(
                                                        lesson.course
                                                    )}

                                                </span>

                                            </div>


                                            <span className="TeacherDashboardHome-recentDate">

                                                {formatDate(
                                                    lesson.createdAt ||
                                                    lesson.updatedAt
                                                )}

                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* =========================
                        RECENT ASSIGNMENTS
                    ========================= */}

                    <div className="TeacherDashboardHome-smallSection">

                        <div className="TeacherDashboardHome-smallHeading">

                            <div>

                                <h3>

                                    <span className="TeacherDashboardHome-headingIcon">

                                        <i className="fa-solid fa-file-lines"></i>

                                    </span>

                                    Recent Assignments

                                </h3>


                                <p>
                                    Your latest created assignments.
                                </p>

                            </div>

                        </div>


                        {recentAssignments.length === 0 ? (

                            <div className="TeacherDashboardHome-empty">

                                <div className="TeacherDashboardHome-emptyIcon">

                                    <i className="fa-solid fa-file-lines"></i>

                                </div>


                                <h4>
                                    No assignments yet
                                </h4>


                                <p>
                                    Your newest assignments will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="TeacherDashboardHome-recentList">

                                {recentAssignments.map(
                                    (assignment) => (

                                        <div
                                            className="TeacherDashboardHome-recentItem"
                                            key={assignment._id}
                                        >

                                            <div className="TeacherDashboardHome-recentIcon">

                                                <i className="fa-solid fa-file-lines"></i>

                                            </div>


                                            <div className="TeacherDashboardHome-recentInfo">

                                                <h4>
                                                    {assignment.title}
                                                </h4>


                                                <span>

                                                    {getCourseTitle(
                                                        assignment.course
                                                    )}

                                                </span>

                                            </div>


                                            <span className="TeacherDashboardHome-recentDate">

                                                {formatDate(
                                                    assignment.createdAt ||
                                                    assignment.updatedAt
                                                )}

                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    RECENT SUBMISSIONS
                ================================================= */}

                <div className="TeacherDashboardHome-section TeacherDashboardHome-submissionsSection">

                    <div className="TeacherDashboardHome-sectionHeading">

                        <div>

                            <h3>

                                <span className="TeacherDashboardHome-headingIcon">

                                    <i className="fa-solid fa-file-circle-check"></i>

                                </span>

                                Recent Submissions

                            </h3>


                            <p>
                                The 3 latest non-graded submissions from your students.
                            </p>

                        </div>

                    </div>


                    {recentSubmissions.length === 0 ? (

                        <div className="TeacherDashboardHome-empty">

                            <div className="TeacherDashboardHome-emptyIcon">

                                <i className="fa-solid fa-file-circle-check"></i>

                            </div>


                            <h4>
                                No submissions yet
                            </h4>


                            <p>
                                Non-graded student submissions will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="TeacherDashboardHome-submissionList">

                            {recentSubmissions.map(
                                (submission) => {

                                    const student =
                                        submission.student;


                                    const assignment =
                                        submission.assignment;


                                    return (

                                        <div
                                            className="TeacherDashboardHome-submissionItem"
                                            key={submission._id}
                                        >

                                            {/* STUDENT ICON */}

                                            <div className="TeacherDashboardHome-submissionIcon">

                                                <i className="fa-solid fa-user"></i>

                                            </div>


                                            {/* SUBMISSION INFORMATION */}

                                            <div className="TeacherDashboardHome-submissionInfo">

                                                <h4>

                                                    {student?.name ||
                                                        "Student"}

                                                </h4>


                                                <span>

                                                    {assignment?.title ||
                                                        "Assignment"}

                                                </span>


                                                <small>

                                                    Submitted{" "}

                                                    {formatDate(
                                                        submission.submittedAt ||
                                                        submission.createdAt
                                                    )}

                                                </small>

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </div>

            </div>

        </section>

    );

}


export default Dashboard;