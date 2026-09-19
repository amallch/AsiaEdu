import "./ContactSection.css";

import { useEffect, useRef, useState } from "react";


function ContactSection() {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sectionRef = useRef(null);


    const socials = [
        {
            id: 1,
            icon: "fa-brands fa-facebook-f",
            label: "Facebook",
            href: "#"
        },
        {
            id: 2,
            icon: "fa-brands fa-linkedin-in",
            label: "LinkedIn",
            href: "#"
        },
        {
            id: 3,
            icon: "fa-brands fa-instagram",
            label: "Instagram",
            href: "#"
        }
    ];


    const contactInfo = [
        {
            icon: "fa-solid fa-phone",
            title: "Phone",
            lines: [
                "+213 555 12 34 56"
            ]
        },
        {
            icon: "fa-solid fa-envelope",
            title: "Email",
            lines: [
                "contact@asiaedu.com"
            ]
        },
        {
            icon: "fa-regular fa-clock",
            title: "Office Hours",
            lines: [
                "Monday - Friday: 9:00 AM - 6:00 PM",
                "Saturday: 10:00 AM - 4:00 PM",
                "Sunday: Closed"
            ]
        }
    ];


    useEffect(() => {

        const section = sectionRef.current;

        if (!section) {
            return;
        }


        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        section.classList.add(
                            "ContactSection-visible"
                        );

                    }
                    else {

                        section.classList.remove(
                            "ContactSection-visible"
                        );

                    }

                });

            },

            {
                threshold: 0.15
            }

        );


        observer.observe(section);


        return () => {

            observer.disconnect();

        };

    }, []);


    function handleChange(e) {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    }


    async function handleSubmit(e) {

        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");
        setIsSubmitting(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message || "Failed to send message"
                );

            }

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });

            setSuccessMessage(
                "Your message has been sent successfully!"
            );

        }
        catch (error) {

            console.log(
                "Error sending message:",
                error
            );

            setErrorMessage(
                "Something went wrong. Please try again."
            );

        }
        finally {

            setIsSubmitting(false);

        }

    }


    function closeSuccessModal() {

        setSuccessMessage("");

    }


    function closeErrorModal() {

        setErrorMessage("");

    }


    return (

        <section
            className="ContactSection"
            ref={sectionRef}
        >

            <div className="ContactSection-container">

                <div className="ContactSection-grid">


                    {/* ================================================= */}
                    {/* LEFT - CONTACT FORM */}
                    {/* ================================================= */}

                    <form
                        className="ContactForm"
                        onSubmit={handleSubmit}
                    >

                        <div className="ContactForm-heading">

                            <span className="ContactForm-badge">
                                Get In Touch
                            </span>

                            <h3>
                                Send Us a Message
                            </h3>

                            <p>
                                Have a question or need help?
                                Send us a message and our team
                                will get back to you.
                            </p>

                        </div>


                        <div className="ContactForm-content">


                            <div className="ContactInput">

                                <label htmlFor="firstName">
                                    First Name
                                </label>

                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="ContactInput">

                                <label htmlFor="lastName">
                                    Last Name
                                </label>

                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="ContactInput ContactFull">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="ContactInput ContactFull">

                                <label htmlFor="phone">
                                    Phone Number
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    placeholder="+213 555 12 34 56"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="ContactInput ContactFull">

                                <label htmlFor="subject">
                                    Subject
                                </label>

                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    placeholder="How can we help you?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="ContactInput ContactFull">

                                <label htmlFor="message">
                                    Message
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    placeholder="Tell us more about your inquiry..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>

                            </div>


                            <div className="ContactFull ContactButton">

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                >

                                    <span>
                                        {isSubmitting
                                            ? "Sending..."
                                            : "Send Message"
                                        }
                                    </span>

                                    <i
                                        className={
                                            isSubmitting
                                                ? "fa-solid fa-spinner fa-spin"
                                                : "fa-regular fa-paper-plane"
                                        }
                                    ></i>

                                </button>

                            </div>

                        </div>

                    </form>


                    {/* ================================================= */}
                    {/* RIGHT COLUMN */}
                    {/* ================================================= */}

                    <div className="ContactRight">


                        {/* CONTACT INFORMATION */}

                        <div className="ContactInfo">

                            <div className="ContactCard-heading">

                                <span>
                                    Contact
                                </span>

                                <h3>
                                    Contact Information
                                </h3>

                            </div>


                            <div className="ContactInfo-list">

                                {contactInfo.map((item) => (

                                    <div
                                        className="ContactInfoItem"
                                        key={item.title}
                                    >

                                        <div className="ContactInfoIcon">

                                            <i className={item.icon}></i>

                                        </div>


                                        <div className="ContactInfoContent">

                                            <h4>
                                                {item.title}
                                            </h4>

                                            {item.lines.map(
                                                (line, index) => (

                                                    <p key={index}>
                                                        {line}
                                                    </p>

                                                )
                                            )}

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* FOLLOW US */}

                        <div className="FollowUs">

                            <h3>
                                Follow Us
                            </h3>

                            <p>
                                Stay connected with AsiaEdu.
                            </p>


                            <div className="FollowUs-icons">

                                {socials.map((social) => (

                                    <a
                                        className="FollowUs-icon"
                                        href={social.href}
                                        aria-label={social.label}
                                        key={social.id}
                                    >

                                        <i
                                            className={social.icon}
                                        ></i>

                                    </a>

                                ))}

                            </div>

                        </div>


                        {/* QUICK FAQ */}

                        <div className="QuickFAQ">

                            <h3>

                                <i className="fa-regular fa-circle-question"></i>

                                Quick FAQ

                            </h3>


                            <div className="QuickFAQ-content">

                                <div className="FAQItem">

                                    <h4>
                                        How do I enroll in a course?
                                    </h4>

                                    <p>
                                        Browse our catalog and click
                                        "Enroll".
                                    </p>

                                </div>


                                <div className="FAQItem">

                                    <h4>
                                        Can I change my level?
                                    </h4>

                                    <p>
                                        Yes, after evaluation with
                                        your teacher.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* SUCCESS MODAL */}
            {/* ================================================= */}

            {successMessage && (

                <div
                    className="ContactModalOverlay"
                    onClick={closeSuccessModal}
                >

                    <div
                        className="ContactSuccessModal"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >

                        <button
                            className="ContactModalClose"
                            type="button"
                            onClick={closeSuccessModal}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>


                        <div className="ContactSuccessIcon">

                            <i className="fa-solid fa-check"></i>

                        </div>


                        <h3>
                            Message Sent!
                        </h3>


                        <p>
                            Thank you for contacting us.
                            Your message has been received successfully.
                        </p>


                        <button
                            className="ContactModalButton"
                            type="button"
                            onClick={closeSuccessModal}
                        >

                            <span>
                                Done
                            </span>

                            <i className="fa-solid fa-check"></i>

                        </button>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* ERROR MODAL */}
            {/* ================================================= */}

            {errorMessage && (

                <div
                    className="ContactModalOverlay"
                    onClick={closeErrorModal}
                >

                    <div
                        className="ContactErrorModal"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >

                        <button
                            className="ContactModalClose"
                            type="button"
                            onClick={closeErrorModal}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>


                        <div className="ContactErrorIcon">

                            <i className="fa-solid fa-xmark"></i>

                        </div>


                        <h3>
                            Something Went Wrong
                        </h3>


                        <p>
                            We couldn't send your message.
                            Please check your information and try again.
                        </p>


                        <button
                            className="ContactModalErrorButton"
                            type="button"
                            onClick={closeErrorModal}
                        >

                            <span>
                                Close
                            </span>

                        </button>

                    </div>

                </div>

            )}

        </section>

    );

}


export default ContactSection;