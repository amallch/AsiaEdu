import "./TeacherSubmissionDetails.css";

import { useState } from "react";


/* =========================================================
   TEACHER SUBMISSION DETAILS
   AsiaEdu Teacher Dashboard
========================================================= */

function TeacherSubmissionDetails({
    submission,
    selectedCourse,
    onBack,
    onUpdate,
    formatDate
}) {

    const assignment =
        submission?.assignment || null;


    const maxScore =
        assignment?.maxScore ||
        20;


    const [grade, setGrade] = useState(
        submission?.grade !== null &&
        submission?.grade !== undefined
            ? submission.grade
            : ""
    );


    const [feedback, setFeedback] = useState(
        submission?.feedback || ""
    );


    const [correction, setCorrection] = useState(
        submission?.correction || ""
    );


    const [correctionFile, setCorrectionFile] =
        useState(null);


    const [isSaving, setIsSaving] =
        useState(false);


    /* =====================================================
       IF NO SUBMISSION
    ===================================================== */

    if (!submission) {

        return (

            <div className="TeacherSubmissionDetails">

                <div className="TeacherSubmissionDetails-container">

                    <div className="TeacherSubmissionDetails-empty">

                        <div className="TeacherSubmissionDetails-empty-icon">

                            <i className="fa-solid fa-file-circle-xmark"></i>

                        </div>

                        <h2>
                            Submission Not Found
                        </h2>

                        <p>
                            We could not find the submission you are looking for.
                        </p>

                        <button
                            className="TeacherSubmissionDetails-back-button"
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
       GET STUDENT NAME
    ===================================================== */

    const studentName =
        submission.student?.name ||
        submission.studentName ||
        "Student";


    /* =====================================================
       GET ASSIGNMENT NAME
    ===================================================== */

    const assignmentName =
        assignment?.title ||
        submission.assignmentName ||
        submission.assignment ||
        "Assignment";


    /* =====================================================
       GET COURSE
    ===================================================== */

    const course =
        assignment?.course || null;


    const courseName =
        course?.title ||
        selectedCourse?.title ||
        selectedCourse?.name ||
        submission.courseName ||
        "Not available";


    /* =====================================================
       GET SESSION
    ===================================================== */

    const session =
        assignment?.session || null;


    const sessionName =
        session?.group ||
        session?.title ||
        session?.name ||
        submission.sessionName ||
        "Not available";


    /* =====================================================
       GET STUDENT ATTACHMENT
    ===================================================== */

    const studentAttachments =
        Array.isArray(submission.attachments)
            ? submission.attachments
            : [];


    const studentAttachment =
        studentAttachments.length > 0
            ? studentAttachments[0]
            : null;


    /* =====================================================
       DISPLAY STATUS
    ===================================================== */

    let displayStatus = "Pending Review";


    if (submission.status === "Graded") {

        displayStatus = "Graded";

    }


    if (submission.status === "Late") {

        displayStatus = "Late";

    }


    /* =====================================================
       BACK
    ===================================================== */

    function handleBack() {

        onBack();

    }


    /* =====================================================
       SAVE GRADE
    ===================================================== */

    async function handleSaveGrade() {

        const numericGrade =
            Number(grade);


        if (
            grade === "" ||
            isNaN(numericGrade) ||
            numericGrade < 0 ||
            numericGrade > maxScore
        ) {

            alert(
                `Please enter a grade between 0 and ${maxScore}.`
            );

            return;

        }


        try {

            setIsSaving(true);


            let correctionAttachment =
                submission.correctionAttachment ||
                null;


            /* =============================================
               UPLOAD CORRECTION FILE
            ============================================= */

            if (correctionFile) {

                const formData =
                    new FormData();


                formData.append(
                    "files",
                    correctionFile
                );


                const uploadResponse =
                    await fetch(
                        "http://localhost:5000/api/assignments/upload",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const uploadData =
                    await uploadResponse.json();


                if (!uploadResponse.ok) {

                    alert(
                        uploadData.message ||
                        "Failed to upload correction file."
                    );

                    setIsSaving(false);

                    return;

                }


                if (
                    uploadData.attachments &&
                    uploadData.attachments.length > 0
                ) {

                    correctionAttachment =
                        uploadData.attachments[0];

                }

            }


            /* =============================================
               UPDATE SUBMISSION
            ============================================= */

            const response =
                await fetch(
                    `http://localhost:5000/api/submissions/${submission._id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            grade:
                                numericGrade,

                            feedback:
                                feedback,

                            correction:
                                correction,

                            correctionAttachment:
                                correctionAttachment,

                            status:
                                "Graded"

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to update submission."
                );

                setIsSaving(false);

                return;

            }


            /* =============================================
               UPDATE FRONTEND
            ============================================= */

            onUpdate(
                data.submission
            );


        } catch (error) {

            console.error(
                "Error saving submission:",
                error
            );


            alert(
                "Failed to save the submission."
            );

        } finally {

            setIsSaving(false);

        }

    }


    /* =====================================================
       OPEN STUDENT ATTACHMENT
    ===================================================== */

    function handleOpenAttachment() {

        if (!studentAttachment?.url) {

            return;

        }


        window.open(
            studentAttachment.url,
            "_blank",
            "noopener,noreferrer"
        );

    }


    /* =====================================================
       CORRECTION FILE
    ===================================================== */

    function handleCorrectionFile(event) {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        setCorrectionFile(file);

    }


    return (

        <div className="TeacherSubmissionDetails">

            <div className="TeacherSubmissionDetails-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="TeacherSubmissionDetails-header">

                    <button
                        className="TeacherSubmissionDetails-back"
                        onClick={handleBack}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Submissions

                    </button>

                </div>


                {/* =================================================
                   TITLE SECTION
                ================================================= */}

                <div className="TeacherSubmissionDetails-title-section">

                    <div className="TeacherSubmissionDetails-title-icon">

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

                <div className="TeacherSubmissionDetails-info-grid">


                    {/* =========================
                       COURSE
                    ========================= */}

                    <div className="TeacherSubmissionDetails-info-card">

                        <span className="TeacherSubmissionDetails-info-label">
                            Course
                        </span>

                        <strong>
                            {courseName}
                        </strong>

                    </div>


                    {/* =========================
                       SESSION
                    ========================= */}

                    <div className="TeacherSubmissionDetails-info-card">

                        <span className="TeacherSubmissionDetails-info-label">
                            Session
                        </span>

                        <strong>
                            {sessionName}
                        </strong>

                    </div>


                    {/* =========================
                       SUBMITTED
                    ========================= */}

                    <div className="TeacherSubmissionDetails-info-card">

                        <span className="TeacherSubmissionDetails-info-label">
                            Submitted
                        </span>

                        <strong>
                            {formatDate(
                                submission.submittedAt
                            )}
                        </strong>

                    </div>


                    {/* =========================
                       STATUS
                    ========================= */}

                    <div className="TeacherSubmissionDetails-info-card">

                        <span className="TeacherSubmissionDetails-info-label">
                            Status
                        </span>

                        <strong
                            className={
                                submission.status === "Graded"
                                    ? "TeacherSubmissionDetails-status graded"
                                    : "TeacherSubmissionDetails-status pending"
                            }
                        >

                            {displayStatus}

                        </strong>

                    </div>

                </div>


                {/* =================================================
                   STUDENT ANSWER
                ================================================= */}

                <div className="TeacherSubmissionDetails-section">

                    <div className="TeacherSubmissionDetails-section-header">

                        <div className="TeacherSubmissionDetails-section-icon">

                            <i className="fa-solid fa-align-left"></i>

                        </div>

                        <h2>
                            Student Answer
                        </h2>

                    </div>


                    <div className="TeacherSubmissionDetails-content">

                        <p>
                            {submission.answer ||
                                "No answer provided."}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   STUDENT ATTACHMENT
                ================================================= */}

                <div className="TeacherSubmissionDetails-section">

                    <div className="TeacherSubmissionDetails-section-header">

                        <div className="TeacherSubmissionDetails-section-icon">

                            <i className="fa-solid fa-paperclip"></i>

                        </div>

                        <h2>
                            Attachment
                        </h2>

                    </div>


                    {studentAttachment ? (

                        <button
                            type="button"
                            className="TeacherSubmissionDetails-attachment"
                            onClick={handleOpenAttachment}
                            disabled={
                                !studentAttachment.url
                            }
                        >

                            <div className="TeacherSubmissionDetails-attachment-icon">

                                <i className="fa-solid fa-file"></i>

                            </div>


                            <span>
                                {studentAttachment.name}
                            </span>


                            {studentAttachment.url && (

                                <i className="fa-solid fa-arrow-up-right-from-square TeacherSubmissionDetails-attachment-open"></i>

                            )}

                        </button>

                    ) : (

                        <p className="TeacherSubmissionDetails-empty-text">

                            No attachment submitted.

                        </p>

                    )}

                </div>


                {/* =================================================
                   TEACHER CORRECTION
                ================================================= */}

                <div className="TeacherSubmissionDetails-section">

                    <div className="TeacherSubmissionDetails-section-header">

                        <div className="TeacherSubmissionDetails-section-icon">

                            <i className="fa-solid fa-pen-to-square"></i>

                        </div>

                        <h2>
                            Teacher Correction
                        </h2>

                    </div>


                    <div className="TeacherSubmissionDetails-grading">


                        {/* =========================
                           CORRECTION
                        ========================= */}

                        <div className="TeacherSubmissionDetails-feedback-field">

                            <label>
                                Correction
                            </label>


                            <textarea
                                value={correction}
                                onChange={(event) =>
                                    setCorrection(
                                        event.target.value
                                    )
                                }
                                placeholder="Write the correction for the student..."
                                rows="5"
                            />

                        </div>


                        {/* =========================
                           CORRECTION ATTACHMENT
                        ========================= */}

                        <div className="TeacherSubmissionDetails-correction-file">

                            <label>
                                Correction Attachment
                            </label>


                            <label className="TeacherSubmissionDetails-file-button">

                                <i className="fa-solid fa-cloud-arrow-up"></i>

                                <span>
                                    {correctionFile
                                        ? correctionFile.name
                                        : submission.correctionAttachment?.name
                                            ? submission.correctionAttachment.name
                                            : "Choose correction file"}
                                </span>

                                <input
                                    type="file"
                                    onChange={
                                        handleCorrectionFile
                                    }
                                />

                            </label>


                            <p>
                                PDF, documents, images, or other files
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                   GRADING
                ================================================= */}

                <div className="TeacherSubmissionDetails-section">

                    <div className="TeacherSubmissionDetails-section-header">

                        <div className="TeacherSubmissionDetails-section-icon">

                            <i className="fa-solid fa-star"></i>

                        </div>

                        <h2>
                            Grade & Feedback
                        </h2>

                    </div>


                    <div className="TeacherSubmissionDetails-grading">


                        {/* =========================
                           GRADE
                        ========================= */}

                        <div className="TeacherSubmissionDetails-grade-field">

                            <label>
                                Grade
                            </label>


                            <div className="TeacherSubmissionDetails-grade-input">

                                <input
                                    type="number"
                                    min="0"
                                    max={maxScore}
                                    value={grade}
                                    onChange={(event) =>
                                        setGrade(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter grade"
                                />

                                <span>
                                    / {maxScore}
                                </span>

                            </div>

                        </div>


                        {/* =========================
                           FEEDBACK
                        ========================= */}

                        <div className="TeacherSubmissionDetails-feedback-field">

                            <label>
                                Feedback
                            </label>


                            <textarea
                                value={feedback}
                                onChange={(event) =>
                                    setFeedback(
                                        event.target.value
                                    )
                                }
                                placeholder="Write feedback for the student..."
                                rows="5"
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                   FOOTER ACTIONS
                ================================================= */}

                <div className="TeacherSubmissionDetails-footer">

                    <button
                        className="TeacherSubmissionDetails-cancel"
                        onClick={handleBack}
                        disabled={isSaving}
                    >

                        Cancel

                    </button>


                    <button
                        className="TeacherSubmissionDetails-save"
                        onClick={handleSaveGrade}
                        disabled={isSaving}
                    >

                        <i className="fa-solid fa-check"></i>

                        {isSaving
                            ? "Saving..."
                            : "Save Grade"}

                    </button>

                </div>

            </div>

        </div>

    );

}


export default TeacherSubmissionDetails;