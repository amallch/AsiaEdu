import "./Dashboard.css";

import { useEffect, useState } from "react";


function Dashboard() {

    const [student, setStudent] =
        useState(null);

    const [courses, setCourses] =
        useState([]);

    const [lessons, setLessons] =
        useState([]);

    const [assignments, setAssignments] =
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
                   GET STUDENT
                ================================================= */

                const studentResponse =
                    await fetch(
                        `https://asiaedu-backend.onrender.com/api/students/user/${userId}`
                    );


                const studentData =
                    await studentResponse.json();


                if (!studentResponse.ok) {

                    throw new Error(
                        studentData.message ||
                        "Failed to get student information."
                    );

                }


                const currentStudent =
                    studentData.student ||
                    studentData;


                if (!currentStudent._id) {

                    throw new Error(
                        "Student ID is missing."
                    );

                }


                setStudent(
                    currentStudent
                );


                /* =================================================
                   GET STUDENT COURSES
                ================================================= */

                const studentCourses =
                    Array.isArray(
                        currentStudent.courses
                    )
                        ? currentStudent.courses
                        : [];


                setCourses(
                    studentCourses
                );


                /* =================================================
                   GET LESSONS
                ================================================= */

                try {

                    const lessonsResponse =
                        await fetch(
                            `https://asiaedu-backend.onrender.com/api/lessons/student/${currentStudent._id}`
                        );


                    if (lessonsResponse.ok) {

                        const lessonsData =
                            await lessonsResponse.json();


                        const studentLessons =
                            Array.isArray(
                                lessonsData
                            )
                                ? lessonsData
                                : lessonsData.lessons || [];


                        setLessons(
                            studentLessons
                        );

                    }

                }
                catch (lessonError) {

                    console.error(
                        "Lessons dashboard error:",
                        lessonError
                    );

                    setLessons([]);

                }


                /* =================================================
                   GET ASSIGNMENTS
                ================================================= */

                try {

                    let assignmentsResponse =
                        await fetch(
                            `https://asiaedu-backend.onrender.com/api/assignments/student/${currentStudent._id}`
                        );


                    /*
                       Some versions of the backend use:

                       /api/assignments/student

                       instead of:

                       /api/assignments/student/:studentId
                    */

                    if (!assignmentsResponse.ok) {

                        assignmentsResponse =
                            await fetch(
                                "https://asiaedu-backend.onrender.com/api/assignments/student"
                            );

                    }


                    if (assignmentsResponse.ok) {

                        const assignmentsData =
                            await assignmentsResponse.json();


                        const studentAssignments =
                            Array.isArray(
                                assignmentsData
                            )
                                ? assignmentsData
                                : assignmentsData.assignments || [];


                        setAssignments(
                            studentAssignments
                        );

                    }

                }
                catch (assignmentError) {

                    console.error(
                        "Assignments dashboard error:",
                        assignmentError
                    );

                    setAssignments([]);

                }


                /* =================================================
                   GET SUBMISSIONS
                ================================================= */

                try {

                    const submissionsResponse =
                        await fetch(
                            `https://asiaedu-backend.onrender.com/api/submissions/student/${currentStudent._id}`
                        );


                    if (submissionsResponse.ok) {

                        const submissionsData =
                            await submissionsResponse.json();


                        const studentSubmissions =
                            Array.isArray(
                                submissionsData
                            )
                                ? submissionsData
                                : submissionsData.submissions || [];


                        setSubmissions(
                            studentSubmissions
                        );

                    } else {

                        setSubmissions([]);

                    }

                }
                catch (submissionError) {

                    console.error(
                        "Submissions dashboard error:",
                        submissionError
                    );

                    setSubmissions([]);

                }

            }

            catch (error) {

                console.error(
                    "Student dashboard error:",
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
       GET COURSE TITLE
    ===================================================== */

    function getCourseTitle(course) {

        if (!course) {

            return "Course";

        }


        if (course.name) {

            return course.name;

        }


        if (course.title) {

            return course.title;

        }


        if (
            course.courseId &&
            typeof course.courseId === "object"
        ) {

            return (
                course.courseId.title ||
                course.courseId.name ||
                "Course"
            );

        }


        return "Course";

    }


    /* =====================================================
       GET COURSE LEVEL
    ===================================================== */

    function getCourseLevel(course) {

        if (!course) {

            return "Beginner";

        }


        if (course.level) {

            return course.level;

        }


        if (
            course.courseId &&
            typeof course.courseId === "object"
        ) {

            return (
                course.courseId.level ||
                "Beginner"
            );

        }


        return "Beginner";

    }


    /* =====================================================
       GET COURSE LANGUAGE
    ===================================================== */

    function getCourseLanguage(course) {

        if (!course) {

            return "";

        }


        if (course.language) {

            return course.language;

        }


        if (
            course.courseId &&
            typeof course.courseId === "object"
        ) {

            return (
                course.courseId.language ||
                ""
            );

        }


        return "";

    }


    /* =====================================================
       GET SESSION
    ===================================================== */

    function getCourseSession(course) {

        if (!course) {

            return "Not scheduled";

        }


        if (
            typeof course.session === "object"
        ) {

            if (
                course.session.group
            ) {

                return course.session.group;

            }


            if (
                course.session.title
            ) {

                return course.session.title;

            }


            if (
                course.session.name
            ) {

                return course.session.name;

            }

        }


        if (
            typeof course.session === "string" &&
            course.session.trim() !== ""
        ) {

            return course.session;

        }


        return "Not scheduled";

    }


    /* =====================================================
       GET STATUS
    ===================================================== */

    function getCourseStatus(course) {

        if (!course) {

            return "Active";

        }


        if (course.status) {

            return course.status;

        }


        return "Active";

    }


    /* =====================================================
       GET INSTRUCTOR
    ===================================================== */

    function getInstructor(course) {

        if (!course) {

            return "Not assigned";

        }


        if (course.teacher) {

            if (
                typeof course.teacher === "object"
            ) {

                return (
                    course.teacher.name ||
                    course.teacher.fullName ||
                    "Not assigned"
                );

            }


            return course.teacher;

        }


        if (
            course.teacherName
        ) {

            return course.teacherName;

        }


        return "Not assigned";

    }


    /* =====================================================
       GET COURSE ID
    ===================================================== */

    function getCourseId(course) {

        if (!course) {

            return "";

        }


        if (course.courseId) {

            if (
                typeof course.courseId === "object"
            ) {

                return course.courseId._id || "";

            }


            return course.courseId;

        }


        if (course._id) {

            return course._id;

        }


        return "";

    }


    /* =====================================================
       GET STUDENT NAME
    ===================================================== */

    function getStudentName() {

        if (!student) {

            return "Student";

        }


        if (student.name) {

            return student.name;

        }


        const fullName =
            `${student.firstName || ""} ${student.lastName || ""}`
                .trim();


        if (fullName) {

            return fullName;

        }


        return "Student";

    }


    /* =====================================================
       GET LESSON TITLE
    ===================================================== */

    function getLessonTitle(lesson) {

        if (!lesson) {

            return "Lesson";

        }


        return (
            lesson.title ||
            lesson.name ||
            "Lesson"
        );

    }


    /* =====================================================
       GET LESSON COURSE
    ===================================================== */

    function getLessonCourse(lesson) {

        if (!lesson) {

            return "Course";

        }


        if (
            lesson.course &&
            typeof lesson.course === "object"
        ) {

            return (
                lesson.course.title ||
                lesson.course.name ||
                "Course"
            );

        }


        if (
            lesson.courseTitle
        ) {

            return lesson.courseTitle;

        }


        if (
            lesson.courseName
        ) {

            return lesson.courseName;

        }


        return "Course";

    }


    /* =====================================================
       GET ASSIGNMENT TITLE
    ===================================================== */

    function getAssignmentTitle(assignment) {

        if (!assignment) {

            return "Assignment";

        }


        return (
            assignment.title ||
            assignment.name ||
            "Assignment"
        );

    }


    /* =====================================================
       GET ASSIGNMENT COURSE
    ===================================================== */

    function getAssignmentCourse(assignment) {

        if (!assignment) {

            return "Course";

        }


        if (
            assignment.course &&
            typeof assignment.course === "object"
        ) {

            return (
                assignment.course.title ||
                assignment.course.name ||
                "Course"
            );

        }


        if (
            assignment.courseTitle
        ) {

            return assignment.courseTitle;

        }


        if (
            assignment.courseName
        ) {

            return assignment.courseName;

        }


        return "Course";

    }


    /* =====================================================
       GET DATE
    ===================================================== */

    function formatDate(date) {

        if (!date) {

            return "";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "";

        }


        return parsedDate.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       GET DAYS UNTIL DUE
    ===================================================== */

    function getDaysUntilDue(date) {

        if (!date) {

            return null;

        }


        const dueDate =
            new Date(date);


        if (
            Number.isNaN(
                dueDate.getTime()
            )
        ) {

            return null;

        }


        const now =
            new Date();


        const today =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );


        const dueDay =
            new Date(
                dueDate.getFullYear(),
                dueDate.getMonth(),
                dueDate.getDate()
            );


        const difference =
            dueDay.getTime() -
            today.getTime();


        return Math.ceil(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );

    }


    /* =====================================================
       GET DUE TEXT
    ===================================================== */

    function getDueText(date) {

        const days =
            getDaysUntilDue(date);


        if (days === null) {

            return "Due soon";

        }


        if (days === 0) {

            return "Due today";

        }


        if (days === 1) {

            return "Due tomorrow";

        }


        return `Due in ${days} days`;

    }


    /* =====================================================
       CHECK IF ASSIGNMENT IS SUBMITTED
    ===================================================== */

    function isAssignmentSubmitted(assignment) {

        if (!assignment) {

            return false;

        }


        /* ---------------------------------------------
           Check assignment flags
        --------------------------------------------- */

        if (
            assignment.submitted === true
        ) {

            return true;

        }


        if (
            assignment.isSubmitted === true
        ) {

            return true;

        }


        if (
            assignment.status === "Submitted"
        ) {

            return true;

        }


        /* ---------------------------------------------
           Check actual submissions
        --------------------------------------------- */

        if (!assignment._id) {

            return false;

        }


        const assignmentId =
            String(
                assignment._id
            );


        const matchingSubmission =
            submissions.find(
                (submission) => {

                    if (
                        !submission.assignment
                    ) {

                        return false;

                    }


                    if (
                        typeof submission.assignment ===
                        "object"
                    ) {

                        if (
                            !submission.assignment._id
                        ) {

                            return false;

                        }


                        return (
                            String(
                                submission.assignment._id
                            ) === assignmentId
                        );

                    }


                    return (
                        String(
                            submission.assignment
                        ) === assignmentId
                    );

                }
            );


        if (matchingSubmission) {

            return true;

        }


        return false;

    }


    /* =====================================================
       SORT RECENT LESSONS
    ===================================================== */

    const recentLessons =
        [...lessons]
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt ||
                        b.updatedAt ||
                        0
                    ) -
                    new Date(
                        a.createdAt ||
                        a.updatedAt ||
                        0
                    )
            )
            .slice(0, 2);


    /* =====================================================
       SORT RECENT ASSIGNMENTS
    ===================================================== */

    const recentAssignments =
        [...assignments]
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt ||
                        b.updatedAt ||
                        0
                    ) -
                    new Date(
                        a.createdAt ||
                        a.updatedAt ||
                        0
                    )
            )
            .slice(0, 2);


    /* =====================================================
       GET DUE SOON ASSIGNMENTS
    ===================================================== */

    const dueSoonAssignments =
        assignments
            .filter(
                (assignment) => {

                    if (
                        !assignment.dueDate
                    ) {

                        return false;

                    }


                    if (
                        isAssignmentSubmitted(
                            assignment
                        )
                    ) {

                        return false;

                    }


                    const days =
                        getDaysUntilDue(
                            assignment.dueDate
                        );


                    if (days === null) {

                        return false;

                    }


                    if (days < 0) {

                        return false;

                    }


                    if (days > 3) {

                        return false;

                    }


                    return true;

                }
            )
            .sort(
                (a, b) =>
                    new Date(
                        a.dueDate
                    ) -
                    new Date(
                        b.dueDate
                    )
            )
            .slice(0, 2);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const languageCount =
        new Set(
            courses
                .map(
                    (course) =>
                        getCourseLanguage(course)
                )
                .filter(Boolean)
        ).size;


    const STATS = [

        {
            label: "My Courses",
            value: courses.length,
            icon: "fa-solid fa-book-open"
        },

        {
            label: "My Lessons",
            value: lessons.length,
            icon: "fa-solid fa-file-lines"
        },

        {
            label: "Assignments",
            value: assignments.length,
            icon: "fa-solid fa-clipboard-list"
        },

        {
            label: "Languages",
            value: languageCount,
            icon: "fa-solid fa-language"
        }

    ];


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <section className="Dashboard">

                <div className="Dashboard-container">

                    <div className="Dashboard-loading">

                        <div className="Dashboard-loader"></div>

                        <p>
                            Loading your dashboard...
                        </p>

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

            <section className="Dashboard">

                <div className="Dashboard-container">

                    <div className="Dashboard-errorCard">

                        <div className="Dashboard-errorIcon">

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

        <section className="Dashboard">

            <div className="Dashboard-container">


                {/* =================================================
                    WELCOME
                ================================================= */}

                <div className="Dashboard-welcome">

                    <div className="Dashboard-welcome-content">

                        <span className="Dashboard-welcome-label">

                            <i className="fa-solid fa-graduation-cap"></i>

                            Student Dashboard

                        </span>


                        <h2>

                            Welcome back,{" "}

                            {getStudentName()}

                            !

                        </h2>


                        <p>

                            Stay up to date with your courses,
                            lessons, and assignments.

                        </p>

                    </div>


                    <div className="Dashboard-welcome-decoration">

                        <i className="fa-solid fa-graduation-cap"></i>

                    </div>

                </div>


                {/* =================================================
                    UPCOMING ASSIGNMENT DEADLINES
                ================================================= */}

                {dueSoonAssignments.length > 0 && (

                    <div className="Dashboard-dueAlert">


                        <div className="Dashboard-dueAlertHeader">

                            <i className="fa-solid fa-triangle-exclamation"></i>

                            <h4>
                                Upcoming Assignment Deadlines
                            </h4>

                        </div>


                        <div className="Dashboard-dueAlertList">

                            {dueSoonAssignments.map(
                                (assignment) => (

                                    <div
                                        className="Dashboard-dueAssignment"
                                        key={assignment._id}
                                    >

                                        <div className="Dashboard-dueAssignmentIcon">

                                            <i className="fa-solid fa-triangle-exclamation"></i>

                                        </div>


                                        <div className="Dashboard-dueAssignmentInfo">

                                            <h5>

                                                {
                                                    getAssignmentTitle(
                                                        assignment
                                                    )
                                                }

                                            </h5>


                                            <p>

                                                {
                                                    getAssignmentCourse(
                                                        assignment
                                                    )
                                                }

                                            </p>

                                        </div>


                                        <div className="Dashboard-dueAssignmentDate">

                                            <i className="fa-regular fa-clock"></i>

                                            <span>

                                                {
                                                    getDueText(
                                                        assignment.dueDate
                                                    )
                                                }

                                            </span>

                                        </div>


                                        <div className="Dashboard-dueAssignmentArrow">

                                            <i className="fa-solid fa-arrow-right"></i>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                )}


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="Dashboard-statistics">

                    {STATS.map(
                        (stat) => (

                            <div
                                className="Dashboard-statCard"
                                key={stat.label}
                            >

                                <div className="Dashboard-statIcon">

                                    <i
                                        className={
                                            stat.icon
                                        }
                                    ></i>

                                </div>


                                <div className="Dashboard-statInfo">

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

                <div className="Dashboard-section">

                    <div className="Dashboard-sectionHeading">

                        <div>

                            <h3>

                                <span className="Dashboard-headingIcon">

                                    <i className="fa-solid fa-book-open"></i>

                                </span>

                                My Courses

                            </h3>


                            <p>
                                Courses you are currently enrolled in.
                            </p>

                        </div>

                    </div>


                    <div className="Dashboard-courseList">

                        {courses.length === 0 ? (

                            <div className="Dashboard-empty">

                                <div className="Dashboard-emptyIcon">

                                    <i className="fa-solid fa-book-open"></i>

                                </div>


                                <h4>
                                    No courses yet
                                </h4>


                                <p>
                                    You are not enrolled in any courses yet.
                                </p>

                            </div>

                        ) : (

                            courses.map(
                                (course) => {

                                    const courseId =
                                        getCourseId(
                                            course
                                        );


                                    return (

                                        <div
                                            className="Dashboard-course"
                                            key={courseId}
                                        >

                                            <div className="Dashboard-course-left">

                                                <div className="Dashboard-courseIcon">

                                                    <i className="fa-solid fa-language"></i>

                                                </div>


                                                <div className="Dashboard-courseInfo">

                                                    <h4>

                                                        {
                                                            getCourseTitle(
                                                                course
                                                            )
                                                        }

                                                    </h4>


                                                    <span>

                                                        {
                                                            getCourseLanguage(
                                                                course
                                                            )
                                                        }

                                                        {
                                                            getCourseLanguage(
                                                                course
                                                            ) && " • "
                                                        }

                                                        Instructor:{" "}

                                                        {
                                                            getInstructor(
                                                                course
                                                            )
                                                        }

                                                    </span>

                                                </div>

                                            </div>


                                            <div className="Dashboard-course-details">

                                                <span className="Dashboard-level">

                                                    {
                                                        getCourseLevel(
                                                            course
                                                        )
                                                    }

                                                </span>


                                                <span className="Dashboard-schedule">

                                                    <i className="fa-regular fa-calendar"></i>

                                                    {
                                                        getCourseSession(
                                                            course
                                                        )
                                                    }

                                                </span>


                                                <span className="Dashboard-status">

                                                    <span className="Dashboard-status-dot"></span>

                                                    {
                                                        getCourseStatus(
                                                            course
                                                        )
                                                    }

                                                </span>

                                            </div>

                                        </div>

                                    );

                                }
                            )

                        )}

                    </div>

                </div>


                {/* =================================================
                    LESSONS + ASSIGNMENTS
                ================================================= */}

                <div className="Dashboard-twoColumns">


                    {/* =================================================
                        RECENT LESSONS
                    ================================================= */}

                    <div className="Dashboard-smallSection">

                        <div className="Dashboard-smallHeading">

                            <div>

                                <h3>

                                    <span className="Dashboard-headingIcon">

                                        <i className="fa-solid fa-file-lines"></i>

                                    </span>

                                    Recent Lessons

                                </h3>


                                <p>
                                    Your latest lessons.
                                </p>

                            </div>

                        </div>


                        {recentLessons.length === 0 ? (

                            <div className="Dashboard-empty Dashboard-smallEmpty">

                                <div className="Dashboard-emptyIcon">

                                    <i className="fa-solid fa-file-lines"></i>

                                </div>


                                <h4>
                                    No lessons yet
                                </h4>


                                <p>
                                    Your teachers haven't shared any lessons with you yet.
                                </p>

                            </div>

                        ) : (

                            <div className="Dashboard-recentList">

                                {recentLessons.map(
                                    (lesson) => (

                                        <div
                                            className="Dashboard-recentItem"
                                            key={lesson._id}
                                        >

                                            <div className="Dashboard-recentIcon">

                                                <i className="fa-solid fa-file-lines"></i>

                                            </div>


                                            <div className="Dashboard-recentInfo">

                                                <h4>
                                                    {
                                                        getLessonTitle(
                                                            lesson
                                                        )
                                                    }
                                                </h4>


                                                <span>
                                                    {
                                                        getLessonCourse(
                                                            lesson
                                                        )
                                                    }
                                                </span>

                                            </div>


                                            <span className="Dashboard-recentDate">

                                                {
                                                    formatDate(
                                                        lesson.createdAt
                                                    )
                                                }

                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        ASSIGNMENTS
                    ================================================= */}

                    <div className="Dashboard-smallSection">

                        <div className="Dashboard-smallHeading">

                            <div>

                                <h3>

                                    <span className="Dashboard-headingIcon">

                                        <i className="fa-solid fa-clipboard-list"></i>

                                    </span>

                                    Recent Assignments

                                </h3>


                                <p>
                                    Your latest assignments.
                                </p>

                            </div>

                        </div>


                        {recentAssignments.length === 0 ? (

                            <div className="Dashboard-empty Dashboard-smallEmpty">

                                <div className="Dashboard-emptyIcon">

                                    <i className="fa-solid fa-clipboard-list"></i>

                                </div>


                                <h4>
                                    No assignments yet
                                </h4>


                                <p>
                                    You don't have any assignments at the moment.
                                </p>

                            </div>

                        ) : (

                            <div className="Dashboard-recentList">

                                {recentAssignments.map(
                                    (assignment) => (

                                        <div
                                            className="Dashboard-recentItem"
                                            key={assignment._id}
                                        >

                                            <div className="Dashboard-recentIcon">

                                                <i className="fa-solid fa-clipboard-list"></i>

                                            </div>


                                            <div className="Dashboard-recentInfo">

                                                <h4>
                                                    {
                                                        getAssignmentTitle(
                                                            assignment
                                                        )
                                                    }
                                                </h4>


                                                <span>
                                                    {
                                                        getAssignmentCourse(
                                                            assignment
                                                        )
                                                    }
                                                </span>

                                            </div>


                                            <span className="Dashboard-recentDate">

                                                {
                                                    assignment.dueDate
                                                        ? `Due ${formatDate(assignment.dueDate)}`
                                                        : "No due date"
                                                }

                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                </div>


            </div>

        </section>

    );

}


export default Dashboard;