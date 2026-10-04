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

    const [reviews, setReviews] = useState([]);

    const [enrollments, setEnrollments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =====================================================
       FORM STATE
    ===================================================== */

    const [selectedCourse, setSelectedCourse] = useState("");

    const [rating, setRating] = useState(0);

    const [hoverRating, setHoverRating] = useState(0);

    const [message, setMessage] = useState("");

    const [submitting, setSubmitting] = useState(false);

    const [submitError, setSubmitError] = useState("");

    const [submitSuccess, setSubmitSuccess] = useState("");


    /* =====================================================
       LOAD REVIEWS + ENROLLMENTS
    ===================================================== */

    useEffect(() => {

        if (!studentId) {

            setLoading(false);

            setError("You must be logged in to view this page.");

            return;

        }


        const loadData = async () => {

            try {

                setLoading(true);


                /* =============================================
                   FETCH STUDENT'S REVIEWS
                ============================================= */

                const reviewsResponse = await fetch(
                    `https://asiaedu-backend.onrender.com/api/reviews/student/${studentId}`
                );


                if (!reviewsResponse.ok) {

                    throw new Error(
                        "Failed to fetch reviews"
                    );

                }


                const reviewsData =
                    await reviewsResponse.json();


                setReviews(reviewsData.reviews || []);


                /* =============================================
                   FETCH STUDENT'S ENROLLMENTS
                ============================================= */

                const enrollmentResponse = await fetch(
                    `https://asiaedu-backend.onrender.com/api/enrollments/student/${studentId}`
                );


                if (!enrollmentResponse.ok) {

                    throw new Error(
                        "Failed to fetch enrollments"
                    );

                }


                const enrollmentData =
                    await enrollmentResponse.json();


                setEnrollments(enrollmentData.enrollments || []);


                setError("");

            } catch (err) {

                console.error(err);

                setError(
                    "Failed to load your data."
                );

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, [studentId]);


    /* =====================================================
       COMPUTE UNREVIEWED COURSES
    ===================================================== */

    const reviewedCourseNames =
        reviews.map((r) => r.courseName);


    const unreviewedCourses =
        enrollments.filter(
            (enrollment) =>
                !reviewedCourseNames.includes(
                    enrollment.courseTitle
                )
        );


    /* =====================================================
       AUTO-SELECT FIRST UNREVIEWED COURSE
    ===================================================== */

    useEffect(() => {

        if (
            unreviewedCourses.length === 1 &&
            !selectedCourse
        ) {

            setSelectedCourse(
                unreviewedCourses[0].courseTitle
            );

        }

    }, [unreviewedCourses.length, selectedCourse]);


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


        if (!selectedCourse.trim()) {

            setSubmitError(
                "Please select a course."
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
                        courseName: selectedCourse.trim(),
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


            setReviews([data.review, ...reviews]);

            setSelectedCourse("");

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
                    Please wait while we load your reviews.
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


    /* =====================================================
       NO ENROLLMENTS
    ===================================================== */

    if (enrollments.length === 0) {

        return (

            <div className="MyReview-empty">

                <i className="fa-solid fa-graduation-cap"></i>

                <h2>
                    No active courses
                </h2>

                <p>
                    You need to be enrolled in at least one course before you can leave a review.
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
                    My Reviews
                </span>

                <h1>
                    {unreviewedCourses.length > 0
                        ? "Share Your Experience"
                        : "Your Reviews"
                    }
                </h1>

                <p>
                    {unreviewedCourses.length > 0
                        ? "Select a course below and tell us about your learning journey."
                        : "Thank you for reviewing all your courses!"
                    }
                </p>

            </div>


            {/* =================================================
                FORM (if there are unreviewed courses)
            ================================================= */}

            {unreviewedCourses.length > 0 && (

                <form
                    className="MyReview-form"
                    onSubmit={handleSubmit}
                >


                    {/* COURSE SELECTOR */}

                    <div className="MyReview-field">

                        <label>
                            Select the course you want to review
                        </label>

                        <div className="MyReview-input">

                            <i className="fa-solid fa-graduation-cap"></i>

                            <select
                                value={selectedCourse}
                                onChange={(e) =>
                                    setSelectedCourse(e.target.value)
                                }
                                className="MyReview-select"
                            >

                                <option value="">
                                    Choose a course
                                </option>

                                {unreviewedCourses.map((enrollment) => (

                                    <option
                                        key={enrollment._id}
                                        value={enrollment.courseTitle}
                                    >
                                        {enrollment.courseTitle}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>


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


                    {/* COURSE (read-only, mirrors selector) */}

                    <div className="MyReview-field">

                        <label>
                            Course
                        </label>

                        <div className="MyReview-input">

                            <i className="fa-solid fa-book"></i>

                            <input
                                type="text"
                                value={selectedCourse}
                                placeholder="Select a course above"
                                readOnly
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


            {/* =================================================
                PREVIOUS REVIEWS
            ================================================= */}

            {reviews.length > 0 && (

                <div className="MyReview-previous">

                    <h2>
                        Your Previous Reviews
                    </h2>


                    <div className="MyReview-cards-grid">

                        {reviews.map((review) => (

                            <div
                                className="MyReview-card"
                                key={review._id}
                            >

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

                                </div>


                                <div className="MyReview-card-rating">

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
                                        {formatDate(review.createdAt)}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>

    );

}


export default MyReview;