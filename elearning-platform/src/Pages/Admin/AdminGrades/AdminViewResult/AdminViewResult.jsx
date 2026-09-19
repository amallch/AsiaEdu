import "./AdminViewResult.css";

import {
    useLocation,
    useNavigate
} from "react-router-dom";


/* =========================================================
   ADMIN VIEW RESULT
   AsiaEdu Admin Dashboard
========================================================= */

function AdminViewResult() {

    const location =
        useLocation();

    const navigate =
        useNavigate();


    const result =
        location.state?.result || null;


    const selectedCourse =
        location.state?.course || null;


    /* =====================================================
       BACK TO GRADES
    ===================================================== */

    function handleBack() {

        navigate(
            "/admin/grades"
        );

    }


    /* =====================================================
       IF NO RESULT
    ===================================================== */

    if (!result) {

        return (

            <div className="AdminViewResult">

                <div className="AdminViewResult-container">

                    <div className="AdminViewResult-empty">

                        <div className="AdminViewResult-empty-icon">

                            <i className="fa-solid fa-chart-line"></i>

                        </div>

                        <h2>
                            Result Not Found
                        </h2>

                        <p>
                            We could not find the result you are looking for.
                        </p>

                        <button
                            className="AdminViewResult-back-button"
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


    /* =====================================================
       STUDENT NAME
    ===================================================== */

    let studentName =
        "Student";


    if (result.student?.name) {

        studentName =
            result.student.name;

    } else if (result.studentName) {

        studentName =
            result.studentName;

    }


    /* =====================================================
       ASSIGNMENT
    ===================================================== */

    const assignment =
        result.assignment || null;


    let assignmentName =
        "Assignment";


    if (assignment?.title) {

        assignmentName =
            assignment.title;

    } else if (result.title) {

        assignmentName =
            result.title;

    } else if (result.assignmentName) {

        assignmentName =
            result.assignmentName;

    }


    /* =====================================================
       COURSE
    ===================================================== */

    const course =
        assignment?.course ||
        selectedCourse ||
        result.course ||
        null;


    let courseName =
        "Not available";


    if (course?.title) {

        courseName =
            course.title;

    } else if (course?.name) {

        courseName =
            course.name;

    } else if (result.courseName) {

        courseName =
            result.courseName;

    }


    /* =====================================================
       SESSION
    ===================================================== */

    const session =
        assignment?.session ||
        result.session ||
        null;


    let sessionName =
        "Not available";


    if (session?.group) {

        sessionName =
            session.group;

    } else if (session?.name) {

        sessionName =
            session.name;

    } else if (session?.title) {

        sessionName =
            session.title;

    } else if (typeof session === "string") {

        sessionName =
            "Session";

    }


    /* =====================================================
       DATE FORMAT
    ===================================================== */

    function formatDate(date) {

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

            return "Not available";

        }


        return formattedDate.toLocaleDateString(
            "en-US",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       SCORE
    ===================================================== */

    const score =
        result.score !== null &&
        result.score !== undefined
            ? result.score
            : result.submission?.grade ??
              result.submission?.score ??
              null;


    const maxScore =
        assignment?.maxScore ||
        result.maxScore ||
        20;


    /* =====================================================
       PERCENTAGE
    ===================================================== */

    let percentage =
        result.percentage;


    if (
        percentage === null ||
        percentage === undefined
    ) {

        if (
            score !== null &&
            maxScore > 0
        ) {

            percentage =
                Math.round(
                    (
                        Number(score) /
                        Number(maxScore)
                    ) *
                    100
                );

        } else {

            percentage =
                null;

        }

    }


    /* =====================================================
       STATUS
    ===================================================== */

    let displayStatus =
        result.status ||
        "Pending";


    if (
        score !== null &&
        score !== undefined
    ) {

        displayStatus =
            "Graded";

    }


    /* =====================================================
       TEACHER FEEDBACK
    ===================================================== */

    const feedback =
        result.feedback ||
        result.submission?.feedback ||
        result.submission?.teacherFeedback ||
        "";


    /* =====================================================
       TEACHER CORRECTION
    ===================================================== */

    const correction =
        result.correction ||
        result.submission?.correction ||
        result.submission?.teacherCorrection ||
        "";


    /* =====================================================
       CORRECTION ATTACHMENT
    ===================================================== */

    let correctionAttachment =
        null;


    if (
        result.correctionAttachment
    ) {

        correctionAttachment =
            result.correctionAttachment;

    } else if (
        result.submission?.correctionAttachment
    ) {

        correctionAttachment =
            result.submission.correctionAttachment;

    }


    /* =====================================================
       CORRECTION ATTACHMENT URL
    ===================================================== */

    let correctionAttachmentUrl =
        "";


    if (
        correctionAttachment?.url
    ) {

        correctionAttachmentUrl =
            correctionAttachment.url;

    } else if (
        correctionAttachment?.path
    ) {

        correctionAttachmentUrl =
            correctionAttachment.path;

    } else if (
        correctionAttachment?.fileUrl
    ) {

        correctionAttachmentUrl =
            correctionAttachment.fileUrl;

    } else if (
        typeof correctionAttachment === "string"
    ) {

        correctionAttachmentUrl =
            correctionAttachment;

    }


    /* =====================================================
       CORRECTION ATTACHMENT NAME
    ===================================================== */

    let correctionAttachmentName =
        "Teacher Correction Attachment";


    if (
        correctionAttachment?.name
    ) {

        correctionAttachmentName =
            correctionAttachment.name;

    } else if (
        correctionAttachment?.filename
    ) {

        correctionAttachmentName =
            correctionAttachment.filename;

    }


    /* =====================================================
       OPEN CORRECTION ATTACHMENT
    ===================================================== */

    function handleOpenCorrectionAttachment() {

        if (!correctionAttachmentUrl) {

            return;

        }


        let finalUrl =
            correctionAttachmentUrl;


        if (
            correctionAttachmentUrl.startsWith("/") &&
            !correctionAttachmentUrl.startsWith("//")
        ) {

            finalUrl =
                `http://localhost:5000${correctionAttachmentUrl}`;

        }


        window.open(
            finalUrl,
            "_blank",
            "noopener,noreferrer"
        );

    }


    return (

        <div className="AdminViewResult">

            <div className="AdminViewResult-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="AdminViewResult-header">

                    <button
                        className="AdminViewResult-back"
                        onClick={handleBack}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Grades

                    </button>

                </div>


                {/* =================================================
                   TITLE + SCORE
                ================================================= */}

                <div className="AdminViewResult-title-section">

                    <div className="AdminViewResult-title-left">

                        <div className="AdminViewResult-title-icon">

                            <i className="fa-solid fa-file-lines"></i>

                        </div>


                        <div>

                            <h1>
                                {studentName}
                            </h1>

                            <p>
                                {assignmentName}
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                       SCORE
                    ================================================= */}

                    <div
                        className={
                            percentage !== null &&
                            percentage < 50
                                ? "AdminViewResult-title-grade failed"
                                : "AdminViewResult-title-grade passed"
                        }
                    >

                        <strong>

                            {
                                score !== null &&
                                score !== undefined
                                    ? score
                                    : "--"
                            }

                            <span className="AdminViewResult-max-score">

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

                <div className="AdminViewResult-info-grid">


                    {/* SUBMITTED */}

                    <div className="AdminViewResult-info-card">

                        <span className="AdminViewResult-info-label">
                            Submitted
                        </span>

                        <strong>
                            {formatDate(
                                result.submittedDate ||
                                result.submission?.submittedAt ||
                                result.submission?.createdAt
                            )}
                        </strong>

                    </div>


                    {/* GRADED */}

                    <div className="AdminViewResult-info-card">

                        <span className="AdminViewResult-info-label">
                            Graded
                        </span>

                        <strong>
                            {formatDate(
                                result.gradedDate ||
                                result.submission?.updatedAt
                            )}
                        </strong>

                    </div>


                    {/* SCORE */}

                    <div className="AdminViewResult-info-card">

                        <span className="AdminViewResult-info-label">
                            Score
                        </span>

                        <strong>

                            {
                                score !== null &&
                                score !== undefined
                                    ? `${score} / ${maxScore}`
                                    : `-- / ${maxScore}`
                            }


                            {
                                percentage !== null && (

                                    <small className="AdminViewResult-percentage">

                                        {percentage}%

                                    </small>

                                )
                            }

                        </strong>

                    </div>


                    {/* STATUS */}

                    <div className="AdminViewResult-info-card">

                        <span className="AdminViewResult-info-label">
                            Status
                        </span>

                        <strong
                            className={
                                displayStatus === "Graded"
                                    ? "AdminViewResult-status graded"
                                    : "AdminViewResult-status pending"
                            }
                        >

                            {displayStatus}

                        </strong>

                    </div>

                </div>


                {/* =================================================
                   TEACHER FEEDBACK
                ================================================= */}

                <div className="AdminViewResult-section">

                    <div className="AdminViewResult-section-header">

                        <div className="AdminViewResult-section-icon">

                            <i className="fa-solid fa-comment-dots"></i>

                        </div>

                        <h2>
                            Teacher Feedback
                        </h2>

                    </div>


                    <div className="AdminViewResult-content">

                        <p>
                            {feedback ||
                                "No teacher feedback provided."}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   TEACHER CORRECTION
                ================================================= */}

                <div className="AdminViewResult-section">

                    <div className="AdminViewResult-section-header">

                        <div className="AdminViewResult-section-icon">

                            <i className="fa-solid fa-pen-to-square"></i>

                        </div>

                        <h2>
                            Teacher Correction
                        </h2>

                    </div>


                    <div className="AdminViewResult-content">

                        <p>
                            {correction ||
                                "No teacher correction provided."}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   TEACHER CORRECTION ATTACHMENT
                ================================================= */}

                <div className="AdminViewResult-section">

                    <div className="AdminViewResult-section-header">

                        <div className="AdminViewResult-section-icon">

                            <i className="fa-solid fa-paperclip"></i>

                        </div>

                        <h2>
                            Teacher Correction Attachment
                        </h2>

                    </div>


                    {correctionAttachment ? (

                        <button
                            type="button"
                            className="AdminViewResult-attachment"
                            onClick={
                                handleOpenCorrectionAttachment
                            }
                            disabled={
                                !correctionAttachmentUrl
                            }
                        >

                            <div className="AdminViewResult-attachment-icon">

                                <i className="fa-solid fa-file"></i>

                            </div>


                            <span>
                                {correctionAttachmentName}
                            </span>


                            {correctionAttachmentUrl && (

                                <i className="fa-solid fa-arrow-up-right-from-square AdminViewResult-attachment-open"></i>

                            )}

                        </button>

                    ) : (

                        <p className="AdminViewResult-empty-text">

                            No correction attachment provided.

                        </p>

                    )}

                </div>


                {/* =================================================
                   FOOTER
                ================================================= */}

                <div className="AdminViewResult-footer">

                    <button
                        className="AdminViewResult-cancel"
                        onClick={handleBack}
                    >

                        Back to Grades

                    </button>

                </div>

            </div>

        </div>

    );

}


export default AdminViewResult;