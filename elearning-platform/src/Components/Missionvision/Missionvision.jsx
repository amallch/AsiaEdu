import "./MissionVision.css";

import Hero from "../../Components/Hero/Hero"

function MissionVision() {

    const items = [
        {
            id: 1,
            icon: "fa-solid fa-bullseye",
            title: "Our Mission",
            description: "To make learning Asian languages accessible, engaging, and effective for students everywhere through expert-led instruction, flexible online classes, and a genuinely supportive learning community."
        },
        {
            id: 2,
            icon: "fa-solid fa-eye",
            title: "Our Vision",
            description: "To become the world's leading platform for Asian language education, empowering learners to connect confidently across cultures and open doors to new opportunities, wherever they are."
        }
    ];

    return (
        <section className="MissionVision">

            <div className="MissionVision-container">
                <Hero
                    center
                    badge="Our Purpose"
                    title="What Drives Us "
                    highlight="Forward"
                    description="Two simple ideas guide everything we build at
                        AsiaEdu, from the courses we design to the teachers
                        we bring on board."
                />

                <div className="MissionVisionCards">

                    {items.map((item) => (
                        <div className="MissionVisionCard" key={item.id}>

                            <div className="MissionVisionCardIcon">
                                <i className={item.icon}></i>
                            </div>

                            <h3>{item.title}</h3>

                            <p>{item.description}</p>

                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}

export default MissionVision;
