import "./Statistics.css";

import {
    useEffect,
    useRef,
    useState
} from "react";


function Statistics() {

    const statisticsRef =
        useRef(null);


    const [statistics, setStatistics] =
        useState({

            students: 0,

            languages: 0,

            teachers: 0,

            courses: 0

        });


    const [animatedValues, setAnimatedValues] =
        useState({

            students: 0,

            languages: 0,

            teachers: 0,

            courses: 0

        });


    const [hasStarted, setHasStarted] =
        useState(false);


    /* =====================================================
       LOAD STATISTICS
    ===================================================== */

    useEffect(() => {

        loadStatistics();

    }, []);


    /* =====================================================
       GET STATISTICS FROM BACKEND
    ===================================================== */

    async function loadStatistics() {

        try {

            const [
                studentsResponse,
                teachersResponse,
                coursesResponse
            ] = await Promise.all([

                fetch(
                    "http://localhost:5000/api/students"
                ),

                fetch(
                    "http://localhost:5000/api/teachers"
                ),

                fetch(
                    "http://localhost:5000/api/courses"
                )

            ]);


            const studentsData =
                await studentsResponse.json();


            const teachersData =
                await teachersResponse.json();


            const coursesData =
                await coursesResponse.json();


            /* =============================================
               STUDENTS
            ============================================= */

            let students =
                studentsData.students ||
                studentsData;


            if (!Array.isArray(students)) {
                students = [];
            }


            /* =============================================
               TEACHERS
            ============================================= */

            let teachers =
                teachersData.teachers ||
                teachersData;


            if (!Array.isArray(teachers)) {
                teachers = [];
            }


            /* =============================================
               COURSES
            ============================================= */

            let courses =
                coursesData.courses ||
                coursesData;


            if (!Array.isArray(courses)) {
                courses = [];
            }


            /* =============================================
               LANGUAGES
            ============================================= */

            const languages =
                new Set();


            courses.forEach(
                (course) => {

                    if (
                        course.language
                    ) {

                        languages.add(
                            course.language
                                .toLowerCase()
                                .trim()
                        );

                    }

                }
            );


            setStatistics({

                students:
                    students.length,

                languages:
                    languages.size,

                teachers:
                    teachers.length,

                courses:
                    courses.length

            });

        }

        catch (error) {

            console.error(
                "Failed to load statistics:",
                error
            );

        }

    }


    /* =====================================================
       START ANIMATION WHEN VISIBLE
    ===================================================== */

    useEffect(() => {

        if (!statisticsRef.current) {
            return;
        }


        const observer =
            new IntersectionObserver(

                (entries) => {

                    const entry =
                        entries[0];


                    if (
                        entry.isIntersecting &&
                        !hasStarted
                    ) {

                        setHasStarted(true);

                    }

                },

                {
                    threshold: 0.3
                }

            );


        observer.observe(
            statisticsRef.current
        );


        return () => {

            observer.disconnect();

        };

    }, [hasStarted]);


    /* =====================================================
       NUMBER COUNTING ANIMATION
    ===================================================== */

    useEffect(() => {

        if (!hasStarted) {
            return;
        }


        const duration = 1200;

        const startTime =
            performance.now();


        function animate(
            currentTime
        ) {

            const elapsed =
                currentTime -
                startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /* =============================================
               SMOOTH EASING
            ============================================= */

            const easedProgress =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            setAnimatedValues({

                students:
                    Math.floor(
                        statistics.students *
                        easedProgress
                    ),

                languages:
                    Math.floor(
                        statistics.languages *
                        easedProgress
                    ),

                teachers:
                    Math.floor(
                        statistics.teachers *
                        easedProgress
                    ),

                courses:
                    Math.floor(
                        statistics.courses *
                        easedProgress
                    )

            });


            if (progress < 1) {

                requestAnimationFrame(
                    animate
                );

            }

        }


        requestAnimationFrame(
            animate
        );


    }, [hasStarted, statistics]);


    const stats = [

        {
            id: 1,

            icon:
                "fa-solid fa-user-graduate",

            value:
                `${animatedValues.students}+`,

            label:
                "Students Taught"

        },

        {
            id: 2,

            icon:
                "fa-solid fa-language",

            value:
                animatedValues.languages,

            label:
                "Languages Offered"

        },

        {
            id: 3,

            icon:
                "fa-solid fa-chalkboard-user",

            value:
                `${animatedValues.teachers}+`,

            label:
                "Expert Teachers"

        },

        {
            id: 4,

            icon:
                "fa-solid fa-book-open",

            value:
                animatedValues.courses,

            label:
                "Courses Available"

        }

    ];


    return (

        <section
            className="Statistics"
            ref={statisticsRef}
        >

            <div className="Statistics-container">

                {
                    stats.map(
                        (stat) => (

                            <div
                                className="StatItem"
                                key={stat.id}
                            >

                                <i
                                    className={
                                        stat.icon
                                    }
                                ></i>


                                <div className="StatItem-info">

                                    <h3>
                                        {
                                            stat.value
                                        }
                                    </h3>

                                    <p>
                                        {
                                            stat.label
                                        }
                                    </p>

                                </div>

                            </div>

                        )
                    )
                }

            </div>

        </section>

    );

}


export default Statistics;