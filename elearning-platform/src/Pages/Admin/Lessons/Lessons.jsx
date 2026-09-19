import "./Lessons.css";

import {
    useEffect,
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";


/* =====================================================
   COMPONENT
===================================================== */

function Lessons() {

    const location = useLocation();

    const navigate = useNavigate();


    /* =====================================================
       LESSONS STATE
    ===================================================== */

    const [lessons, setLessons] = useState([]);


    /* =====================================================
       COURSES STATE
    ===================================================== */

    const [courses, setCourses] = useState([]);


    /* =====================================================
       SESSIONS STATE
    ===================================================== */

    const [sessions, setSessions] = useState([]);


    /* =====================================================
       SELECTED COURSE
       Restore previous course when coming back
    ===================================================== */

    const [selectedCourseId, setSelectedCourseId] =
        useState(
            location.state?.selectedCourseId ||
            null
        );


    /* =====================================================
       SELECTED SESSION
       Restore previous session when coming back
    ===================================================== */

    const [selectedSessionId, setSelectedSessionId] =
        useState(
            location.state?.selectedSessionId ||
            null
        );


    /* =====================================================
       LOADING STATE
    ===================================================== */

    const [isLoading, setIsLoading] =
        useState(true);


    /* =====================================================
       ERROR STATE
    ===================================================== */

    const [error, setError] =
        useState("");


    /* =====================================================
       GET ALL COURSES, SESSIONS AND LESSONS
    ===================================================== */

    useEffect(() => {

        async function fetchAdminData() {

            try {

                setIsLoading(true);

                setError("");


                /* =================================================
                   FETCH COURSES
                ================================================= */

                const coursesResponse =
                    await fetch(
                        "http://localhost:5000/api/courses"
                    );


                const coursesData =
                    await coursesResponse.json();


                if (!coursesResponse.ok) {

                    throw new Error(
                        coursesData.message ||
                        "Failed to get courses"
                    );

                }


                /* =================================================
                   FORMAT COURSES
                ================================================= */

                let allCourses = [];


                if (
                    Array.isArray(
                        coursesData
                    )
                ) {

                    allCourses =
                        coursesData;

                } else if (
                    coursesData.courses &&
                    Array.isArray(
                        coursesData.courses
                    )
                ) {

                    allCourses =
                        coursesData.courses;

                }


                const formattedCourses =
                    allCourses.map(
                        (course) => {

                            /* =====================================
                               COURSE CODE
                            ===================================== */

                            let code = "CN";


                            if (
                                course.language ===
                                "Japanese"
                            ) {

                                code = "JP";

                            }


                            if (
                                course.language ===
                                "Korean"
                            ) {

                                code = "KR";

                            }


                            if (
                                course.language ===
                                "Malay"
                            ) {

                                code = "MY";

                            }


                            if (
                                course.language ===
                                "Russian"
                            ) {

                                code = "RU";

                            }


                            return {

                                id:
                                    course._id,


                                name:
                                    course.title ||
                                    course.name ||
                                    "Language Course",


                                language:
                                    course.language ||
                                    "",


                                level:
                                    course.level ||
                                    "",


                                instructor:
                                    course.teacher ||
                                    "Teacher",


                                code:
                                    code

                            };

                        }
                    );


                setCourses(
                    formattedCourses
                );


                /* =================================================
                   FETCH ALL SESSIONS
                ================================================= */

                const sessionsResponse =
                    await fetch(
                        "http://localhost:5000/api/sessions"
                    );


                const sessionsData =
                    await sessionsResponse.json();


                if (!sessionsResponse.ok) {

                    throw new Error(
                        sessionsData.message ||
                        "Failed to get sessions"
                    );

                }


                let allSessions = [];


                if (
                    Array.isArray(
                        sessionsData
                    )
                ) {

                    allSessions =
                        sessionsData;

                } else if (
                    sessionsData.sessions &&
                    Array.isArray(
                        sessionsData.sessions
                    )
                ) {

                    allSessions =
                        sessionsData.sessions;

                }


                setSessions(
                    allSessions
                );


                /* =================================================
                   FETCH ALL LESSONS
                ================================================= */

                const lessonsResponse =
                    await fetch(
                        "http://localhost:5000/api/lessons/admin"
                    );


                const lessonsData =
                    await lessonsResponse.json();


                if (!lessonsResponse.ok) {

                    throw new Error(
                        lessonsData.message ||
                        "Failed to get admin lessons"
                    );

                }


                /* =================================================
                   FORMAT LESSONS
                ================================================= */

                const formattedLessons =
                    (lessonsData.lessons || []).map(
                        (lesson) => {

                            return {

                                ...lesson

                            };

                        }
                    );


                // Sort lessons by creation date (oldest first)

                formattedLessons.sort(
                    (lessonA, lessonB) => {

                        const dateA =
                            lessonA.createdAt
                                ? new Date(
                                    lessonA.createdAt
                                ).getTime()
                                : 0;


                        const dateB =
                            lessonB.createdAt
                                ? new Date(
                                    lessonB.createdAt
                                ).getTime()
                                : 0;


                        return dateA - dateB;

                    }
                );


                setLessons(
                    formattedLessons
                );


            } catch (error) {

                console.error(
                    "Get admin lessons data error:",
                    error
                );


                setError(
                    "Failed to load lessons. Please try again."
                );

            } finally {

                setIsLoading(false);

            }

        }


        fetchAdminData();

    }, []);


    /* =====================================================
       SELECTED COURSE
    ===================================================== */

    let selectedCourse = null;


    if (selectedCourseId) {

        selectedCourse =
            courses.find(
                (course) => {

                    return (
                        course.id ===
                        selectedCourseId
                    );

                }
            );

    }


    /* =====================================================
       SESSIONS FOR SELECTED COURSE
    ===================================================== */

    const courseSessions =
        sessions.filter(
            (session) => {

                if (!session.course) {

                    return false;

                }


                let sessionCourseId = null;


                if (
                    typeof session.course ===
                    "object"
                ) {

                    sessionCourseId =
                        session.course._id;

                } else {

                    sessionCourseId =
                        session.course;

                }


                return (
                    sessionCourseId ===
                    selectedCourseId
                );

            }
        );


    /* =====================================================
       SELECTED SESSION
    ===================================================== */

    let selectedSession = null;


    if (selectedSessionId) {

        selectedSession =
            courseSessions.find(
                (session) => {

                    return (
                        session._id ===
                        selectedSessionId
                    );

                }
            );

    }


    /* =====================================================
       SESSION LESSONS
       ONLY LESSONS OF SELECTED SESSION
    ===================================================== */

    const sessionLessons =
        lessons.filter(
            (lesson) => {

                if (!lesson.session) {

                    return false;

                }


                return (
                    lesson.session._id ===
                    selectedSessionId
                );

            }
        );


    /* =====================================================
       COURSE CHANGE
    ===================================================== */

    function handleCourseChange(event) {

        const courseId =
            event.target.value;


        if (courseId === "") {

            setSelectedCourseId(
                null
            );

        } else {

            setSelectedCourseId(
                courseId
            );

        }


        // Reset session

        setSelectedSessionId(
            null
        );

    }


    /* =====================================================
       SESSION CHANGE
    ===================================================== */

    function handleSessionChange(event) {

        const sessionId =
            event.target.value;


        if (sessionId === "") {

            setSelectedSessionId(
                null
            );

        } else {

            setSelectedSessionId(
                sessionId
            );

        }

    }


    /* =====================================================
       VIEW LESSON
    ===================================================== */

    function handleLessonClick(lesson) {

        navigate(
            "/admin/lessons/view",
            {
                state: {
                    lesson: lesson,
                    course: selectedCourse,
                    session: selectedSession,
                    teacher: lesson.teacher
                }
            }
        );

    }


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <section className="MyLessons">

                <div className="MyLessons-container">

                    <div className="MyLessons-empty">

                        <div className="MyLessons-emptyIcon">

                            <i className="fa-solid fa-spinner fa-spin"></i>

                        </div>


                        <h3>
                            Loading lessons...
                        </h3>


                        <p>
                            Please wait while we load all lessons.
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

            <section className="MyLessons">

                <div className="MyLessons-container">

                    <div className="MyLessons-empty">

                        <div className="MyLessons-emptyIcon">

                            <i className="fa-solid fa-circle-exclamation"></i>

                        </div>


                        <h3>
                            Unable to load lessons
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
       LESSON LIST
    ===================================================== */

    return (

        <section className="MyLessons">

            <div className="MyLessons-container">


                {/* =============================================
                    ADMIN HEADING
                ============================================= */}

                <div className="Lessons-header">

                    <div>

                        <span>
                            LESSONS
                        </span>


                        <h1>
                            Lessons
                        </h1>


                        <p>
                            View all lessons created by all teachers.
                        </p>

                    </div>

                </div>


                {/* =============================================
                    COURSE SELECTOR
                ============================================= */}

                <div className="MyLessons-courseSelector">

                    <div className="MyLessons-selectorHeading">

                        <div className="MyLessons-selectorIcon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>


                        <div>

                            <span>
                                Select Course
                            </span>


                            <p>
                                Choose a course to view its sessions
                            </p>

                        </div>

                    </div>


                    <div className="MyLessons-selectWrapper">

                        {selectedCourse && (

                            <div className="MyLessons-courseCode">

                                {selectedCourse.code}

                            </div>

                        )}


                        <select
                            value={
                                selectedCourseId || ""
                            }
                            onChange={
                                handleCourseChange
                            }
                            className="MyLessons-select"
                            aria-label="Select course"
                        >

                            <option value="">

                                Select a course

                            </option>


                            {courses.map(
                                (course) => (

                                    <option
                                        key={
                                            course.id
                                        }
                                        value={
                                            course.id
                                        }
                                    >

                                        {course.name}

                                        {" • "}

                                        {course.level}

                                    </option>

                                )
                            )}

                        </select>


                        <i className="fa-solid fa-chevron-down"></i>

                    </div>

                </div>


                {/* =============================================
                    SESSION SELECTOR
                ============================================= */}

                {selectedCourse && (

                    <div className="MyLessons-courseSelector">

                        <div className="MyLessons-selectorHeading">

                            <div className="MyLessons-selectorIcon">

                                <i className="fa-solid fa-users"></i>

                            </div>


                            <div>

                                <span>
                                    Select Session
                                </span>


                                <p>
                                    Choose a session to view its lessons
                                </p>

                            </div>

                        </div>


                        <div className="MyLessons-selectWrapper">

                            <select
                                value={
                                    selectedSessionId || ""
                                }
                                onChange={
                                    handleSessionChange
                                }
                                className="MyLessons-select"
                                aria-label="Select session"
                            >

                                <option value="">

                                    Select a session

                                </option>


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

                                            {session.group ||
                                                session.name ||
                                                "Session"}

                                            {session.startDate
                                                ? " • " +
                                                  session.startDate
                                                : ""}

                                        </option>

                                    )
                                )}

                            </select>


                            <i className="fa-solid fa-chevron-down"></i>

                        </div>

                    </div>

                )}


                {/* =============================================
                    SELECTED COURSE + SESSION
                ============================================= */}

                {selectedCourse &&
                    selectedSession && (

                    <div className="MyLessons-selectedCourse">

                        <div className="MyLessons-selectedCourse-left">

                            <div className="MyLessons-selectedCourse-icon">

                                {selectedCourse.code}

                            </div>


                            <div>

                                <h3>

                                    {selectedCourse.name}

                                </h3>


                                <p>

                                    {selectedSession.group ||
                                        selectedSession.name ||
                                        "Session"}

                                    {" • "}

                                    {selectedCourse.level}

                                </p>

                            </div>

                        </div>


                        <div className="MyLessons-selectedCourse-stats">

                            <div>

                                <strong>

                                    {sessionLessons.length}

                                </strong>


                                <span>
                                    Lessons
                                </span>

                            </div>

                        </div>

                    </div>

                )}


                {/* =============================================
                    LESSON LIST
                ============================================= */}

                {selectedCourse &&
                    selectedSession && (

                    <div className="MyLessons-list">

                        {sessionLessons.map(
                            (lesson, index) => (

                                <div
                                    className="MyLessons-card"
                                    key={
                                        lesson._id
                                    }
                                    onClick={() =>
                                        handleLessonClick(
                                            lesson
                                        )
                                    }
                                    role="button"
                                    tabIndex="0"
                                    onKeyDown={(event) => {

                                        if (
                                            event.key ===
                                                "Enter" ||
                                            event.key ===
                                                " "
                                        ) {

                                            handleLessonClick(
                                                lesson
                                            );

                                        }

                                    }}
                                >

                                    <div className="MyLessons-number">

                                        {String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}

                                    </div>


                                    <div className="MyLessons-content">

                                        <div className="MyLessons-title-row">

                                            <div>

                                                <h3>

                                                    {lesson.title}

                                                </h3>

                                            </div>

                                        </div>


                                        <p className="MyLessons-description">

                                            {lesson.description ||
                                                "No description available."}

                                        </p>


                                        <div className="MyLessons-details">

                                            {lesson.resources &&
                                                lesson.resources.length > 0 && (

                                                    <span>

                                                        <i className="fa-solid fa-link"></i>

                                                        {lesson.resources.length}

                                                        {" "}

                                                        {lesson.resources.length === 1
                                                            ? "Resource"
                                                            : "Resources"}

                                                    </span>

                                                )}


                                            {lesson.attachments &&
                                                lesson.attachments.length > 0 && (

                                                    <span>

                                                        <i className="fa-solid fa-paperclip"></i>

                                                        {lesson.attachments.length}

                                                        {" "}

                                                        {lesson.attachments.length === 1
                                                            ? "Attachment"
                                                            : "Attachments"}

                                                    </span>

                                                )}

                                        </div>

                                    </div>


                                    <div className="MyLessons-card-actions">

                                        <div className="MyLessons-card-arrow">

                                            <i className="fa-solid fa-arrow-right"></i>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}


                        {sessionLessons.length === 0 && (

                            <div className="MyLessons-empty">

                                <div className="MyLessons-emptyIcon">

                                    <i className="fa-regular fa-file-lines"></i>

                                </div>


                                <h3>
                                    No lessons available
                                </h3>


                                <p>
                                    No teacher has added any lessons to this session yet.
                                </p>

                            </div>

                        )}

                    </div>

                )}


                {/* =============================================
                    NO SESSION SELECTED
                ============================================= */}

                {selectedCourse &&
                    !selectedSession && (

                    <div className="MyLessons-empty">

                        <div className="MyLessons-emptyIcon">

                            <i className="fa-solid fa-users"></i>

                        </div>


                        <h3>
                            Select a session
                        </h3>


                        <p>
                            Choose a session above to view its lessons.
                        </p>

                    </div>

                )}


                {/* =============================================
                    NO COURSE SELECTED
                ============================================= */}

                {!selectedCourse && (

                    <div className="MyLessons-empty">

                        <div className="MyLessons-emptyIcon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>


                        <h3>
                            Select a course
                        </h3>


                        <p>
                            Choose a course above to view its sessions and lessons.
                        </p>

                    </div>

                )}

            </div>

        </section>

    );

}


export default Lessons;