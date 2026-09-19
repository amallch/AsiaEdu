import "./TeacherLessons.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


/* =========================================================
   TEACHER LESSONS
========================================================= */

const TeacherLessons = () => {

    const navigate = useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [loggedInUser, setLoggedInUser] = useState(null);

    const [teacherId, setTeacherId] = useState("");
    const [teacher, setTeacher] = useState(null);

    const [courses, setCourses] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedSessionId, setSelectedSessionId] = useState("");

    const [lessons, setLessons] = useState([]);

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
                    "http://localhost:5000/api/teachers"
                );


                const data = await response.json();


                const teacherList = Array.isArray(data)
                    ? data
                    : data.teachers || [];


                const userEmail =
                    loggedInUser.email?.toLowerCase();


                const userName =
                    `${loggedInUser.firstName || ""} ${
                        loggedInUser.lastName || ""
                    }`
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
                    "http://localhost:5000/api/sessions"
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


                        return (
                            instructorId === teacherId
                        );

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
                    "http://localhost:5000/api/courses"
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
       GET TEACHER LESSONS
    ===================================================== */

    useEffect(() => {

        if (!teacherId) return;


        const fetchLessons = async () => {

            try {

                setIsLoading(true);


                const response = await fetch(
                    `http://localhost:5000/api/lessons/teacher/${teacherId}`
                );


                const data = await response.json();


                const lessonList = Array.isArray(data)
                    ? data
                    : data.lessons || [];


                lessonList.sort((a, b) => {

                    const dateA =
                        new Date(a.createdAt || 0);


                    const dateB =
                        new Date(b.createdAt || 0);


                    return dateA - dateB;

                });


                setLessons(lessonList);

            } catch (error) {

                console.error(
                    "Error fetching lessons:",
                    error
                );

            } finally {

                setIsLoading(false);

            }

        };


        fetchLessons();

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
       COURSE + SESSION LESSONS
    ===================================================== */

    const courseLessons =
        lessons.filter((lesson) => {

            const lessonCourseId =
                typeof lesson.course === "object"
                    ? lesson.course?._id
                    : lesson.course;


            const lessonSessionId =
                typeof lesson.session === "object"
                    ? lesson.session?._id
                    : lesson.session;


            return (
                lessonCourseId === selectedCourseId &&
                lessonSessionId === selectedSessionId
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
       ADD LESSON
    ===================================================== */

    const handleAddLesson = () => {

        if (
            !selectedCourse ||
            !selectedSession
        ) {

            return;
        }


        navigate(
            "/teacher-dashboard/lessons/add",
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
       VIEW LESSON
    ===================================================== */

    const handleLessonClick = (lesson) => {

        navigate(
            "/teacher-dashboard/lessons/view",
            {
                state: {
                    lesson: lesson,
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

            <div className="TeacherLessons">

                <div className="TeacherLessons-container">

                    <div className="TeacherLessons-empty">

                        <div className="TeacherLessons-emptyIcon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>


                        <h3>
                            Loading lessons...
                        </h3>


                        <p>
                            Please wait while your lessons are loading.
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

        <div className="TeacherLessons">

            <div className="TeacherLessons-container">


                {/* =====================================================
                   PAGE HEADER
                ===================================================== */}

                <div className="TeacherLessons-heading">

                    <div>

                        <h2>
                            Lessons
                        </h2>


                        <p>
                            Create and manage lessons for your courses.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="TeacherLessons-create-button"
                        onClick={handleAddLesson}
                        disabled={
                            !selectedCourse ||
                            !selectedSession
                        }
                    >

                        <i className="fa-solid fa-plus"></i>

                        Add Lesson

                    </button>

                </div>


                {/* =====================================================
                   COURSE SELECTOR
                ===================================================== */}

                <div className="TeacherLessons-courseSelector">

                    <div className="TeacherLessons-selectorHeading">

                        <div className="TeacherLessons-selectorIcon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>


                        <div>

                            <span>
                                Course
                            </span>


                            <p>
                                Select the course you want to manage lessons for.
                            </p>

                        </div>

                    </div>


                    <div className="TeacherLessons-selectWrapper">

                        <span className="TeacherLessons-courseCode">

                            <i className="fa-solid fa-book"></i>

                        </span>


                        <select
                            className="TeacherLessons-select"
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

                <div className="TeacherLessons-courseSelector">

                    <div className="TeacherLessons-selectorHeading">

                        <div className="TeacherLessons-selectorIcon">

                            <i className="fa-solid fa-users"></i>

                        </div>


                        <div>

                            <span>
                                Session
                            </span>


                            <p>
                                Select the session for these lessons.
                            </p>

                        </div>

                    </div>


                    <div className="TeacherLessons-selectWrapper">

                        <span className="TeacherLessons-courseCode">

                            <i className="fa-solid fa-users"></i>

                        </span>


                        <select
                            className="TeacherLessons-select"
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

                    <div className="TeacherLessons-selectedCourse">

                        <div className="TeacherLessons-selectedCourse-left">

                            <div className="TeacherLessons-selectedCourse-icon">

                                <i className="fa-solid fa-book"></i>

                            </div>


                            <div>

                                <h3>
                                    {selectedCourse.title}
                                </h3>


                                <p>

                                    {selectedCourse.language}

                                    {selectedCourse.level
                                        ? ` • ${selectedCourse.level}`
                                        : ""}

                                </p>

                            </div>

                        </div>


                        <div className="TeacherLessons-selectedCourse-stats">

                            <div>

                                <strong>
                                    {courseLessons.length}
                                </strong>


                                <span>
                                    Lessons
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


                            <div>

                                <strong>
                                    {selectedSession.group}
                                </strong>


                                <span>
                                    Session
                                </span>

                            </div>

                        </div>

                    </div>

                )}


                {/* =====================================================
                   LESSON LIST
                ===================================================== */}

                {selectedCourse && selectedSession ? (

                    courseLessons.length > 0 ? (

                        <div className="TeacherLessons-list">

                            {courseLessons.map(
                                (lesson, index) => (

                                    <article
                                        key={lesson._id}
                                        className="TeacherLessons-card"
                                        onClick={() =>
                                            handleLessonClick(
                                                lesson
                                            )
                                        }
                                        tabIndex="0"
                                        role="button"
                                        onKeyDown={(event) => {

                                            if (
                                                event.key === "Enter" ||
                                                event.key === " "
                                            ) {

                                                handleLessonClick(
                                                    lesson
                                                );

                                            }

                                        }}
                                    >

                                        <div className="TeacherLessons-number">

                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </div>


                                        <div className="TeacherLessons-content">

                                            <h3>
                                                {lesson.title}
                                            </h3>


                                            <p className="TeacherLessons-description">

                                                {lesson.description ||
                                                    "No description available."}

                                            </p>


                                            <div className="TeacherLessons-details">

                                                <span>

                                                    <i className="fa-solid fa-book-open"></i>

                                                    {selectedCourse.title}

                                                </span>


                                                <span>

                                                    <i className="fa-solid fa-file-lines"></i>

                                                    {lesson.content
                                                        ? "Content available"
                                                        : "No content"}

                                                </span>


                                                <span>

                                                    <i className="fa-solid fa-paperclip"></i>

                                                    {lesson.attachments?.length || 0}{" "}

                                                    {lesson.attachments?.length === 1
                                                        ? "Attachment"
                                                        : "Attachments"}

                                                </span>


                                                <span>

                                                    <i className="fa-solid fa-link"></i>

                                                    {lesson.resources?.length || 0}{" "}

                                                    {lesson.resources?.length === 1
                                                        ? "Resource"
                                                        : "Resources"}

                                                </span>

                                            </div>

                                        </div>


                                        <div className="TeacherLessons-card-arrow">

                                            <i className="fa-solid fa-arrow-right"></i>

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="TeacherLessons-empty">

                            <div className="TeacherLessons-emptyIcon">

                                <i className="fa-solid fa-book-open"></i>

                            </div>


                            <h3>
                                No lessons yet
                            </h3>


                            <p>
                                There are no lessons for this session yet.
                            </p>

                        </div>

                    )

                ) : (

                    <div className="TeacherLessons-empty">

                        <div className="TeacherLessons-emptyIcon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>


                        <h3>
                            Select a course and session
                        </h3>


                        <p>
                            Choose a course and session to view its lessons.
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

};


export default TeacherLessons;