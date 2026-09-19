import "./HomeHero.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Button from "../../Utiles/Button/Button";

import heroStudent from "../../assets/heroStudent.png";


function HomeHero() {

    const navigate = useNavigate();

    const [courseCount, setCourseCount] = useState(0);


    useEffect(() => {

        const getCourseCount = async () => {

            try {

                const response = await fetch(
                    "https://asiaedu-backend.onrender.com/api/courses"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch courses");
                }

                const data = await response.json();

                const courses = Array.isArray(data)
                    ? data
                    : data.courses || [];

                setCourseCount(courses.length);

            } catch (error) {

                console.error(
                    "Error fetching course count:",
                    error
                );

            }

        };

        getCourseCount();

    }, []);


    return (

        <section className="HomeHero">

            <div className="HomeHero-container">


                {/* =================================================
                   LEFT SIDE
                ================================================= */}

                <div className="HomeHero-left">


                    {/* ================= SUBTITLE ================= */}

                    <div className="HomeHeroSubtitle">

                        <i className="fa-solid fa-award"></i>

                        <p>
                            100% Online Asian Language School
                        </p>

                    </div>


                    {/* ================= TITLE ================= */}

                    <h1>
                        Master <span>Asian Languages</span>
                        <br />
                        With Confidence
                    </h1>


                    {/* ================= DESCRIPTION ================= */}

                    <div className="HomeHeroDescription">

                        <p>
                            Learn. Practice. Speak with confidence.
                            Your journey to mastering Asian languages
                            starts today.
                        </p>

                    </div>


                    {/* ================= BUTTON ================= */}

                    <div className="HomeHeroButtons">

                        <Button
                            text="Start Learning"
                            type="primary"
                            onClick={() => navigate("/courses")}
                        />

                    </div>


                </div>


                {/* =================================================
                   RIGHT SIDE
                ================================================= */}

                <div className="HomeHero-right">


                    <div className="HeroVisual">


                        {/* ================= BACKGROUND BLOB ================= */}

                        <div className="HeroVisualBlob"></div>


                        {/* ================= STUDENT IMAGE ================= */}

                        <img
                            src={heroStudent}
                            alt="Student"
                            className="HeroVisualImage"
                        />


                        {/* =================================================
                           LIVE & INTERACTIVE CLASSES
                        ================================================= */}

                        <div className="HeroVisualCard HeroVisualCardFeature">

                            <div className="HeroVisualIconBox">

                                <i className="fa-solid fa-play"></i>

                            </div>

                            <div>

                                <h4>
                                    Live &amp; Interactive
                                </h4>

                                <p>
                                    Classes
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                           LANGUAGE COURSES
                        ================================================= */}

                        <div className="HeroVisualCard HeroVisualCardRing">

                            <div className="HeroVisualRing"></div>

                            <h4>
                                {courseCount}+
                            </h4>

                            <p>
                                Language Courses
                            </p>

                        </div>


                        {/* =================================================
                           ONLINE SUPPORT
                        ================================================= */}

                        <div className="HeroVisualCard HeroVisualCardSupport">

                            <div className="HeroVisualIconCircle">

                                <i className="fa-solid fa-headset"></i>

                            </div>

                            <div>

                                <h4>
                                    24/7
                                </h4>

                                <p>
                                    Online Support
                                </p>

                            </div>

                        </div>


                    </div>

                </div>


            </div>

        </section>

    );

}


export default HomeHero;