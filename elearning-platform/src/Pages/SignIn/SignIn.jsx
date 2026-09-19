import { useState } from "react";

import "./SignIn.css";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";


function SignIn() {

    const navigate = useNavigate();

    const location = useLocation();


    const [showPassword, setShowPassword] =
        useState(false);

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    /* =========================================================
       ALERT WINDOW
    ========================================================= */

    const [alertMessage, setAlertMessage] =
        useState("");


    /* =========================================================
       REDIRECT INFORMATION
    ========================================================= */

    const redirectTo =
        location.state?.redirectTo || null;

    const course =
        location.state?.course || null;


    /* =========================================================
       LOGIN
    ========================================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!email || !password) {

            setAlertMessage(
                "Please enter your email and password."
            );

            return;
        }


        try {

            const response = await fetch(
                "https://asiaedu-backend.onrender.com/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                setAlertMessage(
                    data.message ||
                    "Login failed. Please check your email and password."
                );

                return;
            }


            /* =================================================
               SAVE AUTHENTICATION TOKEN
            ================================================= */

            localStorage.setItem(
                "token",
                data.token
            );


            /* =================================================
               SAVE LOGGED-IN USER
            ================================================= */

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            /* =================================================
               UPDATE HEADER IMMEDIATELY
            ================================================= */

            window.dispatchEvent(
                new Event("authChanged")
            );


            console.log(
                "Logged in user:",
                data.user
            );


            /* =================================================
               ENROLLMENT REDIRECT
            ================================================= */

            if (
                redirectTo === "/enrollment" &&
                course
            ) {

                navigate(
                    "/enrollment",
                    {
                        state: {
                            course: course
                        }
                    }
                );

                return;
            }


            /* =================================================
               TUTOR APPLICATION REDIRECT
            ================================================= */

            if (
                redirectTo === "/apply-to-teach"
            ) {

                navigate(
                    "/apply-to-teach"
                );

                return;
            }


            /* =================================================
               DEFAULT LOGIN REDIRECT
            ================================================= */

            navigate("/");


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            setAlertMessage(
                "Could not connect to the server. Please try again."
            );

        }

    };


    return (

        <section className="SignIn">

            <div className="SignIn-card">

                <div className="SignIn-logo">

                    <i className="fa-solid fa-graduation-cap"></i>

                </div>


                <h1>
                    Welcome Back
                </h1>


                <p className="SignIn-subtitle">
                    Sign in to continue your language learning journey
                </p>


                <form
                    className="SignIn-form"
                    onSubmit={handleSubmit}
                >


                    {/* EMAIL */}

                    <div className="SignInInput">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <div className="SignInInput-field">

                            <i className="fa-regular fa-envelope"></i>

                            <input
                                id="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="SignInInput">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="SignInInput-field">

                            <i className="fa-solid fa-lock"></i>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />


                            <i
                                className={`SignInInput-toggle ${
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


                    {/* FORGOT PASSWORD */}

                    <div className="SignIn-row">

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="SignIn-submit"
                    >
                        Sign In
                    </button>

                </form>


                {/* FOOTER */}

                <p className="SignIn-footer">

                    Don't have an account?


                    <Link
                        to="/signup"
                        state={location.state}
                    >
                        Sign Up
                    </Link>

                </p>

            </div>


            {/* =====================================================
               ALERT WINDOW
            ====================================================== */}

            {alertMessage && (

                <div className="SignInAlert-overlay">

                    <div className="SignInAlert">

                        <div className="SignInAlert-icon">

                            <i className="fa-solid fa-circle-exclamation"></i>

                        </div>


                        <h2>
                            Something went wrong
                        </h2>


                        <p>
                            {alertMessage}
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                setAlertMessage("")
                            }
                        >
                            OK
                        </button>

                    </div>

                </div>

            )}

        </section>

    );

}


export default SignIn;