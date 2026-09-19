import "./LanguageShowcase.css";

import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import Hero from "../../Components/Hero/Hero";

import chinaflag from "../../assets/chinaflagbadge.avif";
import japanflag from "../../assets/japanflagbadge.jpg";
import koreaflag from "../../assets/koreaflagbadge.jpg";
import russianflag from "../../assets/russiaflagbadge.jpg";
import malayflag from "../../assets/malysiaflagbadge.jpg";


const LANGUAGE_FLAGS = {

    Chinese: chinaflag,
    Japanese: japanflag,
    Korean: koreaflag,
    Russian: russianflag,
    Malay: malayflag

};


function LanguageShowcase() {

    const [languages, setLanguages] = useState([]);

    const sectionRef = useRef(null);

    const navigate = useNavigate();


    /* =====================================================
       FETCH LANGUAGES FROM COURSES
    ===================================================== */

    useEffect(() => {

        fetch("https://asiaedu-backend.onrender.com/api/courses")

            .then((response) => response.json())

            .then((data) => {

                const courses = Array.isArray(data)
                    ? data
                    : data.courses || [];


                const languageData = {};


                courses.forEach((course) => {

                    if (!course.language) {
                        return;
                    }


                    const languageName =
                        course.language.trim();


                    if (!languageData[languageName]) {

                        languageData[languageName] = {
                            name: languageName,
                            flag: LANGUAGE_FLAGS[languageName],
                            courses: 0
                        };

                    }


                    languageData[languageName].courses++;

                });


                setLanguages(
                    Object.values(languageData)
                );

            })

            .catch((error) => {

                console.error(
                    "Error fetching languages:",
                    error
                );

            });

    }, []);


    /* =====================================================
       LANGUAGE SHOWCASE ANIMATION
    ===================================================== */

    useEffect(() => {

        const section = sectionRef.current;


        if (!section) {
            return;
        }


        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        section.classList.add(
                            "LanguageShowcase-visible"
                        );

                    }
                    else {

                        section.classList.remove(
                            "LanguageShowcase-visible"
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


    /* =====================================================
       OPEN LANGUAGE COURSES
    ===================================================== */

    const handleLanguageClick = (language) => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        navigate(
            `/courses?language=${encodeURIComponent(language)}`
        );

    };


    return (

        <section
            className="LanguageShowcase"
            ref={sectionRef}
        >

            <div className="LanguageShowcase-container">


                <Hero
                    badge="Languages"
                    title="Explore Our"
                    highlight="Languages"
                    description="Discover new languages and connect with different cultures."
                    center={true}
                />


                <div className="LanguageShowcase-slider">

                    <div className="LanguageShowcase-languages">

                        {languages.map((language) => (

                            <div
                                className="LanguageShowcase-item"
                                key={language.name}
                                onClick={() =>
                                    handleLanguageClick(
                                        language.name
                                    )
                                }
                            >

                                <div className="LanguageShowcase-image">

                                    <img
                                        src={language.flag}
                                        alt={language.name}
                                    />

                                </div>


                                <div className="LanguageShowcase-info">

                                    <h3>
                                        {language.name}
                                    </h3>

                                    <span>

                                        {language.courses}{" "}

                                        {language.courses === 1
                                            ? "Course"
                                            : "Courses"}

                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </section>

    );

}


export default LanguageShowcase;