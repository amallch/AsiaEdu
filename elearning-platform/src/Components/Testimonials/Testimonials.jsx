import "./Testimonials.css";

import { useEffect, useRef, useState } from "react";

import TestimonialCard from "../../Cards/TestimonialCard/TestimonialCard";

import Hero from "../../Components/Hero/Hero";


function Testimonials() {

    const testimonials = [
        {
            id: 1,
            name: "Emily Thompson",
            job: "Marketing Manager",
            comment:
                "AsiaEdu made learning Chinese much easier than I expected. The live classes and supportive teachers helped me gain confidence in speaking every week."
        },

        {
            id: 2,
            name: "Daniel Carter",
            job: "University Student",
            comment:
                "I started Japanese with zero knowledge, and after just a few months I could read Hiragana and hold simple conversations. The lessons were engaging and well organized."
        },

        {
            id: 3,
            name: "Sophia Kim",
            job: "Exchange Student",
            comment:
                "I needed Korean for my studies abroad, and this course exceeded my expectations. The instructors explained everything clearly and always encouraged us to practice."
        },

        {
            id: 4,
            name: "Olivia Wilson",
            job: "Language Student",
            comment:
                "The teachers are patient and professional, and the lessons are very easy to follow. I feel much more comfortable speaking Chinese now."
        },

        {
            id: 5,
            name: "James Anderson",
            job: "University Student",
            comment:
                "The Japanese lessons are well structured and interactive. I especially enjoy the speaking activities because they help me practice what I learn."
        },

        {
            id: 6,
            name: "Mia Johnson",
            job: "Exchange Student",
            comment:
                "AsiaEdu gave me the confidence I needed to start learning Korean. The classes are enjoyable and the instructors are always supportive."
        }
    ];


    /* =====================================================
       SECTION ANIMATION
    ===================================================== */

    const sectionRef = useRef(null);


    /* =====================================================
       VISIBLE CARDS
    ===================================================== */

    const getVisibleCards = () => {

        if (window.innerWidth <= 768) {

            return 1;

        }


        if (window.innerWidth <= 992) {

            return 2;

        }


        return 3;

    };


    const [visibleCards, setVisibleCards] =
        useState(getVisibleCards);


    const [currentIndex, setCurrentIndex] =
        useState(0);


    /* =====================================================
       RESIZE
    ===================================================== */

    useEffect(() => {

        const handleResize = () => {

            setVisibleCards(
                getVisibleCards()
            );

            setCurrentIndex(0);

        };


        window.addEventListener(
            "resize",
            handleResize
        );


        return () => {

            window.removeEventListener(
                "resize",
                handleResize
            );

        };

    }, []);


    /* =====================================================
       SCROLL ANIMATION
    ===================================================== */

    useEffect(() => {

        const section =
            sectionRef.current;


        if (!section) {

            return;

        }


        const observer =
            new IntersectionObserver(

                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            section.classList.add(
                                "Testimonials-visible"
                            );

                        }
                        else {

                            section.classList.remove(
                                "Testimonials-visible"
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
       NEXT
    ===================================================== */

    const nextTestimonials = () => {

        if (
            currentIndex <
            testimonials.length - visibleCards
        ) {

            setCurrentIndex(
                currentIndex + 1
            );

        }

    };


    /* =====================================================
       PREVIOUS
    ===================================================== */

    const previousTestimonials = () => {

        if (currentIndex > 0) {

            setCurrentIndex(
                currentIndex - 1
            );

        }

    };


    const visibleTestimonials =
        testimonials.slice(
            currentIndex,
            currentIndex + visibleCards
        );


    return (

        <section
            className="Testimonials"
            ref={sectionRef}
        >

            <div className="Testimonials-container">


                {/* =================================================
                   HERO
                ================================================= */}

                <Hero
                    center
                    badge="Student Reviews"
                    title="Hear From Our"
                    highlight="Learners"
                    description="Every success story inspires us. Explore what our students have to say about their learning journey with AsiaEdu."
                />


                {/* =================================================
                   SLIDER
                ================================================= */}

                <div className="Testimonials-slider">


                    <button
                        className="Testimonials-arrow Testimonials-arrow-left"
                        type="button"
                        onClick={previousTestimonials}
                        disabled={
                            currentIndex === 0
                        }
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                    </button>


                    <div className="Testimonials-cards">

                        {visibleTestimonials.map(
                            (testimonial) => (

                                <TestimonialCard
                                    key={testimonial.id}
                                    testimonial={testimonial}
                                />

                            )
                        )}

                    </div>


                    <button
                        className="Testimonials-arrow Testimonials-arrow-right"
                        type="button"
                        onClick={nextTestimonials}
                        disabled={
                            currentIndex >=
                            testimonials.length -
                            visibleCards
                        }
                    >

                        <i className="fa-solid fa-arrow-right"></i>

                    </button>


                </div>

            </div>

        </section>

    );

}


export default Testimonials;