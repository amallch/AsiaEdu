import "./Footer.css";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


function Footer() {

    const [languages, setLanguages] = useState([]);

    const navigate = useNavigate();

    const location = useLocation();


    const contacts = [
        {
            id: 1,
            icon: "fa-solid fa-phone",
            text: "+1 (555) 123-4567"
        },
        {
            id: 2,
            icon: "fa-solid fa-envelope",
            text: "info@asiaedu.com"
        }
    ];


    const socials = [
        {
            id: 1,
            icon: "fa-brands fa-facebook-f"
        },
        {
            id: 2,
            icon: "fa-brands fa-instagram"
        },
        {
            id: 3,
            icon: "fa-brands fa-linkedin-in"
        }
    ];


    const quickLinks = [
        {
            id: 1,
            title: "Home",
            path: "/"
        },
        {
            id: 2,
            title: "Courses",
            path: "/courses"
        },
        {
            id: 3,
            title: "Programs",
            path: "/#programs"
        },
        {
            id: 4,
            title: "About",
            path: "/about"
        },
        {
            id: 5,
            title: "Contact",
            path: "/contact"
        }
    ];


    /* =====================================================
       FETCH LANGUAGES
    ===================================================== */

    useEffect(() => {

        const getLanguages = async () => {

            try {

                const response = await fetch(
                    "https://asiaedu-backend.onrender.com/api/courses"
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch courses"
                    );

                }


                const data = await response.json();


                const uniqueLanguages = [
                    ...new Set(
                        data
                            .map((course) => course.language)
                            .filter((language) => language)
                    )
                ];


                setLanguages(uniqueLanguages);

            }
            catch (error) {

                console.error(
                    "Error fetching footer languages:",
                    error
                );

            }

        };


        getLanguages();

    }, []);


    /* =====================================================
       SCROLL TO PROGRAMS
    ===================================================== */

    const handleProgramsClick = (event) => {

        event.preventDefault();


        if (location.pathname === "/") {

            const programsSection =
                document.getElementById("programs");


            if (programsSection) {

                programsSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
        else {

            navigate("/#programs");

        }

    };


    return (

        <footer className="Footer">

            <div className="Footer-container">

                <div className="FooterTop">


                    {/* =================================================
                        ABOUT
                    ================================================= */}

                    <div className="FooterAbout">

                        <div className="footerlogo-container">

                            <div className="footerlogo">

                                <i className="fa-solid fa-graduation-cap"></i>

                            </div>

                            <div className="webname-footer">

                                <p>AsiaEdu</p>

                            </div>

                        </div>


                        <div className="footer-desc">

                            <p>
                                Unlock new opportunities by mastering
                                Asian languages with experienced teachers
                                and personalized online learning.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        QUICK LINKS
                    ================================================= */}

                    <div className="FooterLinks">

                        <h3>Quick Links</h3>

                        <ul>

                            {quickLinks.map((link) => (

                                <li key={link.id}>

                                    {link.title === "Programs" ? (

                                        <a
                                            href="/#programs"
                                            onClick={handleProgramsClick}
                                        >
                                            {link.title}
                                        </a>

                                    ) : (

                                        <NavLink to={link.path}>
                                            {link.title}
                                        </NavLink>

                                    )}

                                </li>

                            ))}

                        </ul>

                    </div>


                    {/* =================================================
                        LANGUAGES
                    ================================================= */}

                    <div className="FooterLanguages">

                        <h3>Languages</h3>

                        <ul>

                            {languages.map((language) => (

                                <li key={language}>

                                    <NavLink
                                        to={`/courses?language=${encodeURIComponent(language)}`}
                                    >
                                        {language} Courses
                                    </NavLink>

                                </li>

                            ))}

                        </ul>

                    </div>


                    {/* =================================================
                        CONTACT
                    ================================================= */}

                    <div className="FooterContact">

                        <div className="Contact-us-footer">

                            <h3>Contact us</h3>

                            {contacts.map((contact) => (

                                <div
                                    className="contact-us-footer-div"
                                    key={contact.id}
                                >

                                    <div className="contact-us-icon">

                                        <i className={contact.icon}></i>

                                    </div>

                                    <p>
                                        {contact.text}
                                    </p>

                                </div>

                            ))}

                        </div>


                        {/* =================================================
                            FOLLOW US
                        ================================================= */}

                        <div className="Follow-us-footer">

                            <h3>Follow Us</h3>

                            <div className="Follow-us-footer-container">

                                {socials.map((social) => (

                                    <div
                                        className="Follow-us-footer-icon"
                                        key={social.id}
                                    >

                                        <i className={social.icon}></i>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    SEPARATOR
                ================================================= */}

                <div className="footer-seperation"></div>


                {/* =================================================
                    BOTTOM
                ================================================= */}

                <div className="FooterBottom">

                    <p>
                        © 2026 AsiaEdu. All rights reserved.
                    </p>

                </div>

            </div>

        </footer>

    );

}


export default Footer;