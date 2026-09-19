import "./Courses.css";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import CourseCard from "../../../Cards/CourseCard/CourseCard";


const API_URL =
    "http://localhost:5000/api/courses";


function Courses() {

    const navigate = useNavigate();


    /* =========================================================
       COURSES STATE
    ========================================================= */

    const [courseList, setCourseList] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [languageFilter, setLanguageFilter] =
        useState("All");

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");


    /* =========================================================
       FETCH COURSES
    ========================================================= */

    const fetchCourses = async () => {

        try {

            setIsLoading(true);

            setErrorMessage("");


            const response =
                await fetch(API_URL);


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch courses."
                );

            }


            const data =
                await response.json();


            setCourseList(data);

        }

        catch (error) {

            console.error(
                "Error fetching courses:",
                error
            );


            setErrorMessage(
                "Unable to load courses. Please try again."
            );

        }

        finally {

            setIsLoading(false);

        }

    };


    /* =========================================================
       LOAD COURSES
    ========================================================= */

    useEffect(() => {

        fetchCourses();

    }, []);


    /* =========================================================
       FILTER COURSES
    ========================================================= */

    const filteredCourses =
        courseList.filter((course) => {

            const searchValue =
                search.toLowerCase();


            const title =
                course.title
                    ? course.title.toLowerCase()
                    : "";


            const language =
                course.language
                    ? course.language.toLowerCase()
                    : "";


            const matchesSearch =
                title.includes(searchValue) ||
                language.includes(searchValue);


            const matchesLanguage =
                languageFilter === "All" ||
                course.language === languageFilter;


            return (
                matchesSearch &&
                matchesLanguage
            );

        });


    /* =========================================================
       DELETE COURSE
    ========================================================= */

    const handleDelete = async (course) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${course.title}"?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setErrorMessage("");


            const courseId =
                course.id;


            const response =
                await fetch(
                    `${API_URL}/${courseId}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete course."
                );

            }


            setCourseList(
                courseList.filter(
                    (item) =>
                        String(item.id) !==
                        String(courseId)
                )
            );

        }

        catch (error) {

            console.error(
                "Error deleting course:",
                error
            );


            setErrorMessage(
                error.message ||
                "Unable to delete course."
            );

        }

    };


    /* =========================================================
       OPEN COURSE
    ========================================================= */

    const handleViewCourse = (course) => {

        navigate(
            `/admin/courses/${course.id}`
        );

    };


    /* =========================================================
       PAGE
    ========================================================= */

    return (

        <div className="Courses">


            {/* =====================================================
               HEADER
            ===================================================== */}

            <div className="Courses-header">

                <div>

                    <span>
                        Management
                    </span>

                    <h1>
                        Courses
                    </h1>

                    <p>
                        Manage language courses and their learning content.
                    </p>

                </div>


                <button
                    type="button"
                    className="Courses-add-button"
                    onClick={() =>
                        navigate("/admin/courses/add")
                    }
                >

                    <i className="fa-solid fa-plus"></i>

                    <span>
                        Add Course
                    </span>

                </button>

            </div>


            {/* =====================================================
               ERROR
            ===================================================== */}

            {errorMessage && (

                <div className="Courses-error">

                    <i className="fa-solid fa-circle-exclamation"></i>

                    <span>
                        {errorMessage}
                    </span>

                </div>

            )}


            {/* =====================================================
               FILTERS
            ===================================================== */}

            <div className="Courses-filters">


                {/* =================================================
                   SEARCH
                ================================================= */}

                <div className="Courses-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* =================================================
                   LANGUAGE FILTER
                ================================================= */}

                <div className="Courses-level-filter">

                    <i className="fa-solid fa-language"></i>

                    <select
                        value={languageFilter}
                        onChange={(event) =>
                            setLanguageFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Languages
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

            </div>


            {/* =====================================================
               LOADING
            ===================================================== */}

            {isLoading && (

                <div className="Courses-empty">

                    <i className="fa-solid fa-spinner fa-spin"></i>

                    <span>
                        Loading courses...
                    </span>

                </div>

            )}


            {/* =====================================================
               COURSES
            ===================================================== */}

            {!isLoading && (

                <div className="Courses-grid">

                    {filteredCourses.map(
                        (course) => (

                            <div
                                key={course.id}
                                className="Courses-admin-card-wrapper"
                                onClick={() =>
                                    handleViewCourse(course)
                                }
                            >

                                <CourseCard
                                    course={course}
                                />


                                {/* =================================================
                                   DELETE
                                ================================================= */}

                                <button
                                    type="button"
                                    className="Courses-delete-button"
                                    onClick={(event) => {

                                        event.stopPropagation();

                                        handleDelete(course);

                                    }}
                                    title="Delete course"
                                >

                                    <i className="fa-solid fa-trash"></i>

                                </button>

                            </div>

                        )
                    )}


                    {/* =================================================
                       NO RESULTS
                    ================================================= */}

                    {filteredCourses.length === 0 && (

                        <div className="Courses-empty">

                            <i className="fa-solid fa-book-open"></i>

                            <span>
                                No courses found.
                            </span>

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}


export default Courses;