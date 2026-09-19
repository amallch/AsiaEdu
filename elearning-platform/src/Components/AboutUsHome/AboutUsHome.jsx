import "./AboutUsHome.css";

import { useNavigate } from "react-router-dom";

import Button from "../../Utiles/Button/Button";

import aboutUsImage from "../../assets/aboutushome.png";


function AboutUsHome() {

    const navigate = useNavigate();


    return (

        <section className="AboutUsHome">

            <div className="AboutUsHome-container">


                {/* ================================================= */}
                {/* IMAGE */}
                {/* ================================================= */}

                <div className="AboutUsHome-image">
                    <img
                        src={aboutUsImage}
                        alt="AsiaEdu Students"
                    />
                </div>


                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <div className="AboutUsHome-content">

                    <span className="AboutUsHome-badge">
                        About Us
                    </span>


                    <h2>
                        Your journey to Asian language{" "}
                        <span>fluency</span> starts here
                    </h2>


                    <p>
                        AsiaEdu helps students master Asian languages through
                        engaging lessons, experienced instructors, and a
                        supportive learning environment built for real
                        progress, at your own pace.
                    </p>


                    {/* ================================================= */}
                    {/* STATISTICS */}
                    {/* ================================================= */}

                    <div className="AboutUsHome-highlights">

                        <div className="AboutUsHome-highlight">

                            <strong>
                                500+
                            </strong>

                            <span>
                                Students
                            </span>

                        </div>


                        <div className="AboutUsHome-highlight">

                            <strong>
                                4
                            </strong>

                            <span>
                                Languages
                            </span>

                        </div>


                        <div className="AboutUsHome-highlight">

                            <strong>
                                10+
                            </strong>

                            <span>
                                Tutors
                            </span>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* BUTTON */}
                    {/* ================================================= */}

                    <Button
                        text="Explore Us"
                        type="primary"
                        onClick={() => navigate("/about")}
                    />

                </div>

            </div>

        </section>

    );
}


export default AboutUsHome;