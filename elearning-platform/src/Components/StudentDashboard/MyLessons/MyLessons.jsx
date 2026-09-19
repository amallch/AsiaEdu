import "./MyLessons.css";

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
        "CN"
    );

}


/* =====================================================
   COMPONENT
===================================================== */

function MyLessons() {

    const navigate = useNavigate();


    /* =====================================================
       LESSONS
    ===================================================== */

    const [lessons, setLessons] =
        useState([]);


    /* =====================================================
       ENROLLED COURSES
    ===================================================== */

    const [courses, setCourses] =
        useState([]);


    const [selectedCourseId, setSelectedCourseId] =
        useState("");


    /* =====================================================
       STUDENT ID
    ===================================================== */

    const [studentId, setStudentId] =
        useState("");


    /* =====================================================
       LOADING / ERROR
    ===================================================== */

    const [isLoading, setIsLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    /* =====================================================
       GET SESSION NAME
    ===================================================== */

    function getSessionName(session) {

        if (!session) {

            return "";

        }


        if (
            typeof session ===
            "string"
        ) {

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


        if (course.courseId) {

            if (
                typeof course.courseId ===
                "object"
            ) {

                return (
                    course.courseId._id ||
                    ""
                );

            }


            return course.courseId;

        }


        if (course._id) {

            return course._id;

        }


        return "";

    }


    /* =====================================================
       GET STUDENT LESSONS + COURSES
    ===================================================== */

    useEffect(() => {

        async function fetchStudentLessons() {

            try {

                setIsLoading(true);

                setError("");


                /* =================================================
                   GET LOGGED-IN USER
                ================================================= */

                const savedUser =
                    localStorage.getItem("user");


                if (!savedUser) {

                    throw new Error(
                        "You are not logged in."
                    );

                }


                const loggedInUser =
                    JSON.parse(savedUser);


                if (!loggedInUser.id) {

                    throw new Error(
                        "Logged-in user information is missing."
                    );

                }


                /* =================================================
                   GET STUDENT USING USER ID
                ================================================= */

                const studentResponse =
                    await fetch(
                        `http://localhost:5000/api/students/user/${loggedInUser.id}`
                    );


                const studentData =
                    await studentResponse.json();


                if (!studentResponse.ok) {

                    throw new Error(
                        studentData.message ||
                        "Failed to get student information"
                    );

                }


                const currentStudent =
                    studentData.student ||
                    studentData;


                const currentStudentId =
                    currentStudent._id;


                if (!currentStudentId) {

                    throw new Error(
                        "Student information is missing."
                    );

                }


                /* =================================================
                   SAVE STUDENT ID
                ================================================= */

                setStudentId(
                    currentStudentId
                );


                /* =================================================
                   GET ALL ENROLLED COURSES

                   Courses come directly from student.courses.

                   This means courses will appear even when
                   they have no lessons yet.
                ================================================= */

                const studentCourses =
                    Array.isArray(
                        currentStudent.courses
                    )
                        ? currentStudent.courses
                        : [];


                const formattedCourses =
                    [];


                studentCourses.forEach(
                    (course) => {

                        const courseId =
                            getCourseId(
                                course
                            );


                        if (!courseId) {

                            return;

                        }


                        const alreadyListed =
                            formattedCourses.some(
                                (item) => {

                                    return (
                                        String(item.id) ===
                                        String(courseId)
                                    );

                                }
                            );


                        if (alreadyListed) {

                            return;

                        }


                        const courseLanguage =
                            course.language ||
                            (
                                course.courseId &&
                                typeof course.courseId ===
                                "object"
                                    ? course.courseId.language
                                    : ""
                            ) ||
                            "";


                        const courseName =
                            course.name ||
                            (
                                course.courseId &&
                                typeof course.courseId ===
                                "object"
                                    ? (
                                        course.courseId.title ||
                                        course.courseId.name
                                    )
                                    : ""
                            ) ||
                            "Language Course";


                        const courseSession =
                            getSessionName(
                                course.session
                            );


                        formattedCourses.push({

                            id:
                                courseId,

                            name:
                                courseName,

                            session:
                                courseSession,

                            instructor:
                                course.teacher ||
                                "Teacher",

                            code:
                                getCourseCode(
                                    courseLanguage
                                )

                        });

                    }
                );


                setCourses(
                    formattedCourses
                );


                /* =================================================
                   SELECT FIRST COURSE

                   This happens even if there are
                   no lessons.
                ================================================= */

                if (
                    formattedCourses.length > 0
                ) {

                    setSelectedCourseId(
                        formattedCourses[0].id
                    );

                }


                /* =================================================
                   GET LESSONS USING STUDENT ID

                   This is separate from getting courses.

                   Therefore, an empty lessons array does
                   NOT prevent the course selector from showing.
                ================================================= */

                const response =
                    await fetch(
                        `http://localhost:5000/api/lessons/student/${currentStudentId}`
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to get student lessons"
                    );

                }


                /* =================================================
                   FORMAT LESSONS
                ================================================= */

                const formattedLessons =
                    (data.lessons || []).map(
                        (lesson) => {

                            return {

                                ...lesson,

                                status:
                                    lesson.status ||
                                    "Not Started"

                            };

                        }
                    );


                /* =================================================
                   SORT LESSONS

                   Oldest lesson first.
                ================================================= */

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


            } catch (fetchError) {

                console.error(
                    "Get student lessons error:",
                    fetchError
                );


                setError(
                    fetchError.message ||
                    "Failed to load your lessons. Please try again."
                );


            } finally {

                setIsLoading(false);

            }

        }


        fetchStudentLessons();

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
                        String(course.id) ===
                        String(selectedCourseId)
                    );

                }
            );

    }


    /* =====================================================
       COURSE LESSONS

       Filter lessons using the selected course ID.

       The course selector is independent from lessons,
       so this can safely return an empty array.
    ===================================================== */

    const courseLessons =
        lessons
            .filter(
                (lesson) => {

                    if (!lesson.course) {

                        return false;

                    }


                    let lessonCourseId = "";


                    if (
                        typeof lesson.course ===
                        "object"
                    ) {

                        lessonCourseId =
                            lesson.course._id ||
                            lesson.course.courseId ||
                            "";

                    } else {

                        lessonCourseId =
                            lesson.course;

                    }


                    return (
                        String(lessonCourseId) ===
                        String(selectedCourseId)
                    );

                }
            )
            .sort(
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


    /* =====================================================
       STARTED LESSONS
    ===================================================== */

    const startedLessons =
        courseLessons.filter(
            (lesson) => {

                return (
                    lesson.status ===
                    "Started"
                );

            }
        ).length;


    /* =====================================================
       NOT STARTED LESSONS
    ===================================================== */

    const notStartedLessons =
        courseLessons.filter(
            (lesson) => {

                return (
                    lesson.status ===
                    "Not Started"
                );

            }
        ).length;


    /* =====================================================
       COURSE CHANGE
    ===================================================== */

    function handleCourseChange(event) {

        setSelectedCourseId(
            event.target.value
        );

    }


    /* =====================================================
       OPEN LESSON
    ===================================================== */

    async function handleLessonClick(lesson) {

        try {

            /* =================================================
               START LESSON IF NOT STARTED
            ================================================= */

            if (
                lesson.status ===
                "Not Started"
            ) {

                if (!studentId) {

                    console.error(
                        "Student ID is missing."
                    );

                    return;

                }


                /* =================================================
                   SAVE PROGRESS TO BACKEND
                ================================================= */

                const response =
                    await fetch(
                        `http://localhost:5000/api/lessons/progress/${studentId}/${lesson._id}`,
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to start lesson"
                    );

                }


                /* =================================================
                   UPDATE LOCAL LESSON STATUS
                ================================================= */

                const updatedLessons =
                    lessons.map(
                        (item) => {

                            if (
                                item._id ===
                                lesson._id
                            ) {

                                return {

                                    ...item,

                                    status:
                                        "Started"

                                };

                            }


                            return item;

                        }
                    );


                setLessons(
                    updatedLessons
                );


                /* =================================================
                   GET UPDATED LESSON
                ================================================= */

                const updatedLesson =
                    updatedLessons.find(
                        (item) => {

                            return (
                                item._id ===
                                lesson._id
                            );

                        }
                    );


                /* =================================================
                   OPEN VIEW MY LESSON
                ================================================= */

                navigate(
                    "/student-dashboard/lessons/view",
                    {
                        state: {
                            lesson:
                                updatedLesson
                        }
                    }
                );


                return;

            }


            /* =================================================
               OPEN ALREADY STARTED LESSON
            ================================================= */

            navigate(
                "/student-dashboard/lessons/view",
                {
                    state: {
                        lesson:
                            lesson
                    }
                }
            );


        } catch (error) {

            console.error(
                "Start lesson error:",
                error
            );


            setError(
                error.message ||
                "Failed to start lesson."
            );

        }

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
                            Loading your lessons...
                        </h3>


                        <p>
                            Please wait while we load your lessons.
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
       PAGE
       
       IMPORTANT:
       There is NO early return when lessons.length === 0.

       The course selector must remain visible even when
       there are no lessons.
    ===================================================== */

    return (

        <section className="MyLessons">

            <div className="MyLessons-container">


                {/* =============================================
                    PAGE HEADER
                ============================================= */}

                <div className="Lessons-header">

                    <div>

                        <h1>
                            My Lessons
                        </h1>


                        <p>
                            Continue your lessons and keep improving your language skills.
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
                                Choose a course and session to view its lessons
                            </p>

                        </div>

                    </div>


                    <div className="MyLessons-selectWrapper">

                        <div className="MyLessons-courseCode">

                            {selectedCourse
                                ? selectedCourse.code
                                : "--"}

                        </div>


                        <select
                            value={
                                selectedCourseId
                            }
                            onChange={
                                handleCourseChange
                            }
                            className="MyLessons-select"
                            aria-label="Select course"
                        >

                            {courses.length === 0 && (

                                <option value="">

                                    No enrolled courses

                                </option>

                            )}


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

                                        {course.session && (
                                            <>
                                                {" • "}
                                                {course.session}
                                            </>
                                        )}

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

                {selectedCourse && (

                    <div className="MyLessons-selectedCourse">


                        {/* =========================================
                            COURSE INFORMATION
                        ========================================= */}

                        <div className="MyLessons-selectedCourse-left">

                            <div className="MyLessons-selectedCourse-icon">

                                {selectedCourse.code}

                            </div>


                            <div>

                                <h3>

                                    {selectedCourse.name}

                                </h3>


                                <p>

                                    {selectedCourse.instructor}

                                    {selectedCourse.session && (
                                        <>
                                            {" • "}
                                            {selectedCourse.session}
                                        </>
                                    )}

                                </p>

                            </div>

                        </div>


                        {/* =========================================
                            COURSE STATS
                        ========================================= */}

                        <div className="MyLessons-selectedCourse-stats">

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

                                    {startedLessons}

                                </strong>


                                <span>
                                    Started
                                </span>

                            </div>


                            <div>

                                <strong>

                                    {notStartedLessons}

                                </strong>


                                <span>
                                    Not Started
                                </span>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    LESSON LIST
                ================================================= */}

                <div className="MyLessons-list">

                    {courseLessons.map(
                        (lesson, index) => (

                            <div
                                className="MyLessons-card"
                                key={
                                    lesson._id
                                }
                                onClick={
                                    () =>
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


                                {/* =================================
                                    LESSON NUMBER
                                ================================= */}

                                <div className="MyLessons-number">

                                    {String(
                                        index + 1
                                    ).padStart(
                                        2,
                                        "0"
                                    )}

                                </div>


                                {/* =================================
                                    CONTENT
                                ================================= */}

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


                                    {/* =============================
                                        DETAILS
                                    ============================= */}

                                    <div className="MyLessons-details">

                                        <span>

                                            <i className="fa-solid fa-book-open"></i>

                                            Lesson

                                        </span>


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


                                {/* =================================
                                    RIGHT SIDE
                                ================================= */}

                                <div className="MyLessons-card-actions">


                                    {/* STATUS */}

                                    <span
                                        className={
                                            `MyLessons-status ${
                                                lesson.status
                                                    .toLowerCase()
                                                    .replace(
                                                        " ",
                                                        "-"
                                                    )
                                            }`
                                        }
                                    >

                                        {lesson.status}

                                    </span>


                                    {/* BUTTON */}

                                    <button
                                        type="button"
                                        className="MyLessons-button"
                                        onClick={
                                            (event) => {

                                                event.stopPropagation();


                                                handleLessonClick(
                                                    lesson
                                                );

                                            }
                                        }
                                    >

                                        <span>

                                            {lesson.status ===
                                            "Started"

                                                ? "Review Lesson"

                                                : "Start Lesson"}

                                        </span>


                                        <i className="fa-solid fa-arrow-right"></i>

                                    </button>

                                </div>

                            </div>
                        )
                    )}


                    {/* =============================================
                        EMPTY COURSE
                    ============================================= */}

                    {selectedCourse &&
                    courseLessons.length === 0 && (

                        <div className="MyLessons-empty">

                            <div className="MyLessons-emptyIcon">

                                <i className="fa-regular fa-file-lines"></i>

                            </div>


                            <h3>
                                No lessons yet
                            </h3>


                            <p>
                                Your teacher has not added any lessons to this course yet.
                            </p>

                        </div>

                    )}


                    {/* =============================================
                        NO COURSES
                    ============================================= */}

                    {courses.length === 0 && (

                        <div className="MyLessons-empty">

                            <div className="MyLessons-emptyIcon">

                                <i className="fa-regular fa-bookmark"></i>

                            </div>


                            <h3>
                                No courses available
                            </h3>


                            <p>
                                You are not enrolled in any courses yet.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </section>

    );

}


export default MyLessons;