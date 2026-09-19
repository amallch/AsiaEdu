import "./Home.css";

import { useEffect } from "react";

import HomeHero from "../../Components/HomeHero/HomeHero";
import Statistics from "../../Components/Statistics/Statistics";
import LanguageShowcase from "../../Components/LanguageShowcase/LanguageShowcase";
import WhyChooseUs from "../../Components/WhyChooseUs/WhyChooseUs";
import HomePrograms from "../../Components/HomePrograms/HomePrograms";
import HomeCourses from "../../Components/HomeCourses/HomeCourses";
import Testimonials from "../../Components/Testimonials/Testimonials";
import BecomeTutor from "../../Components/BecomeTutor/BecomeTutor";
import FaqAccordion from "../../Components/FaqAccordion/FaqAccordion";
import ReadyToStart from "../../Components/ReadyToStart/ReadyToStart";
import Footer from "../../Layout/Footer/Footer";


function Home() {

    useEffect(() => {

        if (window.location.hash === "#programs") {

            const scrollToPrograms = () => {

                const programsSection =
                    document.getElementById("programs");


                if (programsSection) {

                    programsSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            };


            setTimeout(scrollToPrograms, 150);

        }

    }, []);


    return (
        <>
            <HomeHero />

            <LanguageShowcase />

            <WhyChooseUs />

            <Statistics />

            <HomePrograms />

            <HomeCourses />

            <Testimonials />

            <BecomeTutor />

            <FaqAccordion />

            <ReadyToStart />

            <Footer />
        </>
    );
}


export default Home;