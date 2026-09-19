import { useState } from "react";

import "./ResetPassword.css";

import { Link, useSearchParams, useNavigate } from "react-router-dom";


function ResetPassword() {

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();


    const token = searchParams.get("token");


    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");


    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!token) {

            alert("Invalid or missing reset token");

            return;

        }


        if (!newPassword || !confirmPassword) {

            alert("Please fill in both password fields");

            return;

        }


        if (newPassword !== confirmPassword) {

            alert("Passwords do not match");

            return;

        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/users/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        token,
                        newPassword
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(data.message || "Password reset failed");

                return;

            }


            alert("Password reset successfully!");


            navigate("/signin");


        } catch (error) {

            console.error("Reset password error:", error);

            alert("Could not connect to the server");

        }

    };


    return (

        <section className="ResetPassword">

            <div className="ResetPassword-card">


                <div className="ResetPassword-logo">

                    <i className="fa-solid fa-lock"></i>

                </div>


                <h1>
                    Reset Password
                </h1>


                <p className="ResetPassword-subtitle">

                    Create a new password for your account.

                </p>


                <form
                    className="ResetPassword-form"
                    onSubmit={handleSubmit}
                >


                    {/* NEW PASSWORD */}

                    <div className="ResetPasswordInput">

                        <label htmlFor="newPassword">
                            New Password
                        </label>


                        <div className="ResetPasswordInput-field">

                            <i className="fa-solid fa-lock"></i>


                            <input
                                id="newPassword"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                            />


                            <i
                                className={`ResetPasswordInput-toggle ${
                                    showPassword
                                        ? "fa-regular fa-eye-slash"
                                        : "fa-regular fa-eye"
                                }`}
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            ></i>

                        </div>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="ResetPasswordInput">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>


                        <div className="ResetPasswordInput-field">

                            <i className="fa-solid fa-lock"></i>


                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Re-enter your new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />


                            <i
                                className={`ResetPasswordInput-toggle ${
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


                    <button
                        type="submit"
                        className="ResetPassword-submit"
                    >
                        Reset Password
                    </button>


                </form>


                <Link
                    to="/signin"
                    className="ResetPassword-back"
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    Back to Login

                </Link>


            </div>

        </section>

    );

}


export default ResetPassword;