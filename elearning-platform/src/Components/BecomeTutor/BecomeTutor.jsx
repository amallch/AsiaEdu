import "./BecomeTutor.css";

import { useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import Button from "../../Utiles/Button/Button";


function BecomeTutor() {

    const navigate = useNavigate();

    const sectionRef = useRef(null);


    /* =====================================================
       APPLY TO TEACH
    ===================================================== */

    const handleApplyToTeach = () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        const user =
            localStorage.getItem("user");


        /* =================================================
           USER IS ALREADY LOGGED IN
        ================================================= */

        if (user) {

            navigate("/apply-to-teach");

            return;
        }


        /* =================================================
           USER IS NOT LOGGED IN
        ================================================= */

        navigate("/signup", {

            state: {

                accountType: "tutor",

                redirectTo: "/apply-to-teach"

            }

        });

    };


    /* =====================================================
       SECTION ANIMATION
    ===================================================== */

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
                            "BecomeTutor-visible"
                        );

                    } else {

                        section.classList.remove(
                            "BecomeTutor-visible"
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
            className="BecomeTutor"
            ref={sectionRef}
        >

            <div className="BecomeTutor-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="BecomeTutor-content">

                    <span className="BecomeTutor-badge">
                        Become a Tutor
                    </span>


                    <h2>
                        Share Your Knowledge,
                        <span> Inspire Learners</span>
                    </h2>


                    <p>
                        Join AsiaEdu as a tutor and help students
                        discover new languages and cultures. Teach
                        what you love, connect with learners, and
                        make a meaningful impact.
                    </p>


                    <Button
                        text="Apply to Teach"
                        type="primary"
                        onClick={handleApplyToTeach}
                    />

                </div>


                {/* =================================================
                   BENEFITS
                ================================================= */}

                <div className="BecomeTutor-benefits">


                    <div className="BecomeTutor-benefit">

                        <div className="BecomeTutor-benefit-icon">

                            <i className="fa-solid fa-globe"></i>

                        </div>


                        <div>

                            <h3>
                                Teach From Anywhere
                            </h3>

                            <p>
                                Connect with students from different
                                places and cultures.
                            </p>

                        </div>

                    </div>


                    <div className="BecomeTutor-benefit">

                        <div className="BecomeTutor-benefit-icon">

                            <i className="fa-solid fa-users"></i>

                        </div>


                        <div>

                            <h3>
                                Build Connections
                            </h3>

                            <p>
                                Create meaningful relationships with
                                learners through language.
                            </p>

                        </div>

                    </div>


                    <div className="BecomeTutor-benefit">

                        <div className="BecomeTutor-benefit-icon">

                            <i className="fa-solid fa-lightbulb"></i>

                        </div>


                        <div>

                            <h3>
                                Make an Impact
                            </h3>

                            <p>
                                Help students grow their skills and
                                confidence every step of the way.
                            </p>

                        </div>

                    </div>


                </div>

            </div>

        </section>

    );

}


export default BecomeTutor;