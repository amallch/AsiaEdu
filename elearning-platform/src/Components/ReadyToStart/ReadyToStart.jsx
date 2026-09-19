import "./ReadyToStart.css";

import { useNavigate } from "react-router-dom";

import Button from "../../Utiles/Button/Button";

import Hero from "../../Components/Hero/Hero";


function ReadyToStart() {

    const navigate = useNavigate();


    const handleStartLearning = () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        navigate("/courses");

    };


    return (

        <section className="ReadyToStart">

            <div className="ReadyToStart-container">

                <Hero
                    center
                    badge="Start Your Journey"
                    title={
                        <>
                            Ready to <span>Start</span> Your Language Journey?
                        </>
                    }
                    description="Join thousands of learners mastering Asian languages with expert teachers, interactive lessons, and flexible online classes."
                />


                <div className="ReadyToStart-buttons">

                    <Button
                        text="Start Learning"
                        onClick={handleStartLearning}
                    />

                </div>

            </div>

        </section>

    );

}


export default ReadyToStart;