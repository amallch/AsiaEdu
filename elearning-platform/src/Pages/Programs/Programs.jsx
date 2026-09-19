import ProgramsGrid from "../../Components/ProgramsGrid/ProgramsGrid";
import Hero from "../../Components/Hero/Hero"

function Programs() {
    return (
        <>
            <Hero
                center
                badge="Our Programs"
                title="Find the Perfect"
                highlight="Program"
                description="Choose the learning path that best matches your goals, schedule, and preferred learning style."
            />
            <ProgramsGrid />
        </>
    );
}

export default Programs;