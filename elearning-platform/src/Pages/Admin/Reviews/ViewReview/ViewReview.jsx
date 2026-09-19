import "./ViewReview.css";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";


function ViewReview() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [review, setReview] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =====================================================
       GET REVIEW FROM BACKEND
    ===================================================== */

    useEffect(() => {

        const fetchReview = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    `https://asiaedu-backend.onrender.com/api/reviews/${id}`
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch review"
                    );

                }


                const data = await response.json();


                setReview(
                    data.review
                );

                setError("");

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load review."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchReview();

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
       RENDER STARS
    ===================================================== */

    const renderStars = (rating) => {

        const safeRating =
            Math.max(0, Math.min(5, Number(rating) || 0));


        return (

            <span className="ViewReview-stars">

                {[1, 2, 3, 4, 5].map((star) => (

                    <i
                        key={star}
                        className={
                            star <= safeRating
                                ? "fa-solid fa-star"
                                : "fa-regular fa-star"
                        }
                    ></i>

                ))}

            </span>

        );

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="ViewReview-empty">

                <i className="fa-solid fa-spinner fa-spin"></i>

                <h2>
                    Loading review...
                </h2>

                <p>
                    Please wait while the review is loaded.
                </p>

            </div>

        );

    }


    /* =====================================================
       REVIEW NOT FOUND / ERROR
    ===================================================== */

    if (!review || error) {

        return (

            <div className="ViewReview-empty">

                <i className="fa-solid fa-star-half-stroke"></i>

                <h2>
                    Review not found
                </h2>

                <p>
                    {error ||
                        "The review could not be found."
                    }
                </p>

                <button
                    onClick={() =>
                        navigate("/admin/reviews")
                    }
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    Back to Reviews

                </button>

            </div>

        );

    }


    return (

        <div className="ViewReview">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="ViewReview-header">

                <div>

                    <button
                        className="ViewReview-back"
                        onClick={() =>
                            navigate("/admin/reviews")
                        }
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        <span>
                            Back to Reviews
                        </span>

                    </button>


                    <span className="ViewReview-label">
                        Reviews Management
                    </span>


                    <h1>
                        {review.name}
                    </h1>


                    <p>
                        View the review details submitted by the student.
                    </p>

                </div>

            </div>


            {/* =================================================
                REVIEWER INFORMATION
            ================================================= */}

            <div className="ViewReview-section">

                <div className="ViewReview-section-header">

                    <div>

                        <h2>
                            Reviewer Information
                        </h2>

                        <p>
                            Details provided by the reviewer.
                        </p>

                    </div>

                </div>


                <div className="ViewReview-info-grid">


                    {/* FULL NAME */}

                    <div className="ViewReview-info-item">

                        <div className="ViewReview-info-icon">

                            <i className="fa-solid fa-user"></i>

                        </div>

                        <div>

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {review.name}
                            </strong>

                        </div>

                    </div>


                    {/* COURSE */}

                    <div className="ViewReview-info-item">

                        <div className="ViewReview-info-icon">

                            <i className="fa-solid fa-graduation-cap"></i>

                        </div>

                        <div>

                            <span>
                                Course Enrolled
                            </span>

                            <strong>
                                {review.courseName}
                            </strong>

                        </div>

                    </div>


                    {/* RATING */}

                    <div className="ViewReview-info-item">

                        <div className="ViewReview-info-icon">

                            <i className="fa-solid fa-star"></i>

                        </div>

                        <div>

                            <span>
                                Rating
                            </span>

                            <strong>
                                {renderStars(review.rating)}
                            </strong>

                        </div>

                    </div>


                    {/* DATE */}

                    <div className="ViewReview-info-item">

                        <div className="ViewReview-info-icon">

                            <i className="fa-regular fa-calendar"></i>

                        </div>

                        <div>

                            <span>
                                Date Submitted
                            </span>

                            <strong>
                                {formatDate(
                                    review.createdAt
                                )}
                            </strong>

                        </div>

                    </div>


                </div>

            </div>


            {/* =================================================
                REVIEW MESSAGE
            ================================================= */}

            <div className="ViewReview-section">

                <div className="ViewReview-section-header">

                    <div>

                        <h2>
                            Review Message
                        </h2>

                        <p>
                            Feedback submitted by the reviewer.
                        </p>

                    </div>

                </div>


                <div className="ViewReview-message-card">

                    <div className="ViewReview-message-content">

                        <div className="ViewReview-message-title">

                            <i className="fa-solid fa-message"></i>

                            <span>
                                Message
                            </span>

                        </div>


                        <p>
                            {review.message}
                        </p>

                    </div>


                </div>

            </div>


        </div>

    );

}


export default ViewReview;