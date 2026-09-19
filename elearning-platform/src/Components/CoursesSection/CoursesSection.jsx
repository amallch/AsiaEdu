import { useEffect, useRef, useState } from "react";

import { useSearchParams } from "react-router-dom";

import "./CoursesSection.css";

import { getCourses } from "../../api/coursesApi";

import CourseCard from "../../Cards/CourseCard/CourseCard";


const LEVELS = [
    "Beginner",
    "Intermediate",
    "Advanced"
];


function CoursesSection() {

    const [courses, setCourses] = useState([]);

    const [searchParams, setSearchParams] =
        useSearchParams();


    const [language, setLanguage] = useState(
        searchParams.get("language") || "All"
    );

    const [level, setLevel] = useState("All");

    const [search, setSearch] = useState("");

    const sectionRef = useRef(null);


    /* =====================================================
       FETCH COURSES
    ===================================================== */

    useEffect(() => {

        getCourses()
            .then((data) => {

                setCourses(data);

            })
            .catch((error) => {

                console.error(
                    "Error fetching courses:",
                    error
                );

            });

    }, []);


    /* =====================================================
       READ LANGUAGE FROM URL
    ===================================================== */

    useEffect(() => {

        const languageFromUrl =
            searchParams.get("language");


        if (languageFromUrl) {

            setLanguage(languageFromUrl);

        }
        else {

            setLanguage("All");

        }

    }, [searchParams]);


    /* =====================================================
       SCROLL ANIMATION
    ===================================================== */

    useEffect(() => {

        const section =
            sectionRef.current;


        if (!section) {

            return;

        }


        const observer =
            new IntersectionObserver(

                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            section.classList.add(
                                "CoursesSection-visible"
                            );

                        }
                        else {

                            section.classList.remove(
                                "CoursesSection-visible"
                            );

                        }

                    });

                },

                {
                    threshold: 0.15
                }

            );


        observer.observe(section);


        return () => {

            observer.disconnect();

        };

    }, []);


    /* =====================================================
       GET LANGUAGES FROM COURSE DATA
    ===================================================== */

    const languages = [
        ...new Set(
            courses
                .map((course) => course.language)
                .filter((item) => item)
        )
    ];


    /* =====================================================
       FILTER COURSES
    ===================================================== */

    const filtered = courses.filter((course) => {

        const matchesLanguage =
            language === "All" ||
            course.language === language;


        const matchesLevel =
            level === "All" ||
            course.level === level;


        const searchText =
            search.trim().toLowerCase();


        const matchesSearch =
            course.title
                .toLowerCase()
                .includes(searchText) ||

            course.language
                .toLowerCase()
                .includes(searchText) ||

            course.level
                .toLowerCase()
                .includes(searchText) ||

            course.description
                ?.toLowerCase()
                .includes(searchText);


        return (
            matchesLanguage &&
            matchesLevel &&
            matchesSearch
        );

    });


    /* =====================================================
       LANGUAGE CHANGE
    ===================================================== */

    const handleLanguageChange = (value) => {

        setLanguage(value);


        if (value === "All") {

            setSearchParams({});

        }
        else {

            setSearchParams({
                language: value
            });

        }

    };


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const clearFilters = () => {

        setLanguage("All");

        setLevel("All");

        setSearch("");

        setSearchParams({});

    };


    return (

        <section
            className="CoursesSection"
            ref={sectionRef}
        >

            <div className="CoursesSection-container">


                {/* =================================================
                   FILTERS
                ================================================= */}

                <div className="CourseFilters">


                    {/* ================= HEADER ================= */}

                    <div className="CourseFilters-header">

                        <h3>

                            <i className="fa-solid fa-sliders"></i>

                            Filters

                        </h3>


                        <button
                            type="button"
                            className="CourseFilters-clear"
                            onClick={clearFilters}
                        >

                            Clear Filters

                        </button>

                    </div>


                    {/* ================= SEARCH ================= */}

                    <div className="CourseSearch">

                        <i className="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    {/* ================= FILTER OPTIONS ================= */}

                    <div className="CourseFilters-options">


                        {/* ================= LANGUAGE ================= */}

                        <div className="CourseFilters-group">

                            <label>
                                Language
                            </label>


                            <select
                                value={language}
                                onChange={(e) =>
                                    handleLanguageChange(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="All">
                                    All Languages
                                </option>


                                {languages.map((item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >

                                        {item}

                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* ================= LEVEL ================= */}

                        <div className="CourseFilters-group">

                            <label>
                                Level
                            </label>


                            <select
                                value={level}
                                onChange={(e) =>
                                    setLevel(e.target.value)
                                }
                            >

                                <option value="All">
                                    All Levels
                                </option>


                                {LEVELS.map((item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >

                                        {item}

                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                </div>


                {/* =================================================
                   COURSES
                ================================================= */}

                <div className="CoursesList">


                    {filtered.length === 0 ? (

                        <div className="CoursesList-empty">

                            <i className="fa-regular fa-face-frown"></i>


                            <p>
                                No courses match your filters.
                            </p>


                            <button
                                type="button"
                                onClick={clearFilters}
                            >

                                Clear Filters

                            </button>

                        </div>

                    ) : (

                        <div className="CoursesCards">

                            {filtered.map((course) => (

                                <CourseCard
                                    key={course.id}
                                    course={course}
                                />

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </section>

    );

}


export default CoursesSection;