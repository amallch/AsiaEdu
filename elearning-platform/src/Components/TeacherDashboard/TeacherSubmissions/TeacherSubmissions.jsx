import "./TeacherSubmissions.css";

import { useEffect, useState } from "react";

import TeacherSubmissionDetails
    from "../TeacherSubmissions/TeacherSubmissionDetails/TeacherSubmissionDetails";


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

        return "Session";

    }


    return "Session";

}


/* =====================================================
   COMPONENT
===================================================== */

function TeacherSubmissions() {

    const [loggedInUser, setLoggedInUser] =
        useState(null);


    const [teacherId, setTeacherId] =
        useState("");


    const [teacher, setTeacher] =
        useState(null);


    const [assignments, setAssignments] =
        useState([]);


    const [submissions, setSubmissions] =
        useState([]);


    const [courses, setCourses] =
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
       GET LOGGED IN USER
    ===================================================== */

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");


        if (!storedUser) {

            setIsLoading(false);

            return;

        }


        try {

            const user =
                JSON.parse(storedUser);


            setLoggedInUser(user);

        } catch (error) {

            console.error(
                "Error reading logged in user:",
                error
            );

            setIsLoading(false);

        }

    }, []);


    /* =====================================================
       FIND TEACHER
    ===================================================== */

    useEffect(() => {

        if (!loggedInUser) {

            return;

        }


        const fetchTeacher = async () => {

            try {

                const response =
                    await fetch(
                        "https://asiaedu-backend.onrender.com/api/teachers"
                    );


                const data =
                    await response.json();


                const teacherList =
                    Array.isArray(data)
                        ? data
                        : data.teachers || [];


                const userEmail =
                    loggedInUser.email?.toLowerCase();


                const userName =
                    `${loggedInUser.firstName || ""} ${loggedInUser.lastName || ""}`
                        .trim()
                        .toLowerCase();


                /* =============================================
                   FIRST TRY EMAIL
                ============================================= */

                let foundTeacher =
                    teacherList.find(
                        (item) => {

                            return (
                                item.email &&
                                item.email.toLowerCase() ===
                                userEmail
                            );

                        }
                    );


                /* =============================================
                   FALLBACK TO NAME
                ============================================= */

                if (!foundTeacher && userName) {

                    foundTeacher =
                        teacherList.find(
                            (item) => {

                                return (
                                    item.name &&
                                    item.name.toLowerCase() ===
                                    userName
                                );

                            }
                        );

                }


                if (!foundTeacher) {

                    console.error(
                        "Teacher not found."
                    );

                    setIsLoading(false);

                    return;

                }


                setTeacher(
                    foundTeacher
                );


                setTeacherId(
                    foundTeacher._id
                );

            } catch (error) {

                console.error(
                    "Error fetching teacher:",
                    error
                );

                setIsLoading(false);

            }

        };


        fetchTeacher();

    }, [loggedInUser]);


    /* =====================================================
       GET TEACHER SESSIONS
    ===================================================== */

    useEffect(() => {

        if (!teacherId) {

            return;

        }


        const fetchSessions =
            async () => {

                try {

                    const response =
                        await fetch(
                            "https://asiaedu-backend.onrender.com/api/sessions"
                        );


                    const data =
                        await response.json();


                    const sessionList =
                        Array.isArray(data)
                            ? data
                            : data.sessions || [];


                    /* =============================================
                       KEEP ONLY THIS TEACHER'S SESSIONS
                    ============================================= */

                    const teacherSessions =
                        sessionList.filter(
                            (session) => {

                                const instructorId =
                                    typeof session.instructor === "object"
                                        ? session.instructor?._id
                                        : session.instructor;


                                return (
                                    String(instructorId) ===
                                    String(teacherId)
                                );

                            }
                        );


                    setSessions(
                        teacherSessions
                    );

                } catch (error) {

                    console.error(
                        "Error fetching teacher sessions:",
                        error
                    );

                    setSessions([]);

                }

            };


        fetchSessions();

    }, [teacherId]);


    /* =====================================================
       GET TEACHER COURSES
       
       Same course relationship logic as TeacherAssignments
    ===================================================== */

    useEffect(() => {

        if (
            !teacherId ||
            !teacher
        ) {

            return;

        }


        const fetchCourses =
            async () => {

                try {

                    const response =
                        await fetch(
                            "https://asiaedu-backend.onrender.com/api/courses"
                        );


                    const data =
                        await response.json();


                    const courseList =
                        Array.isArray(data)
                            ? data
                            : data.courses || [];


                    /* =============================================
                       COURSE IDS FROM TEACHER SESSIONS
                    ============================================= */

                    const sessionCourseIds =
                        sessions
                            .map(
                                (session) => {

                                    if (!session.course) {

                                        return null;

                                    }


                                    if (
                                        typeof session.course ===
                                        "object"
                                    ) {

                                        return session.course._id;

                                    }


                                    return session.course;

                                }
                            )
                            .filter(Boolean);


                    /* =============================================
                       FIND COURSES BELONGING TO TEACHER
                    ============================================= */

                    const teacherCourses =
                        courseList.filter(
                            (course) => {

                                const courseId =
                                    course._id;


                                /* =================================
                                   COURSE CONNECTED THROUGH SESSION
                                ================================= */

                                if (
                                    sessionCourseIds.some(
                                        (sessionCourseId) =>
                                            String(sessionCourseId) ===
                                            String(courseId)
                                    )
                                ) {

                                    return true;

                                }


                                /* =================================
                                   COURSE teacherId
                                ================================= */

                                if (
                                    course.teacherId &&
                                    String(course.teacherId) ===
                                    String(teacherId)
                                ) {

                                    return true;

                                }


                                /* =================================
                                   OLD teacher OBJECT FORMAT
                                ================================= */

                                if (
                                    course.teacher &&
                                    typeof course.teacher ===
                                    "object"
                                ) {

                                    if (
                                        String(
                                            course.teacher._id
                                        ) ===
                                        String(teacherId)
                                    ) {

                                        return true;

                                    }


                                    if (
                                        course.teacher.email &&
                                        teacher.email &&
                                        course.teacher.email.toLowerCase() ===
                                        teacher.email.toLowerCase()
                                    ) {

                                        return true;

                                    }

                                }


                                /* =================================
                                   OLD teacher STRING FORMAT
                                ================================= */

                                if (
                                    course.teacher &&
                                    typeof course.teacher ===
                                    "string"
                                ) {

                                    if (
                                        course.teacher ===
                                        teacher.name
                                    ) {

                                        return true;

                                    }

                                }


                                return false;

                            }
                        );


                    setCourses(
                        teacherCourses
                    );


                    /* =============================================
                       SELECT FIRST COURSE
                    ============================================= */

                    if (
                        teacherCourses.length > 0
                    ) {

                        setSelectedCourseId(
                            (currentId) => {

                                if (
                                    currentId &&
                                    teacherCourses.some(
                                        (course) =>
                                            String(course._id) ===
                                            String(currentId)
                                    )
                                ) {

                                    return currentId;

                                }


                                return teacherCourses[0]._id;

                            }
                        );

                    } else {

                        setSelectedCourseId("");

                    }

                } catch (error) {

                    console.error(
                        "Error fetching teacher courses:",
                        error
                    );

                    setCourses([]);

                }

            };


        fetchCourses();

    }, [
        teacherId,
        sessions,
        teacher
    ]);


    /* =====================================================
       GET TEACHER ASSIGNMENTS
    ===================================================== */

    useEffect(() => {

        if (!teacherId) {

            return;

        }


        const fetchAssignments =
            async () => {

                try {

                    setIsLoading(true);


                    const response =
                        await fetch(
                            `https://asiaedu-backend.onrender.com/api/assignments/teacher/${teacherId}`
                        );


                    const data =
                        await response.json();


                    const assignmentList =
                        Array.isArray(data)
                            ? data
                            : data.assignments || [];


                    setAssignments(
                        assignmentList
                    );

                } catch (error) {

                    console.error(
                        "Error fetching teacher assignments:",
                        error
                    );

                    setIsLoading(false);

                }

            };


        fetchAssignments();

    }, [teacherId]);


    /* =====================================================
       GET SUBMISSIONS
    ===================================================== */

    useEffect(() => {

        if (
            !assignments ||
            assignments.length === 0
        ) {

            setSubmissions([]);
            setSelectedAssignmentId("");
            setIsLoading(false);

            return;

        }


        const fetchSubmissions =
            async () => {

                try {

                    setIsLoading(true);


                    let allSubmissions = [];


                    /* =============================================
                       GET SUBMISSIONS FOR EACH ASSIGNMENT
                    ============================================= */

                    for (
                        const assignment
                        of assignments
                    ) {

                        if (!assignment._id) {

                            continue;

                        }


                        const response =
                            await fetch(
                                `https://asiaedu-backend.onrender.com/api/submissions/assignment/${assignment._id}`
                            );


                        const data =
                            await response.json();


                        const assignmentSubmissions =
                            Array.isArray(data)
                                ? data
                                : data.submissions || [];


                        allSubmissions =
                            [
                                ...allSubmissions,
                                ...assignmentSubmissions
                            ];

                    }


                    /* =============================================
                       REMOVE DUPLICATES
                    ============================================= */

                    const uniqueSubmissions =
                        [];


                    const submissionIds =
                        new Set();


                    allSubmissions.forEach(
                        (submission) => {

                            if (
                                submission._id &&
                                !submissionIds.has(
                                    submission._id
                                )
                            ) {

                                submissionIds.add(
                                    submission._id
                                );

                                uniqueSubmissions.push(
                                    submission
                                );

                            }

                        }
                    );


                    /* =============================================
                       SORT NEWEST FIRST
                    ============================================= */

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

                } finally {

                    setIsLoading(false);

                }

            };


        fetchSubmissions();

    }, [assignments]);


    /* =====================================================
       SELECTED COURSE
    ===================================================== */

    const selectedCourse =
        courses.find(
            (course) =>
                String(course._id) ===
                String(selectedCourseId)
        );


    /* =====================================================
       COURSE ASSIGNMENTS
    ===================================================== */

    const courseAssignments =
        assignments.filter(
            (assignment) => {

                const assignmentCourse =
                    assignment.course;


                const courseId =
                    typeof assignmentCourse === "object"
                        ? assignmentCourse?._id
                        : assignmentCourse;


                return (
                    String(courseId) ===
                    String(selectedCourseId)
                );

            }
        );


    /* =====================================================
       BUILD SESSIONS FOR SELECTED COURSE

       Sessions now come directly from /api/sessions,
       exactly like TeacherAssignments.
    ===================================================== */

    useEffect(() => {

        if (!selectedCourseId) {

            setSelectedSessionId("");
            setSelectedAssignmentId("");

            return;

        }


        const courseSessions =
            sessions.filter(
                (session) => {

                    if (!session.course) {

                        return false;

                    }


                    const sessionCourseId =
                        typeof session.course === "object"
                            ? session.course?._id
                            : session.course;


                    return (
                        String(sessionCourseId) ===
                        String(selectedCourseId)
                    );

                }
            );


        if (
            courseSessions.length > 0
        ) {

            const currentSessionExists =
                courseSessions.some(
                    (session) =>
                        String(
                            getSessionId(session)
                        ) ===
                        String(selectedSessionId)
                );


            if (!currentSessionExists) {

                const firstSessionId =
                    getSessionId(
                        courseSessions[0]
                    );


                setSelectedSessionId(
                    firstSessionId
                );

            }

        } else {

            setSelectedSessionId("");
            setSelectedAssignmentId("");

        }

    }, [
        selectedCourseId,
        sessions
    ]);


    /* =====================================================
       SESSION ASSIGNMENTS
    ===================================================== */

    const sessionAssignments =
        courseAssignments.filter(
            (assignment) => {

                const assignmentSession =
                    assignment.session;


                const sessionId =
                    getSessionId(
                        assignmentSession
                    );


                return (
                    String(sessionId) ===
                    String(selectedSessionId)
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

            const firstAssignment =
                sessionAssignments[0];


            const currentAssignmentExists =
                sessionAssignments.some(
                    (assignment) =>
                        String(assignment._id) ===
                        String(selectedAssignmentId)
                );


            if (!currentAssignmentExists) {

                setSelectedAssignmentId(
                    firstAssignment._id
                );

            }

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

                const assignment =
                    submission.assignment;


                const assignmentId =
                    typeof assignment === "object"
                        ? assignment?._id
                        : assignment;


                return (
                    String(assignmentId) ===
                    String(selectedAssignmentId)
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


        setSelectedSessionId(
            ""
        );


        setSelectedAssignmentId(
            ""
        );


        setSelectedSubmission(
            null
        );

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


        setSelectedAssignmentId(
            ""
        );


        setSelectedSubmission(
            null
        );

    }


    /* =====================================================
       ASSIGNMENT CHANGE
    ===================================================== */

    function handleAssignmentChange(event) {

        setSelectedAssignmentId(
            event.target.value
        );


        setSelectedSubmission(
            null
        );

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
       CLOSE REVIEW
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

        const updatedSubmissions =
            submissions.map(
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


        setSubmissions(
            updatedSubmissions
        );


        setSelectedSubmission(
            null
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

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

            <TeacherSubmissionDetails
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

            <section className="TeacherSubmissions">

                <div className="TeacherSubmissions-container">

                    <div className="TeacherSubmissions-empty">

                        <div className="TeacherSubmissions-emptyIcon">

                            <i className="fa-solid fa-file-lines"></i>

                        </div>


                        <h3>
                            Loading submissions...
                        </h3>


                        <p>
                            Please wait while your submissions are loading.
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

        <section className="TeacherSubmissions">

            <div className="TeacherSubmissions-container">


                {/* =========================
                    HEADING
                ========================= */}

                <div className="TeacherSubmissions-heading">

                    <div>

                        <h2>
                            Submissions
                        </h2>

                        <p>
                            Review student assignments and give grades.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    COURSE + SESSION SELECTORS
                ================================================= */}

                <div className="TeacherSubmissions-filterBar">


                    {/* =========================
                        COURSE
                    ========================= */}

                    <div className="TeacherSubmissions-filterItem">

                        <div className="TeacherSubmissions-filterLabel">

                            <div className="TeacherSubmissions-filterIcon">

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


                        <div className="TeacherSubmissions-selectWrapper">

                            <div className="TeacherSubmissions-courseCode">

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
                                className="TeacherSubmissions-select"
                                aria-label="Select course"
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

                    <div className="TeacherSubmissions-filterDivider"></div>


                    {/* =========================
                        SESSION
                    ========================= */}

                    <div className="TeacherSubmissions-filterItem">

                        <div className="TeacherSubmissions-filterLabel">

                            <div className="TeacherSubmissions-filterIcon">

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


                        <div className="TeacherSubmissions-selectWrapper">

                            <select
                                value={
                                    selectedSessionId
                                }
                                onChange={
                                    handleSessionChange
                                }
                                className="TeacherSubmissions-select TeacherSubmissions-sessionSelect"
                                aria-label="Select session"
                                disabled={
                                    sessions.filter(
                                        (session) => {

                                            if (!session.course) {

                                                return false;

                                            }


                                            const sessionCourseId =
                                                typeof session.course === "object"
                                                    ? session.course?._id
                                                    : session.course;


                                            return (
                                                String(sessionCourseId) ===
                                                String(selectedCourseId)
                                            );

                                        }
                                    ).length === 0
                                }
                            >

                                {sessions.filter(
                                    (session) => {

                                        if (!session.course) {

                                            return false;

                                        }


                                        const sessionCourseId =
                                            typeof session.course === "object"
                                                ? session.course?._id
                                                : session.course;


                                        return (
                                            String(sessionCourseId) ===
                                            String(selectedCourseId)
                                        );

                                    }
                                ).length === 0 && (

                                    <option value="">
                                        No sessions available
                                    </option>

                                )}


                                {sessions
                                    .filter(
                                        (session) => {

                                            if (!session.course) {

                                                return false;

                                            }


                                            const sessionCourseId =
                                                typeof session.course === "object"
                                                    ? session.course?._id
                                                    : session.course;


                                            return (
                                                String(sessionCourseId) ===
                                                String(selectedCourseId)
                                            );

                                        }
                                    )
                                    .map(
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
                    ASSIGNMENT SELECTOR
                ================================================= */}

                <div className="TeacherSubmissions-assignmentSelector">

                    <div className="TeacherSubmissions-assignmentHeading">

                        <div className="TeacherSubmissions-assignmentIcon">

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


                    <div className="TeacherSubmissions-assignmentSelectWrapper">

                        <select
                            value={
                                selectedAssignmentId
                            }
                            onChange={
                                handleAssignmentChange
                            }
                            className="TeacherSubmissions-assignmentSelect"
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

                                        {
                                            assignment.title
                                        }

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

                    <div className="TeacherSubmissions-selectedAssignment">

                        <div className="TeacherSubmissions-selectedAssignment-left">

                            <div className="TeacherSubmissions-selectedAssignment-icon">

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


                        <div className="TeacherSubmissions-selectedAssignment-stats">

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
                    SUBMISSIONS LIST
                ================================================= */}

                <div className="TeacherSubmissions-list">

                    {assignmentSubmissions.map(
                        (submission) => {

                            const studentName =
                                submission.student?.name ||
                                "Student";


                            const assignmentTitle =
                                submission.assignment?.title ||
                                "Assignment";


                            return (

                                <div
                                    className="TeacherSubmissions-card"
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
                                                event.key ===
                                                "Enter" ||
                                                event.key ===
                                                " "
                                            ) {

                                                handleViewSubmission(
                                                    submission
                                                );

                                            }

                                        }
                                    }
                                >

                                    {/* =========================
                                       STUDENT AVATAR
                                    ========================= */}

                                    <div className="TeacherSubmissions-avatar">

                                        {studentName
                                            .charAt(0)
                                            .toUpperCase()}

                                    </div>


                                    {/* =========================
                                       CONTENT
                                    ========================= */}

                                    <div className="TeacherSubmissions-content">

                                        <div className="TeacherSubmissions-titleRow">

                                            <div>

                                                <h3>
                                                    {studentName}
                                                </h3>


                                                <p>
                                                    {assignmentTitle}
                                                </p>

                                            </div>

                                        </div>


                                        <div className="TeacherSubmissions-details">

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

                                                    <span className="TeacherSubmissions-grade">

                                                        <i className="fa-solid fa-star"></i>

                                                        {
                                                            submission.grade
                                                        }

                                                        {" / "}

                                                        {
                                                            submission.assignment?.maxScore ||
                                                            20
                                                        }

                                                    </span>

                                                )}

                                        </div>

                                    </div>


                                    {/* =========================
                                       RIGHT SIDE
                                    ========================= */}

                                    <div className="TeacherSubmissions-cardRight">

                                        {submission.status ===
                                            "Submitted" && (

                                            <span className="TeacherSubmissions-status pending">

                                                Pending Review

                                            </span>

                                        )}


                                        {submission.status ===
                                            "Graded" && (

                                            <span className="TeacherSubmissions-status graded">

                                                Graded

                                            </span>

                                        )}


                                        {submission.status ===
                                            "Late" && (

                                            <span className="TeacherSubmissions-status pending">

                                                Late

                                            </span>

                                        )}


                                        <button
                                            className="TeacherSubmissions-button"
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


                    {/* =========================
                       EMPTY
                    ========================= */}

                    {selectedAssignment &&
                        assignmentSubmissions.length === 0 && (

                            <div className="TeacherSubmissions-empty">

                                <div className="TeacherSubmissions-emptyIcon">

                                    <i className="fa-regular fa-file-lines"></i>

                                </div>


                                <h3>
                                    No submissions found
                                </h3>


                                <p>
                                    No students have submitted this assignment yet.
                                </p>

                            </div>

                        )}


                    {!selectedAssignment &&
                        sessionAssignments.length === 0 && (

                            <div className="TeacherSubmissions-empty">

                                <div className="TeacherSubmissions-emptyIcon">

                                    <i className="fa-regular fa-file-lines"></i>

                                </div>


                                <h3>
                                    No submissions found
                                </h3>


                                <p>
                                    please select an assignment to show available submissions
                                </p>

                            </div>

                        )}

                </div>

            </div>

        </section>

    );

}


export default TeacherSubmissions;