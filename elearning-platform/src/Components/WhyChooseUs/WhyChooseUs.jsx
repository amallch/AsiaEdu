import "./WhyChooseUs.css";

import { useEffect, useRef } from "react";

import Hero from "../../Components/Hero/Hero";

import WhyChooseCard from "../../Cards/WhyChooseCard/WhyChooseCard";


function WhyChooseUs() {

    const sectionRef = useRef(null);


    const features = [

        {
            icon: "fa-solid fa-display",

            title1: "Flexible & Convenient",
            title2: "Learning",

            description:
                "Study anytime, anywhere with our flexible online classes that fit your schedule."
        },


        {
            icon: "fa-solid fa-book-open",

            title1: "Interactive & Engaging",
            title2: "Lessons",

            description:
                "Enjoy interactive lessons, practice exercises, and real-life conversations to build confidence."
        },


        {
            icon: "fa-solid fa-earth-asia",

            title1: "Connect With",
            title2: "Asian Cultures",

            description:
                "Explore rich Asian cultures while learning the language in a fun and meaningful way."
        }

    ];


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
                            "WhyChooseUs-visible"
                        );

                    }

                    else {

                        section.classList.remove(
                            "WhyChooseUs-visible"
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
            className="WhyChooseUs"
            ref={sectionRef}
        >

            <div className="WhyChooseUs-container">

                <Hero
                    center
                    badge="Why AsiaEdu"
                    title="Learn . Connect . Grow"
                    description="From experienced native teachers to flexible learning and immersive cultural experiences, we provide everything you need to build real language confidence."
                />


                <div className="WhyChooseUs-cards">

                    {features.map((feature) => (

                        <WhyChooseCard
                            key={feature.title1}
                            item={feature}
                        />

                    ))}

                </div>

            </div>

        </section>

    );

}


export default WhyChooseUs;