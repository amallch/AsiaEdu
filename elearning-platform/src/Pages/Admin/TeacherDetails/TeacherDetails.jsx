import "./TeacherDetails.css";

import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";


function TeacherDetails() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [teacher, setTeacher] = useState(null);

    const [sessions, setSessions] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");


    const [updatingCourseId, setUpdatingCourseId] =
        useState(null);

    const [deletingCourseId, setDeletingCourseId] =
        useState(null);


    const [updatingSessionId, setUpdatingSessionId] =
        useState(null);

    const [deletingSessionId, setDeletingSessionId] =
        useState(null);


    /* =====================================================
       MODAL
    ===================================================== */

    const [modal, setModal] = useState({
        open: false,
        type: "",
        title: "",
        message: "",
        action: null,
        data: null
    });


    const closeModal = () => {

        setModal({
            open: false,
            type: "",
            title: "",
            message: "",
            action: null,
            data: null
        });

    };


    /* =====================================================
       LOAD TEACHER AND TEACHER SESSIONS
    ===================================================== */

    useEffect(() => {

        const fetchTeacherData = async () => {

            try {

                setIsLoading(true);

                setErrorMessage("");


                /* =================================================
                   LOAD TEACHER
                ================================================= */

                const teacherResponse =
                    await fetch(
                        `http://localhost:5000/api/teachers/${id}`
                    );


                const teacherResult =
                    await teacherResponse.json();


                if (!teacherResponse.ok) {

                    throw new Error(
                        teacherResult.message ||
                        "Failed to fetch teacher."
                    );

                }


                /* =================================================
                   LOAD ALL SESSIONS
                ================================================= */

                const sessionsResponse =
                    await fetch(
                        "http://localhost:5000/api/sessions"
                    );


                const sessionsResult =
                    await sessionsResponse.json();


                if (!sessionsResponse.ok) {

                    throw new Error(
                        sessionsResult.message ||
                        "Failed to fetch sessions."
                    );

                }


                /* =================================================
                   FIND SESSIONS BELONGING TO THIS TEACHER
                ================================================= */

                const teacherSessions =
                    sessionsResult.filter(
                        (session) => {

                            if (
                                !session.instructor
                            ) {

                                return false;

                            }


                            if (
                                typeof session.instructor ===
                                "object"
                            ) {

                                return (
                                    String(
                                        session.instructor._id
                                    ) === String(id)
                                );

                            }


                            return (
                                String(
                                    session.instructor
                                ) === String(id)
                            );

                        }
                    );


                setTeacher(
                    teacherResult
                );


                setSessions(
                    teacherSessions
                );

            }

            catch (error) {

                console.error(
                    "Error loading teacher details:",
                    error
                );


                setErrorMessage(
                    "Unable to load teacher information."
                );

            }

            finally {

                setIsLoading(false);

            }

        };


        fetchTeacherData();

    }, [id]);


    /* =====================================================
       UPDATE COURSE STATUS
    ===================================================== */

    const handleCourseStatusChange =
        async (
            courseId,
            currentStatus
        ) => {

            const newStatus =
                currentStatus === "Active"
                    ? "Inactive"
                    : "Active";


            /* =================================================
               CHECK ENROLLED STUDENTS BEFORE DEACTIVATING
            ================================================= */

            if (newStatus === "Inactive") {

                const courseSessions =
                    sessions.filter(
                        (session) => {

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


                const enrolledStudents =
                    courseSessions.reduce(
                        (total, session) => {

                            return (
                                total +
                                (session.enrolled || 0)
                            );

                        },
                        0
                    );


                if (enrolledStudents > 0) {

                    setModal({

                        open: true,

                        type: "error",

                        title: "Cannot Deactivate",

                        message:
                            "This course cannot be deactivated because there are enrolled students in its sessions.",

                        action: null,

                        data: null

                    });

                    return;

                }

            }


            /* =================================================
               OPEN CONFIRMATION MODAL
            ================================================= */

            setModal({

                open: true,

                type:
                    newStatus === "Inactive"
                        ? "warning"
                        : "success",

                title:
                    newStatus === "Inactive"
                        ? "Confirm Deactivation"
                        : "Confirm Activation",

                message:
                    newStatus === "Inactive"
                        ? "Are you sure you want to deactivate this course?"
                        : "Are you sure you want to activate this course?",

                action: "course-status",

                data: {
                    courseId,
                    newStatus
                }

            });

        };


    /* =====================================================
       CONFIRM COURSE STATUS
    ===================================================== */

    const confirmCourseStatusChange =
        async (
            courseId,
            newStatus
        ) => {

            try {

                setUpdatingCourseId(
                    String(courseId)
                );


                const response =
                    await fetch(
                        `http://localhost:5000/api/teachers/${id}/course-status`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                courseId:
                                    courseId,

                                status:
                                    newStatus

                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to update course status."
                    );

                }


                /* =================================================
                   UPDATE LOCAL TEACHER DATA
                ================================================= */

                setTeacher(
                    previousTeacher => {

                        if (!previousTeacher) {

                            return previousTeacher;

                        }


                        return {

                            ...previousTeacher,

                            courses:
                                previousTeacher.courses.map(
                                    course => {

                                        if (
                                            String(
                                                course.courseId
                                            ) ===
                                            String(courseId)
                                        ) {

                                            return {

                                                ...course,

                                                status:
                                                    newStatus

                                            };

                                        }


                                        return course;

                                    }
                                )

                        };

                    }
                );

            }

            catch (error) {

                console.error(
                    "Error updating teacher course status:",
                    error
                );


                setModal({

                    open: true,

                    type: "error",

                    title: "Something went wrong",

                    message:
                        error.message ||
                        "Failed to update course status.",

                    action: null,

                    data: null

                });

            }

            finally {

                setUpdatingCourseId(
                    null
                );

            }

        };


    /* =====================================================
       DELETE COURSE
    ===================================================== */

    const handleDeleteCourse =
        async (
            courseId,
            courseName
        ) => {

            /* =================================================
               CHECK ENROLLED STUDENTS
            ================================================= */

            const courseSessions =
                sessions.filter(
                    (session) => {

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


            const enrolledStudents =
                courseSessions.reduce(
                    (total, session) => {

                        return (
                            total +
                            (session.enrolled || 0)
                        );

                    },
                    0
                );


            if (enrolledStudents > 0) {

                setModal({

                    open: true,

                    type: "error",

                    title: "Cannot Delete",

                    message:
                        "This course cannot be deleted because there are enrolled students in its sessions.",

                    action: null,

                    data: null

                });

                return;

            }


            /* =================================================
               OPEN DELETE CONFIRMATION
            ================================================= */

            setModal({

                open: true,

                type: "delete",

                title: "Confirm Delete",

                message:
                    `Are you sure you want to delete "${courseName}"? This action cannot be undone.`,

                action: "delete-course",

                data: {
                    courseId
                }

            });

        };


    /* =====================================================
       CONFIRM DELETE COURSE
    ===================================================== */

    const confirmDeleteCourse =
        async (
            courseId
        ) => {

            try {

                setDeletingCourseId(
                    String(courseId)
                );


                const response =
                    await fetch(
                        `http://localhost:5000/api/courses/${courseId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to delete course."
                    );

                }


                /* =================================================
                   REMOVE COURSE FROM TEACHER LOCALLY
                ================================================= */

                setTeacher(
                    previousTeacher => {

                        if (!previousTeacher) {

                            return previousTeacher;

                        }


                        return {

                            ...previousTeacher,

                            courses:
                                previousTeacher.courses.filter(
                                    course =>
                                        String(
                                            course.courseId
                                        ) !==
                                        String(courseId)
                                )

                        };

                    }
                );


                /* =================================================
                   REMOVE ITS SESSIONS LOCALLY
                ================================================= */

                setSessions(
                    previousSessions =>
                        previousSessions.filter(
                            session => {

                                const sessionCourseId =
                                    typeof session.course === "object"
                                        ? session.course._id
                                        : session.course;


                                return (
                                    String(
                                        sessionCourseId
                                    ) !==
                                    String(courseId)
                                );

                            }
                        )
                );

            }

            catch (error) {

                console.error(
                    "Error deleting course:",
                    error
                );


                setModal({

                    open: true,

                    type: "error",

                    title: "Cannot Delete",

                    message:
                        error.message ||
                        "Failed to delete course.",

                    action: null,

                    data: null

                });

            }

            finally {

                setDeletingCourseId(
                    null
                );

            }

        };


    /* =====================================================
       UPDATE SESSION STATUS
    ===================================================== */

    const handleSessionStatusChange =
        async (
            sessionId,
            currentStatus,
            enrolled
        ) => {

            const newStatus =
                currentStatus === "Active"
                    ? "Inactive"
                    : "Active";


            /* =================================================
               CHECK ENROLLED STUDENTS BEFORE DEACTIVATING
            ================================================= */

            if (
                newStatus === "Inactive" &&
                (enrolled || 0) > 0
            ) {

                setModal({

                    open: true,

                    type: "error",

                    title: "Cannot Deactivate",

                    message:
                        "This session cannot be deactivated because there are enrolled students.",

                    action: null,

                    data: null

                });

                return;

            }


            /* =================================================
               OPEN CONFIRMATION MODAL
            ================================================= */

            setModal({

                open: true,

                type:
                    newStatus === "Inactive"
                        ? "warning"
                        : "success",

                title:
                    newStatus === "Inactive"
                        ? "Confirm Deactivation"
                        : "Confirm Activation",

                message:
                    newStatus === "Inactive"
                        ? "Are you sure you want to deactivate this session?"
                        : "Are you sure you want to activate this session?",

                action: "session-status",

                data: {
                    sessionId,
                    newStatus
                }

            });

        };


    /* =====================================================
       CONFIRM SESSION STATUS
    ===================================================== */

    const confirmSessionStatusChange =
        async (
            sessionId,
            newStatus
        ) => {

            try {

                setUpdatingSessionId(
                    String(sessionId)
                );


                const response =
                    await fetch(
                        `http://localhost:5000/api/sessions/${sessionId}/status`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                status:
                                    newStatus

                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to update session status."
                    );

                }


                /* =================================================
                   UPDATE LOCAL SESSION
                ================================================= */

                setSessions(
                    previousSessions =>
                        previousSessions.map(
                            session => {

                                if (
                                    String(
                                        session._id
                                    ) ===
                                    String(sessionId)
                                ) {

                                    return {

                                        ...session,

                                        status:
                                            newStatus

                                    };

                                }


                                return session;

                            }
                        )
                );

            }

            catch (error) {

                console.error(
                    "Error updating session status:",
                    error
                );


                setModal({

                    open: true,

                    type: "error",

                    title: "Something went wrong",

                    message:
                        error.message ||
                        "Failed to update session status.",

                    action: null,

                    data: null

                });

            }

            finally {

                setUpdatingSessionId(
                    null
                );

            }

        };


    /* =====================================================
       DELETE SESSION
    ===================================================== */

    const handleDeleteSession =
        async (
            sessionId,
            sessionName,
            enrolled
        ) => {

            /* =================================================
               CHECK ENROLLED STUDENTS
            ================================================= */

            if ((enrolled || 0) > 0) {

                setModal({

                    open: true,

                    type: "error",

                    title: "Cannot Delete",

                    message:
                        "This session cannot be deleted because there are enrolled students.",

                    action: null,

                    data: null

                });

                return;

            }


            /* =================================================
               OPEN DELETE CONFIRMATION
            ================================================= */

            setModal({

                open: true,

                type: "delete",

                title: "Confirm Delete",

                message:
                    `Are you sure you want to delete "${sessionName}"? This action cannot be undone.`,

                action: "delete-session",

                data: {
                    sessionId
                }

            });

        };


    /* =====================================================
       CONFIRM DELETE SESSION
    ===================================================== */

    const confirmDeleteSession =
        async (
            sessionId
        ) => {

            try {

                setDeletingSessionId(
                    String(sessionId)
                );


                const response =
                    await fetch(
                        `http://localhost:5000/api/sessions/${sessionId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to delete session."
                    );

                }


                /* =================================================
                   REMOVE SESSION LOCALLY
                ================================================= */

                setSessions(
                    previousSessions =>
                        previousSessions.filter(
                            session =>
                                String(
                                    session._id
                                ) !==
                                String(sessionId)
                        )
                );

            }

            catch (error) {

                console.error(
                    "Error deleting session:",
                    error
                );


                setModal({

                    open: true,

                    type: "error",

                    title: "Cannot Delete",

                    message:
                        error.message ||
                        "Failed to delete session.",

                    action: null,

                    data: null

                });

            }

            finally {

                setDeletingSessionId(
                    null
                );

            }

        };


    /* =====================================================
       MODAL CONFIRM ACTION
    ===================================================== */

    const handleModalConfirm = async () => {

        const action =
            modal.action;

        const data =
            modal.data;


        closeModal();


        if (
            action ===
            "course-status"
        ) {

            await confirmCourseStatusChange(
                data.courseId,
                data.newStatus
            );

            return;

        }


        if (
            action ===
            "delete-course"
        ) {

            await confirmDeleteCourse(
                data.courseId
            );

            return;

        }


        if (
            action ===
            "session-status"
        ) {

            await confirmSessionStatusChange(
                data.sessionId,
                data.newStatus
            );

            return;

        }


        if (
            action ===
            "delete-session"
        ) {

            await confirmDeleteSession(
                data.sessionId
            );

        }

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <div className="TeacherDetails-empty">

                <i className="fa-solid fa-spinner fa-spin"></i>

                <h2>
                    Loading teacher...
                </h2>

                <p>
                    Please wait while the teacher information is loaded.
                </p>

            </div>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (errorMessage) {

        return (

            <div className="TeacherDetails-empty">

                <i className="fa-solid fa-circle-exclamation"></i>

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {errorMessage}
                </p>

                <button
                    onClick={() =>
                        navigate("/admin/teachers")
                    }
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    <span>
                        Back to Teachers
                    </span>

                </button>

            </div>

        );

    }


    /* =====================================================
       TEACHER NOT FOUND
    ===================================================== */

    if (!teacher) {

        return (

            <div className="TeacherDetails-empty">

                <i className="fa-solid fa-user-slash"></i>

                <h2>
                    Teacher not found
                </h2>

                <p>
                    The teacher information could not be found.
                </p>

                <button
                    onClick={() =>
                        navigate("/admin/teachers")
                    }
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    <span>
                        Back to Teachers
                    </span>

                </button>

            </div>

        );

    }


    /* =====================================================
       GROUP TEACHER COURSES AND SESSIONS
    ===================================================== */

    const coursesWithSessions = [];


    /* =====================================================
       ADD COURSES SELECTED WHEN TEACHER WAS CREATED
    ===================================================== */

    if (
        teacher.courses &&
        Array.isArray(teacher.courses)
    ) {

        teacher.courses.forEach((course) => {

            if (!course) {

                return;

            }


            coursesWithSessions.push({

                _id:
                    course.courseId ||
                    course.id,

                courseId:
                    course.courseId ||
                    course.id,

                name:
                    course.name ||
                    "Untitled Course",

                language:
                    course.language ||
                    "",

                level:
                    course.level ||
                    "",

                startDate:
                    course.startDate ||
                    "",

                duration:
                    course.duration ||
                    "",

                price:
                    course.price ||
                    0,

                status:
                    course.status ||
                    "Active",

                sessions: []

            });

        });

    }


    /* =====================================================
       ADD SESSIONS TO THEIR COURSES
    ===================================================== */

    sessions.forEach((session) => {

        if (!session.course) {

            return;

        }


        const courseId =
            typeof session.course === "object"
                ? session.course._id
                : session.course;


        const existingCourse =
            coursesWithSessions.find(
                (course) =>
                    String(course._id) ===
                    String(courseId)
            );


        if (existingCourse) {

            existingCourse.sessions.push(
                session
            );

            return;

        }


        /* =================================================
           FALLBACK
           IF SESSION COURSE IS NOT IN TEACHER.COURSES
        ================================================= */

        if (
            typeof session.course === "object"
        ) {

            coursesWithSessions.push({

                _id:
                    session.course._id,

                courseId:
                    session.course._id,

                name:
                    session.course.title ||
                    session.course.name ||
                    "Untitled Course",

                language:
                    session.course.language ||
                    "",

                level:
                    session.course.level ||
                    "",

                startDate:
                    session.course.startDate ||
                    "",

                duration:
                    session.course.duration ||
                    "",

                price:
                    session.course.price ||
                    0,

                status:
                    "Active",

                sessions: [
                    session
                ]

            });

        }

    });


    /* =====================================================
       TOTAL STUDENTS
       ONLY ACTIVE SESSIONS
    ===================================================== */

    const totalStudents =
        sessions.reduce(
            (total, session) => {

                const sessionStatus =
                    session.status ||
                    "Active";


                if (
                    sessionStatus === "Inactive"
                ) {

                    return total;

                }


                return (
                    total +
                    (session.enrolled || 0)
                );

            },
            0
        );


    /* =====================================================
       JOINED DATE
    ===================================================== */

    const joinedDate =
        teacher.joinedDate
            ? new Date(
                teacher.joinedDate
            ).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            )
            : "N/A";


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(date) {

        if (!date) {

            return "N/A";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return date;

        }


        return parsedDate.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    }


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(price) {

        if (
            price === undefined ||
            price === null
        ) {

            return "N/A";

        }


        return `${Number(price).toLocaleString()} DA`;

    }


    /* =====================================================
       FORMAT PROGRAM TYPE
    ===================================================== */

    function formatProgramType(programType) {

        if (!programType) {

            return "N/A";

        }


        return programType;

    }


    return (

        <div className="TeacherDetails">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="TeacherDetails-header">

                <button
                    className="TeacherDetails-back"
                    onClick={() =>
                        navigate("/admin/teachers")
                    }
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    <span>
                        Back to Teachers
                    </span>

                </button>


                <span className="TeacherDetails-label">
                    Teacher Management
                </span>


                <h1>
                    {teacher.name}
                </h1>


                <p>
                    View teacher information and teaching activity.
                </p>

            </div>


            {/* =================================================
                TEACHER STATISTICS
            ================================================= */}

            <div className="TeacherDetails-stats">


                {/* STUDENTS */}

                <div className="TeacherDetails-stat-card">

                    <div className="TeacherDetails-stat-icon">

                        <i className="fa-solid fa-users"></i>

                    </div>

                    <div>

                        <span>
                            Students
                        </span>

                        <strong>
                            {totalStudents}
                        </strong>

                    </div>

                </div>


                {/* COURSES */}

                <div className="TeacherDetails-stat-card">

                    <div className="TeacherDetails-stat-icon">

                        <i className="fa-solid fa-book-open"></i>

                    </div>

                    <div>

                        <span>
                            Courses
                        </span>

                        <strong>
                            {coursesWithSessions.length}
                        </strong>

                    </div>

                </div>


                {/* EXPERIENCE */}

                <div className="TeacherDetails-stat-card">

                    <div className="TeacherDetails-stat-icon">

                        <i className="fa-solid fa-briefcase"></i>

                    </div>

                    <div>

                        <span>
                            Experience
                        </span>

                        <strong>
                            {teacher.experience || "N/A"}
                        </strong>

                    </div>

                </div>


            </div>


            {/* =================================================
                TEACHER INFORMATION
            ================================================= */}

            <div className="TeacherDetails-section">

                <div className="TeacherDetails-section-header">

                    <div>

                        <h2>
                            Teacher Information
                        </h2>

                        <p>
                            Personal and professional information of the teacher.
                        </p>

                    </div>

                </div>


                <div className="TeacherDetails-info-grid">


                    {/* FULL NAME */}

                    <div className="TeacherDetails-info-item">

                        <div className="TeacherDetails-info-icon">

                            <i className="fa-solid fa-user"></i>

                        </div>

                        <div>

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {teacher.name}
                            </strong>

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="TeacherDetails-info-item">

                        <div className="TeacherDetails-info-icon">

                            <i className="fa-solid fa-envelope"></i>

                        </div>

                        <div>

                            <span>
                                Email
                            </span>

                            <strong>
                                {teacher.email}
                            </strong>

                        </div>

                    </div>


                    {/* PHONE */}

                    <div className="TeacherDetails-info-item">

                        <div className="TeacherDetails-info-icon">

                            <i className="fa-solid fa-phone"></i>

                        </div>

                        <div>

                            <span>
                                Phone
                            </span>

                            <strong>
                                {teacher.phone || "N/A"}
                            </strong>

                        </div>

                    </div>


                    {/* TEACHER ID */}

                    <div className="TeacherDetails-info-item">

                        <div className="TeacherDetails-info-icon">

                            <i className="fa-solid fa-id-card"></i>

                        </div>

                        <div>

                            <span>
                                Teacher ID
                            </span>

                            <strong>
                                {teacher.teacherId || "N/A"}
                            </strong>

                        </div>

                    </div>


                    {/* LANGUAGE */}

                    <div className="TeacherDetails-info-item">

                        <div className="TeacherDetails-info-icon">

                            <i className="fa-solid fa-language"></i>

                        </div>

                        <div>

                            <span>
                                Language
                            </span>

                            <strong>
                                {teacher.language || "N/A"}
                            </strong>

                        </div>

                    </div>


                    {/* EXPERIENCE */}

                    <div className="TeacherDetails-info-item">

                        <div className="TeacherDetails-info-icon">

                            <i className="fa-solid fa-briefcase"></i>

                        </div>

                        <div>

                            <span>
                                Experience
                            </span>

                            <strong>
                                {teacher.experience || "N/A"}
                            </strong>

                        </div>

                    </div>


                    {/* EDUCATION */}

                    <div className="TeacherDetails-info-item">

                        <div className="TeacherDetails-info-icon">

                            <i className="fa-solid fa-graduation-cap"></i>

                        </div>

                        <div>

                            <span>
                                Education
                            </span>

                            <strong>
                                {teacher.education || "N/A"}
                            </strong>

                        </div>

                    </div>


                    {/* JOINED DATE */}

                    <div className="TeacherDetails-info-item">

                        <div className="TeacherDetails-info-icon">

                            <i className="fa-regular fa-calendar"></i>

                        </div>

                        <div>

                            <span>
                                Joined Date
                            </span>

                            <strong>
                                {joinedDate}
                            </strong>

                        </div>

                    </div>


                </div>

            </div>


            {/* =================================================
                TEACHING COURSES
            ================================================= */}

            <div className="TeacherDetails-section">

                <div className="TeacherDetails-section-header">

                    <div>

                        <h2>
                            Teaching Courses
                        </h2>

                        <p>
                            Courses and sessions currently taught by this teacher.
                        </p>

                    </div>


                    <div className="TeacherDetails-course-count">

                        <strong>
                            {coursesWithSessions.length}
                        </strong>

                        <span>
                            {coursesWithSessions.length === 1
                                ? "Course"
                                : "Courses"
                            }
                        </span>

                    </div>

                </div>


                {/* =================================================
                    NO COURSES
                ================================================= */}

                {coursesWithSessions.length === 0 && (

                    <div className="TeacherDetails-empty">

                        <i className="fa-solid fa-book-open"></i>

                        <h2>
                            No teaching courses
                        </h2>

                        <p>
                            This teacher has no assigned courses yet.
                        </p>

                    </div>

                )}


                {/* =================================================
                    COURSE LIST
                ================================================= */}

                {coursesWithSessions.map((course) => (

                    <div
                        className="TeacherDetails-course-card"
                        key={course._id}
                    >


                        {/* =================================================
                            COURSE HEADER
                        ================================================= */}

                        <div className="TeacherDetails-course-header">

                            <div className="TeacherDetails-course-title-wrapper">

                                <div className="TeacherDetails-course-icon">

                                    <i className="fa-solid fa-book-open"></i>

                                </div>


                                <div>

                                    <span className="TeacherDetails-course-label">
                                        Course
                                    </span>

                                    <h3>
                                        {course.name}
                                    </h3>

                                    <p>
                                        {course.language} · {course.level}
                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                                COURSE STATUS + ACTIONS
                            ================================================= */}

                            <div className="TeacherDetails-course-actions">

                                <span
                                    className={`TeacherDetails-status ${
                                        course.status === "Inactive"
                                            ? "inactive"
                                            : "active"
                                    }`}
                                >

                                    <span className="TeacherDetails-status-dot"></span>

                                    {course.status}

                                </span>


                                {/* ACTIVATE / DEACTIVATE */}

                                <button
                                    className={`TeacherDetails-course-action ${
                                        course.status === "Inactive"
                                            ? "activate"
                                            : "deactivate"
                                    }`}
                                    disabled={
                                        updatingCourseId ===
                                            String(course.courseId) ||
                                        deletingCourseId ===
                                            String(course.courseId)
                                    }
                                    onClick={() =>
                                        handleCourseStatusChange(
                                            course.courseId,
                                            course.status
                                        )
                                    }
                                >

                                    {updatingCourseId ===
                                    String(course.courseId) ? (

                                        <i className="fa-solid fa-spinner fa-spin"></i>

                                    ) : (

                                        <i
                                            className={
                                                course.status === "Inactive"
                                                    ? "fa-solid fa-check"
                                                    : "fa-solid fa-ban"
                                            }
                                        ></i>

                                    )}


                                    <span>
                                        {course.status === "Inactive"
                                            ? "Activate"
                                            : "Deactivate"
                                        }
                                    </span>

                                </button>


                                {/* DELETE COURSE */}

                                <button
                                    className="TeacherDetails-course-action delete"
                                    disabled={
                                        updatingCourseId ===
                                            String(course.courseId) ||
                                        deletingCourseId ===
                                            String(course.courseId)
                                    }
                                    onClick={() =>
                                        handleDeleteCourse(
                                            course.courseId,
                                            course.name
                                        )
                                    }
                                >

                                    {deletingCourseId ===
                                    String(course.courseId) ? (

                                        <i className="fa-solid fa-spinner fa-spin"></i>

                                    ) : (

                                        <i className="fa-solid fa-trash"></i>

                                    )}

                                    <span>
                                        Delete
                                    </span>

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            SESSIONS
                        ================================================= */}

                        <div className="TeacherDetails-sessions">


                            <div className="TeacherDetails-sessions-heading">

                                <div>

                                    <h4>
                                        Sessions
                                    </h4>

                                    <p>
                                        Sessions taught by this teacher.
                                    </p>

                                </div>


                                <span className="TeacherDetails-session-count">

                                    {course.sessions.length}

                                    {course.sessions.length === 1
                                        ? " Session"
                                        : " Sessions"
                                    }

                                </span>

                            </div>


                            {/* =================================================
                                NO SESSIONS
                            ================================================= */}

                            {course.sessions.length === 0 && (

                                <div className="TeacherDetails-empty">

                                    <i className="fa-solid fa-calendar-xmark"></i>

                                    <h2>
                                        No sessions yet
                                    </h2>

                                    <p>
                                        This course is assigned to the teacher, but no session has been created yet.
                                    </p>

                                </div>

                            )}


                            {/* =================================================
                                SESSION LIST
                            ================================================= */}

                            {course.sessions.length > 0 && (

                                <div className="TeacherDetails-session-list">

                                    {course.sessions.map((session) => {

                                        const sessionStatus =
                                            session.status ||
                                            "Active";


                                        const isUpdating =
                                            updatingSessionId ===
                                            String(session._id);


                                        const isDeleting =
                                            deletingSessionId ===
                                            String(session._id);


                                        return (

                                            <div
                                                className={`TeacherDetails-session-card ${
                                                    sessionStatus === "Inactive"
                                                        ? "session-inactive"
                                                        : ""
                                                }`}
                                                key={session._id}
                                            >


                                                {/* SESSION HEADER */}

                                                <div className="TeacherDetails-session-header">

                                                    <div>

                                                        <span className="TeacherDetails-session-label">
                                                            Session
                                                        </span>

                                                        <h5>
                                                            {session.group || "Unnamed Session"}
                                                        </h5>

                                                    </div>


                                                    <div className="TeacherDetails-session-header-right">

                                                        <div className="TeacherDetails-session-students">

                                                            <i className="fa-solid fa-users"></i>

                                                            <span>
                                                                {session.enrolled || 0}
                                                                {" / "}
                                                                {session.capacity || 0}
                                                            </span>

                                                            <small>
                                                                students
                                                            </small>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* SESSION INFORMATION */}

                                                <div className="TeacherDetails-session-info-grid">


                                                    {/* TEACHER */}

                                                    <div className="TeacherDetails-session-info-item">

                                                        <span>
                                                            Teacher
                                                        </span>

                                                        <strong>
                                                            {session.instructor &&
                                                            typeof session.instructor === "object"
                                                                ? session.instructor.name || teacher.name
                                                                : teacher.name
                                                            }
                                                        </strong>

                                                    </div>


                                                    {/* START DATE */}

                                                    <div className="TeacherDetails-session-info-item">

                                                        <span>
                                                            Start Date
                                                        </span>

                                                        <strong>
                                                            {formatDate(
                                                                session.startDate
                                                            )}
                                                        </strong>

                                                    </div>


                                                    {/* CAPACITY */}

                                                    <div className="TeacherDetails-session-info-item">

                                                        <span>
                                                            Capacity
                                                        </span>

                                                        <strong>
                                                            {session.capacity || 0}
                                                            {" Students"}
                                                        </strong>

                                                    </div>


                                                    {/* AVAILABLE SEATS */}

                                                    <div className="TeacherDetails-session-info-item">

                                                        <span>
                                                            Available Seats
                                                        </span>

                                                        <strong>
                                                            {session.available !== undefined
                                                                ? session.available
                                                                : (
                                                                    (session.capacity || 0) -
                                                                    (session.enrolled || 0)
                                                                )
                                                            }
                                                        </strong>

                                                    </div>


                                                    {/* PROGRAM TYPE */}

                                                    <div className="TeacherDetails-session-info-item">

                                                        <span>
                                                            Program Type
                                                        </span>

                                                        <strong>
                                                            {formatProgramType(
                                                                session.programType
                                                            )}
                                                        </strong>

                                                    </div>


                                                    {/* PRICE */}

                                                    <div className="TeacherDetails-session-info-item">

                                                        <span>
                                                            Price
                                                        </span>

                                                        <strong>
                                                            {session.course &&
                                                            session.course.price !== undefined &&
                                                            session.course.price !== null
                                                                ? formatPrice(
                                                                    session.course.price
                                                                )
                                                                : formatPrice(
                                                                    course.price
                                                                )
                                                            }
                                                        </strong>

                                                    </div>


                                                </div>


                                                {/* =================================================
                                                    SESSION ACTIONS
                                                ================================================= */}

                                                <div className="TeacherDetails-session-actions">

                                                    {/* SESSION STATUS */}

                                                    <div className="TeacherDetails-session-status-wrapper">

                                                        <span
                                                            className={`TeacherDetails-status ${
                                                                sessionStatus === "Inactive"
                                                                    ? "inactive"
                                                                    : "active"
                                                            }`}
                                                        >

                                                            <span className="TeacherDetails-status-dot"></span>

                                                            {sessionStatus}

                                                        </span>

                                                    </div>


                                                    <div className="TeacherDetails-session-action-buttons">


                                                        {/* ACTIVATE / DEACTIVATE */}

                                                        <button
                                                            className={`TeacherDetails-session-action ${
                                                                sessionStatus === "Inactive"
                                                                    ? "activate"
                                                                    : "deactivate"
                                                            }`}
                                                            disabled={
                                                                isUpdating ||
                                                                isDeleting
                                                            }
                                                            onClick={() =>
                                                                handleSessionStatusChange(
                                                                    session._id,
                                                                    sessionStatus,
                                                                    session.enrolled
                                                                )
                                                            }
                                                        >

                                                            {isUpdating ? (

                                                                <i className="fa-solid fa-spinner fa-spin"></i>

                                                            ) : (

                                                                <i
                                                                    className={
                                                                        sessionStatus === "Inactive"
                                                                            ? "fa-solid fa-check"
                                                                            : "fa-solid fa-ban"
                                                                    }
                                                                ></i>

                                                            )}

                                                            <span>
                                                                {sessionStatus === "Inactive"
                                                                    ? "Activate"
                                                                    : "Deactivate"
                                                                }
                                                            </span>

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            className="TeacherDetails-session-action delete"
                                                            disabled={
                                                                isUpdating ||
                                                                isDeleting
                                                            }
                                                            onClick={() =>
                                                                handleDeleteSession(
                                                                    session._id,
                                                                    session.group || "this session",
                                                                    session.enrolled
                                                                )
                                                            }
                                                        >

                                                            {isDeleting ? (

                                                                <i className="fa-solid fa-spinner fa-spin"></i>

                                                            ) : (

                                                                <i className="fa-solid fa-trash"></i>

                                                            )}

                                                            <span>
                                                                Delete
                                                            </span>

                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        );

                                    })}

                                </div>

                            )}

                        </div>


                    </div>

                ))}

            </div>


            {/* =================================================
                CUSTOM MODAL
            ================================================= */}

            {modal.open && (

                <div
                    className="TeacherDetails-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="TeacherDetails-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div
                            className={`TeacherDetails-modal-icon ${
                                modal.type
                            }`}
                        >

                            <i
                                className={
                                    modal.type === "delete"
                                        ? "fa-solid fa-trash"
                                        : modal.type === "error"
                                            ? "fa-solid fa-circle-exclamation"
                                            : modal.type === "warning"
                                                ? "fa-solid fa-ban"
                                                : "fa-solid fa-check"
                                }
                            ></i>

                        </div>


                        <h3>
                            {modal.title}
                        </h3>


                        <p>
                            {modal.message}
                        </p>


                        <div className="TeacherDetails-modal-actions">

                            <button
                                className="TeacherDetails-modal-cancel"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>


                            {modal.action && (

                                <button
                                    className={`TeacherDetails-modal-confirm ${
                                        modal.type === "delete"
                                            ? "delete"
                                            : modal.type === "warning"
                                                ? "warning"
                                                : ""
                                    }`}
                                    onClick={handleModalConfirm}
                                >
                                    {modal.type === "delete"
                                        ? "Delete"
                                        : modal.type === "warning"
                                            ? "Deactivate"
                                            : "Confirm"
                                    }
                                </button>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default TeacherDetails;