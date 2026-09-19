import "./ViewMyAssignment.css";

import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate
} from "react-router-dom";


/* =========================================================
   VIEW MY ASSIGNMENT
   AsiaEdu Student Dashboard
========================================================= */

function ViewMyAssignment() {

    const location = useLocation();
    const navigate = useNavigate();

    const assignment =
        location.state?.assignment;

    const course =
        location.state?.course;


    const [student, setStudent] =
        useState(null);

    const [submission, setSubmission] =
        useState(
            assignment?.submission || null
        );

    const [answer, setAnswer] =
        useState(
            assignment?.submission?.answer ||
            ""
        );

    const [selectedFiles, setSelectedFiles] =
        useState([]);

    const [isSubmitting, setIsSubmitting] =
        useState(false);


    /* =====================================================
       LOAD STUDENT + SUBMISSION
    ===================================================== */

    useEffect(() => {

        async function loadSubmission() {

            try {

                const storedUser =
                    localStorage.getItem("user");


                if (!storedUser) {
                    return;
                }


                const loggedInUser =
                    JSON.parse(storedUser);


                const userId =
                    loggedInUser.id ||
                    loggedInUser._id;


                if (!userId) {
                    return;
                }


                /* =========================================
                   GET STUDENT
                ========================================= */

                const studentResponse =
                    await fetch(
                        `https://asiaedu-backend.onrender.com/api/students/user/${userId}`
                    );


                if (!studentResponse.ok) {
                    return;
                }


                const studentData =
                    await studentResponse.json();


                const currentStudent =
                    studentData.student ||
                    studentData;


                setStudent(
                    currentStudent
                );


                /* =========================================
                   GET SUBMISSIONS
                ========================================= */

                if (
                    assignment &&
                    currentStudent?._id
                ) {

                    const submissionsResponse =
                        await fetch(
                            `https://asiaedu-backend.onrender.com/api/submissions/student/${currentStudent._id}`
                        );


                    if (
                        submissionsResponse.ok
                    ) {

                        const submissionsData =
                            await submissionsResponse.json();


                        const studentSubmissions =
                            submissionsData.submissions ||
                            [];


                        const foundSubmission =
                            studentSubmissions.find(
                                (item) => {

                                    if (
                                        typeof item.assignment ===
                                        "object"
                                    ) {

                                        return (
                                            item.assignment?._id ===
                                            assignment.id
                                        );

                                    }


                                    return (
                                        item.assignment ===
                                        assignment.id
                                    );

                                }
                            );


                        if (foundSubmission) {

                            setSubmission(
                                foundSubmission
                            );


                            setAnswer(
                                foundSubmission.answer ||
                                ""
                            );

                        }

                    }

                }

            } catch (error) {

                console.error(
                    "Failed to load submission:",
                    error
                );

            }

        }


        loadSubmission();

    }, [assignment]);


    /* =====================================================
       IF NO ASSIGNMENT
    ===================================================== */

    if (!assignment) {

        return (

            <div className="ViewMyAssignment">

                <div className="ViewMyAssignment-container">

                    <div className="ViewMyAssignment-empty">

                        <div className="ViewMyAssignment-empty-icon">

                            <i className="fa-solid fa-file-circle-question"></i>

                        </div>


                        <h2>
                            Assignment Not Found
                        </h2>


                        <p>
                            We could not find the assignment you are looking for.
                        </p>


                        <button
                            className="ViewMyAssignment-back-button"
                            onClick={() =>
                                navigate(
                                    "/student-dashboard/assignments"
                                )
                            }
                        >

                            <i className="fa-solid fa-arrow-left"></i>

                            Back to Assignments

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       COURSE
    ===================================================== */

    const assignmentCourse =
        assignment.course ||
        course;


    /* =====================================================
       SESSION
    ===================================================== */

    const assignmentSession =
        assignment.session;


    /* =====================================================
       STATUS
    ===================================================== */

    let assignmentStatus =
        submission
            ? "Submitted"
            : "Not Submitted";


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    let statusClass =
        assignmentStatus
            .toLowerCase()
            .replace(
                " ",
                "-"
            );


    /* =====================================================
       BACK
    ===================================================== */

    function handleBack() {

        navigate(
            "/student-dashboard/assignments"
        );

    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(date) {

        if (!date) {

            return "Not available";

        }


        const dateObject =
            new Date(date);


        if (
            isNaN(
                dateObject.getTime()
            )
        ) {

            return "Not available";

        }


        return dateObject.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       FORMAT DUE DATE
    ===================================================== */

    function formatDueDate(date) {

        if (!date) {

            return "Not available";

        }


        const dateObject =
            new Date(date);


        if (
            isNaN(
                dateObject.getTime()
            )
        ) {

            return "Not available";

        }


        return dateObject.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       OPEN RESOURCE
    ===================================================== */

    function handleOpenResource(
        resource
    ) {

        let url = "";


        if (
            typeof resource ===
            "string"
        ) {

            url = resource;

        } else if (
            resource?.url
        ) {

            url = resource.url;

        }


        if (!url) {
            return;
        }


        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

    }


    /* =====================================================
       OPEN ATTACHMENT
    ===================================================== */

    function handleOpenAttachment(
        attachment
    ) {

        if (!attachment?.url) {
            return;
        }


        let finalUrl =
            attachment.url;


        if (
            attachment.url.startsWith("/") &&
            !attachment.url.startsWith("//")
        ) {

            finalUrl =
                `https://asiaedu-backend.onrender.com${attachment.url}`;

        }


        window.open(
            finalUrl,
            "_blank",
            "noopener,noreferrer"
        );

    }


    /* =====================================================
       ATTACHMENT ICON
    ===================================================== */

    function getAttachmentIcon(
        fileName
    ) {

        if (!fileName) {
            return "fa-file";
        }


        const extension =
            fileName
                .split(".")
                .pop()
                .toLowerCase();


        if (
            extension === "pdf"
        ) {

            return "fa-file-pdf";

        }


        if (
            extension === "doc" ||
            extension === "docx"
        ) {

            return "fa-file-word";

        }


        if (
            extension === "xls" ||
            extension === "xlsx"
        ) {

            return "fa-file-excel";

        }


        if (
            extension === "ppt" ||
            extension === "pptx"
        ) {

            return "fa-file-powerpoint";

        }


        if (
            extension === "jpg" ||
            extension === "jpeg" ||
            extension === "png" ||
            extension === "gif"
        ) {

            return "fa-file-image";

        }


        if (
            extension === "mp4" ||
            extension === "mov" ||
            extension === "avi"
        ) {

            return "fa-file-video";

        }


        return "fa-file";

    }


    /* =====================================================
       FILE SELECTION
    ===================================================== */

    function handleFileChange(
        event
    ) {

        const files =
            Array.from(
                event.target.files
            );


        setSelectedFiles(
            (previousFiles) => [
                ...previousFiles,
                ...files
            ]
        );


        event.target.value = "";

    }


    /* =====================================================
       REMOVE FILE
    ===================================================== */

    function handleRemoveFile(
        fileToRemove
    ) {

        setSelectedFiles(
            (previousFiles) =>
                previousFiles.filter(
                    (file) =>
                        file !== fileToRemove
                )
        );

    }


    /* =====================================================
       SUBMIT
    ===================================================== */

    async function handleSubmit() {

        if (!student) {

            alert(
                "Student information is missing."
            );

            return;
        }


        if (
            !answer.trim() &&
            selectedFiles.length === 0
        ) {

            alert(
                "Please write an answer or upload a file."
            );

            return;
        }


        try {

            setIsSubmitting(
                true
            );


            /* =============================================
               UPLOAD FILES
            ============================================= */

            let uploadedAttachments = [];


            if (selectedFiles.length > 0) {

                const formData =
                    new FormData();


                selectedFiles.forEach(
                    (file) => {

                        formData.append(
                            "files",
                            file
                        );

                    }
                );


                const uploadResponse =
                    await fetch(
                        "https://asiaedu-backend.onrender.com/api/submissions/upload",
                        {
                            method: "POST",

                            body:
                                formData
                        }
                    );


                const uploadData =
                    await uploadResponse.json();


                if (!uploadResponse.ok) {

                    throw new Error(
                        uploadData.message ||
                        "Failed to upload files."
                    );

                }


                uploadedAttachments =
                    uploadData.attachments ||
                    [];

            }


            /* =============================================
               CREATE SUBMISSION
            ============================================= */

            const response =
                await fetch(
                    "https://asiaedu-backend.onrender.com/api/submissions",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            student:
                                student._id,

                            assignment:
                                assignment.id,

                            answer:
                                answer.trim(),

                            attachments:
                                uploadedAttachments

                        })
                    }
                );


            const data =
                await response.json();


            if (
                response.status ===
                409
            ) {

                alert(
                    data.message ||
                    "You have already submitted this assignment."
                );

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to submit assignment."
                );

            }


            const newSubmission =
                data.submission;


            setSubmission(
                newSubmission
            );


            setAnswer(
                newSubmission?.answer ||
                answer
            );


            setSelectedFiles(
                []
            );


            alert(
                "Assignment submitted successfully!"
            );

        } catch (error) {

            console.error(
                error
            );


            alert(
                error.message ||
                "Failed to submit assignment."
            );

        } finally {

            setIsSubmitting(
                false
            );

        }

    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="ViewMyAssignment">

            <div className="ViewMyAssignment-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="ViewMyAssignment-header">

                    <button
                        className="ViewMyAssignment-back"
                        onClick={handleBack}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Assignments

                    </button>


                    <div className="ViewMyAssignment-status-wrapper">

                        <span
                            className={
                                `ViewMyAssignment-status ${statusClass}`
                            }
                        >

                            {assignmentStatus}

                        </span>

                    </div>

                </div>


                {/* =================================================
                   TITLE SECTION
                ================================================= */}

                <div className="ViewMyAssignment-title-section">

                    <div className="ViewMyAssignment-title-icon">

                        <i className="fa-solid fa-file-pen"></i>

                    </div>


                    <div>

                        <h1>
                            {assignment.title}
                        </h1>


                        <p>

                            {assignmentCourse?.title ||
                                assignmentCourse?.name ||
                                "Course"}

                        </p>

                    </div>

                </div>


                {/* =================================================
                   ASSIGNMENT INFORMATION
                ================================================= */}

                <div className="ViewMyAssignment-info-grid">


                    <div className="ViewMyAssignment-info-card">

                        <span className="ViewMyAssignment-info-label">
                            Course
                        </span>


                        <strong>

                            {assignmentCourse?.title ||
                                assignmentCourse?.name ||
                                "Not available"}

                        </strong>

                    </div>


                    <div className="ViewMyAssignment-info-card">

                        <span className="ViewMyAssignment-info-label">
                            Session
                        </span>


                        <strong>

                            {assignmentSession
                                ? assignmentSession.group ||
                                    assignmentSession.name ||
                                    "Session"
                                : "Not available"}

                        </strong>

                    </div>


                    <div className="ViewMyAssignment-info-card">

                        <span className="ViewMyAssignment-info-label">
                            Due Date
                        </span>


                        <strong>

                            {
                                formatDueDate(
                                    assignment.dueDate
                                )
                            }

                        </strong>

                    </div>


                    <div className="ViewMyAssignment-info-card">

                        <span className="ViewMyAssignment-info-label">
                            Maximum Score
                        </span>


                        <strong>

                            {
                                assignment.maxScore ??
                                100
                            }

                            {" "}

                            Points

                        </strong>

                    </div>

                </div>


                {/* =================================================
                   DESCRIPTION
                ================================================= */}

                <div className="ViewMyAssignment-section">

                    <div className="ViewMyAssignment-section-header">

                        <div className="ViewMyAssignment-section-icon">

                            <i className="fa-solid fa-align-left"></i>

                        </div>


                        <h2>
                            Description
                        </h2>

                    </div>


                    <div className="ViewMyAssignment-content">

                        <p>

                            {assignment.description ||
                                "No description provided."}

                        </p>

                    </div>

                </div>


                {/* =================================================
                   INSTRUCTIONS
                ================================================= */}

                <div className="ViewMyAssignment-section">

                    <div className="ViewMyAssignment-section-header">

                        <div className="ViewMyAssignment-section-icon">

                            <i className="fa-solid fa-list-check"></i>

                        </div>


                        <h2>
                            Instructions
                        </h2>

                    </div>


                    <div className="ViewMyAssignment-content">

                        <p>

                            {assignment.instructions ||
                                "No instructions provided."}

                        </p>

                    </div>

                </div>


                {/* =================================================
                   RESOURCES
                ================================================= */}

                <div className="ViewMyAssignment-section">

                    <div className="ViewMyAssignment-section-header">

                        <div className="ViewMyAssignment-section-icon">

                            <i className="fa-solid fa-link"></i>

                        </div>


                        <h2>
                            Resources
                        </h2>

                    </div>


                    <div className="ViewMyAssignment-list">

                        {assignment.resources &&
                        assignment.resources.length > 0 ? (

                            assignment.resources.map(
                                (resource) => {

                                    let resourceUrl = "";


                                    if (
                                        typeof resource ===
                                        "string"
                                    ) {

                                        resourceUrl =
                                            resource;

                                    } else if (
                                        resource?.url
                                    ) {

                                        resourceUrl =
                                            resource.url;

                                    }


                                    return (

                                        <button
                                            type="button"
                                            className="ViewMyAssignment-resource"
                                            key={
                                                resourceUrl ||
                                                JSON.stringify(
                                                    resource
                                                )
                                            }
                                            onClick={() =>
                                                handleOpenResource(
                                                    resource
                                                )
                                            }
                                            disabled={
                                                !resourceUrl
                                            }
                                        >

                                            <div className="ViewMyAssignment-resource-icon">

                                                <i className="fa-solid fa-link"></i>

                                            </div>


                                            <span>

                                                {resourceUrl ||
                                                    "Resource unavailable"}

                                            </span>


                                            {resourceUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewMyAssignment-resource-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewMyAssignment-empty-text">

                                No resources added.

                            </p>

                        )}

                    </div>

                </div>


                {/* =================================================
                   ATTACHMENTS
                ================================================= */}

                <div className="ViewMyAssignment-section">

                    <div className="ViewMyAssignment-section-header">

                        <div className="ViewMyAssignment-section-icon">

                            <i className="fa-solid fa-paperclip"></i>

                        </div>


                        <h2>
                            Attachments
                        </h2>

                    </div>


                    <div className="ViewMyAssignment-list">

                        {assignment.attachments &&
                        assignment.attachments.length > 0 ? (

                            assignment.attachments.map(
                                (attachment) => {

                                    const hasUrl =
                                        Boolean(
                                            attachment?.url
                                        );


                                    const fileName =
                                        attachment?.name ||
                                        "Attachment";


                                    return (

                                        <button
                                            type="button"
                                            className="ViewMyAssignment-attachment"
                                            key={
                                                attachment?._id ||
                                                attachment?.url ||
                                                fileName
                                            }
                                            onClick={() =>
                                                handleOpenAttachment(
                                                    attachment
                                                )
                                            }
                                            disabled={
                                                !hasUrl
                                            }
                                        >

                                            <div className="ViewMyAssignment-attachment-icon">

                                                <i
                                                    className={
                                                        `fa-solid ${getAttachmentIcon(
                                                            fileName
                                                        )}`
                                                    }
                                                ></i>

                                            </div>


                                            <span>

                                                {fileName}

                                            </span>


                                            {hasUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewMyAssignment-attachment-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewMyAssignment-empty-text">

                                No attachments added.

                            </p>

                        )}

                    </div>

                </div>


                {/* =================================================
                   YOUR SUBMISSION
                ================================================= */}

                <div className="ViewMyAssignment-section">

                    <div className="ViewMyAssignment-section-header">

                        <div className="ViewMyAssignment-section-icon">

                            <i className="fa-solid fa-paper-plane"></i>

                        </div>


                        <h2>
                            Your Submission
                        </h2>

                    </div>


                    <div className="ViewMyAssignment-submission">


                        {/* =========================================
                           ANSWER
                        ========================================= */}

                        <div className="ViewMyAssignment-form-group">

                            <label>
                                Your Answer
                            </label>


                            <textarea
                                value={answer}
                                onChange={(event) =>
                                    setAnswer(
                                        event.target.value
                                    )
                                }
                                placeholder="Write your answer here..."
                                disabled={
                                    Boolean(
                                        submission
                                    )
                                }
                            />

                        </div>


                        {/* =========================================
                           FILE UPLOAD
                        ========================================= */}

                        {!submission && (

                            <div className="ViewMyAssignment-form-group">

                                <label>
                                    Upload Files
                                </label>


                                <label className="ViewMyAssignment-upload">

                                    <i className="fa-solid fa-cloud-arrow-up"></i>


                                    <span>
                                        Choose Files
                                    </span>


                                    <small>
                                        PDF, documents, images, videos...
                                    </small>


                                    <input
                                        type="file"
                                        multiple
                                        onChange={
                                            handleFileChange
                                        }
                                    />

                                </label>


                                {selectedFiles.length > 0 && (

                                    <div className="ViewMyAssignment-file-list">

                                        {selectedFiles.map(
                                            (file) => (

                                                <div
                                                    className="ViewMyAssignment-file-item"
                                                    key={
                                                        `${file.name}-${file.size}-${file.lastModified}`
                                                    }
                                                >

                                                    <div>

                                                        <i className="fa-solid fa-file"></i>

                                                        <span>
                                                            {file.name}
                                                        </span>

                                                    </div>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveFile(
                                                                file
                                                            )
                                                        }
                                                    >

                                                        <i className="fa-solid fa-xmark"></i>

                                                    </button>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        )}


                        {/* =========================================
                           SUBMITTED MESSAGE
                        ========================================= */}

                        {submission ? (

                            <div className="ViewMyAssignment-submitted-message">

                                <i className="fa-solid fa-circle-check"></i>


                                <div>

                                    <strong>
                                        Submission received
                                    </strong>


                                    <p>
                                        You have successfully submitted this assignment.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <button
                                className="ViewMyAssignment-submit-button"
                                onClick={
                                    handleSubmit
                                }
                                disabled={
                                    isSubmitting
                                }
                            >

                                {isSubmitting ? (

                                    <>

                                        <i className="fa-solid fa-spinner"></i>

                                        Submitting...

                                    </>

                                ) : (

                                    <>

                                        <i className="fa-solid fa-paper-plane"></i>

                                        Submit Assignment

                                    </>

                                )}

                            </button>

                        )}

                    </div>

                </div>


            </div>

        </div>

    );

}


export default ViewMyAssignment;