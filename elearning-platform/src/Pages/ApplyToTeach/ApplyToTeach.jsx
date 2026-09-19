import "./ApplyToTeach.css";

import { useEffect, useState } from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import Hero from "../../Components/Hero/Hero";


function ApplyToTeach() {

    const location = useLocation();

    const navigate = useNavigate();


    /* =====================================================
       GET LOGGED-IN USER FROM LOCAL STORAGE
    ===================================================== */

    const [loggedInUser, setLoggedInUser] = useState(null);

    const [authChecked, setAuthChecked] = useState(false);


    useEffect(() => {

        const savedUser = localStorage.getItem("user");


        if (savedUser) {

            try {

                const parsedUser =
                    JSON.parse(savedUser);


                setLoggedInUser(parsedUser);

            } catch (error) {

                console.log(
                    "Error reading logged-in user:",
                    error
                );

                localStorage.removeItem("user");

            }

        }


        /*
           IMPORTANT:

           We have finished checking localStorage.
           Now the authentication check is allowed
           to run.
        */

        setAuthChecked(true);

    }, []);


    /* =====================================================
       USER INFORMATION FROM SIGNUP
    ===================================================== */

    const stateUserId =
        location.state?.userId || "";

    const stateFirstName =
        location.state?.firstName || "";

    const stateLastName =
        location.state?.lastName || "";

    const stateEmail =
        location.state?.email || "";


    /* =====================================================
       LOGGED-IN USER INFORMATION
    ===================================================== */

    const loggedUserId =
        loggedInUser?.id ||
        loggedInUser?._id ||
        "";

    const loggedUserFirstName =
        loggedInUser?.firstName ||
        "";

    const loggedUserLastName =
        loggedInUser?.lastName ||
        "";

    const loggedUserEmail =
        loggedInUser?.email ||
        "";


    /* =====================================================
       FINAL USER INFORMATION
    ===================================================== */

    const userId =
        stateUserId ||
        loggedUserId;


    const registeredFirstName =
        stateFirstName ||
        loggedUserFirstName;


    const registeredLastName =
        stateLastName ||
        loggedUserLastName;


    const registeredEmail =
        stateEmail ||
        loggedUserEmail;


    /* =====================================================
       AUTHENTICATION CHECK
    ===================================================== */

    useEffect(() => {

        /*
           IMPORTANT:

           Do not check authentication until
           localStorage has been checked.
        */

        if (!authChecked) {

            return;

        }


        /*
           If there is no logged-in user,
           redirect to Sign In.
        */

        if (!stateUserId && !loggedInUser) {

            navigate("/signin", {

                state: {
                    redirectTo: "/apply-to-teach"
                }

            });

            return;

        }

    }, [
        authChecked,
        loggedInUser,
        stateUserId,
        navigate
    ]);


    /* =====================================================
       STATE
    ===================================================== */

    const [submitted, setSubmitted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);


    const [formData, setFormData] = useState({

        firstName: registeredFirstName,

        lastName: registeredLastName,

        email: registeredEmail,

        phone: "",

        language: "",

        level: "",

        experience: "",

        education: "",

        bio: "",

        availability: "",

    });


    /* =====================================================
       UPDATE FORM WHEN USER INFORMATION IS AVAILABLE
    ===================================================== */

    useEffect(() => {

        setFormData((previousData) => ({

            ...previousData,

            firstName: registeredFirstName,

            lastName: registeredLastName,

            email: registeredEmail,

        }));

    }, [
        registeredFirstName,
        registeredLastName,
        registeredEmail
    ]);


    /* =====================================================
       HANDLE CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const { name, value } = event.target;


        setFormData({

            ...formData,

            [name]: value

        });

    };


    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();


        /* -------------------------------------------------
           SECURITY CHECK
        ------------------------------------------------- */

        if (!userId) {

            alert(
                "You must be logged in before submitting a tutor application."
            );


            navigate("/signin", {

                state: {
                    redirectTo: "/apply-to-teach"
                }

            });


            return;

        }


        setIsSubmitting(true);


        try {

            const response = await fetch(
                "https://asiaedu-backend.onrender.com/api/tutor-applications",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        userId: userId,

                        ...formData

                    })

                }
            );


            const data =
                await response.json();


            if (response.ok) {

                console.log(
                    "Application submitted successfully:",
                    data
                );


                setSubmitted(true);

                setIsSubmitting(false);

            } else {

                console.log(
                    "Application failed:",
                    data
                );


                alert(
                    data.message ||
                    "Failed to submit application"
                );


                setIsSubmitting(false);

            }


        } catch (error) {

            console.log(
                "Error submitting application:",
                error
            );


            alert(
                "Could not connect to the server"
            );


            setIsSubmitting(false);

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <section className="ApplyToTeach">

            <div className="ApplyToTeach-container">


                {/* =====================================================
                   HERO
                ===================================================== */}

                <Hero
                    center
                    badge="Apply to Teach"
                    title="Apply to Teach with"
                    highlight="AsiaEdu"
                    description="Share your knowledge, inspire learners, and become part of our growing community of tutors."
                />


                {/* =====================================================
                   SUCCESS MESSAGE / APPLICATION FORM
                ===================================================== */}

                {submitted ? (

                    <div className="ApplyToTeach-success">

                        <div className="ApplyToTeach-successIcon">

                            <i className="fa-solid fa-check"></i>

                        </div>


                        <h2>
                            Application Submitted Successfully!
                        </h2>


                        <p>
                            Thank you for applying to teach with AsiaEdu.
                            We will review your application and contact
                            you with the next steps.
                        </p>

                    </div>

                ) : (

                    <form
                        className="ApplyToTeach-form"
                        onSubmit={handleSubmit}
                    >


                        {/* =================================================
                           PERSONAL INFORMATION
                        ================================================= */}

                        <div className="ApplyToTeach-section">

                            <div className="ApplyToTeach-sectionHeader">

                                <div className="ApplyToTeach-sectionIcon">

                                    <i className="fa-regular fa-user"></i>

                                </div>


                                <div>

                                    <h2>
                                        Personal Information
                                    </h2>

                                    <p>
                                        Tell us a little about yourself.
                                    </p>

                                </div>

                            </div>


                            <div className="ApplyToTeach-grid">


                                <div className="ApplyToTeach-field">

                                    <label htmlFor="firstName">
                                        First Name
                                    </label>

                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="Enter your first name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="ApplyToTeach-field">

                                    <label htmlFor="lastName">
                                        Last Name
                                    </label>

                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Enter your last name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="ApplyToTeach-field">

                                    <label htmlFor="email">
                                        Email Address
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="ApplyToTeach-field">

                                    <label htmlFor="phone">
                                        Phone Number
                                    </label>

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+213 ..."
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                            </div>

                        </div>


                        {/* =================================================
                           TEACHING INFORMATION
                        ================================================= */}

                        <div className="ApplyToTeach-section">

                            <div className="ApplyToTeach-sectionHeader">

                                <div className="ApplyToTeach-sectionIcon">

                                    <i className="fa-solid fa-chalkboard-user"></i>

                                </div>


                                <div>

                                    <h2>
                                        Teaching Information
                                    </h2>

                                    <p>
                                        Tell us about what you would like to teach.
                                    </p>

                                </div>

                            </div>


                            <div className="ApplyToTeach-grid">


                                <div className="ApplyToTeach-field">

                                    <label htmlFor="language">
                                        Language You Teach
                                    </label>

                                    <select
                                        id="language"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select a language
                                        </option>

                                        <option value="Chinese">
                                            Chinese
                                        </option>

                                        <option value="Japanese">
                                            Japanese
                                        </option>

                                        <option value="Korean">
                                            Korean
                                        </option>

                                        <option value="Russian">
                                            Russian
                                        </option>

                                        <option value="Malay">
                                            Malay
                                        </option>

                                    </select>

                                </div>


                                <div className="ApplyToTeach-field">

                                    <label htmlFor="level">
                                        Level You Can Teach
                                    </label>

                                    <select
                                        id="level"
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select a level
                                        </option>

                                        <option value="Beginner">
                                            Beginner
                                        </option>

                                        <option value="Intermediate">
                                            Intermediate
                                        </option>

                                        <option value="Advanced">
                                            Advanced
                                        </option>

                                        <option value="All Levels">
                                            All Levels
                                        </option>

                                    </select>

                                </div>


                                <div className="ApplyToTeach-field">

                                    <label htmlFor="experience">
                                        Teaching Experience
                                    </label>

                                    <select
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select your experience
                                        </option>

                                        <option value="Less than 1 year">
                                            Less than 1 year
                                        </option>

                                        <option value="1-2 years">
                                            1–2 years
                                        </option>

                                        <option value="3-5 years">
                                            3–5 years
                                        </option>

                                        <option value="5+ years">
                                            5+ years
                                        </option>

                                    </select>

                                </div>


                                <div className="ApplyToTeach-field">

                                    <label htmlFor="education">
                                        Education
                                    </label>

                                    <input
                                        id="education"
                                        name="education"
                                        type="text"
                                        placeholder="Your degree or qualification"
                                        value={formData.education}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                            </div>

                        </div>


                        {/* =================================================
                           ABOUT YOU
                        ================================================= */}

                        <div className="ApplyToTeach-section">

                            <div className="ApplyToTeach-sectionHeader">

                                <div className="ApplyToTeach-sectionIcon">

                                    <i className="fa-regular fa-message"></i>

                                </div>


                                <div>

                                    <h2>
                                        Tell Us About Yourself
                                    </h2>

                                    <p>
                                        Help us get to know you as a tutor.
                                    </p>

                                </div>

                            </div>


                            <div className="ApplyToTeach-field">

                                <label htmlFor="bio">
                                    About You
                                </label>

                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows="6"
                                    placeholder="Tell us about yourself, your teaching style, and why you would like to teach with AsiaEdu..."
                                    value={formData.bio}
                                    onChange={handleChange}
                                    required
                                ></textarea>

                            </div>

                        </div>


                        {/* =================================================
                           AVAILABILITY
                        ================================================= */}

                        <div className="ApplyToTeach-section">

                            <div className="ApplyToTeach-sectionHeader">

                                <div className="ApplyToTeach-sectionIcon">

                                    <i className="fa-regular fa-clock"></i>

                                </div>


                                <div>

                                    <h2>
                                        Availability
                                    </h2>

                                    <p>
                                        Tell us when you are available to teach.
                                    </p>

                                </div>

                            </div>


                            <div className="ApplyToTeach-field">

                                <label htmlFor="availability">
                                    Your Availability
                                </label>

                                <textarea
                                    id="availability"
                                    name="availability"
                                    rows="4"
                                    placeholder="Example: Monday to Friday, 5 PM – 9 PM"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    required
                                ></textarea>

                            </div>

                        </div>


                        {/* =================================================
                           SUBMIT
                        ================================================= */}

                        <div className="ApplyToTeach-submit">

                            <button
                                type="submit"
                                className="ApplyToTeach-submitButton"
                                disabled={isSubmitting}
                            >

                                <span>
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Submit Application"
                                    }
                                </span>

                                <i className="fa-solid fa-arrow-right"></i>

                            </button>


                            <p>
                                We will review your application and contact
                                you with the next steps.
                            </p>

                        </div>


                    </form>

                )}

            </div>

        </section>

    );

}


export default ApplyToTeach;