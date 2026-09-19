import "./HomePrograms.css";

import { useEffect, useRef } from "react";

import HomeProgramsCards from "../../Cards/HomeProgramsCards/HomeProgramsCards";
import Hero from "../../Components/Hero/Hero";


const programs = [
    {
        id: 1,

        type: "normal",

        title1: "Normal",
        title2: "Program",

        description:
            "Weekly classes designed for steady and lasting language progress.",

        icon: "fa-solid fa-book-open"

    },

    {
        id: 2,

        type: "summer",

        title1: "Summer",
        title2: "Camp",

        description:
            "Language learning combined with fun cultural and group activities.",

        icon: "fa-solid fa-campground"

    }

];


function HomePrograms() {

    const sectionRef = useRef(null);


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
                            "HomePrograms-visible"
                        );

                    }

                    else {

                        section.classList.remove(
                            "HomePrograms-visible"
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


    return (

        <section
            className="HomePrograms"
            id="programs"
            ref={sectionRef}
        >

            <div className="HomePrograms-container">

                <Hero
                    center
                    badge="Our Programs"
                    title="Discover Our"
                    highlight="Programs"
                    description="Whether you prefer steady progress or intensive study, we offer programs tailored to every learner."
                />


                <div className="HomePrograms-cards">

                    {programs.map((program) => (

                        <HomeProgramsCards
                            key={program.id}
                            program={program}
                        />

                    ))}

                </div>

            </div>

        </section>

    );

}


export default HomePrograms;