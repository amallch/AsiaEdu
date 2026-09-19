import "./CourseDetailsHero.css";

import chinaFlag from "../../assets/chinaflagbadge.avif";
import japanFlag from "../../assets/japanflagbadge.jpg";
import koreaFlag from "../../assets/koreaflagbadge.jpg";
import malaysiaFlag from "../../assets/malysiaflagbadge.jpg";
import russiaFlag from "../../assets/russiaflagbadge.jpg";


const LEVEL_COLORS = {

    Beginner: "#0E9E68",

    Intermediate: "#E35D1C",

    Advanced: "#6D4FDB"

};


const COURSE_FLAGS = {

    Chinese: chinaFlag,

    Japanese: japanFlag,

    Korean: koreaFlag,

    Malay: malaysiaFlag,

    Russian: russiaFlag

};


function CourseDetailsHero({ course }) {

    if (!course) {
        return null;
    }


    const levelColor =
        LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner;


    const flag =
        COURSE_FLAGS[course.language];


    return (

        <section className="CourseDetailsHero">

            <div className="CourseDetailsHero-container">

                <div className="CourseDetailsHero-content">


                    {/* ================= BADGES ================= */}

                    <div className="CourseDetailsHero-badges">


                        {/* ================= LANGUAGE ================= */}

                        <span className="CourseDetailsHero-language">

                            {flag && (

                                <img
                                    src={flag}
                                    alt={`${course.language} flag`}
                                    className="CourseDetailsHero-languageFlag"
                                />

                            )}

                            {course.language}

                        </span>


                        {/* ================= LEVEL ================= */}

                        <span
                            className="CourseDetailsHero-level"
                            style={{ color: levelColor }}
                        >

                            <span
                                className="CourseDetailsHero-levelDot"
                                style={{
                                    background: levelColor
                                }}
                            ></span>

                            {course.level}

                        </span>


                    </div>


                    {/* ================= TITLE ================= */}

                    <h1>
                        {course.title}
                    </h1>


                    {/* ================= DESCRIPTION ================= */}

                    <p>
                        {course.description}
                    </p>


                </div>

            </div>

        </section>

    );

}


export default CourseDetailsHero;