import "./Courses.css";

import CoursesSection from "../../Components/CoursesSection/CoursesSection";
import Footer from "../../Layout/Footer/Footer";

import Hero from "../../Components/Hero/Hero";

function Courses() {
    return (
        <>
            <Hero
                center
                badge="Our Courses"
                title="Language"
                highlight="Courses"
                description="Find the perfect course for your learning goals, from beginner to advanced."
            />
            <CoursesSection />
            <Footer />
        </>
    );
}

export default Courses;