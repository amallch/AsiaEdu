import { useEffect, useRef, useState } from "react";

import "./HomeCourses.css";

import { useNavigate } from "react-router-dom";

import ReadMore from "../../Utiles/ReadMore/ReadMore";

import CourseCard from "../../Cards/CourseCard/CourseCard";

import Hero from "../../Components/Hero/Hero";


function HomeCourses() {

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);

    const sectionRef = useRef(null);


    /* =====================================================
       FETCH COURSES
    ===================================================== */

    useEffect(() => {

        const fetchCourses = async () => {

            try {

                const response = await fetch(
                    "https://asiaedu-backend.onrender.com/api/courses"
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to load courses"
                    );

                }


                const data = await response.json();

                setCourses(data);

            } catch (error) {

                console.error(
                    "Failed to load home courses:",
                    error
                );

            }

        };


        fetchCourses();

    }, []);


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
                                "HomeCourses-visible"
                            );

                        }
                        else {

                            section.classList.remove(
                                "HomeCourses-visible"
                            );

                        }

                    });

                },

                {
                    threshold: 0.2
                }

            );


        observer.observe(section);


        return () => {

            observer.disconnect();

        };

    }, []);


    const displayedCourses =
        courses.slice(0, 3);


    return (

        <section
            className="HomeCourses"
            ref={sectionRef}
        >

            <div className="HomeCourses-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="HomeCourses-headings-container">

                    <Hero
                        badge="Our Courses"
                        title="Explore Our"
                        highlight="Languages"
                        description="Discover expertly designed courses in Asian languages, tailored to help you build confidence and achieve fluency at your own pace."
                    />


                    <div className="HomeCourses-button">

                        <ReadMore
                            text="View More Courses"
                            icon="fa-solid fa-book-open"
                            onClick={() =>
                                navigate("/courses")
                            }
                        />

                    </div>

                </div>


                {/* =================================================
                   COURSE CARDS
                ================================================= */}

                <div className="HomeCourses-cards">

                    {displayedCourses.map(
                        (course, index) => (

                            <div
                                className={`HomeCourses-card HomeCourses-card-${index + 1}`}
                                key={course.id}
                            >

                                <CourseCard
                                    course={course}
                                />

                            </div>

                        )
                    )}

                </div>


            </div>

        </section>

    );

}


export default HomeCourses;