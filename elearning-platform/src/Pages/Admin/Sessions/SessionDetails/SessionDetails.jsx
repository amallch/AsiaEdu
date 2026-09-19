import "./SessionDetails.css";

import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";


const API_URL =
    "https://asiaedu-backend.onrender.com/api/sessions";


function SessionDetails() {

    const navigate = useNavigate();

    const params = useParams();

    const sessionId =
        params.sessionId || params.id;


    /* =====================================================
       STATE
    ===================================================== */

    const [session, setSession] =
        useState(null);

    const [enrollments, setEnrollments] =
        useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");


    /* =====================================================
       FETCH SESSION DETAILS
    ===================================================== */

    const fetchSessionDetails = async () => {

        try {

            setIsLoading(true);

            setErrorMessage("");


            const response =
                await fetch(
                    `${API_URL}/${sessionId}/details`
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to fetch session details."
                );

            }


            setSession(
                data.session
            );


            setEnrollments(
                Array.isArray(data.enrollments)
                    ? data.enrollments
                    : []
            );

        }

        catch (error) {

            console.error(
                "Error fetching session details:",
                error
            );


            setErrorMessage(
                error.message ||
                "Unable to load session details."
            );

        }

        finally {

            setIsLoading(false);

        }

    };


    useEffect(() => {

        if (sessionId) {

            fetchSessionDetails();

        }

    }, [sessionId]);


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (date) => {

        if (!date) {

            return "Not specified";

        }


        const parts =
            String(date).split("-");


        if (parts.length !== 3) {

            return date;

        }


        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]);

        const day =
            Number(parts[2]);


        const monthNames = [

            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"

        ];


        if (
            Number.isNaN(year) ||
            Number.isNaN(month) ||
            Number.isNaN(day) ||
            !monthNames[month - 1]
        ) {

            return date;

        }


        return (
            `${monthNames[month - 1]} ` +
            `${day}, ` +
            `${year}`
        );

    };


    /* =====================================================
       FORMAT CREATED DATE
    ===================================================== */

    const formatCreatedDate = (date) => {

        if (!date) {

            return "Not available";

        }


        const formattedDate =
            new Date(date);


        if (
            Number.isNaN(
                formattedDate.getTime()
            )
        ) {

            return date;

        }


        return formattedDate.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <div className="SessionDetails-loading">

                <i className="fa-solid fa-spinner fa-spin"></i>

                <span>
                    Loading session details...
                </span>

            </div>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (errorMessage) {

        return (

            <div className="SessionDetails-error-page">

                <i className="fa-solid fa-circle-exclamation"></i>

                <h2>
                    Unable to load session
                </h2>

                <p>
                    {errorMessage}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/sessions")
                    }
                >
                    Back to Sessions
                </button>

            </div>

        );

    }


    /* =====================================================
       NO SESSION
    ===================================================== */

    if (!session) {

        return (

            <div className="SessionDetails-error-page">

                <i className="fa-solid fa-users"></i>

                <h2>
                    Session not found
                </h2>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/sessions")
                    }
                >
                    Back to Sessions
                </button>

            </div>

        );

    }


    /* =====================================================
       COURSE INFORMATION
    ===================================================== */

    const course =
        session.course || null;


    /* =====================================================
       INSTRUCTOR INFORMATION
    ===================================================== */

    const instructor =
        session.instructor || null;


    /* =====================================================
       AVAILABLE SEATS
    ===================================================== */

    const availableSeats =
        session.capacity -
        session.enrolled;


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="SessionDetails">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="SessionDetails-header">

                <div>

                    <span>
                        Management / Sessions
                    </span>

                    <h1>
                        Session Details
                    </h1>

                    <p>
                        View session information and the students enrolled in this group.
                    </p>

                </div>


                <div className="SessionDetails-header-actions">

                    <button
                        type="button"
                        className="SessionDetails-back-button"
                        onClick={() =>
                            navigate("/admin/sessions")
                        }
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        <span>
                            Back
                        </span>

                    </button>


                    <button
                        type="button"
                        className="SessionDetails-edit-button"
                        onClick={() =>
                            navigate(
                                `/admin/sessions/edit/${session._id}`
                            )
                        }
                    >

                        <i className="fa-solid fa-pen"></i>

                        <span>
                            Edit Session
                        </span>

                    </button>

                </div>

            </div>


            {/* =================================================
                SESSION OVERVIEW
            ================================================= */}

            <div className="SessionDetails-overview">


                {/* SESSION ICON */}

                <div className="SessionDetails-overview-icon">

                    <i className="fa-solid fa-users"></i>

                </div>


                {/* SESSION MAIN INFO */}

                <div className="SessionDetails-overview-main">

                    <span className="SessionDetails-language">

                        {course &&
                        course.language
                            ? course.language
                            : "Language"}

                    </span>


                    <h2>

                        {course &&
                        course.title
                            ? course.title
                            : "Untitled Course"}

                    </h2>


                    <p>

                        {session.group
                            ? session.group
                            : "Group"}

                    </p>

                </div>


                {/* PROGRAM TYPE */}

                <div className="SessionDetails-program">

                    <span>
                        Program Type
                    </span>

                    <strong>
                        {session.programType || "-"}
                    </strong>

                </div>

            </div>


            {/* =================================================
                INFORMATION GRID
            ================================================= */}

            <div className="SessionDetails-sections">


                {/* =================================================
                    SESSION INFORMATION
                ================================================= */}

                <div className="SessionDetails-section">

                    <div className="SessionDetails-section-title">

                        <div className="SessionDetails-section-icon">

                            <i className="fa-solid fa-users"></i>

                        </div>

                        <div>

                            <h2>
                                Session Information
                            </h2>

                            <p>
                                Details about this course group.
                            </p>

                        </div>

                    </div>


                    <div className="SessionDetails-info-grid">


                        {/* GROUP */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Group
                            </span>

                            <strong>
                                {session.group || "-"}
                            </strong>

                        </div>


                        {/* LEVEL */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Level
                            </span>

                            <strong>

                                {course &&
                                course.level
                                    ? course.level
                                    : "-"}

                            </strong>

                        </div>


                        {/* START DATE */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Start Date
                            </span>

                            <strong>
                                {formatDate(
                                    session.startDate
                                )}
                            </strong>

                        </div>


                        {/* PROGRAM TYPE */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Program Type
                            </span>

                            <strong>
                                {session.programType || "-"}
                            </strong>

                        </div>


                        {/* CAPACITY */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Capacity
                            </span>

                            <strong>
                                {session.capacity}
                            </strong>

                        </div>


                        {/* ENROLLED */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Enrolled
                            </span>

                            <strong>
                                {session.enrolled}
                            </strong>

                        </div>


                        {/* AVAILABLE */}

                        <div
                            className={
                                availableSeats <= 0
                                    ? "SessionDetails-info-item full"
                                    : "SessionDetails-info-item available"
                            }
                        >

                            <span>
                                Available Seats
                            </span>

                            <strong>
                                {availableSeats}
                            </strong>

                        </div>


                        {/* CREATED */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Created
                            </span>

                            <strong>
                                {formatCreatedDate(
                                    session.createdAt
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    COURSE INFORMATION
                ================================================= */}

                <div className="SessionDetails-section">

                    <div className="SessionDetails-section-title">

                        <div className="SessionDetails-section-icon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>

                        <div>

                            <h2>
                                Course Information
                            </h2>

                            <p>
                                Information about the course assigned to this session.
                            </p>

                        </div>

                    </div>


                    <div className="SessionDetails-info-grid">


                        {/* COURSE */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Course
                            </span>

                            <strong>
                                {course &&
                                course.title
                                    ? course.title
                                    : "-"}

                            </strong>

                        </div>


                        {/* LANGUAGE */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Language
                            </span>

                            <strong>
                                {course &&
                                course.language
                                    ? course.language
                                    : "-"}

                            </strong>

                        </div>


                        {/* LEVEL */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Level
                            </span>

                            <strong>
                                {course &&
                                course.level
                                    ? course.level
                                    : "-"}

                            </strong>

                        </div>


                        {/* DURATION */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Duration
                            </span>

                            <strong>
                                {course &&
                                course.duration
                                    ? course.duration
                                    : "-"}

                            </strong>

                        </div>


                        {/* PRICE */}

                        <div className="SessionDetails-info-item">

                            <span>
                                Course Price
                            </span>

                            <strong>

                                {course &&
                                course.price !== undefined
                                    ? `${course.price} DA`
                                    : "-"}

                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    INSTRUCTOR
                ================================================= */}

                <div className="SessionDetails-section">

                    <div className="SessionDetails-section-title">

                        <div className="SessionDetails-section-icon">

                            <i className="fa-solid fa-user-tie"></i>

                        </div>

                        <div>

                            <h2>
                                Instructor
                            </h2>

                            <p>
                                Teacher assigned to this session.
                            </p>

                        </div>

                    </div>


                    <div className="SessionDetails-instructor-card">

                        <div className="SessionDetails-instructor-icon">

                            <i className="fa-solid fa-user"></i>

                        </div>


                        <div>

                            <strong>

                                {instructor &&
                                instructor.name
                                    ? instructor.name
                                    : "No instructor"}

                            </strong>


                            <span>

                                {instructor &&
                                instructor.email
                                    ? instructor.email
                                    : "No email available"}

                            </span>


                            {instructor &&
                            instructor.language && (

                                <small>

                                    {instructor.language}

                                </small>

                            )}

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ENROLLED STUDENTS
                ================================================= */}

                <div className="SessionDetails-section">

                    <div className="SessionDetails-section-title">

                        <div className="SessionDetails-section-icon">

                            <i className="fa-solid fa-graduation-cap"></i>

                        </div>

                        <div>

                            <h2>
                                Enrolled Students
                            </h2>

                            <p>
                                Students currently registered for this session.
                            </p>

                        </div>

                        <div className="SessionDetails-student-count">

                            {enrollments.length}

                        </div>

                    </div>


                    {enrollments.length > 0 ? (

                        <div className="SessionDetails-students">

                            {enrollments.map(
                                (enrollment) => (

                                    <div
                                        className="SessionDetails-student"
                                        key={enrollment._id}
                                    >


                                        {/* STUDENT ICON */}

                                        <div className="SessionDetails-student-icon">

                                            <i className="fa-solid fa-user"></i>

                                        </div>


                                        {/* STUDENT INFO */}

                                        <div className="SessionDetails-student-main">

                                            <strong>
                                                {enrollment.fullName}
                                            </strong>

                                            <span>
                                                {enrollment.email}
                                            </span>

                                            <small>
                                                {enrollment.phone}
                                            </small>

                                        </div>


                                        {/* ENROLLMENT STATUS */}

                                        <div
                                            className={
                                                enrollment.status ===
                                                "Confirmed"
                                                    ? "SessionDetails-student-status confirmed"
                                                    : "SessionDetails-student-status pending"
                                            }
                                        >

                                            {enrollment.status ||
                                                "Pending"}

                                        </div>


                                        {/* VIEW ENROLLMENT */}

                                        <button
                                            type="button"
                                            className="SessionDetails-student-view"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/enrollments/${enrollment._id}`
                                                )
                                            }
                                        >

                                            <i className="fa-solid fa-arrow-right"></i>

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="SessionDetails-no-students">

                            <i className="fa-solid fa-user-graduate"></i>

                            <h3>
                                No students enrolled
                            </h3>

                            <p>
                                No students have enrolled in this session yet.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}


export default SessionDetails;