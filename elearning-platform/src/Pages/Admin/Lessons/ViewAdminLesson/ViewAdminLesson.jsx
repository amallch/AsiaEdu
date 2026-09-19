import "./ViewAdminLesson.css";

import { useLocation, useNavigate } from "react-router-dom";


/* =========================================================
   VIEW ADMIN LESSON
   AsiaEdu Admin Dashboard
========================================================= */

function ViewAdminLesson() {

    const location = useLocation();
    const navigate = useNavigate();

    const lesson = location.state?.lesson;
    const course = location.state?.course;
    const session = location.state?.session;
    const teacher = location.state?.teacher;


    /* =====================================================
       IF NO LESSON
    ===================================================== */

    if (!lesson) {

        return (
            <div className="ViewAdminLesson">

                <div className="ViewAdminLesson-container">

                    <div className="ViewAdminLesson-empty">

                        <div className="ViewAdminLesson-empty-icon">
                            <i className="fa-solid fa-book-open"></i>
                        </div>

                        <h2>
                            Lesson Not Found
                        </h2>

                        <p>
                            We could not find the lesson you are looking for.
                        </p>

                        <button
                            className="ViewAdminLesson-back-button"
                            onClick={() =>
                                navigate(
                                    "/admin/lessons"
                                )
                            }
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            Back to Lessons
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
            "/admin/lessons",
            {
                state: {
                    selectedCourseId:
                        course?.id ||
                        course?._id,

                    selectedSessionId:
                        session?._id
                }
            }
        );

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

        <div className="ViewAdminLesson">

            <div className="ViewAdminLesson-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="ViewAdminLesson-header">

                    <button
                        className="ViewAdminLesson-back"
                        onClick={handleBack}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Lessons

                    </button>

                </div>


                {/* =================================================
                   TITLE SECTION
                ================================================= */}

                <div className="ViewAdminLesson-title-section">

                    <div className="ViewAdminLesson-title-icon">

                        <i className="fa-solid fa-book-open"></i>

                    </div>


                    <div>

                        <h1>
                            {lesson.title}
                        </h1>

                        <p>
                            {course?.title || "Course"}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   LESSON INFORMATION
                ================================================= */}

                <div className="ViewAdminLesson-info-grid">

                    <div className="ViewAdminLesson-info-card">

                        <span className="ViewAdminLesson-info-label">
                            Course
                        </span>

                        <strong>
                            {course?.title || "Not available"}
                        </strong>

                    </div>


                    <div className="ViewAdminLesson-info-card">

                        <span className="ViewAdminLesson-info-label">
                            Session
                        </span>

                        <strong>
                            {session
                                ? `${session.group} • ${session.startDate}`
                                : "Not available"}
                        </strong>

                    </div>


                    <div className="ViewAdminLesson-info-card">

                        <span className="ViewAdminLesson-info-label">
                            Program Type
                        </span>

                        <strong>
                            {session?.programType ||
                                "Not available"}
                        </strong>

                    </div>


                    <div className="ViewAdminLesson-info-card">

                        <span className="ViewAdminLesson-info-label">
                            Teacher
                        </span>

                        <strong>
                            {teacher?.name ||
                                lesson.teacher?.name ||
                                "Not available"}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                   DESCRIPTION
                ================================================= */}

                <div className="ViewAdminLesson-section">

                    <div className="ViewAdminLesson-section-header">

                        <div className="ViewAdminLesson-section-icon">

                            <i className="fa-solid fa-align-left"></i>

                        </div>

                        <h2>
                            Description
                        </h2>

                    </div>


                    <div className="ViewAdminLesson-content">

                        <p>
                            {lesson.description ||
                                "No description provided."}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   LESSON CONTENT
                ================================================= */}

                <div className="ViewAdminLesson-section">

                    <div className="ViewAdminLesson-section-header">

                        <div className="ViewAdminLesson-section-icon">

                            <i className="fa-solid fa-book"></i>

                        </div>

                        <h2>
                            Lesson Content
                        </h2>

                    </div>


                    <div className="ViewAdminLesson-content">

                        <p>
                            {lesson.content ||
                                "No lesson content provided."}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   RESOURCES
                ================================================= */}

                <div className="ViewAdminLesson-section">

                    <div className="ViewAdminLesson-section-header">

                        <div className="ViewAdminLesson-section-icon">

                            <i className="fa-solid fa-link"></i>

                        </div>

                        <h2>
                            Resources
                        </h2>

                    </div>


                    <div className="ViewAdminLesson-list">

                        {lesson.resources &&
                        lesson.resources.length > 0 ? (

                            lesson.resources.map(
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
                                            className="ViewAdminLesson-resource"
                                            key={`${resourceUrl}-${index}`}
                                            onClick={() =>
                                                handleOpenResource(
                                                    resource
                                                )
                                            }
                                            disabled={!resourceUrl}
                                        >

                                            <div className="ViewAdminLesson-resource-icon">

                                                <i className="fa-solid fa-link"></i>

                                            </div>


                                            <span>
                                                {resourceUrl ||
                                                    "Resource unavailable"}
                                            </span>


                                            {resourceUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewAdminLesson-resource-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewAdminLesson-empty-text">
                                No resources added.
                            </p>

                        )}

                    </div>

                </div>


                {/* =================================================
                   ATTACHMENTS
                ================================================= */}

                <div className="ViewAdminLesson-section">

                    <div className="ViewAdminLesson-section-header">

                        <div className="ViewAdminLesson-section-icon">

                            <i className="fa-solid fa-paperclip"></i>

                        </div>

                        <h2>
                            Attachments
                        </h2>

                    </div>


                    <div className="ViewAdminLesson-list">

                        {lesson.attachments &&
                        lesson.attachments.length > 0 ? (

                            lesson.attachments.map(
                                (attachment, index) => {

                                    const hasUrl =
                                        Boolean(
                                            attachment?.url
                                        );


                                    return (

                                        <button
                                            type="button"
                                            className="ViewAdminLesson-attachment"
                                            key={`${attachment.name}-${index}`}
                                            onClick={() =>
                                                handleOpenAttachment(
                                                    attachment
                                                )
                                            }
                                            disabled={!hasUrl}
                                        >

                                            <div className="ViewAdminLesson-attachment-icon">

                                                <i className="fa-solid fa-file"></i>

                                            </div>


                                            <span>
                                                {attachment.name ||
                                                    "Attachment"}
                                            </span>


                                            {hasUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewAdminLesson-attachment-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewAdminLesson-empty-text">
                                No attachments added.
                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );

}


export default ViewAdminLesson;