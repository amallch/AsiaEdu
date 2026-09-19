import { useEffect, useState } from "react";

import "./RelatedCourses.css";

import CourseCard from "../../Cards/CourseCard/CourseCard";


function RelatedCourses({ course }) {

    const [courses, setCourses] = useState([]);


    useEffect(() => {

        const fetchCourses = async () => {

            try {

                const response = await fetch(
                    "https://asiaedu-backend.onrender.com/api/courses"
                );


                if (!response.ok) {

                    throw new Error("Failed to load courses");

                }


                const data = await response.json();

                setCourses(data);

            } catch (error) {

                console.error(
                    "Failed to load related courses:",
                    error
                );

            }

        };


        fetchCourses();

    }, []);


    if (!course) {
        return null;
    }


    // Same language AND same level
    const sameLanguageAndLevel = courses.filter(
        (item) =>
            item.language === course.language &&
            item.level === course.level &&
            item.id !== course.id
    );


    // Same language but different level
    const sameLanguage = courses.filter(
        (item) =>
            item.language === course.language &&
            item.level !== course.level &&
            item.id !== course.id
    );


    // Different language but same level
    const sameLevel = courses.filter(
        (item) =>
            item.language !== course.language &&
            item.level === course.level &&
            item.id !== course.id
    );


    // Priority:
    // 1. Same language + same level
    // 2. Same language + different level
    // 3. Different language + same level
    const related = [
        ...sameLanguageAndLevel,
        ...sameLanguage,
        ...sameLevel
    ].slice(0, 3);


    if (related.length === 0) {
        return null;
    }


    return (

        <section className="RelatedCourses">

            <div className="RelatedCourses-container">

                <h2>
                    Related Courses
                </h2>


                <div className="RelatedCourses-grid">

                    {related.map((item) => (

                        <CourseCard
                            key={item.id}
                            course={item}
                        />

                    ))}

                </div>

            </div>

        </section>

    );

}


export default RelatedCourses;