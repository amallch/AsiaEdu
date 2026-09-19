import { useEffect, useState } from "react";

import "./CourseDetails.css";

import { useParams } from "react-router-dom";

import CourseDetailsHero
    from "../../Components/CourseDetailsHero/CourseDetailsHero";

import CourseDetailsContent
    from "../../Components/CourseDetailsContent/CourseDetailsContent";

import RelatedCourses
    from "../../Components/RelatedCourses/RelatedCourses";


function CourseDetails() {

    const { id } = useParams();

    const [course, setCourse] = useState(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchCourse = async () => {

            try {

                const response = await fetch(
                    `https://asiaedu-backend.onrender.com/api/courses/${id}`
                );


                if (!response.ok) {

                    throw new Error(
                        "Course not found"
                    );

                }


                const courseData = await response.json();

                setCourse(courseData);


            } catch (error) {

                console.error(
                    "Failed to load course:",
                    error
                );

                setCourse(null);

            } finally {

                setLoading(false);

            }

        };


        fetchCourse();

    }, [id]);


    if (loading) {

        return (
            <h2>
                Loading course...
            </h2>
        );

    }


    if (!course) {

        return (
            <h2>
                Course not found.
            </h2>
        );

    }


    return (

        <>

            <CourseDetailsHero
                course={course}
            />


            <CourseDetailsContent
                course={course}
            />


            <RelatedCourses
                course={course}
            />

        </>

    );

}


export default CourseDetails;