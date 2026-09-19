import "./ViewAssignment.css";

import { useLocation, useNavigate } from "react-router-dom";


/* =========================================================
   VIEW ASSIGNMENT
   AsiaEdu Teacher Dashboard
========================================================= */

function ViewAssignment() {

    const location = useLocation();
    const navigate = useNavigate();

    const assignment = location.state?.assignment;
    const course = location.state?.course;
    const session = location.state?.session;
    const teacher = location.state?.teacher;


    /* =====================================================
       IF NO ASSIGNMENT
    ===================================================== */

    if (!assignment) {

        return (
            <div className="ViewAssignment">

                <div className="ViewAssignment-container">

                    <div className="ViewAssignment-empty">

                        <div className="ViewAssignment-empty-icon">
                            <i className="fa-solid fa-file-circle-xmark"></i>
                        </div>

                        <h2>
                            Assignment Not Found
                        </h2>

                        <p>
                            We could not find the assignment you are looking for.
                        </p>

                        <button
                            className="ViewAssignment-back-button"
                            onClick={() => navigate(-1)}
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
       BACK
    ===================================================== */

    function handleBack() {

        navigate(-1);

    }


    /* =====================================================
       EDIT
    ===================================================== */

    function handleEdit() {

        navigate("/teacher-dashboard/assignments/edit", {
            state: {
                assignment,
                course,
                session,
                teacher
            }
        });

    }


    /* =====================================================
       DELETE
    ===================================================== */

    async function handleDelete() {

        const confirmed = window.confirm(
            "Are you sure you want to delete this assignment?"
        );


        if (!confirmed) {

            return;

        }


        try {

            const response = await fetch(
                `https://asiaedu-backend.onrender.com/api/assignments/${assignment._id}`,
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete assignment."
                );

            }


            alert(
                "Assignment deleted successfully."
            );


            navigate(
                "/teacher-dashboard/assignments"
            );


        } catch (error) {

            console.error(
                "Delete assignment error:",
                error
            );


            alert(
                error.message ||
                "Something went wrong while deleting the assignment."
            );

        }

    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(date) {

        if (!date) {

            return "No due date";

        }

        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

    }


    /* =====================================================
       OPEN RESOURCE
    ===================================================== */

    function handleOpenResource(resource) {

        let url = "";

        if (typeof resource === "string") {

            url = resource;

        } else if (resource?.url) {

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

    function handleOpenAttachment(attachment) {

        if (!attachment?.url) {

            return;

        }


        window.open(
            attachment.url,
            "_blank",
            "noopener,noreferrer"
        );

    }


    return (

        <div className="ViewAssignment">

            <div className="ViewAssignment-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="ViewAssignment-header">

                    <button
                        className="ViewAssignment-back"
                        onClick={handleBack}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Assignments

                    </button>


                    <div className="ViewAssignment-actions">

                        <button
                            className="ViewAssignment-edit"
                            onClick={handleEdit}
                        >

                            <i className="fa-solid fa-pen"></i>

                            Edit Assignment

                        </button>


                        <button
                            className="ViewAssignment-delete"
                            onClick={handleDelete}
                        >

                            <i className="fa-solid fa-trash"></i>

                            Delete Assignment

                        </button>

                    </div>

                </div>


                {/* =================================================
                   TITLE SECTION
                ================================================= */}

                <div className="ViewAssignment-title-section">

                    <div className="ViewAssignment-title-icon">

                        <i className="fa-solid fa-file-lines"></i>

                    </div>


                    <div>

                        <h1>
                            {assignment.title}
                        </h1>

                        <p>
                            {course?.title || "Course"}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   COURSE INFORMATION
                ================================================= */}

                <div className="ViewAssignment-info-grid">

                    <div className="ViewAssignment-info-card">

                        <span className="ViewAssignment-info-label">
                            Course
                        </span>

                        <strong>
                            {course?.title || "Not available"}
                        </strong>

                    </div>


                    <div className="ViewAssignment-info-card">

                        <span className="ViewAssignment-info-label">
                            Session
                        </span>

                        <strong>
                            {session?.title ||
                            session?.name ||
                            session?.group ||
                            "Not available"}
                        </strong>

                    </div>


                    <div className="ViewAssignment-info-card">

                        <span className="ViewAssignment-info-label">
                            Due Date
                        </span>

                        <strong>
                            {formatDate(
                                assignment.dueDate
                            )}
                        </strong>

                    </div>


                    <div className="ViewAssignment-info-card">

                        <span className="ViewAssignment-info-label">
                            Maximum Score
                        </span>

                        <strong>
                            {assignment.maxScore || 0} Points
                        </strong>

                    </div>

                </div>


                {/* =================================================
                   DESCRIPTION
                ================================================= */}

                <div className="ViewAssignment-section">

                    <div className="ViewAssignment-section-header">

                        <div className="ViewAssignment-section-icon">

                            <i className="fa-solid fa-align-left"></i>

                        </div>

                        <h2>
                            Description
                        </h2>

                    </div>


                    <div className="ViewAssignment-content">

                        <p>
                            {assignment.description ||
                                "No description provided."}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   INSTRUCTIONS
                ================================================= */}

                <div className="ViewAssignment-section">

                    <div className="ViewAssignment-section-header">

                        <div className="ViewAssignment-section-icon">

                            <i className="fa-solid fa-list-check"></i>

                        </div>

                        <h2>
                            Instructions
                        </h2>

                    </div>


                    <div className="ViewAssignment-content">

                        <p>
                            {assignment.instructions ||
                                "No instructions provided."}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   RESOURCES
                ================================================= */}

                <div className="ViewAssignment-section">

                    <div className="ViewAssignment-section-header">

                        <div className="ViewAssignment-section-icon">

                            <i className="fa-solid fa-link"></i>

                        </div>

                        <h2>
                            Resources
                        </h2>

                    </div>


                    <div className="ViewAssignment-list">

                        {assignment.resources &&
                        assignment.resources.length > 0 ? (

                            assignment.resources.map(
                                (resource, index) => {

                                    let resourceUrl = "";

                                    if (
                                        typeof resource === "string"
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
                                            className="ViewAssignment-resource"
                                            key={index}
                                            onClick={() =>
                                                handleOpenResource(
                                                    resource
                                                )
                                            }
                                            disabled={!resourceUrl}
                                        >

                                            <div className="ViewAssignment-resource-icon">

                                                <i className="fa-solid fa-link"></i>

                                            </div>


                                            <span>
                                                {resourceUrl ||
                                                    "Resource unavailable"}
                                            </span>


                                            {resourceUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewAssignment-resource-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewAssignment-empty-text">
                                No resources added.
                            </p>

                        )}

                    </div>

                </div>


                {/* =================================================
                   ATTACHMENTS
                ================================================= */}

                <div className="ViewAssignment-section">

                    <div className="ViewAssignment-section-header">

                        <div className="ViewAssignment-section-icon">

                            <i className="fa-solid fa-paperclip"></i>

                        </div>

                        <h2>
                            Attachments
                        </h2>

                    </div>


                    <div className="ViewAssignment-list">

                        {assignment.attachments &&
                        assignment.attachments.length > 0 ? (

                            assignment.attachments.map(
                                (attachment, index) => {

                                    const hasUrl =
                                        Boolean(
                                            attachment?.url
                                        );


                                    return (

                                        <button
                                            type="button"
                                            className="ViewAssignment-attachment"
                                            key={index}
                                            onClick={() =>
                                                handleOpenAttachment(
                                                    attachment
                                                )
                                            }
                                            disabled={!hasUrl}
                                        >

                                            <div className="ViewAssignment-attachment-icon">

                                                <i className="fa-solid fa-file"></i>

                                            </div>


                                            <span>
                                                {attachment.name ||
                                                    "Attachment"}
                                            </span>


                                            {hasUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewAssignment-attachment-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewAssignment-empty-text">
                                No attachments added.
                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );

}


export default ViewAssignment;