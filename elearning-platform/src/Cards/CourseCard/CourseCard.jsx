import { useNavigate } from "react-router-dom";

import "./CourseCard.css";

import ReadMore from "../../Utiles/ReadMore/ReadMore";


/* =================================================
   LANGUAGE ICONS
================================================= */

const COURSE_ICONS = {

    Chinese: "中",

    Japanese: "あ",

    Korean: "한",

    Russian: "Я",

    Malay: "A"

};


/* =================================================
   FORMAT START DATE
================================================= */

const formatStartDate = (date) => {

    if (!date) {

        return "Coming Soon";

    }


    const parts =
        String(date).split("-");


    if (parts.length !== 3) {

        return date;

    }


    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]);

    const day =
        Number(parts[2]);


    const monthNames = [

        "January",

        "February",

        "March",

        "April",

        "May",

        "June",

        "July",

        "August",

        "September",

        "October",

        "November",

        "December"

    ];


    if (

        Number.isNaN(year) ||

        Number.isNaN(month) ||

        Number.isNaN(day) ||

        !monthNames[month - 1]

    ) {

        return date;

    }


    return (

        `${monthNames[month - 1]} ` +

        `${day}, ` +

        `${year}`

    );

};


function CourseCard({ course }) {

    const navigate = useNavigate();


    /* =================================================
       COURSE ID
    ================================================= */

    const courseId = course.id;


    /* =================================================
       COURSE ICON
    ================================================= */

    const courseIcon =
        COURSE_ICONS[course.language] || "A";


    /* =================================================
       OPEN COURSE
    ================================================= */

    const openCourse = () => {

        console.log(
            "Opening course:",
            course
        );


        if (!courseId) {

            console.error(
                "Course does not have a numeric id:",
                course
            );

            return;

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        navigate(`/courses/${courseId}`);

    };


    return (

        <div
            className="CourseCard"
            onClick={openCourse}
        >

            {/* =================================================
               LANGUAGE ICON
            ================================================= */}

            <div className="CourseCardIcon">

                <span>
                    {courseIcon}
                </span>

            </div>


            {/* =================================================
               CONTENT
            ================================================= */}

            <div className="CourseCardContent">

                {/* =================================================
                   TITLE
                ================================================= */}

                <h3 className="CourseCardTitle">

                    {course.title}

                </h3>


                {/* =================================================
                   DESCRIPTION
                ================================================= */}

                <p className="CourseCardDescription">

                    {course.description ||

                        `Learn ${course.language} step by step with our structured course.`

                    }

                </p>


                {/* =================================================
                   COURSE INFO
                ================================================= */}

                <div className="CourseCardInfo">

                    {/* =================================================
                       DURATION
                    ================================================= */}

                    <div className="CourseCardInfoItem">

                        <i className="fa-regular fa-clock"></i>

                        <span>
                            {course.duration || "10 Weeks"}
                        </span>

                    </div>


                    {/* =================================================
                       LEVEL
                    ================================================= */}

                    <div className="CourseCardInfoItem">

                        <i className="fa-solid fa-signal"></i>

                        <span>
                            {course.level || "Beginner"}
                        </span>

                    </div>


                    {/* =================================================
                       SEATS
                    ================================================= */}

                    <div className="CourseCardInfoItem">

                        <i className="fa-regular fa-user"></i>

                        <span>

                            {course.seats
                                ? `${course.seats} Seats available`
                                : "Seats available"
                            }

                        </span>

                    </div>

                </div>


                {/* =================================================
                   NEXT START DATE
                ================================================= */}

                <div className="CourseCardStartDate">

                    <i className="fa-regular fa-calendar"></i>

                    <span>

                        Next Start:{" "}

                        <strong>
                            {formatStartDate(
                                course.startDate
                            )}
                        </strong>

                    </span>

                </div>


                {/* =================================================
                   DIVIDER
                ================================================= */}

                <div className="CourseCardDivider"></div>


                {/* =================================================
                   FOOTER
                ================================================= */}

                <div className="CourseCardFooter">

                    {/* =================================================
                       PRICE
                    ================================================= */}

                    <span className="CourseCardPrice">

                        {course.price} DA

                    </span>


                    {/* =================================================
                       REGISTER
                    ================================================= */}

                    <div
                        onClick={(event) => {

                            event.stopPropagation();

                        }}
                    >

                        <ReadMore
                            text="view details"
                            onClick={openCourse}
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}


export default CourseCard;