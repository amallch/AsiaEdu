import { useState } from "react";

import "./ForgotPassword.css";

import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email) {
            alert("Please enter your email address");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/users/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Something went wrong");
                return;
            }

            alert("Password reset link generated!");

            navigate(`/reset-password?token=${data.resetToken}`);

        } catch (error) {

            console.error("Forgot password error:", error);

            alert("Could not connect to the server");

        }
    };

    return (

        <section className="ForgotPassword">

            <div className="ForgotPassword-card">

                <div className="ForgotPassword-logo">
                    <i className="fa-solid fa-lock"></i>
                </div>


                <h1>
                    Forgot Password?
                </h1>


                <p className="ForgotPassword-subtitle">
                    No worries! Enter your email address and we'll send you a link to reset your password.
                </p>


                <form
                    className="ForgotPassword-form"
                    onSubmit={handleSubmit}
                >

                    <div className="ForgotPasswordInput">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <div className="ForgotPasswordInput-field">

                            <i className="fa-regular fa-envelope"></i>

                            <input
                                id="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="ForgotPassword-submit"
                    >
                        Send Reset Link
                    </button>

                </form>


                <Link
                    to="/signin"
                    className="ForgotPassword-back"
                >
                    <i className="fa-solid fa-arrow-left"></i>

                    Back to Login
                </Link>

            </div>

        </section>

    );

}


export default ForgotPassword;