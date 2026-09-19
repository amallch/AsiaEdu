import AboutHero from "../../Components/AboutHero/AboutHero";
import MissionVision from "../../Components/MissionVision/MissionVision";
import Statistics from "../../Components/Statistics/Statistics";
import WhyChooseUs from "../../Components/WhyChooseUs/WhyChooseUs";
import OurValues from "../../Components/OurValues/OurValues";
import FaqAccordion from "../../Components/FaqAccordion/FaqAccordion";
import ReadyToStart from "../../Components/ReadyToStart/ReadyToStart";
import Footer from "../../Layout/Footer/Footer";


function About() {

    return (
        <>
            <AboutHero />

            <Statistics />

            <MissionVision />

            <WhyChooseUs />

            <OurValues />

            <FaqAccordion />

            <ReadyToStart />

            <Footer />
        </>
    );

}


export default About;