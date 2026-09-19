import "./Reviews.css";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


function Reviews() {

    const [reviews, setReviews] = useState([]);

    const [search, setSearch] = useState("");

    const [yearFilter, setYearFilter] = useState("All");

    const [deleteReview, setDeleteReview] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const navigate = useNavigate();


    /* =====================================================
       GET REVIEWS FROM BACKEND
    ===================================================== */

    useEffect(() => {

        const fetchReviews = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    "https://asiaedu-backend.onrender.com/api/reviews"
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch reviews"
                    );

                }


                const data = await response.json();


                setReviews(
                    data.reviews || []
                );

                setError("");

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load reviews."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchReviews();

    }, []);


    /* =====================================================
       AVAILABLE YEARS
    ===================================================== */

    const availableYears = [
        ...new Set(
            reviews
                .map((review) => {

                    if (!review.createdAt) {

                        return null;

                    }

                    return new Date(
                        review.createdAt
                    ).getFullYear();

                })
                .filter(Boolean)
        )
    ].sort((a, b) => b - a);


    /* =====================================================
       FILTER REVIEWS
    ===================================================== */

    const filteredReviews = reviews.filter((review) => {

        const name =
            review.name?.toLowerCase() || "";

        const courseName =
            review.courseName?.toLowerCase() || "";

        const message =
            review.message?.toLowerCase() || "";

        const searchValue =
            search.toLowerCase();


        const matchesSearch =
            name.includes(searchValue) ||
            courseName.includes(searchValue) ||
            message.includes(searchValue);


        const matchesYear =
            yearFilter === "All" ||
            (
                review.createdAt &&
                new Date(
                    review.createdAt
                ).getFullYear() ===
                Number(yearFilter)
            );


        return (
            matchesSearch &&
            matchesYear
        );

    });


    /* =====================================================
       VIEW REVIEW
    ===================================================== */

    const viewReview = (reviewId) => {

        navigate(
            `/admin/reviews/${reviewId}`
        );

    };


    /* =====================================================
       DELETE REVIEW
    ===================================================== */

    const confirmDelete = async () => {

        if (!deleteReview) {

            return;

        }


        try {

            const response = await fetch(
                `https://asiaedu-backend.onrender.com/api/reviews/${deleteReview._id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete review"
                );

            }


            setReviews((currentReviews) =>
                currentReviews.filter(
                    (review) =>
                        review._id !== deleteReview._id
                )
            );


            setDeleteReview(null);


        } catch (error) {

            console.error(error);

            setError(
                "Failed to delete review."
            );

        }

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
       RENDER STARS
    ===================================================== */

    const renderStars = (rating) => {

        const safeRating =
            Math.max(0, Math.min(5, Number(rating) || 0));


        return (

            <span className="Reviews-stars">

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


    return (

        <div className="Reviews">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="Reviews-header">

                <div>

                    <span>
                        Management
                    </span>

                    <h1>
                        Reviews
                    </h1>

                    <p>
                        Manage student reviews displayed on AsiaEdu.
                    </p>

                </div>


                <div className="Reviews-total">

                    <strong>
                        {reviews.length}
                    </strong>

                    <span>
                        Total Reviews
                    </span>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="Reviews-filters">


                {/* SEARCH */}

                <div className="Reviews-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>


                {/* YEAR FILTER */}

                <div className="Reviews-year-filter">

                    <i className="fa-regular fa-calendar"></i>

                    <select
                        value={yearFilter}
                        onChange={(event) =>
                            setYearFilter(event.target.value)
                        }
                    >

                        <option value="All">
                            All Years
                        </option>

                        {availableYears.map(
                            (year) => (

                                <option
                                    key={year}
                                    value={year}
                                >
                                    {year}
                                </option>

                            )
                        )}

                    </select>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="Reviews-error">

                    {error}

                </div>

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="Reviews-card">

                <div className="Reviews-table-wrapper">

                    <table className="Reviews-table">

                        <thead>

                            <tr>

                                <th>
                                    Reviewer
                                </th>

                                <th>
                                    Course
                                </th>

                                <th>
                                    Rating
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {/* =================================================
                                LOADING
                            ================================================= */}

                            {loading && (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="Reviews-empty"
                                    >

                                        Loading reviews...

                                    </td>

                                </tr>

                            )}


                            {/* =================================================
                                REVIEWS
                            ================================================= */}

                            {!loading &&
                                filteredReviews.map((review) => (

                                    <tr key={review._id}>


                                        {/* REVIEWER */}

                                        <td>

                                            <div className="Reviews-user">

                                                <div className="Reviews-avatar">

                                                    {review.name
                                                        ?.trim()
                                                        .split(" ")
                                                        .map(
                                                            (name) =>
                                                                name[0]
                                                        )
                                                        .join("")
                                                        .slice(0, 2)
                                                        .toUpperCase()
                                                    }

                                                </div>


                                                <strong className="Reviews-name">

                                                    {review.name}

                                                </strong>

                                            </div>

                                        </td>


                                        {/* COURSE */}

                                        <td>

                                            <span className="Reviews-course">

                                                {review.courseName}

                                            </span>

                                        </td>


                                        {/* RATING */}

                                        <td>

                                            {renderStars(review.rating)}

                                        </td>


                                        {/* DATE */}

                                        <td>

                                            <span className="Reviews-date">

                                                {formatDate(
                                                    review.createdAt
                                                )}

                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="Reviews-actions">


                                                {/* VIEW */}

                                                <button
                                                    className="Reviews-view"
                                                    onClick={() =>
                                                        viewReview(
                                                            review._id
                                                        )
                                                    }
                                                    aria-label="View review"
                                                >

                                                    <i className="fa-solid fa-eye"></i>

                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    className="Reviews-delete"
                                                    onClick={() =>
                                                        setDeleteReview(
                                                            review
                                                        )
                                                    }
                                                    aria-label="Delete review"
                                                >

                                                    <i className="fa-solid fa-trash"></i>

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))
                            }


                            {/* =================================================
                                EMPTY
                            ================================================= */}

                            {!loading &&
                                filteredReviews.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="Reviews-empty"
                                        >

                                            No reviews found.

                                        </td>

                                    </tr>

                                )
                            }

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            {deleteReview && (

                <div className="Reviews-modal-overlay">

                    <div className="Reviews-delete-modal">


                        <div className="Reviews-delete-icon">

                            <i className="fa-solid fa-trash"></i>

                        </div>


                        <h2>
                            Delete Review?
                        </h2>


                        <p>

                            Are you sure you want to delete the review from{" "}

                            <strong>
                                {deleteReview.name}
                            </strong>

                            ? This action cannot be undone.

                        </p>


                        <div className="Reviews-delete-actions">

                            <button
                                className="Reviews-cancel-delete"
                                onClick={() =>
                                    setDeleteReview(null)
                                }
                            >

                                Cancel

                            </button>


                            <button
                                className="Reviews-confirm-delete"
                                onClick={confirmDelete}
                            >

                                <i className="fa-solid fa-trash"></i>
                                Delete

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Reviews;