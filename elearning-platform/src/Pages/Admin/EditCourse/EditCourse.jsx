import "./EditCourse.css";

import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";


const API_URL =
    "https://asiaedu-backend.onrender.com/api/courses";


const EMPTY_FORM = {

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


function EditCourse() {

    const navigate = useNavigate();

    const { id } = useParams();


    /* =========================================================
       COURSE STATE
    ========================================================= */

    const [form, setForm] =
        useState(EMPTY_FORM);


    /* =========================================================
       GENERAL STATE
    ========================================================= */

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");


    /* =========================================================
       FETCH COURSE
    ========================================================= */

    const fetchCourse = async () => {

        try {

            setIsLoading(true);

            setErrorMessage("");


            const response =
                await fetch(
                    `${API_URL}/${id}`
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load course."
                );

            }


            /* =================================================
               SET COURSE FORM
            ================================================= */

            setForm({

                title:
                    data.title || "",

                language:
                    data.language || "",

                level:
                    data.level || "Beginner",

                duration:
                    data.duration || "",

                startDate:
                    data.startDate || "",

                price:
                    data.price !== undefined
                        ? String(data.price)
                            .replace(" DA", "")
                            .replace(",", "")
                        : "",

                description:
                    data.description || "",


                /* =================================================
                   LEARNING POINTS
                ================================================= */

                learnPoints:
                    data.learnPoints?.length
                        ? data.learnPoints
                        : [""],


                /* =================================================
                   SYLLABUS
                ================================================= */

                syllabus:
                    data.syllabus?.length
                        ? data.syllabus.map(
                            (module) => ({

                                title:
                                    module.title ||
                                    "",

                                summary:
                                    module.summary ||
                                    "",

                                lessons:
                                    module.lessons?.length
                                        ? module.lessons
                                        : [""]

                            })
                        )

                        : [

                            {
                                title: "",
                                summary: "",
                                lessons: [""]
                            }

                        ]

            });

        }

        catch (error) {

            console.error(
                "Error loading course:",
                error
            );


            setErrorMessage(
                error.message ||
                "Unable to load course."
            );

        }

        finally {

            setIsLoading(false);

        }

    };


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    useEffect(() => {

        fetchCourse();

    }, [id]);


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
       LEARN POINTS
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


        setForm({

            ...form,

            learnPoints:
                form.learnPoints.filter(
                    (_, pointIndex) =>
                        pointIndex !== index
                )

        });

    };


    /* =========================================================
       MODULE
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


        setForm({

            ...form,

            syllabus:
                form.syllabus.filter(
                    (_, index) =>
                        index !== moduleIndex
                )

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

            ...updatedModules[moduleIndex],

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

        const lessons =
            form.syllabus[
                moduleIndex
            ].lessons;


        if (
            lessons.length === 1
        ) {

            return;

        }


        const updatedModules =
            [...form.syllabus];


        updatedModules[moduleIndex] = {

            ...updatedModules[moduleIndex],

            lessons:
                lessons.filter(
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


                price:
                    form.price === ""
                        ? 0
                        : Number(form.price),


                learnPoints:
                    form.learnPoints.filter(
                        (point) =>
                            point.trim() !== ""
                    )

            };


            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {

                        method: "PUT",

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
                    "Failed to update course."
                );

            }


            navigate(
                "/admin/courses"
            );

        }

        catch (error) {

            console.error(
                "Error updating course:",
                error
            );


            setErrorMessage(
                error.message ||
                "Unable to update course."
            );

        }

        finally {

            setIsSaving(false);

        }

    };


    /* =========================================================
       LOADING
    ========================================================= */

    if (isLoading) {

        return (

            <div className="EditCourse-loading">

                <i className="fa-solid fa-spinner fa-spin"></i>

                <span>
                    Loading course...
                </span>

            </div>

        );

    }


    /* =========================================================
       ERROR PAGE
    ========================================================= */

    if (
        errorMessage &&
        !form.title
    ) {

        return (

            <div className="EditCourse">

                <div className="EditCourse-error-page">

                    <i className="fa-solid fa-circle-exclamation"></i>

                    <p>
                        {errorMessage}
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/courses"
                            )
                        }
                    >

                        Back to Courses

                    </button>

                </div>

            </div>

        );

    }


    /* =========================================================
       PAGE
    ========================================================= */

    return (

        <div className="EditCourse">


            {/* =================================================
               HEADER
            ================================================= */}

            <div className="EditCourse-header">

                <div>

                    <span>
                        Course Management
                    </span>

                    <h1>
                        Edit Course
                    </h1>

                    <p>
                        Update all information for this course.
                    </p>

                </div>


                <button
                    type="button"
                    className="EditCourse-back-button"
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


            {errorMessage && (

                <div className="EditCourse-error">

                    <i className="fa-solid fa-circle-exclamation"></i>

                    {errorMessage}

                </div>

            )}


            <form
                className="EditCourse-form"
                onSubmit={handleSave}
            >


                {/* =================================================
                   BASIC INFORMATION
                ================================================= */}

                <section className="EditCourse-section">

                    <div className="EditCourse-section-title">

                        <div className="EditCourse-section-icon">

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


                    <div className="EditCourse-grid">


                        {/* COURSE TITLE */}

                        <div className="EditCourse-group full">

                            <label>
                                Course Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={
                                    handleInputChange
                                }
                                required
                            />

                        </div>


                        {/* LANGUAGE */}

                        <div className="EditCourse-group">

                            <label>
                                Language
                            </label>

                            <select
                                name="language"
                                value={form.language}
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

                        <div className="EditCourse-group">

                            <label>
                                Level
                            </label>

                            <select
                                name="level"
                                value={form.level}
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

                        <div className="EditCourse-group">

                            <label>
                                Duration
                            </label>

                            <input
                                type="text"
                                name="duration"
                                value={form.duration}
                                onChange={
                                    handleInputChange
                                }
                            />

                        </div>


                        {/* NEXT START DATE */}

                        <div className="EditCourse-group">

                            <label>
                                Next Start Date
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={
                                    handleInputChange
                                }
                                required
                            />

                        </div>


                        {/* PRICE */}

                        <div className="EditCourse-group">

                            <label>
                                Price
                            </label>

                            <div className="EditCourse-price">

                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={
                                        handleInputChange
                                    }
                                    min="0"
                                />

                                <span>
                                    DA
                                </span>

                            </div>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="EditCourse-group full">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={
                                    handleInputChange
                                }
                                rows="5"
                            ></textarea>

                        </div>

                    </div>

                </section>


                {/* =================================================
                   LEARNING POINTS
                ================================================= */}

                <section className="EditCourse-section">

                    <div className="EditCourse-section-title">

                        <div className="EditCourse-section-icon">

                            <i className="fa-solid fa-list-check"></i>

                        </div>

                        <div>

                            <h2>
                                What Students Will Learn
                            </h2>

                            <p>
                                Update the learning outcomes.
                            </p>

                        </div>

                    </div>


                    <div className="EditCourse-repeat-list">

                        {form.learnPoints.map(
                            (point, index) => (

                                <div
                                    className="EditCourse-repeat-row"
                                    key={index}
                                >

                                    <span>
                                        {index + 1}
                                    </span>

                                    <input
                                        type="text"
                                        value={point}
                                        onChange={(event) =>
                                            handleLearnPointChange(
                                                index,
                                                event.target.value
                                            )
                                        }
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
                        className="EditCourse-secondary-button"
                        onClick={addLearnPoint}
                    >

                        <i className="fa-solid fa-plus"></i>

                        Add Learning Point

                    </button>

                </section>


                {/* =================================================
                   SYLLABUS
                ================================================= */}

                <section className="EditCourse-section">

                    <div className="EditCourse-section-title">

                        <div className="EditCourse-section-icon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>

                        <div>

                            <h2>
                                Syllabus
                            </h2>

                            <p>
                                Manage modules and lessons.
                            </p>

                        </div>

                    </div>


                    <div className="EditCourse-modules">

                        {form.syllabus.map(
                            (
                                module,
                                moduleIndex
                            ) => (

                                <div
                                    className="EditCourse-module"
                                    key={moduleIndex}
                                >

                                    <div className="EditCourse-module-header">

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


                                    <div className="EditCourse-grid">


                                        <div className="EditCourse-group full">

                                            <label>
                                                Module Title
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    module.title
                                                }
                                                onChange={(event) =>
                                                    handleModuleChange(
                                                        moduleIndex,
                                                        "title",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="EditCourse-group full">

                                            <label>
                                                Module Summary
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    module.summary
                                                }
                                                onChange={(event) =>
                                                    handleModuleChange(
                                                        moduleIndex,
                                                        "summary",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>


                                    <div className="EditCourse-subtitle">

                                        Lessons

                                    </div>


                                    <div className="EditCourse-repeat-list">

                                        {module.lessons.map(
                                            (
                                                lesson,
                                                lessonIndex
                                            ) => (

                                                <div
                                                    className="EditCourse-repeat-row"
                                                    key={lessonIndex}
                                                >

                                                    <span>
                                                        {lessonIndex + 1}
                                                    </span>

                                                    <input
                                                        type="text"
                                                        value={
                                                            lesson
                                                        }
                                                        onChange={(event) =>
                                                            handleModuleLessonChange(
                                                                moduleIndex,
                                                                lessonIndex,
                                                                event.target.value
                                                            )
                                                        }
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


                                    <button
                                        type="button"
                                        className="EditCourse-small-button"
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


                    <button
                        type="button"
                        className="EditCourse-secondary-button"
                        onClick={addModule}
                    >

                        <i className="fa-solid fa-plus"></i>

                        Add Module

                    </button>

                </section>


                {/* =================================================
                   ACTIONS
                ================================================= */}

                <div className="EditCourse-actions">

                    <button
                        type="button"
                        className="EditCourse-cancel"
                        onClick={() =>
                            navigate(
                                "/admin/courses"
                            )
                        }
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="EditCourse-save"
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
                            : "Save Changes"
                        }

                    </button>

                </div>

            </form>

        </div>

    );

}


export default EditCourse;