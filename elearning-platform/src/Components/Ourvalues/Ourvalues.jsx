import "./OurValues.css";

import { useEffect, useRef } from "react";

import Hero from "../../Components/Hero/Hero";


function OurValues() {

    const values = [
        {
            icon: "fa-solid fa-bullseye",
            title: "Excellence",
            description:
                "We hold every lesson, every teacher, and every resource to a high standard, because your time deserves nothing less."
        },
        {
            icon: "fa-solid fa-earth-asia",
            title: "Accessibility",
            description:
                "Language learning shouldn't be limited by geography or schedule. We make it possible to learn from anywhere, on your time."
        },
        {
            icon: "fa-solid fa-people-group",
            title: "Community",
            description:
                "Learning a language means more with others. We build real connection between students, teachers, and cultures."
        },
        {
            icon: "fa-solid fa-seedling",
            title: "Growth",
            description:
                "We celebrate progress over perfection, and design every course to keep you moving forward at your own pace."
        }
    ];


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
                            "OurValues-visible"
                        );

                    } else {

                        section.classList.remove(
                            "OurValues-visible"
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
            className="OurValues"
            ref={sectionRef}
        >

            <div className="OurValues-container">

                <Hero
                    badge="Our Values"
                    title="What We"
                    highlight="Stand For"
                    description="These are the principles that shape how we teach, how we build our courses, and how we treat every student who joins us."
                    center={true}
                />


                <div className="OurValuesCards">

                    {values.map((value) => (

                        <div
                            className="OurValueCard"
                            key={value.title}
                        >

                            <div className="OurValueCard-icon">

                                <i className={value.icon}></i>

                            </div>


                            <h3>
                                {value.title}
                            </h3>


                            <p>
                                {value.description}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}


export default OurValues;