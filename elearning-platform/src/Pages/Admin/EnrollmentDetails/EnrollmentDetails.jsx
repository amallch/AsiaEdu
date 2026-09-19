import "./EnrollmentDetails.css";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";


function EnrollmentDetails() {

    const params = useParams();

    const enrollmentId =
        params.enrollmentId || params.id;

    const navigate = useNavigate();


    /* =====================================================
       ENROLLMENT STATE
    ===================================================== */

    const [enrollment, setEnrollment] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [isConfirming, setIsConfirming] = useState(false);


    /* =====================================================
       GET ENROLLMENT FROM BACKEND
    ===================================================== */

    useEffect(() => {

        const fetchEnrollment = async () => {

            try {

                setLoading(true);

                setError("");


                if (!enrollmentId) {

                    throw new Error(
                        "Enrollment ID is missing"
                    );

                }


                const response = await fetch(
                    `https://asiaedu-backend.onrender.com/api/enrollments/${enrollmentId}`
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch enrollment"
                    );

                }


                const data = await response.json();


                setEnrollment(data);

            } catch (error) {

                console.log(
                    "Failed to fetch enrollment:",
                    error
                );


                setError(
                    "Failed to load enrollment."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchEnrollment();

    }, [enrollmentId]);


    /* =====================================================
       CONFIRM ENROLLMENT
    ===================================================== */

    const confirmEnrollment = async () => {

        if (!enrollment) {

            return;

        }


        try {

            setIsConfirming(true);


            const response = await fetch(
                `https://asiaedu-backend.onrender.com/api/enrollments/${enrollment._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        status: "Confirmed"
                    })
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to confirm enrollment"
                );

            }


            const data = await response.json();


            setEnrollment(
                data.enrollment
            );


            navigate("/admin/enrollments");

        } catch (error) {

            console.log(
                "Failed to confirm enrollment:",
                error
            );


            setError(
                "Failed to confirm enrollment."
            );

        } finally {

            setIsConfirming(false);

        }

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="EnrollmentDetails">

                <div className="EnrollmentDetails-empty">

                    <i className="fa-solid fa-spinner fa-spin"></i>

                    <h2>
                        Loading Enrollment...
                    </h2>

                    <p>
                        Please wait while the enrollment information is being loaded.
                    </p>

                </div>

            </div>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error && !enrollment) {

        return (

            <div className="EnrollmentDetails">

                <div className="EnrollmentDetails-empty">

                    <i className="fa-solid fa-file-circle-xmark"></i>

                    <h2>
                        Enrollment Not Found
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/admin/enrollments")
                        }
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Enrollments

                    </button>

                </div>

            </div>

        );

    }


    /* =====================================================
       FORMAT DATES
    ===================================================== */

    const enrollmentDate =
        new Date(
            enrollment.createdAt
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );


    const updatedDate =
        new Date(
            enrollment.updatedAt
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );


    /* =====================================================
       COURSE ID
    ===================================================== */

    let displayedCourseId = enrollment.courseId;

    if (
        enrollment.courseId &&
        typeof enrollment.courseId === "object"
    ) {

        displayedCourseId =
            enrollment.courseId._id;

    }


    return (

        <div className="EnrollmentDetails">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="EnrollmentDetails-header">

                <div>

                    <button
                        className="EnrollmentDetails-back"
                        onClick={() =>
                            navigate("/admin/enrollments")
                        }
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        <span>
                            Back to Enrollments
                        </span>

                    </button>


                    <span className="EnrollmentDetails-label">
                        Enrollment Management
                    </span>


                    <h1>
                        {enrollment.fullName}
                    </h1>


                    <p>
                        Review the enrollment information before confirming the student.
                    </p>

                </div>


                <span
                    className={
                        enrollment.status === "Confirmed"
                            ? "EnrollmentDetails-status confirmed"
                            : "EnrollmentDetails-status pending"
                    }
                >

                    <span className="EnrollmentDetails-status-dot"></span>

                    {enrollment.status}

                </span>

            </div>


            {/* =================================================
                STUDENT INFORMATION
            ================================================= */}

            <div className="EnrollmentDetails-section">

                <div className="EnrollmentDetails-section-header">

                    <div>

                        <span>
                            Student
                        </span>

                        <h2>
                            Student Information
                        </h2>

                        <p>
                            Personal information submitted with this enrollment.
                        </p>

                    </div>

                </div>


                <div className="EnrollmentDetails-info-grid">


                    {/* FULL NAME */}

                    <div className="EnrollmentDetails-info-item">

                        <div className="EnrollmentDetails-info-icon">

                            <i className="fa-solid fa-user"></i>

                        </div>

                        <div>

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {enrollment.fullName}
                            </strong>

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="EnrollmentDetails-info-item">

                        <div className="EnrollmentDetails-info-icon">

                            <i className="fa-solid fa-envelope"></i>

                        </div>

                        <div>

                            <span>
                                Email
                            </span>

                            <strong>
                                {enrollment.email}
                            </strong>

                        </div>

                    </div>


                    {/* PHONE */}

                    <div className="EnrollmentDetails-info-item">

                        <div className="EnrollmentDetails-info-icon">

                            <i className="fa-solid fa-phone"></i>

                        </div>

                        <div>

                            <span>
                                Phone
                            </span>

                            <strong>
                                {enrollment.phone}
                            </strong>

                        </div>

                    </div>


                    {/* SECONDARY PHONE */}

                    <div className="EnrollmentDetails-info-item">

                        <div className="EnrollmentDetails-info-icon">

                            <i className="fa-solid fa-mobile-screen"></i>

                        </div>

                        <div>

                            <span>
                                Secondary Phone
                            </span>

                            <strong>
                                {enrollment.phone2 || "Not provided"}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                COURSE INFORMATION
            ================================================= */}

            <div className="EnrollmentDetails-section">

                <div className="EnrollmentDetails-section-header">

                    <div>

                        <span>
                            Course
                        </span>

                        <h2>
                            Course Information
                        </h2>

                        <p>
                            Information about the course selected by the student.
                        </p>

                    </div>

                </div>


                <div className="EnrollmentDetails-course-card">


                    {/* COURSE HEADER */}

                    <div className="EnrollmentDetails-course-header">

                        <div className="EnrollmentDetails-course-title">

                            <div className="EnrollmentDetails-course-icon">

                                <i className="fa-solid fa-book-open"></i>

                            </div>


                            <div>

                                <span>
                                    Course
                                </span>

                                <h3>
                                    {enrollment.courseTitle}
                                </h3>

                                <p>
                                    {enrollment.language} · {enrollment.level}
                                </p>

                            </div>

                        </div>


                        <span className="EnrollmentDetails-course-price">

                            {Number(
                                enrollment.price || 0
                            ).toLocaleString()} DA

                        </span>

                    </div>


                    {/* COURSE DETAILS */}

                    <div className="EnrollmentDetails-course-grid">


                        <div>

                            <span>
                                Language
                            </span>

                            <strong>
                                {enrollment.language}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Level
                            </span>

                            <strong>
                                {enrollment.level}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Session
                            </span>

                            <strong>
                                {enrollment.sessionId
                                    ? enrollment.sessionId.group
                                    : "Not specified"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Teacher
                            </span>

                            <strong>
                                {enrollment.teacher}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Start Date
                            </span>

                            <strong>
                                {enrollment.startDate}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Duration
                            </span>

                            <strong>
                                {enrollment.duration}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Price
                            </span>

                            <strong>
                                {Number(
                                    enrollment.price || 0
                                ).toLocaleString()} DA
                            </strong>

                        </div>


                        <div>

                            <span>
                                Program Type
                            </span>

                            <strong>
                                {enrollment.programType}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                ENROLLMENT INFORMATION
            ================================================= */}

            <div className="EnrollmentDetails-section">

                <div className="EnrollmentDetails-section-header">

                    <div>

                        <span>
                            Record
                        </span>

                        <h2>
                            Enrollment Information
                        </h2>

                        <p>
                            Details about this enrollment request.
                        </p>

                    </div>

                </div>


                <div className="EnrollmentDetails-record-grid">


                    {/* ENROLLMENT ID */}

                    <div className="EnrollmentDetails-record-item">

                        <div className="EnrollmentDetails-record-icon">

                            <i className="fa-solid fa-fingerprint"></i>

                        </div>

                        <div>

                            <span>
                                Enrollment ID
                            </span>

                            <strong>
                                {enrollment._id}
                            </strong>

                        </div>

                    </div>


                    {/* COURSE ID */}

                    <div className="EnrollmentDetails-record-item">

                        <div className="EnrollmentDetails-record-icon">

                            <i className="fa-solid fa-book"></i>

                        </div>

                        <div>

                            <span>
                                Course ID
                            </span>

                            <strong>
                                {displayedCourseId}
                            </strong>

                        </div>

                    </div>


                    {/* CREATED AT */}

                    <div className="EnrollmentDetails-record-item">

                        <div className="EnrollmentDetails-record-icon">

                            <i className="fa-regular fa-calendar-plus"></i>

                        </div>

                        <div>

                            <span>
                                Created At
                            </span>

                            <strong>
                                {enrollmentDate}
                            </strong>

                        </div>

                    </div>


                    {/* LAST UPDATED */}

                    <div className="EnrollmentDetails-record-item">

                        <div className="EnrollmentDetails-record-icon">

                            <i className="fa-solid fa-clock-rotate-left"></i>

                        </div>

                        <div>

                            <span>
                                Last Updated
                            </span>

                            <strong>
                                {updatedDate}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                ACTION
            ================================================= */}

            <div className="EnrollmentDetails-action-card">

                <div>

                    <span>
                        Enrollment Status
                    </span>


                    {enrollment.status === "Pending" ? (

                        <>

                            <h2>
                                This enrollment is waiting for confirmation.
                            </h2>

                            <p>
                                Once confirmed, this enrollment can become an official student record.
                            </p>

                        </>

                    ) : (

                        <>

                            <h2>
                                This enrollment has been confirmed.
                            </h2>

                            <p>
                                The student has been approved for this course.
                            </p>

                        </>

                    )}

                </div>


                {enrollment.status === "Pending" && (

                    <button
                        className="EnrollmentDetails-confirm"
                        onClick={confirmEnrollment}
                        disabled={isConfirming}
                    >

                        <i
                            className={
                                isConfirming
                                    ? "fa-solid fa-spinner fa-spin"
                                    : "fa-solid fa-check"
                            }
                        ></i>


                        {isConfirming
                            ? "Confirming..."
                            : "Confirm Enrollment"
                        }

                    </button>

                )}

            </div>


            {/* =================================================
                CONFIRMATION ERROR
            ================================================= */}

            {error && enrollment && (

                <div className="EnrollmentDetails-error">

                    {error}

                </div>

            )}

        </div>

    );

}


export default EnrollmentDetails;