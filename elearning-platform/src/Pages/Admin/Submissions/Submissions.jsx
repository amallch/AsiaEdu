import "./Submissions.css";

import { useEffect, useState } from "react";

import SubmissionDetails
    from "./AdminSubmissionDetails/AdminSubmissionDetails";


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


    if (typeof course === "object") {

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


    if (typeof session === "object") {

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


    if (typeof session === "object") {

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
   COMPONENT
===================================================== */

function Submissions() {

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


    const [selectedCourseId, setSelectedCourseId] =
        useState("");


    const [selectedSessionId, setSelectedSessionId] =
        useState("");


    const [selectedAssignmentId, setSelectedAssignmentId] =
        useState("");


    const [selectedSubmission, setSelectedSubmission] =
        useState(null);


    const [isLoading, setIsLoading] =
        useState(true);


    /* =====================================================
       GET ALL COURSES
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
                        "Failed to fetch courses"
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


                setCourses([]);

            }

        }


        fetchCourses();

    }, []);


    /* =====================================================
       GET ALL SESSIONS
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
                        "Failed to fetch sessions"
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
       GET ALL ASSIGNMENTS
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
                        "Failed to fetch assignments"
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
       GET SUBMISSIONS FOR ALL ASSIGNMENTS
    ===================================================== */

    useEffect(() => {

        async function fetchSubmissions() {

            if (
                assignments.length === 0
            ) {

                setSubmissions([]);

                setIsLoading(false);

                return;

            }


            try {

                setIsLoading(true);


                let allSubmissions = [];


                for (
                    const assignment
                    of assignments
                ) {

                    if (
                        !assignment._id
                    ) {

                        continue;

                    }


                    try {

                        const response =
                            await fetch(
                                `http://localhost:5000/api/submissions/assignment/${assignment._id}`
                            );


                        if (!response.ok) {

                            continue;

                        }


                        const data =
                            await response.json();


                        let assignmentSubmissions = [];


                        if (
                            Array.isArray(data)
                        ) {

                            assignmentSubmissions =
                                data;

                        } else {

                            assignmentSubmissions =
                                data.submissions || [];

                        }


                        allSubmissions = [
                            ...allSubmissions,
                            ...assignmentSubmissions
                        ];

                    } catch (error) {

                        console.error(
                            `Error fetching submissions for assignment ${assignment._id}:`,
                            error
                        );

                    }

                }


                /* =========================================
                   REMOVE DUPLICATES
                ========================================= */

                const submissionMap =
                    new Map();


                allSubmissions.forEach(
                    (submission) => {

                        if (
                            submission._id &&
                            !submissionMap.has(
                                submission._id
                            )
                        ) {

                            submissionMap.set(
                                submission._id,
                                submission
                            );

                        }

                    }
                );


                const uniqueSubmissions =
                    Array.from(
                        submissionMap.values()
                    );


                /* =========================================
                   NEWEST FIRST
                ========================================= */

                uniqueSubmissions.sort(
                    (a, b) => {

                        const dateA =
                            new Date(
                                a.submittedAt || 0
                            );


                        const dateB =
                            new Date(
                                b.submittedAt || 0
                            );


                        return dateB - dateA;

                    }
                );


                setSubmissions(
                    uniqueSubmissions
                );

            } catch (error) {

                console.error(
                    "Error fetching submissions:",
                    error
                );


                setSubmissions([]);

            } finally {

                setIsLoading(false);

            }

        }


        fetchSubmissions();

    }, [assignments]);


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


        /* =========================================
           SELECT FIRST SESSION
        ========================================= */

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
       GET ASSIGNMENTS FOR SELECTED COURSE
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
       GET ASSIGNMENTS FOR SELECTED SESSION
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
                    typeof submission.assignment === "object"
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

    const pendingSubmissions =
        assignmentSubmissions.filter(
            (submission) =>
                submission.status ===
                "Submitted"
        ).length;


    const gradedSubmissions =
        assignmentSubmissions.filter(
            (submission) =>
                submission.status ===
                "Graded"
        ).length;


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

        setSelectedSubmission(null);

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

        setSelectedSubmission(null);

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


        setSelectedSubmission(null);

    }


    /* =====================================================
       VIEW SUBMISSION
    ===================================================== */

    function handleViewSubmission(
        submission
    ) {

        setSelectedSubmission(
            submission
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       CLOSE DETAILS
    ===================================================== */

    function handleCloseReview() {

        setSelectedSubmission(
            null
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       UPDATE SUBMISSION
    ===================================================== */

    function handleUpdateSubmission(
        updatedSubmission
    ) {

        setSubmissions(
            (previousSubmissions) => {

                return previousSubmissions.map(
                    (submission) => {

                        if (
                            submission._id ===
                            updatedSubmission._id
                        ) {

                            return updatedSubmission;

                        }


                        return submission;

                    }
                );

            }
        );


        setSelectedSubmission(
            updatedSubmission
        );

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
       DETAILS PAGE
    ===================================================== */

    if (
        selectedSubmission !== null
    ) {

        return (

            <SubmissionDetails

                submission={
                    selectedSubmission
                }

                selectedCourse={
                    selectedCourse
                }

                onBack={
                    handleCloseReview
                }

                onUpdate={
                    handleUpdateSubmission
                }

                formatDate={
                    formatDate
                }

            />

        );

    }


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <section className="Submissions">

                <div className="Submissions-container">

                    <div className="Submissions-empty">

                        <div className="Submissions-emptyIcon">

                            <i className="fa-solid fa-file-lines"></i>

                        </div>


                        <h3>
                            Loading submissions...
                        </h3>


                        <p>
                            Please wait while the submissions are loading.
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

        <section className="Submissions">

            <div className="Submissions-container">


                {/* =================================================
                   HEADING
                ================================================= */}

                <div className="Submissions-heading">

                    <div>

                        <span>
                            Submissions
                        </span>

                        <h2>
                            Submissions
                        </h2>

                        <p>
                            Review student assignments and give grades.
                        </p>

                    </div>

                </div>


                {/* =================================================
                   COURSE + SESSION
                ================================================= */}

                <div className="Submissions-filterBar">


                    {/* =========================
                       COURSE
                    ========================= */}

                    <div className="Submissions-filterItem">

                        <div className="Submissions-filterLabel">

                            <div className="Submissions-filterIcon">

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


                        <div className="Submissions-selectWrapper">

                            <div className="Submissions-courseCode">

                                {selectedCourse
                                    ? getCourseCode(
                                        selectedCourse.language
                                    )
                                    : "--"}

                            </div>


                            <select
                                value={
                                    selectedCourseId
                                }
                                onChange={
                                    handleCourseChange
                                }
                                className="Submissions-select"
                                aria-label="Select course"
                                disabled={
                                    courses.length === 0
                                }
                            >

                                {courses.length === 0 && (

                                    <option value="">
                                        No courses available
                                    </option>

                                )}


                                {courses.map(
                                    (course) => (

                                        <option
                                            key={
                                                course._id
                                            }
                                            value={
                                                course._id
                                            }
                                        >

                                            {course.title}

                                        </option>

                                    )
                                )}

                            </select>


                            <i className="fa-solid fa-chevron-down"></i>

                        </div>

                    </div>


                    {/* =========================
                       DIVIDER
                    ========================= */}

                    <div className="Submissions-filterDivider"></div>


                    {/* =========================
                       SESSION
                    ========================= */}

                    <div className="Submissions-filterItem">

                        <div className="Submissions-filterLabel">

                            <div className="Submissions-filterIcon">

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


                        <div className="Submissions-selectWrapper">

                            <select
                                value={
                                    selectedSessionId
                                }
                                onChange={
                                    handleSessionChange
                                }
                                className="Submissions-select Submissions-sessionSelect"
                                aria-label="Select session"
                                disabled={
                                    sessions.length === 0
                                }
                            >

                                {sessions.length === 0 && (

                                    <option value="">
                                        No sessions available
                                    </option>

                                )}


                                {sessions.map(
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
                                )}

                            </select>


                            <i className="fa-solid fa-chevron-down"></i>

                        </div>

                    </div>

                </div>


                {/* =================================================
                   ASSIGNMENT
                ================================================= */}

                <div className="Submissions-assignmentSelector">

                    <div className="Submissions-assignmentHeading">

                        <div className="Submissions-assignmentIcon">

                            <i className="fa-solid fa-file-lines"></i>

                        </div>


                        <div>

                            <span>
                                Select Assignment
                            </span>

                            <p>
                                Choose an assignment to view student submissions
                            </p>

                        </div>

                    </div>


                    <div className="Submissions-assignmentSelectWrapper">

                        <select
                            value={
                                selectedAssignmentId
                            }
                            onChange={
                                handleAssignmentChange
                            }
                            className="Submissions-assignmentSelect"
                            aria-label="Select assignment"
                            disabled={
                                sessionAssignments.length === 0
                            }
                        >

                            {sessionAssignments.length === 0 && (

                                <option value="">
                                    No assignments available
                                </option>

                            )}


                            {sessionAssignments.map(
                                (assignment) => (

                                    <option
                                        key={
                                            assignment._id
                                        }
                                        value={
                                            assignment._id
                                        }
                                    >

                                        {assignment.title}

                                    </option>

                                )
                            )}

                        </select>


                        <i className="fa-solid fa-chevron-down"></i>

                    </div>

                </div>


                {/* =================================================
                   SELECTED ASSIGNMENT
                ================================================= */}

                {selectedAssignment && (

                    <div className="Submissions-selectedAssignment">

                        <div className="Submissions-selectedAssignment-left">

                            <div className="Submissions-selectedAssignment-icon">

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


                        <div className="Submissions-selectedAssignment-stats">

                            <div>

                                <strong>
                                    {
                                        assignmentSubmissions.length
                                    }
                                </strong>

                                <span>
                                    Submissions
                                </span>

                            </div>


                            <div>

                                <strong>
                                    {
                                        pendingSubmissions
                                    }
                                </strong>

                                <span>
                                    Pending
                                </span>

                            </div>


                            <div>

                                <strong>
                                    {
                                        gradedSubmissions
                                    }
                                </strong>

                                <span>
                                    Graded
                                </span>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                   SUBMISSIONS
                ================================================= */}

                <div className="Submissions-list">

                    {assignmentSubmissions.map(
                        (submission) => {

                            let studentName =
                                "Student";


                            if (
                                submission.student?.name
                            ) {

                                studentName =
                                    submission.student.name;

                            } else if (
                                submission.student?.firstName
                            ) {

                                studentName =
                                    `${submission.student.firstName} ${submission.student.lastName || ""}`.trim();

                            }


                            const assignmentTitle =
                                submission.assignment?.title ||
                                selectedAssignment?.title ||
                                "Assignment";


                            return (

                                <div
                                    className="Submissions-card"
                                    key={
                                        submission._id
                                    }
                                    onClick={() =>
                                        handleViewSubmission(
                                            submission
                                        )
                                    }
                                    role="button"
                                    tabIndex="0"
                                    onKeyDown={
                                        (event) => {

                                            if (
                                                event.key === "Enter" ||
                                                event.key === " "
                                            ) {

                                                event.preventDefault();

                                                handleViewSubmission(
                                                    submission
                                                );

                                            }

                                        }
                                    }
                                >

                                    <div className="Submissions-avatar">

                                        {studentName
                                            .charAt(0)
                                            .toUpperCase()}

                                    </div>


                                    <div className="Submissions-content">

                                        <div className="Submissions-titleRow">

                                            <div>

                                                <h3>
                                                    {studentName}
                                                </h3>


                                                <p>
                                                    {assignmentTitle}
                                                </p>

                                            </div>

                                        </div>


                                        <div className="Submissions-details">

                                            <span>

                                                <i className="fa-regular fa-calendar"></i>

                                                {
                                                    formatDate(
                                                        submission.submittedAt
                                                    )
                                                }

                                            </span>


                                            {submission.grade !== null &&
                                                submission.grade !== undefined && (

                                                    <span className="Submissions-grade">

                                                        <i className="fa-solid fa-star"></i>

                                                        {
                                                            submission.grade
                                                        }

                                                        {" / "}

                                                        {
                                                            submission.assignment?.maxScore ||
                                                            selectedAssignment?.maxScore ||
                                                            20
                                                        }

                                                    </span>

                                                )}

                                        </div>

                                    </div>


                                    <div className="Submissions-cardRight">

                                        {submission.status ===
                                            "Submitted" && (

                                            <span className="Submissions-status pending">

                                                Pending Review

                                            </span>

                                        )}


                                        {submission.status ===
                                            "Graded" && (

                                            <span className="Submissions-status graded">

                                                Graded

                                            </span>

                                        )}


                                        {submission.status ===
                                            "Late" && (

                                            <span className="Submissions-status pending">

                                                Late

                                            </span>

                                        )}


                                        <button
                                            type="button"
                                            className="Submissions-button"
                                            onClick={
                                                (event) => {

                                                    event.stopPropagation();


                                                    handleViewSubmission(
                                                        submission
                                                    );

                                                }
                                            }
                                        >

                                            {submission.status ===
                                                "Submitted"
                                                ? "View Submission"
                                                : "Review Submission"
                                            }

                                            <i className="fa-solid fa-arrow-right"></i>

                                        </button>

                                    </div>

                                </div>

                            );

                        }
                    )}


                    {/* =================================================
                       NO SUBMISSION YET
                    ================================================= */}

                    {selectedAssignment &&
                        assignmentSubmissions.length === 0 && (

                            <div className="Submissions-empty">

                                <div className="Submissions-emptyIcon">

                                    <i className="fa-regular fa-file-lines"></i>

                                </div>


                                <h3>
                                    No submission yet
                                </h3>


                                <p>
                                    No students have submitted this assignment yet.
                                </p>

                            </div>

                        )}


                    {/* =================================================
                       NO ASSIGNMENTS
                    ================================================= */}

                    {!selectedAssignment &&
                        sessionAssignments.length === 0 && (

                            <div className="Submissions-empty">

                                <div className="Submissions-emptyIcon">

                                    <i className="fa-regular fa-file-lines"></i>

                                </div>


                                <h3>
                                    No assignments available
                                </h3>


                                <p>
                                    There are no assignments for this session yet.
                                </p>

                            </div>

                        )}

                </div>

            </div>

        </section>

    );

}


export default Submissions;