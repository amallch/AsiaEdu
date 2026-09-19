import "./Hero.css";

import { useEffect, useRef } from "react";


function Hero({
    badge,
    title,
    highlight,
    description,
    center = false
}) {

    const heroRef = useRef(null);


    useEffect(() => {

        const hero = heroRef.current;

        if (!hero) {
            return;
        }


        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        hero.classList.add("Hero-visible");

                    } else {

                        hero.classList.remove("Hero-visible");

                    }

                });

            },

            {
                threshold: 0.2
            }

        );


        observer.observe(hero);


        return () => {

            observer.disconnect();

        };

    }, []);


    return (

        <section
            className="Hero"
            ref={heroRef}
        >

            <div className="Hero-container">

                <div
                    className={`Hero-headings ${
                        center ? "center" : ""
                    }`}
                >

                    <span className="Hero-badge">
                        {badge}
                    </span>


                    <h2>
                        {title} <span>{highlight}</span>
                    </h2>


                    <p>
                        {description}
                    </p>

                </div>

            </div>

        </section>

    );

}


export default Hero;