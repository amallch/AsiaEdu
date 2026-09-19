import "./MyReview.css";

import { useEffect, useState } from "react";


function MyReview() {

    /* =====================================================
       LOGGED-IN USER
    ===================================================== */

    const storedUser =
        localStorage.getItem("user");

    const user =
        storedUser ? JSON.parse(storedUser) : null;


    const studentId = user?.id || "";

    const fullName =
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim();


    /* =====================================================
       STATE
    ===================================================== */

    const [review, setReview] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =====================================================
       FORM STATE
    ===================================================== */

    const [courseName, setCourseName] = useState("");

    const [rating, setRating] = useState(0);

    const [hoverRating, setHoverRating] = useState(0);

    const [message, setMessage] = useState("");

    const [submitting, setSubmitting] = useState(false);

    const [submitError, setSubmitError] = useState("");

    const [submitSuccess, setSubmitSuccess] = useState("");


    /* =====================================================
       LOAD EXISTING REVIEW
    ===================================================== */

    useEffect(() => {

        if (!studentId) {

            setLoading(false);

            setError("You must be logged in to view this page.");

            return;

        }


        const fetchReview = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    `https://asiaedu-backend.onrender.com/api/reviews/student/${studentId}`
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch review"
                    );

                }


                const data = await response.json();


                setReview(data.review);

                setError("");

            } catch (err) {

                console.error(err);

                setError(
                    "Failed to load your review."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchReview();

    }, [studentId]);


    /* =====================================================
       SUBMIT REVIEW
    ===================================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitError("");

        setSubmitSuccess("");


        if (!studentId) {

            setSubmitError(
                "You must be logged in to submit a review."
            );

            return;

        }


        if (!courseName.trim()) {

            setSubmitError(
                "Please enter the course you enrolled in."
            );

            return;

        }


        if (rating < 1 || rating > 5) {

            setSubmitError(
                "Please select a rating from 1 to 5."
            );

            return;

        }


        if (!message.trim()) {

            setSubmitError(
                "Please write your review."
            );

            return;

        }


        try {

            setSubmitting(true);


            const response = await fetch(
                "https://asiaedu-backend.onrender.com/api/reviews",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        studentId,
                        name: fullName,
                        courseName: courseName.trim(),
                        rating,
                        message: message.trim()
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setSubmitError(
                    data.message ||
                    "Failed to submit review."
                );

                return;

            }


            setReview(data.review);

            setCourseName("");

            setRating(0);

            setHoverRating(0);

            setMessage("");

            setSubmitSuccess(
                "Your review has been submitted successfully."
            );

        } catch (err) {

            console.error(err);

            setSubmitError(
                "Could not connect to the server. Please try again."
            );

        } finally {

            setSubmitting(false);

        }

    };


    /* =====================================================
       RENDER STARS
    ===================================================== */

    const renderStars = (value) => {

        const safe =
            Math.max(0, Math.min(5, Number(value) || 0));


        return (

            <span className="MyReview-stars">

                {[1, 2, 3, 4, 5].map((star) => (

                    <i
                        key={star}
                        className={
                            star <= safe
                                ? "fa-solid fa-star"
                                : "fa-regular fa-star"
                        }
                    ></i>

                ))}

            </span>

        );

    };


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
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="MyReview-empty">

                <i className="fa-solid fa-spinner fa-spin"></i>

                <h2>
                    Loading...
                </h2>

                <p>
                    Please wait while we check your review.
                </p>

            </div>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        return (

            <div className="MyReview-empty">

                <i className="fa-solid fa-circle-exclamation"></i>

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

            </div>

        );

    }


    return (

        <div className="MyReview">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="MyReview-header">

                <span>
                    My Review
                </span>

                <h1>
                    {review
                        ? "Your Review"
                        : "Share Your Experience"
                    }
                </h1>

                <p>
                    {review
                        ? "Here is the review you submitted. Thank you for your feedback!"
                        : "Tell us about your learning journey with AsiaEdu."
                    }
                </p>

            </div>


            {/* =================================================
                EXISTING REVIEW
            ================================================= */}

            {review ? (

                <div className="MyReview-card">


                    <div className="MyReview-card-header">

                        <div className="MyReview-avatar">

                            {review.name
                                ?.trim()
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            }

                        </div>


                        <div className="MyReview-card-info">

                            <strong>
                                {review.name}
                            </strong>

                            <span>
                                {review.courseName}
                            </span>

                        </div>


                        {renderStars(review.rating)}

                    </div>


                    <div className="MyReview-card-body">

                        <p>
                            {review.message}
                        </p>

                    </div>


                    <div className="MyReview-card-footer">

                        <i className="fa-regular fa-calendar"></i>

                        <span>
                            Submitted on {formatDate(review.createdAt)}
                        </span>

                    </div>

                </div>

            ) : (

                /* =================================================
                   FORM
                ================================================= */

                <form
                    className="MyReview-form"
                    onSubmit={handleSubmit}
                >


                    {/* NAME (read-only) */}

                    <div className="MyReview-field">

                        <label>
                            Your Name
                        </label>

                        <div className="MyReview-input">

                            <i className="fa-solid fa-user"></i>

                            <input
                                type="text"
                                value={fullName}
                                readOnly
                            />

                        </div>

                    </div>


                    {/* COURSE */}

                    <div className="MyReview-field">

                        <label>
                            Course You Enrolled In
                        </label>

                        <div className="MyReview-input">

                            <i className="fa-solid fa-graduation-cap"></i>

                            <input
                                type="text"
                                placeholder="e.g. Chinese Beginner"
                                value={courseName}
                                onChange={(e) =>
                                    setCourseName(e.target.value)
                                }
                            />

                        </div>

                    </div>


                    {/* RATING */}

                    <div className="MyReview-field">

                        <label>
                            Rating
                        </label>

                        <div className="MyReview-rating-input">

                            {[1, 2, 3, 4, 5].map((star) => (

                                <i
                                    key={star}
                                    className={
                                        star <= (hoverRating || rating)
                                            ? "fa-solid fa-star"
                                            : "fa-regular fa-star"
                                    }
                                    onMouseEnter={() =>
                                        setHoverRating(star)
                                    }
                                    onMouseLeave={() =>
                                        setHoverRating(0)
                                    }
                                    onClick={() =>
                                        setRating(star)
                                    }
                                ></i>

                            ))}

                            <span>
                                {rating > 0
                                    ? `${rating} / 5`
                                    : "Select a rating"
                                }
                            </span>

                        </div>

                    </div>


                    {/* MESSAGE */}

                    <div className="MyReview-field">

                        <label>
                            Your Review
                        </label>

                        <div className="MyReview-textarea">

                            <textarea
                                rows="6"
                                placeholder="Tell us about your experience..."
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                            ></textarea>

                        </div>

                    </div>


                    {/* FEEDBACK */}

                    {submitError && (

                        <div className="MyReview-feedback MyReview-feedback-error">

                            <i className="fa-solid fa-circle-exclamation"></i>

                            {submitError}

                        </div>

                    )}


                    {submitSuccess && (

                        <div className="MyReview-feedback MyReview-feedback-success">

                            <i className="fa-solid fa-circle-check"></i>

                            {submitSuccess}

                        </div>

                    )}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="MyReview-submit"
                        disabled={submitting}
                    >

                        {submitting ? (

                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Submitting...
                            </>

                        ) : (

                            <>
                                <i className="fa-solid fa-paper-plane"></i>
                                Submit Review
                            </>

                        )}

                    </button>

                </form>

            )}

        </div>

    );

}


export default MyReview;