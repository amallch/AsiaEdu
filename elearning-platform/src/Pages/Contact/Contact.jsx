import ContactSection from "../../Components/ContactSection/ContactSection";
import FaqAccordion from "../../Components/FaqAccordion/FaqAccordion";
import ReadyToStart from "../../Components/ReadyToStart/ReadyToStart";

import Hero from "../../Components/Hero/Hero";


import Footer from "../../Layout/Footer/Footer";

function Contact() {
    return (
        <>
            <Hero
                center
                badge="Contact Us"
                title="Get In"
                highlight="Touch"
                description="Have questions or need assistance? We'd love to hear from you. Reach out to our team and we'll get back to you as soon as possible."
            />
            <ContactSection/>
            <FaqAccordion/>
            <ReadyToStart/>
            <Footer />
        </>
    );
}

export default Contact;