import "./HomeProgramsCards.css";

import { useNavigate } from "react-router-dom";

import ReadMore from "../../Utiles/ReadMore/ReadMore";


function HomeProgramsCards({ program }) {

    const navigate = useNavigate();


    /* =====================================================
       PROGRAM TYPE
    ===================================================== */

    let badge = "Normal";

    let badgeIcon =
        "fa-solid fa-book-open";


    if (program.type === "summer") {

        badge = "Summer Camp";

        badgeIcon =
            "fa-solid fa-sun";

    }

    else if (program.type === "individual") {

        badge = "Personalized";

        badgeIcon =
            "fa-solid fa-user";

    }


    /* =====================================================
       OPEN PROGRAM
    ===================================================== */

    const handleExplore = () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        navigate(
            `/programs/${program.id}`
        );

    };


    return (

        <article className="HomeProgramCard">


            {/* =================================================
               TOP
            ================================================= */}

            <div className="HomeProgramCard-top">

                <div className="HomeProgramCard-icon">

                    <i className={badgeIcon}></i>

                </div>


                <span className="HomeProgramCard-badge">

                    {badge}

                </span>

            </div>


            {/* =================================================
               CONTENT
            ================================================= */}

            <div className="HomeProgramCard-content">


                <span className="HomeProgramCard-label">
                    AsiaEdu Program
                </span>


                <h3>

                    {program.title1}

                    <span>
                        {" "}
                        {program.title2}
                    </span>

                </h3>


                <p>
                    {program.description}
                </p>

            </div>


            {/* =================================================
               BUTTON
            ================================================= */}

            <ReadMore
                text="Explore Program"
                onClick={handleExplore}
            />


        </article>

    );

}


export default HomeProgramsCards;