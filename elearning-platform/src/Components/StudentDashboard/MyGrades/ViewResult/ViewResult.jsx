import "./ViewResult.css";

import { useLocation, useNavigate } from "react-router-dom";


/* =========================================================
   VIEW RESULT
   AsiaEdu Student Dashboard
========================================================= */

function ViewResult() {

    const location =
        useLocation();


    const navigate =
        useNavigate();


    const result =
        location.state?.result;


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(date) {

        if (!date) {

            return "Not available";

        }


        return new Date(
            date
        ).toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       GET ASSIGNMENT
    ===================================================== */

    const assignment =
        result?.assignment || null;


    /* =====================================================
       GET COURSE
    ===================================================== */

    const course =
        assignment?.course ||
        result?.course ||
        null;


    const courseName =
        course?.title ||
        course?.name ||
        result?.courseName ||
        "Not available";


    /* =====================================================
       GET SESSION
    ===================================================== */

    const session =
        assignment?.session ||
        result?.session ||
        null;


    const sessionName =
        session?.group ||
        session?.title ||
        session?.name ||
        result?.sessionName ||
        "Not available";


    /* =====================================================
       GET ASSIGNMENT NAME
    ===================================================== */

    const assignmentName =
        assignment?.title ||
        result?.title ||
        "Assignment Result";


    /* =====================================================
       GET MAX SCORE
    ===================================================== */

    const maxScore =
        assignment?.maxScore ||
        result?.maxScore ||
        20;


    /* =====================================================
       GET GRADE
    ===================================================== */

    const grade =
        result?.score !== null &&
        result?.score !== undefined
            ? result.score
            : assignment?.grade;


    /* =====================================================
       GET PERCENTAGE
    ===================================================== */

    const percentage =
        grade !== null &&
        grade !== undefined &&
        maxScore
            ? Math.round(
                (Number(grade) /
                    Number(maxScore)) *
                100
            )
            : null;


    /* =====================================================
       GET STUDENT ANSWER
    ===================================================== */

    const studentAnswer =
        result?.answer ||
        "No answer provided.";


    /* =====================================================
       GET ATTACHMENTS
    ===================================================== */

    const studentAttachments =
        Array.isArray(
            result?.attachments
        )
            ? result.attachments
            : Array.isArray(
                result?.submission?.attachments
            )
                ? result.submission.attachments
                : [];


    const studentAttachment =
        studentAttachments.length > 0
            ? studentAttachments[0]
            : null;


    /* =====================================================
       GET TEACHER FEEDBACK
    ===================================================== */

    const feedback =
        result?.feedback ||
        "";


    /* =====================================================
       GET TEACHER CORRECTION
    ===================================================== */

    const correction =
        result?.correction ||
        "";


    /* =====================================================
       GET CORRECTION ATTACHMENT
    ===================================================== */

    const correctionAttachment =
        result?.correctionAttachment ||
        result?.submission?.correctionAttachment ||
        null;


    /* =====================================================
       GET SUBMISSION DATE
    ===================================================== */

    const submittedAt =
        result?.submittedDate ||
        result?.submission?.submittedAt ||
        result?.submittedAt ||
        result?.createdAt ||
        null;


    /* =====================================================
       GET GRADED DATE
    ===================================================== */

    const gradedAt =
        result?.gradedDate ||
        result?.gradedAt ||
        result?.submission?.gradedAt ||
        result?.submission?.updatedAt ||
        null;


    /* =====================================================
       GET STATUS
    ===================================================== */

    const resultStatus =
        result?.status ||
        (
            grade !== null &&
            grade !== undefined
                ? "Graded"
                : "Pending"
        );


    /* =====================================================
       OPEN ATTACHMENT
    ===================================================== */

    function handleOpenAttachment(
        attachment
    ) {

        if (!attachment?.url) {

            return;

        }


        window.open(
            attachment.url,
            "_blank",
            "noopener,noreferrer"
        );

    }


    /* =====================================================
       BACK TO GRADES
    ===================================================== */

    function handleBack() {

        navigate(
            "/student-dashboard/grades"
        );

    }


    /* =====================================================
       IF NO RESULT
    ===================================================== */

    if (!result) {

        return (

            <div className="ViewResult">

                <div className="ViewResult-container">

                    <div className="ViewResult-empty">

                        <div className="ViewResult-empty-icon">

                            <i className="fa-solid fa-file-circle-xmark"></i>

                        </div>


                        <h2>
                            Result Not Found
                        </h2>


                        <p>
                            We could not find the assignment result.
                        </p>


                        <button
                            className="ViewResult-back"
                            onClick={handleBack}
                        >

                            <i className="fa-solid fa-arrow-left"></i>

                            Back to Grades

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="ViewResult">

            <div className="ViewResult-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="ViewResult-header">

                    <button
                        className="ViewResult-back-button"
                        onClick={handleBack}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Grades

                    </button>

                </div>


                {/* =================================================
                   ASSIGNMENT TITLE
                ================================================= */}

                <div className="ViewResult-title-section">

                    <div className="ViewResult-title-left">

                        <div className="ViewResult-title-icon">

                            <i className="fa-solid fa-file-lines"></i>

                        </div>


                        <div>

                            <h1>
                                {assignmentName}
                            </h1>


                            <p>
                                {courseName}
                                {" • "}
                                {sessionName}
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                       GRADE
                    ================================================= */}

                    <div
                        className={
                            percentage !== null &&
                            percentage < 50
                                ? "ViewResult-title-grade failed"
                                : "ViewResult-title-grade passed"
                        }
                    >

                        <strong>

                            {
                                grade !== null &&
                                grade !== undefined
                                    ? grade
                                    : "--"
                            }

                            <span className="ViewResult-max-score">

                                {" / "}
                                {maxScore}

                            </span>

                        </strong>


                        {
                            percentage !== null && (

                                <small>
                                    {percentage}%
                                </small>

                            )
                        }

                    </div>

                </div>


                {/* =================================================
                   RESULT INFORMATION
                ================================================= */}

                <div className="ViewResult-info-grid">


                    {/* =========================
                       SUBMITTED
                    ========================= */}

                    <div className="ViewResult-info-card">

                        <span className="ViewResult-info-label">
                            Submitted
                        </span>


                        <strong>
                            {formatDate(
                                submittedAt
                            )}
                        </strong>

                    </div>


                    {/* =========================
                       GRADED
                    ========================= */}

                    <div className="ViewResult-info-card">

                        <span className="ViewResult-info-label">
                            Graded
                        </span>


                        <strong>
                            {formatDate(
                                gradedAt
                            )}
                        </strong>

                    </div>


                    {/* =========================
                       SCORE
                    ========================= */}

                    <div className="ViewResult-info-card">

                        <span className="ViewResult-info-label">
                            Score
                        </span>


                        <strong>

                            {
                                grade !== null &&
                                grade !== undefined
                                    ? `${grade} / ${maxScore}`
                                    : `-- / ${maxScore}`
                            }


                            {
                                percentage !== null && (

                                    <small className="ViewResult-percentage">

                                        {percentage}%

                                    </small>

                                )
                            }

                        </strong>

                    </div>


                    {/* =========================
                       STATUS
                    ========================= */}

                    <div className="ViewResult-info-card">

                        <span className="ViewResult-info-label">
                            Status
                        </span>


                        <strong
                            className={
                                resultStatus === "Graded"
                                    ? "ViewResult-status graded"
                                    : "ViewResult-status pending"
                            }
                        >

                            {resultStatus}

                        </strong>

                    </div>

                </div>


                {/* =================================================
                   STUDENT ANSWER
                ================================================= */}

                <div className="ViewResult-section">

                    <div className="ViewResult-section-header">

                        <div className="ViewResult-section-icon">

                            <i className="fa-solid fa-align-left"></i>

                        </div>


                        <h2>
                            Your Answer
                        </h2>

                    </div>


                    <div className="ViewResult-content">

                        <p>
                            {studentAnswer}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   STUDENT ATTACHMENT
                ================================================= */}

                <div className="ViewResult-section">

                    <div className="ViewResult-section-header">

                        <div className="ViewResult-section-icon">

                            <i className="fa-solid fa-paperclip"></i>

                        </div>


                        <h2>
                            Your Attachment
                        </h2>

                    </div>


                    <div className="ViewResult-list">

                        {
                            studentAttachment ? (

                                <button
                                    type="button"
                                    className="ViewResult-attachment"
                                    onClick={() =>
                                        handleOpenAttachment(
                                            studentAttachment
                                        )
                                    }
                                    disabled={
                                        !studentAttachment.url
                                    }
                                >

                                    <div className="ViewResult-attachment-icon">

                                        <i className="fa-solid fa-file"></i>

                                    </div>


                                    <span>
                                        {
                                            studentAttachment.name ||
                                            "Submitted file"
                                        }
                                    </span>


                                    {
                                        studentAttachment.url && (

                                            <i className="fa-solid fa-arrow-up-right-from-square ViewResult-attachment-open"></i>

                                        )
                                    }

                                </button>

                            ) : (

                                <p className="ViewResult-empty-text">

                                    No attachment submitted.

                                </p>

                            )
                        }

                    </div>

                </div>


                {/* =================================================
                   TEACHER FEEDBACK
                ================================================= */}

                <div className="ViewResult-section">

                    <div className="ViewResult-section-header">

                        <div className="ViewResult-section-icon">

                            <i className="fa-solid fa-comment-dots"></i>

                        </div>


                        <h2>
                            Teacher Feedback
                        </h2>

                    </div>


                    <div className="ViewResult-content">

                        <p>
                            {
                                feedback ||
                                "No teacher feedback provided."
                            }
                        </p>

                    </div>

                </div>


                {/* =================================================
                   TEACHER CORRECTION
                ================================================= */}

                <div className="ViewResult-section">

                    <div className="ViewResult-section-header">

                        <div className="ViewResult-section-icon">

                            <i className="fa-solid fa-pen-to-square"></i>

                        </div>


                        <h2>
                            Teacher Correction
                        </h2>

                    </div>


                    <div className="ViewResult-content">

                        <p>
                            {
                                correction ||
                                "No correction provided."
                            }
                        </p>

                    </div>

                </div>


                {/* =================================================
                   CORRECTION ATTACHMENT
                ================================================= */}

                <div className="ViewResult-section">

                    <div className="ViewResult-section-header">

                        <div className="ViewResult-section-icon">

                            <i className="fa-solid fa-file-circle-check"></i>

                        </div>


                        <h2>
                            Correction Attachment
                        </h2>

                    </div>


                    <div className="ViewResult-list">

                        {
                            correctionAttachment ? (

                                <button
                                    type="button"
                                    className="ViewResult-attachment"
                                    onClick={() =>
                                        handleOpenAttachment(
                                            correctionAttachment
                                        )
                                    }
                                    disabled={
                                        !correctionAttachment.url
                                    }
                                >

                                    <div className="ViewResult-attachment-icon">

                                        <i className="fa-solid fa-file"></i>

                                    </div>


                                    <span>
                                        {
                                            correctionAttachment.name ||
                                            "Correction file"
                                        }
                                    </span>


                                    {
                                        correctionAttachment.url && (

                                            <i className="fa-solid fa-arrow-up-right-from-square ViewResult-attachment-open"></i>

                                        )
                                    }

                                </button>

                            ) : (

                                <p className="ViewResult-empty-text">

                                    No correction attachment provided.

                                </p>

                            )
                        }

                    </div>

                </div>


            </div>

        </div>

    );

}


export default ViewResult;