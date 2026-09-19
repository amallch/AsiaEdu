import "./Assignments.css";

import {
    useEffect,
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";


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

function getCourseCode(course) {

    if (!course) {
        return "CN";
    }


    let language = "";


    if (typeof course === "string") {

        language = course;

    } else {

        language =
            course.language ||
            "";

    }


    return (
        LANGUAGE_CODES[language] ||
        "CN"
    );

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(date) {

    if (!date) {
        return "";
    }


    const dateObject =
        new Date(date);


    if (isNaN(dateObject.getTime())) {
        return "";
    }


    return dateObject.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =====================================================
   GET SESSION NAME
===================================================== */

function getSessionName(session) {

    if (!session) {
        return "";
    }


    if (typeof session === "string") {

        return session;

    }


    return (
        session.name ||
        session.group ||
        session.title ||
        ""
    );

}


/* =====================================================
   GET COURSE ID
===================================================== */

function getCourseId(course) {

    if (!course) {
        return "";
    }


    if (typeof course === "string") {
        return course;
    }


    return course._id || "";

}


/* =====================================================
   GET SESSION ID
===================================================== */

function getSessionId(session) {

    if (!session) {
        return "";
    }


    if (typeof session === "string") {
        return session;
    }


    return session._id || "";

}


/* =====================================================
   GET TEACHER NAME
===================================================== */

function getTeacherName(teacher) {

    if (!teacher) {
        return "Teacher";
    }


    if (typeof teacher === "string") {
        return teacher;
    }


    return (
        teacher.name ||
        "Teacher"
    );

}


/* =====================================================
   GET ASSIGNMENT STATUS
===================================================== */

function getAssignmentStatus(assignment) {

    if (!assignment) {
        return "Active";
    }


    if (assignment.status) {
        return assignment.status;
    }


    if (!assignment.dueDate) {
        return "Active";
    }


    const dueDate =
        new Date(
            assignment.dueDate
        );


    const today =
        new Date();


    if (
        dueDate.getTime() <
        today.getTime()
    ) {

        return "Completed";

    }


    return "Active";

}


/* =====================================================
   COMPONENT
===================================================== */

function Assignments() {

    const location = useLocation();
    const navigate = useNavigate();


    const [assignments, setAssignments] =
        useState([]);


    const [courses, setCourses] =
        useState([]);


    const [sessions, setSessions] =
        useState([]);


    const [
        selectedCourseId,
        setSelectedCourseId
    ] = useState(
        location.state?.selectedCourseId ||
        ""
    );


    const [
        selectedSessionId,
        setSelectedSessionId
    ] = useState(
        location.state?.selectedSessionId ||
        ""
    );


    const [isLoading, setIsLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    /* =====================================================
       FETCH DATA
    ===================================================== */

    useEffect(() => {

        async function fetchData() {

            try {

                setIsLoading(true);
                setError("");


                const [
                    assignmentsResponse,
                    coursesResponse,
                    sessionsResponse
                ] = await Promise.all([

                    fetch(
                        "http://localhost:5000/api/assignments/admin"
                    ),

                    fetch(
                        "http://localhost:5000/api/courses"
                    ),

                    fetch(
                        "http://localhost:5000/api/sessions"
                    )

                ]);


                if (
                    !assignmentsResponse.ok ||
                    !coursesResponse.ok ||
                    !sessionsResponse.ok
                ) {

                    throw new Error(
                        "Failed to load assignments data."
                    );

                }


                const assignmentsData =
                    await assignmentsResponse.json();


                const coursesData =
                    await coursesResponse.json();


                const sessionsData =
                    await sessionsResponse.json();


                let assignmentList = [];

                let courseList = [];

                let sessionList = [];


                if (
                    Array.isArray(
                        assignmentsData
                    )
                ) {

                    assignmentList =
                        assignmentsData;

                } else if (
                    Array.isArray(
                        assignmentsData.assignments
                    )
                ) {

                    assignmentList =
                        assignmentsData.assignments;

                }


                if (
                    Array.isArray(
                        coursesData
                    )
                ) {

                    courseList =
                        coursesData;

                } else if (
                    Array.isArray(
                        coursesData.courses
                    )
                ) {

                    courseList =
                        coursesData.courses;

                }


                if (
                    Array.isArray(
                        sessionsData
                    )
                ) {

                    sessionList =
                        sessionsData;

                } else if (
                    Array.isArray(
                        sessionsData.sessions
                    )
                ) {

                    sessionList =
                        sessionsData.sessions;

                }


                setAssignments(
                    assignmentList
                );


                setCourses(
                    courseList
                );


                setSessions(
                    sessionList
                );


                /* =============================================
                   DEFAULT COURSE
                ============================================= */

                if (
                    !location.state?.selectedCourseId &&
                    courseList.length > 0
                ) {

                    const firstAssignmentCourse =
                        assignmentList.find(
                            (assignment) =>
                                assignment.course
                        );


                    if (
                        firstAssignmentCourse
                    ) {

                        const firstCourseId =
                            getCourseId(
                                firstAssignmentCourse.course
                            );


                        setSelectedCourseId(
                            firstCourseId
                        );

                    } else {

                        setSelectedCourseId(
                            courseList[0]._id
                        );

                    }

                }


                /* =============================================
                   DEFAULT SESSION
                ============================================= */

                if (
                    !location.state?.selectedSessionId
                ) {

                    const currentCourseId =
                        location.state?.selectedCourseId ||
                        (
                            assignmentList.length > 0
                                ? getCourseId(
                                    assignmentList[0].course
                                )
                                : courseList[0]?._id
                        );


                    const firstCourseSession =
                        sessionList.find(
                            (session) => {

                                return (
                                    getCourseId(
                                        session.course
                                    ) ===
                                    currentCourseId
                                );

                            }
                        );


                    if (
                        firstCourseSession
                    ) {

                        setSelectedSessionId(
                            firstCourseSession._id
                        );

                    }

                }

            }

            catch (error) {

                console.error(
                    "Error fetching assignments:",
                    error
                );


                setError(
                    "Failed to load assignments. Please try again."
                );

            }

            finally {

                setIsLoading(false);

            }

        }


        fetchData();

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
       COURSE SESSIONS
    ===================================================== */

    const courseSessions =
        sessions.filter(
            (session) => {

                return (
                    getCourseId(
                        session.course
                    ) ===
                    selectedCourseId
                );

            }
        );


    /* =====================================================
       SELECTED SESSION
    ===================================================== */

    const selectedSession =
        sessions.find(
            (session) =>
                session._id ===
                selectedSessionId
        );


    /* =====================================================
       FILTER ASSIGNMENTS
       OLDEST -> NEWEST
    ===================================================== */

    const courseAssignments =
        assignments
            .filter(
                (assignment) => {

                    const assignmentCourseId =
                        getCourseId(
                            assignment.course
                        );


                    const assignmentSessionId =
                        getSessionId(
                            assignment.session
                        );


                    const matchesCourse =
                        assignmentCourseId ===
                        selectedCourseId;


                    const matchesSession =
                        assignmentSessionId ===
                        selectedSessionId;


                    return (
                        matchesCourse &&
                        matchesSession
                    );

                }
            )
            .sort(
                (a, b) => {

                    return (
                        new Date(
                            a.createdAt
                        ) -
                        new Date(
                            b.createdAt
                        )
                    );

                }
            );


    /* =====================================================
       COURSE CHANGE
    ===================================================== */

    function handleCourseChange(event) {

        const courseId =
            event.target.value;


        setSelectedCourseId(
            courseId
        );


        const firstSession =
            sessions.find(
                (session) => {

                    return (
                        getCourseId(
                            session.course
                        ) ===
                        courseId
                    );

                }
            );


        if (firstSession) {

            setSelectedSessionId(
                firstSession._id
            );

        } else {

            setSelectedSessionId(
                ""
            );

        }

    }


    /* =====================================================
       SESSION CHANGE
    ===================================================== */

    function handleSessionChange(event) {

        setSelectedSessionId(
            event.target.value
        );

    }


    /* =====================================================
       ASSIGNMENT CLICK
    ===================================================== */

    function handleAssignmentClick(
        assignment
    ) {

        navigate(
            "/admin/assignments/view",
            {
                state: {
                    assignment:
                        assignment,

                    course:
                        selectedCourse,

                    session:
                        selectedSession,

                    teacher:
                        assignment.teacher
                }
            }
        );

    }


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <section className="Assignments">

                <div className="Assignments-container">

                    <div className="Assignments-empty">

                        <div className="Assignments-emptyIcon">

                            <i className="fa-solid fa-spinner fa-spin"></i>

                        </div>


                        <h3>
                            Loading assignments...
                        </h3>


                        <p>
                            Please wait while we load the assignments.
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

            <section className="Assignments">

                <div className="Assignments-container">

                    <div className="Assignments-empty">

                        <div className="Assignments-emptyIcon">

                            <i className="fa-solid fa-circle-exclamation"></i>

                        </div>


                        <h3>
                            Something went wrong
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

        <section className="Assignments">

            <div className="Assignments-container">


                {/* =================================================
                   HEADING
                ================================================= */}

                <div className="Assignments-heading">

                    <div>

                        <span>
                            Assignments
                        </span>

                        <h2>
                            Assignments
                        </h2>

                        <p>
                            View all assignments created by all teachers.
                        </p>

                    </div>


                    <div className="Assignments-count">

                        <strong>
                            {assignments.length}
                        </strong>

                        <span>
                            Total Assignments
                        </span>

                    </div>

                </div>


                {/* =================================================
                   COURSE SELECTOR
                ================================================= */}

                <div className="Assignments-courseSelector">


                    <div className="Assignments-selectorHeading">

                        <div className="Assignments-selectorIcon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>


                        <div>

                            <span>
                                Select Course
                            </span>

                            <p>
                                Choose a course to view its assignments
                            </p>

                        </div>

                    </div>


                    <div className="Assignments-selectWrapper">

                        <div className="Assignments-courseCode">

                            {getCourseCode(
                                selectedCourse
                            )}

                        </div>


                        <select
                            value={
                                selectedCourseId
                            }
                            onChange={
                                handleCourseChange
                            }
                            className="Assignments-select"
                            aria-label="Select course"
                        >

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

                                        {
                                            course.title ||
                                            course.name ||
                                            "Language Course"
                                        }

                                    </option>

                                )
                            )}

                        </select>


                        <i className="fa-solid fa-chevron-down"></i>

                    </div>

                </div>


                {/* =================================================
                   SESSION SELECTOR
                ================================================= */}

                <div className="Assignments-courseSelector">


                    <div className="Assignments-selectorHeading">

                        <div className="Assignments-selectorIcon">

                            <i className="fa-solid fa-calendar-days"></i>

                        </div>


                        <div>

                            <span>
                                Select Session
                            </span>

                            <p>
                                Choose a session to view its assignments
                            </p>

                        </div>

                    </div>


                    <div className="Assignments-selectWrapper">

                        <div className="Assignments-courseCode">

                            <i className="fa-solid fa-calendar"></i>

                        </div>


                        <select
                            value={
                                selectedSessionId
                            }
                            onChange={
                                handleSessionChange
                            }
                            className="Assignments-select"
                            aria-label="Select session"
                        >

                            {courseSessions.length === 0 && (

                                <option value="">
                                    No sessions available
                                </option>

                            )}


                            {courseSessions.map(
                                (session) => (

                                    <option
                                        key={
                                            session._id
                                        }
                                        value={
                                            session._id
                                        }
                                    >

                                        {
                                            getSessionName(
                                                session
                                            )
                                        }

                                    </option>

                                )
                            )}

                        </select>


                        <i className="fa-solid fa-chevron-down"></i>

                    </div>

                </div>


                {/* =================================================
                   SELECTED COURSE
                ================================================= */}

                <div className="Assignments-selectedCourse">


                    <div className="Assignments-selectedCourse-left">

                        <div className="Assignments-selectedCourse-icon">

                            {getCourseCode(
                                selectedCourse
                            )}

                        </div>


                        <div>

                            <h3>
                                {
                                    selectedCourse?.title ||
                                    selectedCourse?.name ||
                                    "Language Course"
                                }
                            </h3>

                            <p>
                                {
                                    courseAssignments.length
                                }

                                {" "}

                                assignments

                            </p>

                        </div>

                    </div>


                    <div className="Assignments-selectedCourse-stats">

                        <div>

                            <strong>
                                {
                                    courseAssignments.filter(
                                        (assignment) =>
                                            getAssignmentStatus(
                                                assignment
                                            ) ===
                                            "Active"
                                    ).length
                                }
                            </strong>

                            <span>
                                Active
                            </span>

                        </div>


                        <div>

                            <strong>
                                {
                                    courseAssignments.filter(
                                        (assignment) =>
                                            getAssignmentStatus(
                                                assignment
                                            ) ===
                                            "Completed"
                                    ).length
                                }
                            </strong>

                            <span>
                                Completed
                            </span>

                        </div>


                        <div>

                            <strong>
                                {
                                    courseAssignments.filter(
                                        (assignment) =>
                                            getAssignmentStatus(
                                                assignment
                                            ) ===
                                            "Draft"
                                    ).length
                                }
                            </strong>

                            <span>
                                Draft
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                   ASSIGNMENTS LIST
                ================================================= */}

                <div className="Assignments-list">

                    {courseAssignments.map(
                        (assignment, index) => (

                            <div
                                className="Assignments-card"
                                key={
                                    assignment._id
                                }
                                onClick={() =>
                                    handleAssignmentClick(
                                        assignment
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

                                            handleAssignmentClick(
                                                assignment
                                            );

                                        }

                                    }
                                }
                            >


                                <div className="Assignments-number">

                                    {String(
                                        index + 1
                                    ).padStart(
                                        2,
                                        "0"
                                    )}

                                </div>


                                <div className="Assignments-content">

                                    <div className="Assignments-title-row">

                                        <h3>
                                            {
                                                assignment.title
                                            }
                                        </h3>

                                    </div>


                                    <p className="Assignments-description">

                                        {
                                            assignment.description ||
                                            "No description available."
                                        }

                                    </p>


                                    <div className="Assignments-details">

                                        <span>

                                            <i className="fa-regular fa-calendar"></i>

                                            Due{" "}

                                            {
                                                formatDate(
                                                    assignment.dueDate
                                                )
                                            }

                                        </span>


                                        <span>

                                            <i className="fa-solid fa-star"></i>

                                            {
                                                assignment.maxScore ||
                                                100
                                            }

                                            {" "}

                                            points

                                        </span>


                                        {assignment.resources &&
                                            assignment.resources.length > 0 && (

                                            <span>

                                                <i className="fa-solid fa-link"></i>

                                                {
                                                    assignment.resources.length
                                                }

                                                {" "}

                                                {
                                                    assignment.resources.length ===
                                                    1
                                                        ? "Resource"
                                                        : "Resources"
                                                }

                                            </span>

                                        )}


                                        {assignment.attachments &&
                                            assignment.attachments.length > 0 && (

                                            <span>

                                                <i className="fa-solid fa-paperclip"></i>

                                                {
                                                    assignment.attachments.length
                                                }

                                                {" "}

                                                {
                                                    assignment.attachments.length ===
                                                    1
                                                        ? "Attachment"
                                                        : "Attachments"
                                                }

                                            </span>

                                        )}

                                    </div>

                                </div>


                                <div className="Assignments-card-arrow">

                                    <i className="fa-solid fa-arrow-right"></i>

                                </div>

                            </div>

                        )
                    )}


                    {courseAssignments.length === 0 && (

                        <div className="Assignments-empty">

                            <div className="Assignments-emptyIcon">

                                <i className="fa-regular fa-file-lines"></i>

                            </div>


                            <h3>
                                No assignments found
                            </h3>


                            <p>
                                No assignments available for this course and session.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </section>

    );

}


export default Assignments;