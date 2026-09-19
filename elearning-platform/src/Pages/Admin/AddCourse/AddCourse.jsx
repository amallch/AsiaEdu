import "./AddCourse.css";

import { useState } from "react";

import { useNavigate } from "react-router-dom";


const API_URL =
    "http://localhost:5000/api/courses";


const INITIAL_FORM = {

    title: "",

    language: "",

    level: "Beginner",

    duration: "",

    startDate: "",

    price: "",

    description: "",


    learnPoints: [""],


    syllabus: [

        {

            title: "",

            summary: "",

            lessons: [""]

        }

    ]

};


function AddCourse() {

    const navigate = useNavigate();


    /* =========================================================
       FORM STATE
    ========================================================= */

    const [form, setForm] =
        useState(INITIAL_FORM);


    /* =========================================================
       SAVE STATE
    ========================================================= */

    const [isSaving, setIsSaving] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");


    /* =========================================================
       BASIC INPUT
    ========================================================= */

    const handleInputChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm({

            ...form,

            [name]: value

        });

    };


    /* =========================================================
       LEARNING POINTS
    ========================================================= */

    const handleLearnPointChange = (
        index,
        value
    ) => {

        const updatedPoints =
            [...form.learnPoints];


        updatedPoints[index] =
            value;


        setForm({

            ...form,

            learnPoints:
                updatedPoints

        });

    };


    const addLearnPoint = () => {

        setForm({

            ...form,

            learnPoints: [

                ...form.learnPoints,

                ""

            ]

        });

    };


    const removeLearnPoint = (
        index
    ) => {

        if (
            form.learnPoints.length === 1
        ) {

            return;

        }


        const updatedPoints =
            form.learnPoints.filter(
                (_, pointIndex) =>
                    pointIndex !== index
            );


        setForm({

            ...form,

            learnPoints:
                updatedPoints

        });

    };


    /* =========================================================
       SYLLABUS
    ========================================================= */

    const handleModuleChange = (
        moduleIndex,
        field,
        value
    ) => {

        const updatedModules =
            [...form.syllabus];


        updatedModules[moduleIndex] = {

            ...updatedModules[moduleIndex],

            [field]:
                value

        };


        setForm({

            ...form,

            syllabus:
                updatedModules

        });

    };


    const addModule = () => {

        setForm({

            ...form,

            syllabus: [

                ...form.syllabus,

                {

                    title: "",

                    summary: "",

                    lessons: [""]

                }

            ]

        });

    };


    const removeModule = (
        moduleIndex
    ) => {

        if (
            form.syllabus.length === 1
        ) {

            return;

        }


        const updatedModules =
            form.syllabus.filter(
                (_, index) =>
                    index !== moduleIndex
            );


        setForm({

            ...form,

            syllabus:
                updatedModules

        });

    };


    /* =========================================================
       MODULE LESSON
    ========================================================= */

    const handleModuleLessonChange = (
        moduleIndex,
        lessonIndex,
        value
    ) => {

        const updatedModules =
            [...form.syllabus];


        const updatedLessons =
            [
                ...updatedModules[
                    moduleIndex
                ].lessons
            ];


        updatedLessons[lessonIndex] =
            value;


        updatedModules[moduleIndex] = {

            ...updatedModules[moduleIndex],

            lessons:
                updatedLessons

        };


        setForm({

            ...form,

            syllabus:
                updatedModules

        });

    };


    const addModuleLesson = (
        moduleIndex
    ) => {

        const updatedModules =
            [...form.syllabus];


        updatedModules[moduleIndex] = {

            ...updatedModules[
                moduleIndex
            ],

            lessons: [

                ...updatedModules[
                    moduleIndex
                ].lessons,

                ""

            ]

        };


        setForm({

            ...form,

            syllabus:
                updatedModules

        });

    };


    const removeModuleLesson = (
        moduleIndex,
        lessonIndex
    ) => {

        const currentLessons =
            form.syllabus[
                moduleIndex
            ].lessons;


        if (
            currentLessons.length === 1
        ) {

            return;

        }


        const updatedModules =
            [...form.syllabus];


        updatedModules[moduleIndex] = {

            ...updatedModules[
                moduleIndex
            ],

            lessons:
                currentLessons.filter(
                    (_, index) =>
                        index !== lessonIndex
                )

        };


        setForm({

            ...form,

            syllabus:
                updatedModules

        });

    };


    /* =========================================================
       SAVE COURSE
    ========================================================= */

    const handleSave = async (
        event
    ) => {

        event.preventDefault();


        try {

            setIsSaving(true);

            setErrorMessage("");


            const courseData = {

                ...form,


                /* =============================================
                   NUMERIC PRICE
                ============================================= */

                price:
                    form.price === ""
                        ? 0
                        : Number(
                            form.price
                        ),


                /* =============================================
                   LEARNING POINTS
                ============================================= */

                learnPoints:
                    form.learnPoints.filter(
                        (point) =>
                            point.trim() !== ""
                    ),


                /* =============================================
                   SYLLABUS
                ============================================= */

                syllabus:
                    form.syllabus

            };


            /* =================================================
               POST COURSE
            ================================================= */

            const response =
                await fetch(
                    API_URL,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                courseData
                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to create course."
                );

            }


            /* =================================================
               SUCCESS
            ================================================= */

            navigate(
                "/admin/courses"
            );

        }

        catch (error) {

            console.error(
                "Error creating course:",
                error
            );


            setErrorMessage(
                error.message ||
                "Unable to create course."
            );

        }

        finally {

            setIsSaving(false);

        }

    };


    /* =========================================================
       PAGE
    ========================================================= */

    return (

        <div className="AddCourse">


            {/* =====================================================
               HEADER
            ===================================================== */}

            <div className="AddCourse-header">

                <div>

                    <span>
                        Course Management
                    </span>

                    <h1>
                        Add Course
                    </h1>

                    <p>
                        Create a complete language course.
                    </p>

                </div>


                <button
                    type="button"
                    className="AddCourse-back-button"
                    onClick={() =>
                        navigate(
                            "/admin/courses"
                        )
                    }
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    Back to Courses

                </button>

            </div>


            {/* =====================================================
               ERROR
            ===================================================== */}

            {errorMessage && (

                <div className="AddCourse-error">

                    <i className="fa-solid fa-circle-exclamation"></i>

                    {errorMessage}

                </div>

            )}


            <form
                className="AddCourse-form"
                onSubmit={handleSave}
            >


                {/* =================================================
                   BASIC INFORMATION
                ================================================= */}

                <section className="AddCourse-section">

                    <div className="AddCourse-section-title">

                        <div className="AddCourse-section-icon">

                            <i className="fa-solid fa-book"></i>

                        </div>

                        <div>

                            <h2>
                                Basic Information
                            </h2>

                            <p>
                                Main information displayed for the course.
                            </p>

                        </div>

                    </div>


                    <div className="AddCourse-grid">


                        {/* COURSE TITLE */}

                        <div className="AddCourse-group full">

                            <label>
                                Course Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={
                                    form.title
                                }
                                onChange={
                                    handleInputChange
                                }
                                placeholder="e.g. Chinese HSK 1"
                                required
                            />

                        </div>


                        {/* LANGUAGE */}

                        <div className="AddCourse-group">

                            <label>
                                Language
                            </label>

                            <select
                                name="language"
                                value={
                                    form.language
                                }
                                onChange={
                                    handleInputChange
                                }
                                required
                            >

                                <option value="">
                                    Select Language
                                </option>

                                <option value="Chinese">
                                    Chinese
                                </option>

                                <option value="Japanese">
                                    Japanese
                                </option>

                                <option value="Korean">
                                    Korean
                                </option>

                                <option value="Malay">
                                    Malay
                                </option>

                                <option value="Russian">
                                    Russian
                                </option>

                            </select>

                        </div>


                        {/* LEVEL */}

                        <div className="AddCourse-group">

                            <label>
                                Level
                            </label>

                            <select
                                name="level"
                                value={
                                    form.level
                                }
                                onChange={
                                    handleInputChange
                                }
                            >

                                <option value="Beginner">
                                    Beginner
                                </option>

                                <option value="Intermediate">
                                    Intermediate
                                </option>

                                <option value="Advanced">
                                    Advanced
                                </option>

                            </select>

                        </div>


                        {/* DURATION */}

                        <div className="AddCourse-group">

                            <label>
                                Duration
                            </label>

                            <input
                                type="text"
                                name="duration"
                                value={
                                    form.duration
                                }
                                onChange={
                                    handleInputChange
                                }
                                placeholder="e.g. 10 Weeks"
                                required
                            />

                        </div>


                        {/* NEXT START DATE */}

                        <div className="AddCourse-group">

                            <label>
                                Next Start Date
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={
                                    form.startDate
                                }
                                onChange={
                                    handleInputChange
                                }
                            />

                        </div>


                        {/* PRICE */}

                        <div className="AddCourse-group">

                            <label>
                                Price
                            </label>

                            <div className="AddCourse-price">

                                <input
                                    type="number"
                                    name="price"
                                    value={
                                        form.price
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="9800"
                                    min="0"
                                    required
                                />

                                <span>
                                    DA
                                </span>

                            </div>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="AddCourse-group full">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleInputChange
                                }
                                placeholder="Write a complete description of the course..."
                                rows="5"
                            ></textarea>

                        </div>

                    </div>

                </section>


                {/* =================================================
                   LEARNING POINTS
                ================================================= */}

                <section className="AddCourse-section">

                    <div className="AddCourse-section-title">

                        <div className="AddCourse-section-icon">

                            <i className="fa-solid fa-list-check"></i>

                        </div>

                        <div>

                            <h2>
                                What Students Will Learn
                            </h2>

                            <p>
                                Add the main learning outcomes of this course.
                            </p>

                        </div>

                    </div>


                    <div className="AddCourse-repeat-list">

                        {form.learnPoints.map(
                            (
                                point,
                                index
                            ) => (

                                <div
                                    className="AddCourse-repeat-row"
                                    key={index}
                                >

                                    <span>
                                        {index + 1}
                                    </span>

                                    <input
                                        type="text"
                                        value={
                                            point
                                        }
                                        onChange={
                                            (event) =>
                                                handleLearnPointChange(
                                                    index,
                                                    event.target.value
                                                )
                                        }
                                        placeholder="e.g. Master Pinyin and Mandarin pronunciation"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeLearnPoint(
                                                index
                                            )
                                        }
                                    >

                                        <i className="fa-solid fa-trash"></i>

                                    </button>

                                </div>

                            )
                        )}

                    </div>


                    <button
                        type="button"
                        className="AddCourse-secondary-button"
                        onClick={
                            addLearnPoint
                        }
                    >

                        <i className="fa-solid fa-plus"></i>

                        Add Learning Point

                    </button>

                </section>


                {/* =================================================
                   SYLLABUS
                ================================================= */}

                <section className="AddCourse-section">

                    <div className="AddCourse-section-title">

                        <div className="AddCourse-section-icon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>

                        <div>

                            <h2>
                                Syllabus
                            </h2>

                            <p>
                                Create modules and add lessons inside each module.
                            </p>

                        </div>

                    </div>


                    <div className="AddCourse-modules">

                        {form.syllabus.map(
                            (
                                module,
                                moduleIndex
                            ) => (

                                <div
                                    className="AddCourse-module"
                                    key={moduleIndex}
                                >


                                    {/* MODULE HEADER */}

                                    <div className="AddCourse-module-header">

                                        <strong>
                                            Module{" "}
                                            {moduleIndex + 1}
                                        </strong>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeModule(
                                                    moduleIndex
                                                )
                                            }
                                        >

                                            <i className="fa-solid fa-trash"></i>

                                            Remove Module

                                        </button>

                                    </div>


                                    <div className="AddCourse-grid">


                                        {/* MODULE TITLE */}

                                        <div className="AddCourse-group full">

                                            <label>
                                                Module Title
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    module.title
                                                }
                                                onChange={
                                                    (event) =>
                                                        handleModuleChange(
                                                            moduleIndex,
                                                            "title",
                                                            event.target.value
                                                        )
                                                }
                                                placeholder="Module 1: Mandarin Foundations"
                                            />

                                        </div>


                                        {/* MODULE SUMMARY */}

                                        <div className="AddCourse-group full">

                                            <label>
                                                Module Summary
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    module.summary
                                                }
                                                onChange={
                                                    (event) =>
                                                        handleModuleChange(
                                                            moduleIndex,
                                                            "summary",
                                                            event.target.value
                                                        )
                                                }
                                                placeholder="6 lessons • 2 weeks"
                                            />

                                        </div>

                                    </div>


                                    <div className="AddCourse-subtitle">

                                        Lessons

                                    </div>


                                    {/* LESSONS */}

                                    <div className="AddCourse-repeat-list">

                                        {module.lessons.map(
                                            (
                                                lesson,
                                                lessonIndex
                                            ) => (

                                                <div
                                                    className="AddCourse-repeat-row"
                                                    key={
                                                        lessonIndex
                                                    }
                                                >

                                                    <span>
                                                        {lessonIndex + 1}
                                                    </span>

                                                    <input
                                                        type="text"
                                                        value={
                                                            lesson
                                                        }
                                                        onChange={
                                                            (event) =>
                                                                handleModuleLessonChange(
                                                                    moduleIndex,
                                                                    lessonIndex,
                                                                    event.target.value
                                                                )
                                                        }
                                                        placeholder="Lesson title"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeModuleLesson(
                                                                moduleIndex,
                                                                lessonIndex
                                                            )
                                                        }
                                                    >

                                                        <i className="fa-solid fa-trash"></i>

                                                    </button>

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {/* ADD LESSON */}

                                    <button
                                        type="button"
                                        className="AddCourse-small-button"
                                        onClick={() =>
                                            addModuleLesson(
                                                moduleIndex
                                            )
                                        }
                                    >

                                        <i className="fa-solid fa-plus"></i>

                                        Add Lesson

                                    </button>

                                </div>

                            )
                        )}

                    </div>


                    {/* ADD MODULE */}

                    <button
                        type="button"
                        className="AddCourse-secondary-button"
                        onClick={
                            addModule
                        }
                    >

                        <i className="fa-solid fa-plus"></i>

                        Add Module

                    </button>

                </section>


                {/* =================================================
                   ACTIONS
                ================================================= */}

                <div className="AddCourse-actions">


                    {/* CANCEL */}

                    <button
                        type="button"
                        className="AddCourse-cancel"
                        onClick={() =>
                            navigate(
                                "/admin/courses"
                            )
                        }
                    >

                        Cancel

                    </button>


                    {/* SAVE */}

                    <button
                        type="submit"
                        className="AddCourse-save"
                        disabled={isSaving}
                    >

                        <i
                            className={
                                isSaving
                                    ? "fa-solid fa-spinner fa-spin"
                                    : "fa-solid fa-check"
                            }
                        ></i>

                        {isSaving
                            ? "Saving..."
                            : "Add Course"
                        }

                    </button>

                </div>

            </form>

        </div>

    );

}


export default AddCourse;