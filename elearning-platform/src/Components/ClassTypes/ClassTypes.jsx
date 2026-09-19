import "./ClassTypes.css";

import Hero from "../Hero/Hero";


function ClassTypes() {

    return (

        <section className="class-types">

            <div className="class-types-container">

                <Hero
                    badge="CLASS TYPES"
                    title="Learning That Fits"
                    highlight="You"
                    description="Choose the class format that matches your learning style and goals."
                    center={true}
                />


                <div className="class-types-cards">


                    {/* =================================================
                       SMALL GROUP
                    ================================================= */}

                    <div className="class-type-card">

                        <div className="class-type-icon">

                            <i className="fa-solid fa-users"></i>

                        </div>


                        <div className="class-type-content">

                            <span className="class-type-label">
                                COLLABORATIVE LEARNING
                            </span>

                            <h3>
                                Small Group Classes
                            </h3>

                            <p>
                                Learn with a small group of students in a
                                friendly and interactive environment where
                                everyone gets the chance to participate.
                            </p>


                            <div className="class-type-feature">

                                <i className="fa-solid fa-check"></i>

                                <span>
                                    Interactive group learning
                                </span>

                            </div>


                            <div className="class-type-feature">

                                <i className="fa-solid fa-check"></i>

                                <span>
                                    Practice with other learners
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                       INDIVIDUAL
                    ================================================= */}

                    <div className="class-type-card">

                        <div className="class-type-icon">

                            <i className="fa-solid fa-user"></i>

                        </div>


                        <div className="class-type-content">

                            <span className="class-type-label">
                                PERSONALIZED LEARNING
                            </span>

                            <h3>
                                Individual Classes
                            </h3>

                            <p>
                                Enjoy personalized one-on-one lessons focused
                                on your goals, your level, and your own pace.
                            </p>


                            <div className="class-type-feature">

                                <i className="fa-solid fa-check"></i>

                                <span>
                                    Lessons tailored to your goals
                                </span>

                            </div>


                            <div className="class-type-feature">

                                <i className="fa-solid fa-check"></i>

                                <span>
                                    Learn at your own pace
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}


export default ClassTypes;