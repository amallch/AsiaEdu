import "./ViewCourse.css";

import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";


const API_URL =
    "http://localhost:5000/api/courses";


const COURSE_ICONS = {

    Chinese: "中",

    Japanese: "あ",

    Korean: "한",

    Russian: "Я",

    Malay: "A"

};


function ViewCourse() {

    const navigate = useNavigate();

    const params = useParams();

    const courseId =
        params.id || params.courseId;


    /* =====================================================
       STATE
    ===================================================== */

    const [course, setCourse] =
        useState(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");


    /* =====================================================
       FETCH COURSE DETAILS
    ===================================================== */

    const fetchCourseDetails = async () => {

        try {

            setIsLoading(true);

            setErrorMessage("");


            const response =
                await fetch(
                    `${API_URL}/${courseId}`
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to fetch course details."
                );

            }


            if (data.course) {

                setCourse(data.course);

            } else {

                setCourse(data);

            }

        }

        catch (error) {

            console.error(
                "Error fetching course details:",
                error
            );


            setErrorMessage(
                error.message ||
                "Unable to load course details."
            );

        }

        finally {

            setIsLoading(false);

        }

    };


    useEffect(() => {

        if (courseId) {

            fetchCourseDetails();

        }

    }, [courseId]);


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (date) => {

        if (!date) {

            return "Not specified";

        }


        const parts =
            String(date).split("-");


        if (parts.length !== 3) {

            return date;

        }


        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]);

        const day =
            Number(parts[2]);


        const monthNames = [

            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"

        ];


        if (
            Number.isNaN(year) ||
            Number.isNaN(month) ||
            Number.isNaN(day) ||
            !monthNames[month - 1]
        ) {

            return date;

        }


        return (
            `${monthNames[month - 1]} ` +
            `${day}, ` +
            `${year}`
        );

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <div className="ViewCourse-loading">

                <i className="fa-solid fa-spinner fa-spin"></i>

                <span>
                    Loading course details...
                </span>

            </div>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (errorMessage) {

        return (

            <div className="ViewCourse-error-page">

                <i className="fa-solid fa-circle-exclamation"></i>

                <h2>
                    Unable to load course
                </h2>

                <p>
                    {errorMessage}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/courses")
                    }
                >

                    Back to Courses

                </button>

            </div>

        );

    }


    /* =====================================================
       NO COURSE
    ===================================================== */

    if (!course) {

        return (

            <div className="ViewCourse-error-page">

                <i className="fa-solid fa-book-open"></i>

                <h2>
                    Course not found
                </h2>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/courses")
                    }
                >

                    Back to Courses

                </button>

            </div>

        );

    }


    /* =====================================================
       COURSE ICON
    ===================================================== */

    const courseIcon =
        COURSE_ICONS[course.language] || "A";


    /* =====================================================
       COURSE PAGE
    ===================================================== */

    return (

        <div className="ViewCourse">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="ViewCourse-header">

                <div>

                    <span>
                        Management / Courses
                    </span>

                    <h1>
                        Course Details
                    </h1>

                    <p>
                        View course information and course details.
                    </p>

                </div>


                <div className="ViewCourse-header-actions">

                    <button
                        type="button"
                        className="ViewCourse-back-button"
                        onClick={() =>
                            navigate("/admin/courses")
                        }
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        <span>
                            Back
                        </span>

                    </button>


                    <button
                        type="button"
                        className="ViewCourse-edit-button"
                        onClick={() =>
                            navigate(
                                `/admin/courses/edit/${course.id || course._id}`
                            )
                        }
                    >

                        <i className="fa-solid fa-pen"></i>

                        <span>
                            Edit Course
                        </span>

                    </button>

                </div>

            </div>


            {/* =================================================
                COURSE OVERVIEW
            ================================================= */}

            <div className="ViewCourse-overview">


                {/* COURSE ICON */}

                <div className="ViewCourse-overview-icon">

                    <span>
                        {courseIcon}
                    </span>

                </div>


                {/* MAIN COURSE INFO */}

                <div className="ViewCourse-overview-main">

                    <span className="ViewCourse-language">

                        {course.language ||
                            "Language"}

                    </span>


                    <h2>

                        {course.title ||
                            "Untitled Course"}

                    </h2>


                    <p>

                        {course.level ||
                            "Beginner"}

                    </p>

                </div>


                {/* PRICE */}

                <div className="ViewCourse-price">

                    <span>
                        Course Price
                    </span>

                    <strong>

                        {course.price !== undefined
                            ? `${course.price} DA`
                            : "-"}

                    </strong>

                </div>

            </div>


            {/* =================================================
                SECTIONS
            ================================================= */}

            <div className="ViewCourse-sections">


                {/* =================================================
                    COURSE INFORMATION
                ================================================= */}

                <div className="ViewCourse-section">

                    <div className="ViewCourse-section-title">

                        <div className="ViewCourse-section-icon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>

                        <div>

                            <h2>
                                Course Information
                            </h2>

                            <p>
                                Main information about this course.
                            </p>

                        </div>

                    </div>


                    <div className="ViewCourse-info-grid">


                        {/* LANGUAGE */}

                        <div className="ViewCourse-info-item">

                            <span>
                                Language
                            </span>

                            <strong>
                                {course.language || "-"}
                            </strong>

                        </div>


                        {/* LEVEL */}

                        <div className="ViewCourse-info-item">

                            <span>
                                Level
                            </span>

                            <strong>
                                {course.level || "-"}
                            </strong>

                        </div>


                        {/* DURATION */}

                        <div className="ViewCourse-info-item">

                            <span>
                                Duration
                            </span>

                            <strong>
                                {course.duration || "-"}
                            </strong>

                        </div>


                        {/* START DATE */}

                        <div className="ViewCourse-info-item">

                            <span>
                                Next Start Date
                            </span>

                            <strong>
                                {formatDate(
                                    course.startDate
                                )}
                            </strong>

                        </div>


                        {/* PRICE */}

                        <div className="ViewCourse-info-item">

                            <span>
                                Course Price
                            </span>

                            <strong>
                                {course.price !== undefined
                                    ? `${course.price} DA`
                                    : "-"}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div className="ViewCourse-section">

                    <div className="ViewCourse-section-title">

                        <div className="ViewCourse-section-icon">

                            <i className="fa-solid fa-align-left"></i>

                        </div>

                        <div>

                            <h2>
                                Course Description
                            </h2>

                            <p>
                                Description provided for this course.
                            </p>

                        </div>

                    </div>


                    <div className="ViewCourse-description">

                        <p>

                            {course.description ||
                                `Learn ${course.language || "this language"} step by step with our structured course.`}

                        </p>

                    </div>

                </div>


                {/* =================================================
                    LEARNING POINTS
                ================================================= */}

                <div className="ViewCourse-section">

                    <div className="ViewCourse-section-title">

                        <div className="ViewCourse-section-icon">

                            <i className="fa-solid fa-list-check"></i>

                        </div>

                        <div>

                            <h2>
                                What Students Will Learn
                            </h2>

                            <p>
                                Main learning outcomes of this course.
                            </p>

                        </div>

                    </div>


                    {Array.isArray(course.learnPoints) &&
                    course.learnPoints.length > 0 ? (

                        <div className="ViewCourse-learning-points">

                            {course.learnPoints.map(
                                (point, index) => (

                                    <div
                                        className="ViewCourse-learning-point"
                                        key={`${point}-${index}`}
                                    >

                                        <div>

                                            <i className="fa-solid fa-check"></i>

                                        </div>

                                        <span>
                                            {point}
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="ViewCourse-empty">

                            <i className="fa-solid fa-list"></i>

                            <p>
                                No learning points added yet.
                            </p>

                        </div>

                    )}

                </div>


                {/* =================================================
                    SYLLABUS
                ================================================= */}

                <div className="ViewCourse-section">

                    <div className="ViewCourse-section-title">

                        <div className="ViewCourse-section-icon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>

                        <div>

                            <h2>
                                Syllabus
                            </h2>

                            <p>
                                Modules and lessons included in this course.
                            </p>

                        </div>

                    </div>


                    {Array.isArray(course.syllabus) &&
                    course.syllabus.length > 0 ? (

                        <div className="ViewCourse-syllabus">

                            {course.syllabus.map(
                                (
                                    module,
                                    moduleIndex
                                ) => (

                                    <div
                                        className="ViewCourse-module"
                                        key={
                                            module._id ||
                                            `module-${moduleIndex}`
                                        }
                                    >


                                        {/* MODULE HEADER */}

                                        <div className="ViewCourse-module-header">

                                            <div className="ViewCourse-module-number">

                                                {moduleIndex + 1}

                                            </div>


                                            <div>

                                                <h3>

                                                    {module.title ||
                                                        `Module ${moduleIndex + 1}`}

                                                </h3>

                                                <p>

                                                    {module.summary ||
                                                        "No module summary available."}

                                                </p>

                                            </div>

                                        </div>


                                        {/* LESSONS */}

                                        {Array.isArray(
                                            module.lessons
                                        ) &&
                                        module.lessons.length > 0 ? (

                                            <div className="ViewCourse-lessons">

                                                {module.lessons.map(
                                                    (
                                                        lesson,
                                                        lessonIndex
                                                    ) => (

                                                        <div
                                                            className="ViewCourse-lesson"
                                                            key={
                                                                `${moduleIndex}-${lessonIndex}-${lesson}`
                                                            }
                                                        >

                                                            <span>
                                                                {lessonIndex + 1}
                                                            </span>

                                                            <p>
                                                                {lesson}
                                                            </p>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        ) : (

                                            <div className="ViewCourse-module-empty">

                                                No lessons added to this module.

                                            </div>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="ViewCourse-empty">

                            <i className="fa-solid fa-book-open"></i>

                            <p>
                                No syllabus added yet.
                            </p>

                        </div>

                    )}

                </div>


            </div>

        </div>

    );

}


export default ViewCourse;