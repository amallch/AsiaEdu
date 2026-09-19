import { useState } from "react";

import "./CourseDetailsContent.css";

import { useNavigate } from "react-router-dom";


const TABS = [
    { id: "overview", label: "Overview" },
    { id: "syllabus", label: "Syllabus" }
];


function CourseDetailsContent({ course }) {

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("overview");
    const [openModule, setOpenModule] = useState(0);


    if (!course) {
        return null;
    }


    /* =====================================================
       SAFE COURSE DATA
    ===================================================== */

    const learnPoints = Array.isArray(course.learnPoints)
        ? course.learnPoints
        : [];


    const syllabus = Array.isArray(course.syllabus)
        ? course.syllabus
        : [];


    /* =====================================================
       COURSE FEATURES
    ===================================================== */

    const features = [

        {
            icon: "fa-solid fa-video",
            title: "Live Interactive Classes",
            description: `${course.lessons || 0} live sessions with expert instructors`
        },

        {
            icon: "fa-solid fa-file-arrow-down",
            title: "Downloadable Resources",
            description: "PDFs, worksheets, and study materials"
        },

        {
            icon: "fa-solid fa-play",
            title: "Recorded Video Lessons",
            description: "Recorded video lessons available anytime"
        },

        {
            icon: "fa-solid fa-award",
            title: "Certificate of Completion",
            description: "Receive a certificate when you complete the course"
        },

        {
            icon: "fa-solid fa-users",
            title: "Community Support",
            description: "Connect with other learners and get support"
        }

    ];


    /* =====================================================
       ENROLL NOW
    ===================================================== */

    const handleEnrollNow = () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        const storedUser =
            localStorage.getItem("user");

        const user =
            storedUser
                ? JSON.parse(storedUser)
                : null;


        /* =================================================
        ALREADY LOGGED IN
        ================================================= */

        if (user) {

            navigate("/enrollment", {

                state: {

                    course: course

                }

            });

            return;
        }


        /* =================================================
        NOT LOGGED IN
        ================================================= */

        navigate("/signin", {

            state: {

                accountType: "student",

                redirectTo: "/enrollment",

                course: course

            }

        });

    };


    return (

        <section className="CourseDetailsContent">

            <div className="CourseDetailsContent-container">


                {/* ================= LEFT ================= */}

                <div className="CourseDetailsContent-left">


                    {/* ================= TABS ================= */}

                    <div className="CourseTabs">

                        {TABS.map((tab) => (

                            <button
                                key={tab.id}
                                type="button"
                                className={
                                    activeTab === tab.id
                                        ? "active"
                                        : ""
                                }
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>

                        ))}

                    </div>


                    {/* ================= OVERVIEW ================= */}

                    {activeTab === "overview" && (

                        <div className="CourseTabPanel">

                            <div className="CoursePanel-block">

                                <h3>
                                    What You'll Learn
                                </h3>


                                <div className="LearnPoints">

                                    {learnPoints.length > 0 ? (

                                        learnPoints.map((point, index) => (

                                            <div
                                                className="LearnPoint"
                                                key={index}
                                            >

                                                <i className="fa-solid fa-circle-check"></i>

                                                <span>
                                                    {point}
                                                </span>

                                            </div>

                                        ))

                                    ) : (

                                        <p>
                                            Course learning objectives will be
                                            available soon.
                                        </p>

                                    )}

                                </div>

                            </div>


                            <h3 className="CoursePanel-subheading">
                                Course Features
                            </h3>


                            <div className="CourseFeatures">

                                {features.map((feature, index) => (

                                    <div
                                        className="CourseFeature"
                                        key={index}
                                    >

                                        <div className="CourseFeature-icon">

                                            <i className={feature.icon}></i>

                                        </div>


                                        <div>

                                            <h4>
                                                {feature.title}
                                            </h4>

                                            <p>
                                                {feature.description}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    )}


                    {/* ================= SYLLABUS ================= */}

                    {activeTab === "syllabus" && (

                        <div className="CourseTabPanel">

                            <h3>
                                Course Curriculum
                            </h3>


                            <p className="Syllabus-summary">

                                {syllabus.length}
                                {" "}
                                modules
                                {" • "}
                                {course.lessons || 0}
                                {" "}
                                lessons
                                {" • "}
                                {course.duration || "N/A"}

                            </p>


                            <div className="SyllabusList">

                                {syllabus.length > 0 ? (

                                    syllabus.map((module, index) => {

                                        const moduleLessons =
                                            Array.isArray(module.lessons)
                                                ? module.lessons
                                                : [];


                                        return (

                                            <div
                                                className="SyllabusModule"
                                                key={index}
                                            >

                                                <button
                                                    type="button"
                                                    className="SyllabusModule-header"
                                                    onClick={() =>
                                                        setOpenModule(
                                                            openModule === index
                                                                ? null
                                                                : index
                                                        )
                                                    }
                                                >

                                                    <div>

                                                        <h4>
                                                            {module.title}
                                                        </h4>

                                                        <span>
                                                            {module.summary}
                                                        </span>

                                                    </div>


                                                    <i
                                                        className={`fa-solid fa-chevron-down ${
                                                            openModule === index
                                                                ? "open"
                                                                : ""
                                                        }`}
                                                    ></i>

                                                </button>


                                                {openModule === index && (

                                                    <ul className="SyllabusModule-lessons">

                                                        {moduleLessons.length > 0 ? (

                                                            moduleLessons.map(
                                                                (
                                                                    lesson,
                                                                    lessonIndex
                                                                ) => (

                                                                    <li
                                                                        key={
                                                                            lessonIndex
                                                                        }
                                                                    >

                                                                        <i className="fa-regular fa-circle-play"></i>

                                                                        {lesson}

                                                                    </li>

                                                                )
                                                            )

                                                        ) : (

                                                            <li>
                                                                No lessons available.
                                                            </li>

                                                        )}

                                                    </ul>

                                                )}

                                            </div>

                                        );

                                    })

                                ) : (

                                    <p>
                                        Course syllabus will be available soon.
                                    </p>

                                )}

                            </div>

                        </div>

                    )}

                </div>


                {/* ================= RIGHT ================= */}

                <div className="CourseDetailsContent-right">

                    <div className="CoursePriceCard">

                        <h2>
                            {course.price} DA
                        </h2>


                        <p className="CoursePriceCard-note">
                            One-time payment
                        </p>


                        <button
                            type="button"
                            className="CoursePriceCard-enroll"
                            onClick={handleEnrollNow}
                        >
                            Enroll Now
                        </button>

                    </div>

                </div>

            </div>

        </section>

    );

}


export default CourseDetailsContent;