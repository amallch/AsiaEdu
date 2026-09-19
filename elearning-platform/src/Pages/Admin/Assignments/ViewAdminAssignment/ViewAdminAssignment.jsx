import "./ViewAdminAssignment.css";

import {
    useLocation,
    useNavigate
} from "react-router-dom";


/* =========================================================
   VIEW ADMIN ASSIGNMENT
   AsiaEdu Admin Dashboard
========================================================= */

function ViewAdminAssignment() {

    const location = useLocation();
    const navigate = useNavigate();

    const assignment =
        location.state?.assignment;

    const course =
        location.state?.course;

    const session =
        location.state?.session;


    /* =====================================================
       IF NO ASSIGNMENT
    ===================================================== */

    if (!assignment) {

        return (

            <div className="ViewAdminAssignment">

                <div className="ViewAdminAssignment-container">

                    <div className="ViewAdminAssignment-empty">

                        <div className="ViewAdminAssignment-empty-icon">

                            <i className="fa-solid fa-file-lines"></i>

                        </div>


                        <h2>
                            Assignment Not Found
                        </h2>


                        <p>
                            We could not find the assignment you are looking for.
                        </p>


                        <button
                            className="ViewAdminAssignment-back-button"
                            onClick={() =>
                                navigate(
                                    "/admin/assignments"
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
       BACK
    ===================================================== */

    function handleBack() {

        navigate(
            "/admin/assignments",
            {
                state: {

                    selectedCourseId:
                        course?.id ||
                        course?._id ||
                        (
                            typeof assignment.course ===
                            "object"
                                ? assignment.course._id
                                : assignment.course
                        ),

                    selectedSessionId:
                        session?._id ||
                        session?.id ||
                        (
                            typeof assignment.session ===
                            "object"
                                ? assignment.session._id
                                : assignment.session
                        )

                }
            }
        );

    }


    /* =====================================================
       OPEN RESOURCE
    ===================================================== */

    function handleOpenResource(resource) {

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

        if (
            !attachment?.url
        ) {

            return;

        }


        window.open(
            attachment.url,
            "_blank",
            "noopener,noreferrer"
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


    return (

        <div className="ViewAdminAssignment">

            <div className="ViewAdminAssignment-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="ViewAdminAssignment-header">

                    <button
                        className="ViewAdminAssignment-back"
                        onClick={handleBack}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Assignments

                    </button>

                </div>


                {/* =================================================
                   TITLE SECTION
                ================================================= */}

                <div className="ViewAdminAssignment-title-section">

                    <div className="ViewAdminAssignment-title-icon">

                        <i className="fa-solid fa-file-lines"></i>

                    </div>


                    <div>

                        <h1>
                            {assignment.title}
                        </h1>


                        <p>
                            {course?.title ||
                                assignment.course?.title ||
                                "Course"}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   ASSIGNMENT INFORMATION
                ================================================= */}

                <div className="ViewAdminAssignment-info-grid">


                    {/* COURSE */}

                    <div className="ViewAdminAssignment-info-card">

                        <span className="ViewAdminAssignment-info-label">
                            Course
                        </span>


                        <strong>

                            {course?.title ||
                                assignment.course?.title ||
                                "Not available"}

                        </strong>

                    </div>


                    {/* SESSION */}

                    <div className="ViewAdminAssignment-info-card">

                        <span className="ViewAdminAssignment-info-label">
                            Session
                        </span>


                        <strong>

                            {session
                                ? session.group ||
                                    session.name ||
                                    "Session"
                                : assignment.session
                                    ? assignment.session.group ||
                                        assignment.session.name ||
                                        "Session"
                                    : "Not available"}

                        </strong>

                    </div>


                    {/* DUE DATE */}

                    <div className="ViewAdminAssignment-info-card">

                        <span className="ViewAdminAssignment-info-label">
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


                    {/* MAXIMUM SCORE */}

                    <div className="ViewAdminAssignment-info-card">

                        <span className="ViewAdminAssignment-info-label">
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

                <div className="ViewAdminAssignment-section">

                    <div className="ViewAdminAssignment-section-header">

                        <div className="ViewAdminAssignment-section-icon">

                            <i className="fa-solid fa-align-left"></i>

                        </div>


                        <h2>
                            Description
                        </h2>

                    </div>


                    <div className="ViewAdminAssignment-content">

                        <p>

                            {assignment.description ||
                                "No description provided."}

                        </p>

                    </div>

                </div>


                {/* =================================================
                   INSTRUCTIONS
                ================================================= */}

                <div className="ViewAdminAssignment-section">

                    <div className="ViewAdminAssignment-section-header">

                        <div className="ViewAdminAssignment-section-icon">

                            <i className="fa-solid fa-list-check"></i>

                        </div>


                        <h2>
                            Instructions
                        </h2>

                    </div>


                    <div className="ViewAdminAssignment-content">

                        <p>

                            {assignment.instructions ||
                                "No instructions provided."}

                        </p>

                    </div>

                </div>


                {/* =================================================
                   RESOURCES
                ================================================= */}

                <div className="ViewAdminAssignment-section">

                    <div className="ViewAdminAssignment-section-header">

                        <div className="ViewAdminAssignment-section-icon">

                            <i className="fa-solid fa-link"></i>

                        </div>


                        <h2>
                            Resources
                        </h2>

                    </div>


                    <div className="ViewAdminAssignment-list">

                        {assignment.resources &&
                        assignment.resources.length > 0 ? (

                            assignment.resources.map(
                                (resource, index) => {

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
                                            className="ViewAdminAssignment-resource"
                                            key={`${resourceUrl}-${index}`}
                                            onClick={() =>
                                                handleOpenResource(
                                                    resource
                                                )
                                            }
                                            disabled={!resourceUrl}
                                        >

                                            <div className="ViewAdminAssignment-resource-icon">

                                                <i className="fa-solid fa-link"></i>

                                            </div>


                                            <span>

                                                {resourceUrl ||
                                                    "Resource unavailable"}

                                            </span>


                                            {resourceUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewAdminAssignment-resource-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewAdminAssignment-empty-text">

                                No resources added.

                            </p>

                        )}

                    </div>

                </div>


                {/* =================================================
                   ATTACHMENTS
                ================================================= */}

                <div className="ViewAdminAssignment-section">

                    <div className="ViewAdminAssignment-section-header">

                        <div className="ViewAdminAssignment-section-icon">

                            <i className="fa-solid fa-paperclip"></i>

                        </div>


                        <h2>
                            Attachments
                        </h2>

                    </div>


                    <div className="ViewAdminAssignment-list">

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
                                            className="ViewAdminAssignment-attachment"
                                            key={`${attachment.name}-${index}`}
                                            onClick={() =>
                                                handleOpenAttachment(
                                                    attachment
                                                )
                                            }
                                            disabled={!hasUrl}
                                        >

                                            <div className="ViewAdminAssignment-attachment-icon">

                                                <i className="fa-solid fa-file"></i>

                                            </div>


                                            <span>

                                                {attachment.name ||
                                                    "Attachment"}

                                            </span>


                                            {hasUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewAdminAssignment-attachment-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewAdminAssignment-empty-text">

                                No attachments added.

                            </p>

                        )}

                    </div>

                </div>


            </div>

        </div>

    );

}


export default ViewAdminAssignment;