import Hero from "../../Components/Hero/Hero";
import SpeakingSessions from "../../Components/SpeakingSessions/SpeakingSessions"


function Speaking() {
    return (
        <>
            <Hero
                badge="Speaking Sessions"
                title="Find the perfect"
                highlight="speaking session"
                description="Browse available speaking sessions by language, level, and class type. Choose the session that matches your learning goals and start practicing with confidence."
                center={true}
            />
            <SpeakingSessions/>
        </>
    );
}

export default Speaking;