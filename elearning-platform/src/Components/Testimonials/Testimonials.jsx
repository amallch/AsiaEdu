import "./Testimonials.css";

import { useEffect, useRef, useState } from "react";

import TestimonialCard from "../../Cards/TestimonialCard/TestimonialCard";

import Hero from "../../Components/Hero/Hero";

import { getReviews } from "../../api/reviewsApi";


function Testimonials() {

    /* =====================================================
       REVIEWS STATE
    ===================================================== */

    const [testimonials, setTestimonials] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);


    /* =====================================================
       FETCH REVIEWS FROM API
    ===================================================== */

    useEffect(() => {

        const fetchReviews = async () => {

            try {

                const data = await getReviews();

                setTestimonials(data.reviews || []);

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);

            }

        };


        fetchReviews();

    }, []);


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
                   LOADING / ERROR
                ================================================= */}

                {loading && (

                    <p className="Testimonials-status">
                        Loading reviews...
                    </p>

                )}

                {error && (

                    <p className="Testimonials-status">
                        Could not load reviews.
                    </p>

                )}


                {/* =================================================
                   SLIDER
                ================================================= */}

                {!loading && !error && testimonials.length > 0 && (

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
                                        key={testimonial._id}
                                        testimonial={{
                                            name: testimonial.name,
                                            job: testimonial.courseName,
                                            comment: testimonial.message,
                                            rating: testimonial.rating
                                        }}
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

                )}

            </div>

        </section>

    );

}


export default Testimonials;