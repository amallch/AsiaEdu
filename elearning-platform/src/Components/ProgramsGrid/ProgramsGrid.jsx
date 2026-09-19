import "./ProgramsGrid.css";

import { useParams } from "react-router-dom";

import HomeProgramsCards from "../../Cards/HomeProgramsCards/HomeProgramsCards";

import NormalProgram from "../../assets/NormalProgram.jpg";
import SummerCamp from "../../assets/SummerCamp.avif";
import PrivateLessons from "../../assets/PrivateLessons.png";


function ProgramsGrid() {

    const { id } = useParams();


    const programs = [

        {
            id: 1,

            type: "normal",

            title1: "Normal",
            title2: "Program",

            description:
                "Learn at a comfortable pace with weekly classes designed for steady and lasting progress.",

            image: NormalProgram,

            duration: "3 Months",

            classSize: "Up to 12 Students",

            schedule: "1 Session / Week",

            certificate: "Certificate Included"
        },

        {
            id: 2,

            type: "summer",

            title1: "Summer",
            title2: "Camp",

            description:
                "A fun and interactive summer experience combining language learning with cultural activities.",

            image: SummerCamp,

            duration: "5 Weeks",

            classSize: "Group Activities",

            schedule: "4–5 Sessions / Week",

            certificate: "Certificate of Participation"
        },

    ];


    /* =====================================================
       FIND SELECTED PROGRAM
    ===================================================== */

    let program = null;


    for (let i = 0; i < programs.length; i++) {

        if (programs[i].id === Number(id)) {

            program = programs[i];

            break;
        }
    }


    /* =====================================================
       PROGRAM NOT FOUND
    ===================================================== */

    if (!program) {

        return (

            <section className="ProgramsGrid">

                <div className="ProgramsGrid-notFound">

                    <div className="ProgramsGrid-notFound-icon">
                        <i className="fas fa-circle-exclamation"></i>
                    </div>

                    <h2>
                        Program Not Found
                    </h2>

                    <p>
                        The program you are looking for does not exist.
                    </p>

                </div>

            </section>

        );
    }


    /* =====================================================
       OTHER PROGRAMS
    ===================================================== */

    const otherPrograms = programs.filter(
        (item) => item.id !== program.id
    );


    return (

        <section className="ProgramsGrid">

            <div className="ProgramsGrid-container">


                {/* =====================================================
                    SELECTED PROGRAM
                ===================================================== */}

                <div className="ProgramsGrid-selected">


                    {/* IMAGE */}

                    <div className="ProgramsGrid-image-container">

                        <div
                            className="ProgramsGrid-image"
                            style={{
                                backgroundImage: `url(${program.image})`
                            }}
                        >

                            <div className="ProgramsGrid-image-overlay"></div>

                            <span className="ProgramsGrid-badge">

                                {program.type === "summer"
                                    ? "Seasonal"
                                    : program.type === "individual"
                                        ? "Personalized"
                                        : "Normal"}

                            </span>

                        </div>

                    </div>


                    {/* CONTENT */}

                    <div className="ProgramsGrid-content">

                        <div className="ProgramsGrid-label">

                            <i className="fas fa-graduation-cap"></i>

                            <span>
                                OUR PROGRAM
                            </span>

                        </div>


                        <h1>
                            {program.title1} {program.title2}
                        </h1>


                        <p className="ProgramsGrid-description">
                            {program.description}
                        </p>


                        {/* PROGRAM INFO */}

                        <div className="ProgramsGrid-info">


                            <div className="ProgramsGrid-infoItem">

                                <div className="ProgramsGrid-infoIcon">
                                    <i className="fas fa-calendar-days"></i>
                                </div>

                                <div>

                                    <span>
                                        Duration
                                    </span>

                                    <strong>
                                        {program.duration}
                                    </strong>

                                </div>

                            </div>


                            <div className="ProgramsGrid-infoItem">

                                <div className="ProgramsGrid-infoIcon">
                                    <i className="fas fa-users"></i>
                                </div>

                                <div>

                                    <span>
                                        Class Size
                                    </span>

                                    <strong>
                                        {program.classSize}
                                    </strong>

                                </div>

                            </div>


                            <div className="ProgramsGrid-infoItem">

                                <div className="ProgramsGrid-infoIcon">
                                    <i className="fas fa-clock"></i>
                                </div>

                                <div>

                                    <span>
                                        Schedule
                                    </span>

                                    <strong>
                                        {program.schedule}
                                    </strong>

                                </div>

                            </div>


                            <div className="ProgramsGrid-infoItem">

                                <div className="ProgramsGrid-infoIcon">
                                    <i className="fas fa-certificate"></i>
                                </div>

                                <div>

                                    <span>
                                        Certificate
                                    </span>

                                    <strong>
                                        {program.certificate}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    EXPLORE MORE PROGRAMS
                ===================================================== */}

                <div className="ProgramsGrid-more">


                    <div className="ProgramsGrid-moreHeader">

                        <span className="ProgramsGrid-moreLabel">
                            EXPLORE MORE PROGRAMS
                        </span>

                        <h2>
                            Discover Our Other Programs
                        </h2>

                        <div className="ProgramsGrid-moreLine"></div>

                    </div>


                    {/* =================================================
                        REUSE HOME PROGRAM CARDS
                    ================================================= */}

                    <div className="ProgramsGrid-moreCards">

                        {otherPrograms.map((otherProgram) => (

                            <HomeProgramsCards
                                key={otherProgram.id}
                                program={otherProgram}
                            />

                        ))}

                    </div>

                </div>

            </div>

        </section>

    );
}


export default ProgramsGrid;