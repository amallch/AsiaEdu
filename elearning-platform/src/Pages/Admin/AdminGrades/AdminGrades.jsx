import "./AdminGrades.css";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


/* =====================================================
   LANGUAGE -> COURSE CODE
===================================================== */

const LANGUAGE_CODES = {
    Chinese: "CN",
    Japanese: "JP",
    Korean: "KR",
    Malay: "MY",
    Russian: "RU"
};


/* =====================================================
   GET COURSE CODE
===================================================== */

function getCourseCode(language) {

    return (
        LANGUAGE_CODES[language] ||
        "AS"
    );

}


/* =====================================================
   GET COURSE ID
===================================================== */

function getCourseId(course) {

    if (!course) {

        return "";

    }


    if (
        typeof course ===
        "object"
    ) {

        return course._id || "";

    }


    return course;

}


/* =====================================================
   GET SESSION ID
===================================================== */

function getSessionId(session) {

    if (!session) {

        return "";

    }


    if (
        typeof session ===
        "object"
    ) {

        return session._id || "";

    }


    return session;

}


/* =====================================================
   GET SESSION NAME
===================================================== */

function getSessionName(session) {

    if (!session) {

        return "Session";

    }


    if (
        typeof session ===
        "object"
    ) {

        if (session.group) {

            return session.group;

        }


        if (session.title) {

            return session.title;

        }


        if (session.name) {

            return session.name;

        }


        return "Session";

    }


    return "Session";

}


/* =====================================================
   GET STUDENT NAME
===================================================== */

function getStudentName(student) {

    if (!student) {

        return "Student";

    }


    if (student.name) {

        return student.name;

    }


    if (
        student.firstName ||
        student.lastName
    ) {

        return (
            `${student.firstName || ""} ${student.lastName || ""}`
        ).trim();

    }


    if (student.email) {

        return student.email;

    }


    return "Student";

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(date) {

    if (!date) {

        return "No date";

    }


    return new Date(
        date
    ).toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =====================================================
   COMPONENT
===================================================== */

function AdminGrades() {

    const navigate =
        useNavigate();


    /* =====================================================
       DATA
    ===================================================== */

    const [assignments, setAssignments] =
        useState([]);


    const [submissions, setSubmissions] =
        useState([]);


    const [courses, setCourses] =
        useState([]);


    const [allSessions, setAllSessions] =
        useState([]);


    const [sessions, setSessions] =
        useState([]);


    /* =====================================================
       SELECTIONS
    ===================================================== */

    const [selectedCourseId, setSelectedCourseId] =
        useState("");


    const [selectedSessionId, setSelectedSessionId] =
        useState("");


    const [selectedAssignmentId, setSelectedAssignmentId] =
        useState("");


    /* =====================================================
       LOADING
    ===================================================== */

    const [isLoading, setIsLoading] =
        useState(true);


    /* =====================================================
       ERROR
    ===================================================== */

    const [error, setError] =
        useState("");


    /* =====================================================
       GET COURSES
    ===================================================== */

    useEffect(() => {

        async function fetchCourses() {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/courses"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch courses."
                    );

                }


                const data =
                    await response.json();


                let courseList = [];


                if (
                    Array.isArray(data)
                ) {

                    courseList =
                        data;

                } else {

                    courseList =
                        data.courses || [];

                }


                setCourses(
                    courseList
                );


                if (
                    courseList.length > 0
                ) {

                    setSelectedCourseId(
                        courseList[0]._id
                    );

                }

            } catch (error) {

                console.error(
                    "Error fetching courses:",
                    error
                );


                setError(
                    error.message ||
                    "Failed to fetch courses."
                );


                setCourses([]);

            }

        }


        fetchCourses();

    }, []);


    /* =====================================================
       GET SESSIONS
    ===================================================== */

    useEffect(() => {

        async function fetchSessions() {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/sessions"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch sessions."
                    );

                }


                const data =
                    await response.json();


                let sessionList = [];


                if (
                    Array.isArray(data)
                ) {

                    sessionList =
                        data;

                } else {

                    sessionList =
                        data.sessions || [];

                }


                setAllSessions(
                    sessionList
                );

            } catch (error) {

                console.error(
                    "Error fetching sessions:",
                    error
                );


                setAllSessions([]);

            }

        }


        fetchSessions();

    }, []);


    /* =====================================================
       GET ASSIGNMENTS
    ===================================================== */

    useEffect(() => {

        async function fetchAssignments() {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/assignments/admin"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch assignments."
                    );

                }


                const data =
                    await response.json();


                let assignmentList = [];


                if (
                    Array.isArray(data)
                ) {

                    assignmentList =
                        data;

                } else {

                    assignmentList =
                        data.assignments || [];

                }


                setAssignments(
                    assignmentList
                );

            } catch (error) {

                console.error(
                    "Error fetching assignments:",
                    error
                );


                setAssignments([]);

            }

        }


        fetchAssignments();

    }, []);


    /* =====================================================
       GET ALL SUBMISSIONS
    ===================================================== */

    useEffect(() => {

        async function fetchSubmissions() {

            try {

                setIsLoading(true);


                const response =
                    await fetch(
                        "http://localhost:5000/api/submissions/admin"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch submissions."
                    );

                }


                const data =
                    await response.json();


                const submissionList =
                    data.submissions ||
                    [];


                setSubmissions(
                    submissionList
                );

            } catch (error) {

                console.error(
                    "Error fetching submissions:",
                    error
                );


                setSubmissions([]);

                setError(
                    error.message ||
                    "Failed to fetch submissions."
                );

            } finally {

                setIsLoading(false);

            }

        }


        fetchSubmissions();

    }, []);


    /* =====================================================
       SELECTED COURSE
    ===================================================== */

    const selectedCourse =
        courses.find(
            (course) =>
                course._id ===
                selectedCourseId
        );


    /* =====================================================
       GET SESSIONS FOR SELECTED COURSE
    ===================================================== */

    useEffect(() => {

        if (
            !selectedCourseId
        ) {

            setSessions([]);

            setSelectedSessionId("");

            setSelectedAssignmentId("");

            return;

        }


        const courseSessions =
            allSessions.filter(
                (session) => {

                    const sessionCourseId =
                        getCourseId(
                            session.course
                        );


                    return (
                        sessionCourseId ===
                        selectedCourseId
                    );

                }
            );


        setSessions(
            courseSessions
        );


        if (
            courseSessions.length > 0
        ) {

            setSelectedSessionId(
                getSessionId(
                    courseSessions[0]
                )
            );

        } else {

            setSelectedSessionId("");

            setSelectedAssignmentId("");

        }

    }, [
        selectedCourseId,
        allSessions
    ]);


    /* =====================================================
       COURSE ASSIGNMENTS
    ===================================================== */

    const courseAssignments =
        assignments.filter(
            (assignment) => {

                const assignmentCourseId =
                    getCourseId(
                        assignment.course
                    );


                return (
                    assignmentCourseId ===
                    selectedCourseId
                );

            }
        );


    /* =====================================================
       SESSION ASSIGNMENTS
    ===================================================== */

    const sessionAssignments =
        courseAssignments.filter(
            (assignment) => {

                const assignmentSessionId =
                    getSessionId(
                        assignment.session
                    );


                return (
                    assignmentSessionId ===
                    selectedSessionId
                );

            }
        );


    /* =====================================================
       SELECT FIRST ASSIGNMENT
    ===================================================== */

    useEffect(() => {

        if (
            sessionAssignments.length > 0
        ) {

            setSelectedAssignmentId(
                sessionAssignments[0]._id
            );

        } else {

            setSelectedAssignmentId("");

        }

    }, [
        selectedSessionId,
        selectedCourseId,
        assignments
    ]);


    /* =====================================================
       SELECTED ASSIGNMENT
    ===================================================== */

    const selectedAssignment =
        assignments.find(
            (assignment) =>
                assignment._id ===
                selectedAssignmentId
        );


    /* =====================================================
       ASSIGNMENT SUBMISSIONS
    ===================================================== */

    const assignmentSubmissions =
        submissions.filter(
            (submission) => {

                const assignmentId =
                    typeof submission.assignment ===
                    "object"
                        ? submission.assignment?._id
                        : submission.assignment;


                return (
                    assignmentId ===
                    selectedAssignmentId
                );

            }
        );


    /* =====================================================
       STATISTICS
    ===================================================== */

    const gradedSubmissions =
        assignmentSubmissions.filter(
            (submission) =>
                submission.grade !== null &&
                submission.grade !== undefined
        );


    const pendingSubmissions =
        assignmentSubmissions.filter(
            (submission) =>
                submission.grade === null ||
                submission.grade === undefined
        );


    /* =====================================================
       AVERAGE GRADE
    ===================================================== */

    let averagePercentage = 0;


    const gradedTotal =
        gradedSubmissions.reduce(
            (
                total,
                submission
            ) => {

                return (
                    total +
                    (
                        Number(
                            submission.grade
                        ) || 0
                    )
                );

            },
            0
        );


    const gradedPossible =
        gradedSubmissions.reduce(
            (
                total,
                submission
            ) => {

                const maxScore =
                    submission.assignment?.maxScore ||
                    selectedAssignment?.maxScore ||
                    20;


                return (
                    total +
                    Number(
                        maxScore
                    )
                );

            },
            0
        );


    if (
        gradedPossible > 0
    ) {

        averagePercentage =
            Math.round(
                (
                    gradedTotal /
                    gradedPossible
                ) *
                100
            );

    }


    /* =====================================================
       COURSE CHANGE
    ===================================================== */

    function handleCourseChange(event) {

        const courseId =
            event.target.value;


        setSelectedCourseId(
            courseId
        );


        setSelectedSessionId("");

        setSelectedAssignmentId("");

    }


    /* =====================================================
       SESSION CHANGE
    ===================================================== */

    function handleSessionChange(event) {

        const sessionId =
            event.target.value;


        setSelectedSessionId(
            sessionId
        );


        setSelectedAssignmentId("");

    }


    /* =====================================================
       ASSIGNMENT CHANGE
    ===================================================== */

    function handleAssignmentChange(event) {

        const assignmentId =
            event.target.value;


        setSelectedAssignmentId(
            assignmentId
        );

    }


    /* =====================================================
       OPEN RESULT
    ===================================================== */

    function handleOpenResult(submission) {

        const grade =
            submission.grade ??
            submission.score ??
            null;


        const maxScore =
            submission.assignment?.maxScore ||
            selectedAssignment?.maxScore ||
            20;


        let percentage =
            null;


        if (
            grade !== null &&
            maxScore > 0
        ) {

            percentage =
                Math.round(
                    (
                        grade /
                        maxScore
                    ) *
                    100
                );

        }


        navigate(
            "/admin/grades/view",
            {
                state: {

                    result: {

                        id:
                            submission._id,

                        submissionId:
                            submission._id,

                        submission:
                            submission,

                        student:
                            submission.student,

                        studentName:
                            getStudentName(
                                submission.student
                            ),

                        assignment:
                            submission.assignment ||
                            selectedAssignment,

                        course:
                            selectedCourse,

                        courseId:
                            selectedCourse?._id,

                        session:
                            submission.assignment?.session ||
                            selectedAssignment?.session,

                        title:
                            submission.assignment?.title ||
                            selectedAssignment?.title,

                        description:
                            submission.assignment?.description ||
                            selectedAssignment?.description,

                        score:
                            grade,

                        maxScore:
                            maxScore,

                        percentage:
                            percentage,

                        status:
                            grade !== null
                                ? "Graded"
                                : "Pending",

                        submittedDate:
                            submission.submittedAt ||
                            submission.createdAt,

                        gradedDate:
                            grade !== null
                                ? submission.updatedAt
                                : null,

                        answer:
                            submission.answer ||
                            submission.content ||
                            "",

                        feedback:
                            submission.feedback ||
                            submission.teacherFeedback ||
                            "",

                        correction:
                            submission.correction ||
                            submission.teacherCorrection ||
                            "",

                        attachments:
                            submission.attachments ||
                            []

                    },

                    course:
                        selectedCourse

                }
            }
        );

    }


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <section className="AdminGrades">

                <div className="AdminGrades-container">

                    <div className="AdminGrades-empty">

                        <div className="AdminGrades-emptyIcon">

                            <i className="fa-solid fa-chart-column"></i>

                        </div>


                        <h3>
                            Loading grades...
                        </h3>


                        <p>
                            Please wait while the student grades are loading.
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

            <section className="AdminGrades">

                <div className="AdminGrades-container">

                    <div className="AdminGrades-empty">

                        <div className="AdminGrades-emptyIcon">

                            <i className="fa-solid fa-circle-exclamation"></i>

                        </div>


                        <h3>
                            Unable to load grades
                        </h3>


                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            </section>

        );

    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <section className="AdminGrades">

            <div className="AdminGrades-container">


                {/* =================================================
                   HEADING
                ================================================= */}

                <div className="AdminGrades-heading">

                    <div>

                        <span>
                            Grades
                        </span>

                        <h2>
                            Grades
                        </h2>


                        <p>
                            View student grades, corrections and teacher feedback.
                        </p>

                    </div>

                </div>


                {/* =================================================
                   COURSE + SESSION
                ================================================= */}

                <div className="AdminGrades-filterBar">


                    {/* =========================
                       COURSE
                    ========================= */}

                    <div className="AdminGrades-filterItem">

                        <div className="AdminGrades-filterLabel">

                            <div className="AdminGrades-filterIcon">

                                <i className="fa-solid fa-book"></i>

                            </div>


                            <div>

                                <span>
                                    Select Course
                                </span>


                                <p>
                                    Choose a course
                                </p>

                            </div>

                        </div>


                        <div className="AdminGrades-selectWrapper">

                            <div className="AdminGrades-courseCode">

                                {
                                    selectedCourse
                                        ? getCourseCode(
                                            selectedCourse.language
                                        )
                                        : "--"
                                }

                            </div>


                            <select
                                value={
                                    selectedCourseId
                                }
                                onChange={
                                    handleCourseChange
                                }
                                className="AdminGrades-select"
                                aria-label="Select course"
                                disabled={
                                    courses.length === 0
                                }
                            >

                                {
                                    courses.length === 0 && (

                                        <option value="">
                                            No courses available
                                        </option>

                                    )
                                }


                                {
                                    courses.map(
                                        (course) => (

                                            <option
                                                key={
                                                    course._id
                                                }
                                                value={
                                                    course._id
                                                }
                                            >

                                                {
                                                    course.title
                                                }

                                            </option>

                                        )
                                    )
                                }

                            </select>


                            <i className="fa-solid fa-chevron-down"></i>

                        </div>

                    </div>


                    {/* =========================
                       DIVIDER
                    ========================= */}

                    <div className="AdminGrades-filterDivider"></div>


                    {/* =========================
                       SESSION
                    ========================= */}

                    <div className="AdminGrades-filterItem">

                        <div className="AdminGrades-filterLabel">

                            <div className="AdminGrades-filterIcon">

                                <i className="fa-regular fa-calendar"></i>

                            </div>


                            <div>

                                <span>
                                    Select Session
                                </span>


                                <p>
                                    Choose a session
                                </p>

                            </div>

                        </div>


                        <div className="AdminGrades-selectWrapper">

                            <select
                                value={
                                    selectedSessionId
                                }
                                onChange={
                                    handleSessionChange
                                }
                                className="AdminGrades-select AdminGrades-sessionSelect"
                                aria-label="Select session"
                                disabled={
                                    sessions.length === 0
                                }
                            >

                                {
                                    sessions.length === 0 && (

                                        <option value="">
                                            No sessions available
                                        </option>

                                    )
                                }


                                {
                                    sessions.map(
                                        (session) => {

                                            const sessionId =
                                                getSessionId(
                                                    session
                                                );


                                            return (

                                                <option
                                                    key={
                                                        sessionId
                                                    }
                                                    value={
                                                        sessionId
                                                    }
                                                >

                                                    {
                                                        getSessionName(
                                                            session
                                                        )
                                                    }

                                                </option>

                                            );

                                        }
                                    )
                                }

                            </select>


                            <i className="fa-solid fa-chevron-down"></i>

                        </div>

                    </div>

                </div>


                {/* =================================================
                   ASSIGNMENT SELECTOR
                ================================================= */}

                <div className="AdminGrades-assignmentSelector">

                    <div className="AdminGrades-assignmentHeading">

                        <div className="AdminGrades-assignmentIcon">

                            <i className="fa-solid fa-file-lines"></i>

                        </div>


                        <div>

                            <span>
                                Select Assignment
                            </span>


                            <p>
                                Choose an assignment to view student grades
                            </p>

                        </div>

                    </div>


                    <div className="AdminGrades-assignmentSelectWrapper">

                        <select
                            value={
                                selectedAssignmentId
                            }
                            onChange={
                                handleAssignmentChange
                            }
                            className="AdminGrades-assignmentSelect"
                            aria-label="Select assignment"
                            disabled={
                                sessionAssignments.length === 0
                            }
                        >

                            {
                                sessionAssignments.length === 0 && (

                                    <option value="">
                                        No assignments available
                                    </option>

                                )
                            }


                            {
                                sessionAssignments.map(
                                    (assignment) => (

                                        <option
                                            key={
                                                assignment._id
                                            }
                                            value={
                                                assignment._id
                                            }
                                        >

                                            {
                                                assignment.title
                                            }

                                        </option>

                                    )
                                )
                            }

                        </select>


                        <i className="fa-solid fa-chevron-down"></i>

                    </div>

                </div>


                {/* =================================================
                   SELECTED ASSIGNMENT
                ================================================= */}

                {
                    selectedAssignment && (

                        <div className="AdminGrades-selectedAssignment">

                            <div className="AdminGrades-selectedAssignment-left">

                                <div className="AdminGrades-selectedAssignment-icon">

                                    <i className="fa-solid fa-file-lines"></i>

                                </div>


                                <div>

                                    <h3>
                                        {
                                            selectedAssignment.title
                                        }
                                    </h3>


                                    <p>

                                        {
                                            selectedCourse?.title ||
                                            "Course"
                                        }

                                        {" • "}

                                        {
                                            getSessionName(
                                                selectedAssignment.session
                                            )
                                        }

                                    </p>

                                </div>

                            </div>


                            <div className="AdminGrades-selectedAssignment-stats">

                                <div>

                                    <strong>
                                        {
                                            assignmentSubmissions.length
                                        }
                                    </strong>


                                    <span>
                                        Students
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        {
                                            gradedSubmissions.length
                                        }
                                    </strong>


                                    <span>
                                        Graded
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        {
                                            pendingSubmissions.length
                                        }
                                    </strong>


                                    <span>
                                        Pending
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        {
                                            averagePercentage
                                        }%
                                    </strong>


                                    <span>
                                        Average
                                    </span>

                                </div>

                            </div>

                        </div>

                    )
                }


                {/* =================================================
                   STUDENTS
                ================================================= */}

                <div className="AdminGrades-list">

                    {
                        assignmentSubmissions.map(
                            (
                                submission
                            ) => {

                                const studentName =
                                    getStudentName(
                                        submission.student
                                    );


                                const grade =
                                    submission.grade ??
                                    submission.score ??
                                    null;


                                const maxScore =
                                    submission.assignment?.maxScore ||
                                    selectedAssignment?.maxScore ||
                                    20;


                                let percentage =
                                    null;


                                if (
                                    grade !== null &&
                                    maxScore > 0
                                ) {

                                    percentage =
                                        Math.round(
                                            (
                                                grade /
                                                maxScore
                                            ) *
                                            100
                                        );

                                }


                                return (

                                    <div
                                        className="AdminGrades-card"
                                        key={
                                            submission._id
                                        }
                                        onClick={() =>
                                            handleOpenResult(
                                                submission
                                            )
                                        }
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(event) => {

                                            if (
                                                event.key === "Enter" ||
                                                event.key === " "
                                            ) {

                                                handleOpenResult(
                                                    submission
                                                );

                                            }

                                        }}
                                    >


                                        {/* =================================================
                                           AVATAR
                                        ================================================= */}

                                        <div className="AdminGrades-avatar">

                                            {
                                                studentName
                                                    .charAt(0)
                                                    .toUpperCase()
                                            }

                                        </div>


                                        {/* =================================================
                                           CONTENT
                                        ================================================= */}

                                        <div className="AdminGrades-content">

                                            <div className="AdminGrades-titleRow">

                                                <div>

                                                    <h3>
                                                        {
                                                            studentName
                                                        }
                                                    </h3>


                                                    <p>
                                                        {
                                                            selectedAssignment.title
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="AdminGrades-details">

                                                <span>

                                                    <i className="fa-regular fa-calendar"></i>

                                                    Submitted{" "}

                                                    {
                                                        formatDate(
                                                            submission.submittedAt
                                                        )
                                                    }

                                                </span>


                                                {
                                                    submission.updatedAt && (

                                                        <span>

                                                            <i className="fa-solid fa-clock"></i>

                                                            Updated{" "}

                                                            {
                                                                formatDate(
                                                                    submission.updatedAt
                                                                )
                                                            }

                                                        </span>

                                                    )
                                                }

                                            </div>

                                        </div>


                                        {/* =================================================
                                           GRADE
                                        ================================================= */}

                                        <div className="AdminGrades-score">

                                            {
                                                grade !== null ? (

                                                    <>

                                                        <strong
                                                            className={
                                                                percentage !== null &&
                                                                percentage < 50
                                                                    ? "failed-score"
                                                                    : "passed-score"
                                                            }
                                                        >

                                                            {
                                                                grade
                                                            }

                                                            <span>
                                                                /
                                                                {
                                                                    maxScore
                                                                }
                                                            </span>

                                                        </strong>


                                                        <small
                                                            className={
                                                                percentage !== null &&
                                                                percentage < 50
                                                                    ? "failed-percentage"
                                                                    : "passed-percentage"
                                                            }
                                                        >

                                                            {
                                                                percentage
                                                            }%

                                                        </small>

                                                    </>

                                                ) : (

                                                    <>

                                                        <strong className="pending-score">
                                                            —
                                                        </strong>


                                                        <small className="pending-text">
                                                            Pending
                                                        </small>

                                                    </>

                                                )
                                            }

                                        </div>


                                        {/* =================================================
                                           RIGHT
                                        ================================================= */}

                                        <div className="AdminGrades-cardRight">

                                            {
                                                grade !== null ? (

                                                    <span className="AdminGrades-status graded">

                                                        <i className="fa-solid fa-circle-check"></i>

                                                        Graded

                                                    </span>

                                                ) : (

                                                    <span className="AdminGrades-status pending">

                                                        <i className="fa-regular fa-clock"></i>

                                                        Pending

                                                    </span>

                                                )
                                            }


                                            <button
                                                type="button"
                                                className="AdminGrades-button"
                                                onClick={(event) => {

                                                    event.stopPropagation();

                                                    handleOpenResult(
                                                        submission
                                                    );

                                                }}
                                            >

                                                {
                                                    grade !== null
                                                        ? "View Result"
                                                        : "View Submission"
                                                }


                                                <i className="fa-solid fa-arrow-right"></i>

                                            </button>

                                        </div>

                                    </div>

                                );

                            }
                        )
                    }


                    {/* =================================================
                       NO STUDENTS
                    ================================================= */}

                    {
                        selectedAssignment &&
                        assignmentSubmissions.length === 0 && (

                            <div className="AdminGrades-empty">

                                <div className="AdminGrades-emptyIcon">

                                    <i className="fa-regular fa-user"></i>

                                </div>


                                <h3>
                                    No students yet
                                </h3>


                                <p>
                                    No students have submitted this assignment yet.
                                </p>

                            </div>

                        )
                    }


                    {/* =================================================
                       NO ASSIGNMENTS
                    ================================================= */}

                    {
                        !selectedAssignment &&
                        sessionAssignments.length === 0 && (

                            <div className="AdminGrades-empty">

                                <div className="AdminGrades-emptyIcon">

                                    <i className="fa-regular fa-file-lines"></i>

                                </div>


                                <h3>
                                    No assignments available
                                </h3>


                                <p>
                                    There are no assignments for this session yet.
                                </p>

                            </div>

                        )
                    }

                </div>

            </div>

        </section>

    );

}


export default AdminGrades;