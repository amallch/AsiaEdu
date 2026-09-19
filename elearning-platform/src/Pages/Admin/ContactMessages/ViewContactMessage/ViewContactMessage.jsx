import "./ViewContactMessage.css";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";


function ViewContactMessage() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [contact, setContact] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =====================================================
       GET CONTACT MESSAGE FROM BACKEND
    ===================================================== */

    useEffect(() => {

        const fetchContact = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    `https://asiaedu-backend.onrender.com/api/contact/${id}`
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch contact message"
                    );

                }


                const data = await response.json();


                setContact(
                    data.contact
                );

                setError("");

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load contact message."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchContact();

    }, [id]);


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (date) => {

        if (!date) {

            return "N/A";

        }


        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="ViewContactMessage-empty">

                <i className="fa-solid fa-spinner fa-spin"></i>

                <h2>
                    Loading message...
                </h2>

                <p>
                    Please wait while the contact message is loaded.
                </p>

            </div>

        );

    }


    /* =====================================================
       MESSAGE NOT FOUND / ERROR
    ===================================================== */

    if (!contact || error) {

        return (

            <div className="ViewContactMessage-empty">

                <i className="fa-solid fa-envelope-circle-xmark"></i>

                <h2>
                    Message not found
                </h2>

                <p>
                    {error ||
                        "The contact message could not be found."
                    }
                </p>

                <button
                    onClick={() =>
                        navigate("/admin/contact")
                    }
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    Back to Contact Messages

                </button>

            </div>

        );

    }


    return (

        <div className="ViewContactMessage">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="ViewContactMessage-header">

                <div>

                    <button
                        className="ViewContactMessage-back"
                        onClick={() =>
                            navigate("/admin/contact")
                        }
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        <span>
                            Back to Contact Messages
                        </span>

                    </button>


                    <span className="ViewContactMessage-label">
                        Contact Management
                    </span>


                    <h1>
                        {contact.firstName}{" "}
                        {contact.lastName}
                    </h1>


                    <p>
                        View the contact information and message details.
                    </p>

                </div>

            </div>


            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}

            <div className="ViewContactMessage-section">

                <div className="ViewContactMessage-section-header">

                    <div>

                        <h2>
                            Contact Information
                        </h2>

                        <p>
                            Personal information provided by the visitor.
                        </p>

                    </div>

                </div>


                <div className="ViewContactMessage-info-grid">


                    {/* FULL NAME */}

                    <div className="ViewContactMessage-info-item">

                        <div className="ViewContactMessage-info-icon">

                            <i className="fa-solid fa-user"></i>

                        </div>

                        <div>

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {contact.firstName}{" "}
                                {contact.lastName}
                            </strong>

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="ViewContactMessage-info-item">

                        <div className="ViewContactMessage-info-icon">

                            <i className="fa-solid fa-envelope"></i>

                        </div>

                        <div>

                            <span>
                                Email
                            </span>

                            <strong>
                                {contact.email}
                            </strong>

                        </div>

                    </div>


                    {/* PHONE */}

                    <div className="ViewContactMessage-info-item">

                        <div className="ViewContactMessage-info-icon">

                            <i className="fa-solid fa-phone"></i>

                        </div>

                        <div>

                            <span>
                                Phone
                            </span>

                            <strong>
                                {contact.phone}
                            </strong>

                        </div>

                    </div>


                    {/* DATE */}

                    <div className="ViewContactMessage-info-item">

                        <div className="ViewContactMessage-info-icon">

                            <i className="fa-regular fa-calendar"></i>

                        </div>

                        <div>

                            <span>
                                Date Received
                            </span>

                            <strong>
                                {formatDate(
                                    contact.createdAt
                                )}
                            </strong>

                        </div>

                    </div>


                </div>

            </div>


            {/* =================================================
                MESSAGE DETAILS
            ================================================= */}

            <div className="ViewContactMessage-section">

                <div className="ViewContactMessage-section-header">

                    <div>

                        <h2>
                            Message Details
                        </h2>

                        <p>
                            Message submitted by the visitor.
                        </p>

                    </div>

                </div>


                <div className="ViewContactMessage-message-card">


                    {/* SUBJECT */}

                    <div className="ViewContactMessage-message-subject">

                        <div className="ViewContactMessage-message-icon">

                            <i className="fa-solid fa-tag"></i>

                        </div>


                        <div>

                            <span>
                                Subject
                            </span>

                            <strong>
                                {contact.subject}
                            </strong>

                        </div>

                    </div>


                    {/* MESSAGE */}

                    <div className="ViewContactMessage-message-content">

                        <div className="ViewContactMessage-message-title">

                            <i className="fa-solid fa-message"></i>

                            <span>
                                Message
                            </span>

                        </div>


                        <p>
                            {contact.message}
                        </p>

                    </div>


                </div>

            </div>


        </div>

    );

}


export default ViewContactMessage;