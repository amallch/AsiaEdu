import "./AdminSubmissionDetails.css";


/* =========================================================
   ADMIN SUBMISSION DETAILS
   AsiaEdu Admin Dashboard
========================================================= */

function AdminSubmissionDetails({
    submission,
    selectedCourse,
    onBack,
    formatDate
}) {


    const assignment =
        submission?.assignment || null;


    /* =====================================================
       IF NO SUBMISSION
    ===================================================== */

    if (!submission) {

        return (

            <div className="AdminSubmissionDetails">

                <div className="AdminSubmissionDetails-container">

                    <div className="AdminSubmissionDetails-empty">

                        <div className="AdminSubmissionDetails-empty-icon">

                            <i className="fa-solid fa-file-circle-xmark"></i>

                        </div>

                        <h2>
                            Submission Not Found
                        </h2>

                        <p>
                            We could not find the submission you are looking for.
                        </p>

                        <button
                            className="AdminSubmissionDetails-back-button"
                            onClick={onBack}
                        >

                            <i className="fa-solid fa-arrow-left"></i>

                            Back to Submissions

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


    if (submission.student?.name) {

        studentName =
            submission.student.name;

    } else if (submission.studentName) {

        studentName =
            submission.studentName;

    }


    /* =====================================================
       ASSIGNMENT NAME
    ===================================================== */

    let assignmentName =
        "Assignment";


    if (assignment?.title) {

        assignmentName =
            assignment.title;

    } else if (submission.assignmentName) {

        assignmentName =
            submission.assignmentName;

    } else if (typeof submission.assignment === "string") {

        assignmentName =
            submission.assignment;

    }


    /* =====================================================
       COURSE
    ===================================================== */

    const course =
        assignment?.course || null;


    let courseName =
        "Not available";


    if (course?.title) {

        courseName =
            course.title;

    } else if (selectedCourse?.title) {

        courseName =
            selectedCourse.title;

    } else if (selectedCourse?.name) {

        courseName =
            selectedCourse.name;

    } else if (submission.courseName) {

        courseName =
            submission.courseName;

    }


    /* =====================================================
       SESSION
    ===================================================== */

    const session =
        assignment?.session || submission?.session || null;


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

        /*
           If session is only an ID, the backend needs
           to populate the session.
        */

        sessionName =
            "Session";

    }


    /* =====================================================
       GET STUDENT ATTACHMENTS
    ===================================================== */

    let studentAttachments = [];


    if (Array.isArray(submission.attachments)) {

        studentAttachments =
            submission.attachments;

    } else if (submission.attachment) {

        studentAttachments =
            [submission.attachment];

    }


    const studentAttachment =
        studentAttachments.length > 0
            ? studentAttachments[0]
            : null;


    /* =====================================================
       GET ATTACHMENT URL
    ===================================================== */

    let attachmentUrl =
        "";


    if (studentAttachment?.url) {

        attachmentUrl =
            studentAttachment.url;

    } else if (studentAttachment?.path) {

        attachmentUrl =
            studentAttachment.path;

    } else if (studentAttachment?.fileUrl) {

        attachmentUrl =
            studentAttachment.fileUrl;

    }


    /* =====================================================
       ATTACHMENT NAME
    ===================================================== */

    let attachmentName =
        "Student Attachment";


    if (studentAttachment?.name) {

        attachmentName =
            studentAttachment.name;

    } else if (studentAttachment?.filename) {

        attachmentName =
            studentAttachment.filename;

    }


    /* =====================================================
       DISPLAY STATUS
    ===================================================== */

    let displayStatus =
        "Pending Review";


    if (submission.status === "Graded") {

        displayStatus =
            "Graded";

    }


    if (submission.status === "Late") {

        displayStatus =
            "Late";

    }


    /* =====================================================
       BACK
    ===================================================== */

    function handleBack() {

        onBack();

    }


    /* =====================================================
       OPEN ATTACHMENT
    ===================================================== */

    function handleOpenAttachment() {

        if (!attachmentUrl) {

            return;

        }


        let finalUrl =
            attachmentUrl;


        /*
           If the backend sends a relative path,
           add the backend URL.
        */

        if (
            attachmentUrl.startsWith("/") &&
            !attachmentUrl.startsWith("//")
        ) {

            finalUrl =
                `https://asiaedu-backend.onrender.com${attachmentUrl}`;

        }


        window.open(
            finalUrl,
            "_blank",
            "noopener,noreferrer"
        );

    }


    return (

        <div className="AdminSubmissionDetails">

            <div className="AdminSubmissionDetails-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="AdminSubmissionDetails-header">

                    <button
                        className="AdminSubmissionDetails-back"
                        onClick={handleBack}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Submissions

                    </button>

                </div>


                {/* =================================================
                   TITLE
                ================================================= */}

                <div className="AdminSubmissionDetails-title-section">

                    <div className="AdminSubmissionDetails-title-icon">

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
                   SUBMISSION INFORMATION
                ================================================= */}

                <div className="AdminSubmissionDetails-info-grid">


                    <div className="AdminSubmissionDetails-info-card">

                        <span className="AdminSubmissionDetails-info-label">
                            Course
                        </span>

                        <strong>
                            {courseName}
                        </strong>

                    </div>


                    <div className="AdminSubmissionDetails-info-card">

                        <span className="AdminSubmissionDetails-info-label">
                            Session
                        </span>

                        <strong>
                            {sessionName}
                        </strong>

                    </div>


                    <div className="AdminSubmissionDetails-info-card">

                        <span className="AdminSubmissionDetails-info-label">
                            Submitted
                        </span>

                        <strong>
                            {formatDate(
                                submission.submittedAt
                            )}
                        </strong>

                    </div>


                    <div className="AdminSubmissionDetails-info-card">

                        <span className="AdminSubmissionDetails-info-label">
                            Status
                        </span>

                        <strong
                            className={
                                submission.status === "Graded"
                                    ? "AdminSubmissionDetails-status graded"
                                    : "AdminSubmissionDetails-status pending"
                            }
                        >

                            {displayStatus}

                        </strong>

                    </div>

                </div>


                {/* =================================================
                   STUDENT ANSWER
                ================================================= */}

                <div className="AdminSubmissionDetails-section">

                    <div className="AdminSubmissionDetails-section-header">

                        <div className="AdminSubmissionDetails-section-icon">

                            <i className="fa-solid fa-align-left"></i>

                        </div>

                        <h2>
                            Student Answer
                        </h2>

                    </div>


                    <div className="AdminSubmissionDetails-content">

                        <p>
                            {submission.answer ||
                                "No answer provided."}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   STUDENT ATTACHMENT
                ================================================= */}

                <div className="AdminSubmissionDetails-section">

                    <div className="AdminSubmissionDetails-section-header">

                        <div className="AdminSubmissionDetails-section-icon">

                            <i className="fa-solid fa-paperclip"></i>

                        </div>

                        <h2>
                            Attachment
                        </h2>

                    </div>


                    {studentAttachment ? (

                        <button
                            type="button"
                            className="AdminSubmissionDetails-attachment"
                            onClick={handleOpenAttachment}
                            disabled={!attachmentUrl}
                        >

                            <div className="AdminSubmissionDetails-attachment-icon">

                                <i className="fa-solid fa-file"></i>

                            </div>


                            <span>
                                {attachmentName}
                            </span>


                            {attachmentUrl && (

                                <i className="fa-solid fa-arrow-up-right-from-square AdminSubmissionDetails-attachment-open"></i>

                            )}

                        </button>

                    ) : (

                        <p className="AdminSubmissionDetails-empty-text">

                            No attachment submitted.

                        </p>

                    )}

                </div>


                {/* =================================================
                   FOOTER
                ================================================= */}

                <div className="AdminSubmissionDetails-footer">

                    <button
                        className="AdminSubmissionDetails-cancel"
                        onClick={handleBack}
                    >

                        Back to Submissions

                    </button>

                </div>

            </div>

        </div>

    );

}


export default AdminSubmissionDetails;