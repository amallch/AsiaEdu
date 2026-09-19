import "./AboutHero.css";

import { useNavigate } from "react-router-dom";

import Button from "../../Utiles/Button/Button";

import Hero from "../../Components/Hero/Hero";


function AboutHero() {

    const navigate = useNavigate();


    return (

        <section className="AboutHero">

            <div className="AboutHero-container">


                {/* ================= HERO ================= */}

                <Hero
                    center
                    badge="About Us"
                    title="About AsiaEdu"
                    description="AsiaEdu is an online Asian language school that connects students with experienced native tutors through interactive lessons and daily practice. Our mission is to make learning Chinese, Japanese, Korean, and more engaging, practical, and accessible for everyone."
                />


                {/* ================= BUTTONS ================= */}

                <div className="AboutHero-buttons">

                    <Button
                        text="Discover Our Courses"
                        type="primary"
                        onClick={() => navigate("/courses")}
                    />

                    <Button
                        text="Contact Us"
                        type="outline"
                        onClick={() => navigate("/contact")}
                    />

                </div>

            </div>

        </section>

    );

}


export default AboutHero;