import "./TeacherAssignments.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


/* =====================================================
   TEACHER ASSIGNMENTS
===================================================== */

function TeacherAssignments() {

    const navigate = useNavigate();

    const [loggedInUser, setLoggedInUser] = useState(null);

    const [teacherId, setTeacherId] = useState("");
    const [teacher, setTeacher] = useState(null);

    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");

    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState("");

    const [assignments, setAssignments] = useState([]);

    const [isLoading, setIsLoading] = useState(true);


    /* =====================================================
       GET LOGGED IN USER
    ===================================================== */

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {

            setIsLoading(false);

            return;
        }

        try {

            const user = JSON.parse(storedUser);

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

        if (!loggedInUser) return;


        const fetchTeacher = async () => {

            try {

                const response = await fetch(
                    "https://asiaedu-backend.onrender.com/api/teachers"
                );

                const data = await response.json();

                const teacherList = Array.isArray(data)
                    ? data
                    : data.teachers || [];


                const userEmail =
                    loggedInUser.email?.toLowerCase();


                const userName =
                    `${loggedInUser.firstName || ""} ${loggedInUser.lastName || ""}`
                        .trim()
                        .toLowerCase();


                /* =====================================================
                   FIRST TRY EMAIL
                ===================================================== */

                let foundTeacher = teacherList.find((item) => {

                    return (
                        item.email &&
                        item.email.toLowerCase() === userEmail
                    );

                });


                /* =====================================================
                   FALLBACK TO NAME
                ===================================================== */

                if (!foundTeacher && userName) {

                    foundTeacher = teacherList.find((item) => {

                        return (
                            item.name &&
                            item.name.toLowerCase() === userName
                        );

                    });

                }


                if (!foundTeacher) {

                    console.error(
                        "Teacher not found."
                    );

                    setIsLoading(false);

                    return;
                }


                setTeacher(foundTeacher);

                setTeacherId(foundTeacher._id);

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

        if (!teacherId) return;


        const fetchSessions = async () => {

            try {

                const response = await fetch(
                    "https://asiaedu-backend.onrender.com/api/sessions"
                );

                const data = await response.json();

                const sessionList = Array.isArray(data)
                    ? data
                    : data.sessions || [];


                const teacherSessions = sessionList.filter(
                    (session) => {

                        const instructorId =
                            typeof session.instructor === "object"
                                ? session.instructor?._id
                                : session.instructor;


                        return instructorId === teacherId;

                    }
                );


                setSessions(teacherSessions);

            } catch (error) {

                console.error(
                    "Error fetching sessions:",
                    error
                );

            }

        };


        fetchSessions();

    }, [teacherId]);


    /* =====================================================
       GET TEACHER COURSES
    ===================================================== */

    useEffect(() => {

        if (!teacherId) return;


        const fetchCourses = async () => {

            try {

                const response = await fetch(
                    "https://asiaedu-backend.onrender.com/api/courses"
                );

                const data = await response.json();

                const courseList = Array.isArray(data)
                    ? data
                    : data.courses || [];


                /* =====================================================
                   COURSES FROM TEACHER SESSIONS
                ===================================================== */

                const sessionCourseIds = sessions
                    .map((session) => {

                        if (!session.course) {
                            return null;
                        }


                        if (
                            typeof session.course === "object"
                        ) {

                            return session.course._id;

                        }


                        return session.course;

                    })
                    .filter(Boolean);


                const teacherCourses = courseList.filter(
                    (course) => {

                        const courseId = course._id;


                        /* =====================================================
                           COURSE CONNECTED THROUGH SESSION
                        ===================================================== */

                        if (
                            sessionCourseIds.includes(
                                courseId
                            )
                        ) {

                            return true;
                        }


                        /* =====================================================
                           COURSE CONNECTED THROUGH teacherId
                        ===================================================== */

                        if (course.teacherId) {

                            const courseTeacherId =
                                typeof course.teacherId === "object"
                                    ? course.teacherId._id
                                    : course.teacherId;


                            if (
                                courseTeacherId === teacherId
                            ) {

                                return true;
                            }

                        }


                        /* =====================================================
                           OLD DATA FALLBACK
                        ===================================================== */

                        if (course.teacher) {

                            if (
                                typeof course.teacher === "object"
                            ) {

                                if (
                                    course.teacher._id === teacherId ||
                                    course.teacher.email === teacher?.email
                                ) {

                                    return true;
                                }

                            }


                            if (
                                typeof course.teacher === "string" &&
                                teacher?.name &&
                                course.teacher.toLowerCase() ===
                                teacher.name.toLowerCase()
                            ) {

                                return true;
                            }

                        }


                        return false;

                    }
                );


                setCourses(teacherCourses);


                /* =====================================================
                   SELECT FIRST COURSE
                ===================================================== */

                if (
                    teacherCourses.length > 0 &&
                    !teacherCourses.some(
                        (course) =>
                            course._id === selectedCourseId
                    )
                ) {

                    setSelectedCourseId(
                        teacherCourses[0]._id
                    );

                }

            } catch (error) {

                console.error(
                    "Error fetching courses:",
                    error
                );

            }

        };


        fetchCourses();

    }, [
        teacherId,
        sessions,
        teacher,
        selectedCourseId
    ]);


    /* =====================================================
       GET TEACHER ASSIGNMENTS
    ===================================================== */

    useEffect(() => {

        if (!teacherId) return;


        const fetchAssignments = async () => {

            try {

                setIsLoading(true);


                const response = await fetch(
                    `https://asiaedu-backend.onrender.com/api/assignments/teacher/${teacherId}`
                );


                const data = await response.json();


                const assignmentList = Array.isArray(data)
                    ? data
                    : data.assignments || [];


                assignmentList.sort((a, b) => {

                    const dateA =
                        new Date(a.createdAt || 0);

                    const dateB =
                        new Date(b.createdAt || 0);


                    return dateA - dateB;

                });


                setAssignments(assignmentList);

            } catch (error) {

                console.error(
                    "Error fetching assignments:",
                    error
                );

            } finally {

                setIsLoading(false);
            }

        };


        fetchAssignments();

    }, [teacherId]);


    /* =====================================================
       SELECTED COURSE
    ===================================================== */

    const selectedCourse = courses.find(
        (course) =>
            course._id === selectedCourseId
    );


    /* =====================================================
       COURSE SESSIONS
    ===================================================== */

    const courseSessions = sessions.filter(
        (session) => {

            const sessionCourseId =
                typeof session.course === "object"
                    ? session.course?._id
                    : session.course;


            return (
                sessionCourseId === selectedCourseId
            );

        }
    );


    /* =====================================================
       SELECTED SESSION
    ===================================================== */

    const selectedSession = courseSessions.find(
        (session) =>
            session._id === selectedSessionId
    );


    /* =====================================================
       AUTO SELECT FIRST SESSION
    ===================================================== */

    useEffect(() => {

        if (!selectedCourseId) {

            setSelectedSessionId("");

            return;
        }


        if (courseSessions.length === 0) {

            setSelectedSessionId("");

            return;
        }


        const sessionStillExists =
            courseSessions.some(
                (session) =>
                    session._id === selectedSessionId
            );


        if (!sessionStillExists) {

            setSelectedSessionId(
                courseSessions[0]._id
            );

        }

    }, [
        selectedCourseId,
        courseSessions,
        selectedSessionId
    ]);


    /* =====================================================
       COURSE + SESSION ASSIGNMENTS
    ===================================================== */

    const courseAssignments =
        assignments.filter((assignment) => {

            const assignmentCourseId =
                typeof assignment.course === "object"
                    ? assignment.course?._id
                    : assignment.course;


            const assignmentSessionId =
                typeof assignment.session === "object"
                    ? assignment.session?._id
                    : assignment.session;


            return (
                assignmentCourseId === selectedCourseId &&
                assignmentSessionId === selectedSessionId
            );

        });


    /* =====================================================
       COURSE CHANGE
    ===================================================== */

    const handleCourseChange = (event) => {

        const courseId = event.target.value;


        setSelectedCourseId(courseId);

        setSelectedSessionId("");

    };


    /* =====================================================
       SESSION CHANGE
    ===================================================== */

    const handleSessionChange = (event) => {

        const sessionId = event.target.value;


        setSelectedSessionId(sessionId);

    };


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (date) => {

        if (!date) {
            return "No date";
        }


        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    };


    /* =====================================================
       CREATE ASSIGNMENT
    ===================================================== */

    const handleCreateAssignment = () => {

        if (
            !selectedCourse ||
            !selectedSession
        ) {

            return;
        }


        navigate(
            "/teacher-dashboard/assignments/add",
            {
                state: {
                    course: selectedCourse,
                    session: selectedSession,
                    teacher: teacher
                }
            }
        );

    };


    /* =====================================================
       VIEW ASSIGNMENT
    ===================================================== */

    const handleViewAssignment = (assignment) => {

        navigate(
            "/teacher-dashboard/assignments/view",
            {
                state: {
                    assignment: assignment,
                    course: selectedCourse,
                    session: selectedSession,
                    teacher: teacher
                }
            }
        );

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading && !teacher) {

        return (

            <div className="TeacherAssignments">

                <div className="TeacherAssignments-container">

                    <div className="TeacherAssignments-empty">

                        <div className="TeacherAssignments-emptyIcon">

                            <i className="fa-solid fa-clipboard-list"></i>

                        </div>

                        <h3>
                            Loading assignments...
                        </h3>

                        <p>
                            Please wait while your assignments are loading.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="TeacherAssignments">

            <div className="TeacherAssignments-container">


                {/* =====================================================
                   PAGE HEADER
                ===================================================== */}

                <div className="TeacherAssignments-heading">

                    <div>

                        <h2>
                            Assignments
                        </h2>

                        <p>
                            Create and manage assignments for your courses.
                        </p>

                    </div>


                    <button
                        className="TeacherAssignments-create-button"
                        onClick={handleCreateAssignment}
                        disabled={
                            !selectedCourse ||
                            !selectedSession
                        }
                    >

                        <i className="fa-solid fa-plus"></i>

                        Add Assignment

                    </button>

                </div>


                {/* =====================================================
                   COURSE SELECTOR
                ===================================================== */}

                <div className="TeacherAssignments-courseSelector">

                    <div className="TeacherAssignments-selectorHeading">

                        <div className="TeacherAssignments-selectorIcon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>


                        <div>

                            <span>
                                Course
                            </span>

                            <p>
                                Select the course you want to manage assignments for.
                            </p>

                        </div>

                    </div>


                    <div className="TeacherAssignments-selectWrapper">

                        <div className="TeacherAssignments-courseCode">

                            <i className="fa-solid fa-book"></i>

                        </div>


                        <select
                            className="TeacherAssignments-select"
                            value={selectedCourseId}
                            onChange={handleCourseChange}
                        >

                            <option value="">
                                Select a course
                            </option>


                            {courses.map((course) => (

                                <option
                                    key={course._id}
                                    value={course._id}
                                >
                                    {course.title}
                                </option>

                            ))}

                        </select>


                        <i className="fa-solid fa-chevron-down"></i>

                    </div>

                </div>


                {/* =====================================================
                   SESSION SELECTOR
                ===================================================== */}

                <div className="TeacherAssignments-courseSelector">

                    <div className="TeacherAssignments-selectorHeading">

                        <div className="TeacherAssignments-selectorIcon">

                            <i className="fa-solid fa-users"></i>

                        </div>


                        <div>

                            <span>
                                Session
                            </span>

                            <p>
                                Select the session for these assignments.
                            </p>

                        </div>

                    </div>


                    <div className="TeacherAssignments-selectWrapper">

                        <div className="TeacherAssignments-courseCode">

                            <i className="fa-solid fa-users"></i>

                        </div>


                        <select
                            className="TeacherAssignments-select"
                            value={selectedSessionId}
                            onChange={handleSessionChange}
                            disabled={!selectedCourseId}
                        >

                            <option value="">
                                Select a session
                            </option>


                            {courseSessions.map((session) => (

                                <option
                                    key={session._id}
                                    value={session._id}
                                >

                                    {session.group} •{" "}
                                    {session.startDate} •{" "}
                                    {session.programType}

                                </option>

                            ))}

                        </select>


                        <i className="fa-solid fa-chevron-down"></i>

                    </div>

                </div>


                {/* =====================================================
                   SELECTED COURSE
                ===================================================== */}

                {selectedCourse && selectedSession && (

                    <div className="TeacherAssignments-selectedCourse">

                        <div className="TeacherAssignments-selectedCourse-left">

                            <div className="TeacherAssignments-selectedCourse-icon">

                                {selectedCourse.language
                                    ? selectedCourse.language
                                        .substring(0, 2)
                                        .toUpperCase()
                                    : "AS"}

                            </div>


                            <div>

                                <h3>
                                    {selectedCourse.title}
                                </h3>

                                <p>
                                    {selectedCourse.language} •{" "}
                                    {selectedCourse.level}
                                </p>

                            </div>

                        </div>


                        <div className="TeacherAssignments-selectedCourse-stats">

                            <div>

                                <strong>
                                    {courseAssignments.length}
                                </strong>

                                <span>
                                    Assignments
                                </span>

                            </div>


                            <div>

                                <strong>
                                    {selectedCourse.students || 0}
                                </strong>

                                <span>
                                    Students
                                </span>

                            </div>


                            <div>

                                <strong>
                                    {selectedCourse.level || "-"}
                                </strong>

                                <span>
                                    Level
                                </span>

                            </div>

                        </div>

                    </div>

                )}


                {/* =====================================================
                   ASSIGNMENT LIST
                ===================================================== */}

                {selectedCourse && selectedSession ? (

                    courseAssignments.length > 0 ? (

                        <div className="TeacherAssignments-list">

                            {courseAssignments.map(
                                (assignment, index) => (

                                    <div
                                        className="TeacherAssignments-card"
                                        key={assignment._id}
                                        onClick={() =>
                                            handleViewAssignment(
                                                assignment
                                            )
                                        }
                                    >

                                        <div className="TeacherAssignments-number">

                                            {String(index + 1).padStart(
                                                2,
                                                "0"
                                            )}

                                        </div>


                                        <div className="TeacherAssignments-content">

                                            <h3>
                                                {assignment.title}
                                            </h3>


                                            <p className="TeacherAssignments-description">

                                                {assignment.description}

                                            </p>


                                            <div className="TeacherAssignments-details">

                                                <span>

                                                    <i className="fa-regular fa-calendar"></i>

                                                    Due:{" "}
                                                    {formatDate(
                                                        assignment.dueDate
                                                    )}

                                                </span>


                                                <span>

                                                    <i className="fa-solid fa-star"></i>

                                                    Max Score:{" "}
                                                    {assignment.maxScore}

                                                </span>


                                                {/* RESOURCE COUNT */}

                                                <span>

                                                    <i className="fa-solid fa-paperclip"></i>

                                                    {assignment.resources?.length || 0}{" "}

                                                    {assignment.resources?.length === 1
                                                        ? "Resource"
                                                        : "Resources"}

                                                </span>


                                                {/* ATTACHMENT COUNT */}

                                                <span>

                                                    <i className="fa-solid fa-paperclip"></i>

                                                    {assignment.attachments?.length || 0}{" "}

                                                    {assignment.attachments?.length === 1
                                                        ? "Attachment"
                                                        : "Attachments"}

                                                </span>

                                            </div>

                                        </div>


                                        {/* ACTION ARROW */}

                                        <div className="TeacherAssignments-card-arrow">

                                            <i className="fa-solid fa-arrow-right"></i>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="TeacherAssignments-empty">

                            <div className="TeacherAssignments-emptyIcon">

                                <i className="fa-solid fa-clipboard-list"></i>

                            </div>


                            <h3>
                                No assignments yet
                            </h3>


                            <p>
                                There are no assignments for this session yet.
                            </p>

                        </div>

                    )

                ) : (

                    <div className="TeacherAssignments-empty">

                        <div className="TeacherAssignments-emptyIcon">

                            <i className="fa-solid fa-clipboard-list"></i>

                        </div>


                        <h3>
                            Select a course and session
                        </h3>


                        <p>
                            Choose a course and session to view its assignments.
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}

export default TeacherAssignments;