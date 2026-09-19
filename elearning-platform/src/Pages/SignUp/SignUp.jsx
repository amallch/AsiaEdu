import { useState } from "react";

import "./SignUp.css";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";


function SignUp() {

    const navigate = useNavigate();

    const location = useLocation();


    /* =====================================================
       REDIRECT INFORMATION
    ===================================================== */

    const redirectTo =
        location.state?.redirectTo || "";


    /* =====================================================
       COURSE DATA
    ===================================================== */

    const course =
        location.state?.course || null;


    /* =====================================================
       PASSWORD VISIBILITY
    ===================================================== */

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    /* =====================================================
       FORM DATA
    ===================================================== */

    const [firstName, setFirstName] =
        useState("");

    const [lastName, setLastName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    /* =====================================================
       ALERT WINDOW
    ===================================================== */

    const [alertMessage, setAlertMessage] =
        useState("");

    const [alertType, setAlertType] =
        useState("error");


    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();


        /* =================================================
           CHECK PASSWORDS
        ================================================= */

        if (password !== confirmPassword) {

            setAlertType("error");

            setAlertMessage(
                "Passwords do not match."
            );

            return;

        }


        try {

            /* =================================================
               CREATE USER
            ================================================= */

            const response = await fetch(
                "http://localhost:5000/api/users",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        firstName,

                        lastName,

                        email,

                        password

                    })
                }
            );


            const data =
                await response.json();


            /* =================================================
               CHECK RESPONSE
            ================================================= */

            if (!response.ok) {

                setAlertType("error");

                setAlertMessage(
                    data.message ||
                    "Registration failed."
                );

                return;

            }


            /* =================================================
               SAVE USER IN LOCAL STORAGE
            ================================================= */

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            /* =================================================
               UPDATE HEADER
            ================================================= */

            window.dispatchEvent(
                new Event("authChanged")
            );


            /* =================================================
               APPLY TO TEACH
            ================================================= */

            if (
                redirectTo === "/apply-to-teach"
            ) {

                navigate(
                    "/apply-to-teach",
                    {
                        state: {

                            userId:
                                data.user.id,

                            firstName:
                                data.user.firstName,

                            lastName:
                                data.user.lastName,

                            email:
                                data.user.email

                        }
                    }
                );

                return;

            }


            /* =================================================
               STUDENT ENROLLMENT
            ================================================= */

            if (redirectTo) {

                navigate(
                    redirectTo,
                    {
                        state: {

                            course:
                                course

                        }
                    }
                );

                return;

            }


            /* =================================================
               ACCOUNT CREATED SUCCESSFULLY
            ================================================= */

            setAlertType("success");

            setAlertMessage(
                "Your account has been created successfully!"
            );


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            setAlertType("error");

            setAlertMessage(
                "Could not connect to the server. Please try again."
            );

        }

    };


    /* =====================================================
       CLOSE ALERT
    ===================================================== */

    const handleCloseAlert = () => {

        setAlertMessage("");

        if (alertType === "success") {

            navigate("/signin");

        }

    };


    return (

        <section className="SignUp">

            <div className="SignUp-card">


                {/* =================================================
                   LOGO
                ================================================= */}

                <div className="SignUp-logo">

                    <i className="fa-solid fa-graduation-cap"></i>

                </div>


                {/* =================================================
                   HEADING
                ================================================= */}

                <h1>
                    Create Your Account
                </h1>


                <p className="SignUp-subtitle">

                    Join thousands of learners mastering Asian languages

                </p>


                <form
                    className="SignUp-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                       FIRST NAME / LAST NAME
                    ================================================= */}

                    <div className="SignUpInput-row">


                        <div className="SignUpInput">

                            <label htmlFor="firstName">
                                First Name
                            </label>


                            <div className="SignUpInput-field">

                                <i className="fa-regular fa-user"></i>


                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <div className="SignUpInput">

                            <label htmlFor="lastName">
                                Last Name
                            </label>


                            <div className="SignUpInput-field">

                                <i className="fa-regular fa-user"></i>


                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                    </div>


                    {/* =================================================
                       EMAIL
                    ================================================= */}

                    <div className="SignUpInput">

                        <label htmlFor="email">
                            Email Address
                        </label>


                        <div className="SignUpInput-field">

                            <i className="fa-regular fa-envelope"></i>


                            <input
                                id="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* =================================================
                       PASSWORD
                    ================================================= */}

                    <div className="SignUpInput">

                        <label htmlFor="password">
                            Password
                        </label>


                        <div className="SignUpInput-field">

                            <i className="fa-solid fa-lock"></i>


                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />


                            <i
                                className={`SignUpInput-toggle ${
                                    showPassword
                                        ? "fa-regular fa-eye-slash"
                                        : "fa-regular fa-eye"
                                }`}
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            ></i>

                        </div>

                    </div>


                    {/* =================================================
                       CONFIRM PASSWORD
                    ================================================= */}

                    <div className="SignUpInput">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>


                        <div className="SignUpInput-field">

                            <i className="fa-solid fa-lock"></i>


                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />


                            <i
                                className={`SignUpInput-toggle ${
                                    showConfirmPassword
                                        ? "fa-regular fa-eye-slash"
                                        : "fa-regular fa-eye"
                                }`}
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            ></i>

                        </div>

                    </div>


                    {/* =================================================
                       SUBMIT
                    ================================================= */}

                    <button
                        type="submit"
                        className="SignUp-submit"
                    >

                        Create Account

                    </button>


                </form>


                {/* =================================================
                   FOOTER
                ================================================= */}

                <p className="SignUp-footer">

                    Already have an account?

                    <Link to="/signin">
                        Sign In
                    </Link>

                </p>


            </div>


            {/* =================================================
               ALERT WINDOW
            ================================================= */}

            {alertMessage && (

                <div className="SignUpAlert-overlay">

                    <div
                        className={`SignUpAlert ${
                            alertType === "success"
                                ? "SignUpAlert-success"
                                : ""
                        }`}
                    >

                        <div className="SignUpAlert-icon">

                            <i
                                className={
                                    alertType === "success"
                                        ? "fa-solid fa-circle-check"
                                        : "fa-solid fa-circle-exclamation"
                                }
                            ></i>

                        </div>


                        <h2>

                            {alertType === "success"
                                ? "Account Created"
                                : "Something went wrong"}

                        </h2>


                        <p>
                            {alertMessage}
                        </p>


                        <button
                            type="button"
                            onClick={handleCloseAlert}
                        >
                            {alertType === "success"
                                ? "Continue"
                                : "OK"}
                        </button>

                    </div>

                </div>

            )}

        </section>

    );

}


export default SignUp;