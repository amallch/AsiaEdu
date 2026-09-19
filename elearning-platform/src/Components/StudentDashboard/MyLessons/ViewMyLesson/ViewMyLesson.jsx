import "./ViewMyLesson.css";

import { useLocation, useNavigate } from "react-router-dom";


/* =========================================================
   VIEW MY LESSON
   AsiaEdu Student Dashboard
========================================================= */

function ViewMyLesson() {

    const location = useLocation();
    const navigate = useNavigate();

    const lesson = location.state?.lesson;


    /* =====================================================
       IF NO LESSON
    ===================================================== */

    if (!lesson) {

        return (
            <div className="ViewMyLesson">

                <div className="ViewMyLesson-container">

                    <div className="ViewMyLesson-empty">

                        <div className="ViewMyLesson-empty-icon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>

                        <h2>
                            Lesson Not Found
                        </h2>

                        <p>
                            We could not find the lesson you are looking for.
                        </p>

                        <button
                            className="ViewMyLesson-back-button"
                            onClick={() =>
                                navigate(
                                    "/student-dashboard/lessons"
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
       COURSE
    ===================================================== */

    const course = lesson.course;


    /* =====================================================
       SESSION
    ===================================================== */

    const session = lesson.session;


    /* =====================================================
       TEACHER
    ===================================================== */

    const teacher = lesson.teacher;


    /* =====================================================
       STATUS
    ===================================================== */

    const lessonStatus =
        lesson.status ||
        "Not Started";


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    let statusClass =
        lessonStatus
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
            "/student-dashboard/lessons"
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


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="ViewMyLesson">

            <div className="ViewMyLesson-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="ViewMyLesson-header">

                    <button
                        className="ViewMyLesson-back"
                        onClick={handleBack}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Lessons

                    </button>


                    <div className="ViewMyLesson-status-wrapper">

                        <span
                            className={
                                `ViewMyLesson-status ${statusClass}`
                            }
                        >

                            {lessonStatus}

                        </span>

                    </div>

                </div>


                {/* =================================================
                   TITLE SECTION
                ================================================= */}

                <div className="ViewMyLesson-title-section">

                    <div className="ViewMyLesson-title-icon">

                        <i className="fa-solid fa-book-open"></i>

                    </div>


                    <div>

                        <h1>
                            {lesson.title}
                        </h1>

                        <p>
                            {course?.title ||
                                course?.name ||
                                "Course"}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   LESSON INFORMATION
                ================================================= */}

                <div className="ViewMyLesson-info-grid">

                    <div className="ViewMyLesson-info-card">

                        <span className="ViewMyLesson-info-label">
                            Course
                        </span>

                        <strong>
                            {course?.title ||
                                course?.name ||
                                "Not available"}
                        </strong>

                    </div>


                    <div className="ViewMyLesson-info-card">

                        <span className="ViewMyLesson-info-label">
                            Session
                        </span>

                        <strong>

                            {session
                                ? `${session.group || session.name || ""}${session.startDate
                                    ? ` • ${session.startDate}`
                                    : ""
                                }`
                                : "Not available"}

                        </strong>

                    </div>


                    <div className="ViewMyLesson-info-card">

                        <span className="ViewMyLesson-info-label">
                            Program Type
                        </span>

                        <strong>

                            {session?.programType ||
                                "Not available"}

                        </strong>

                    </div>


                    <div className="ViewMyLesson-info-card">

                        <span className="ViewMyLesson-info-label">
                            Teacher
                        </span>

                        <strong>

                            {teacher?.name ||
                                "Not available"}

                        </strong>

                    </div>

                </div>


                {/* =================================================
                   DESCRIPTION
                ================================================= */}

                <div className="ViewMyLesson-section">

                    <div className="ViewMyLesson-section-header">

                        <div className="ViewMyLesson-section-icon">

                            <i className="fa-solid fa-align-left"></i>

                        </div>

                        <h2>
                            Description
                        </h2>

                    </div>


                    <div className="ViewMyLesson-content">

                        <p>

                            {lesson.description ||
                                "No description provided."}

                        </p>

                    </div>

                </div>


                {/* =================================================
                   LESSON CONTENT
                ================================================= */}

                <div className="ViewMyLesson-section">

                    <div className="ViewMyLesson-section-header">

                        <div className="ViewMyLesson-section-icon">

                            <i className="fa-solid fa-book"></i>

                        </div>

                        <h2>
                            Lesson Content
                        </h2>

                    </div>


                    <div className="ViewMyLesson-content">

                        <p>

                            {lesson.content ||
                                "No lesson content provided."}

                        </p>

                    </div>

                </div>


                {/* =================================================
                   RESOURCES
                ================================================= */}

                <div className="ViewMyLesson-section">

                    <div className="ViewMyLesson-section-header">

                        <div className="ViewMyLesson-section-icon">

                            <i className="fa-solid fa-link"></i>

                        </div>

                        <h2>
                            Resources
                        </h2>

                    </div>


                    <div className="ViewMyLesson-list">

                        {lesson.resources &&
                        lesson.resources.length > 0 ? (

                            lesson.resources.map(
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
                                            className="ViewMyLesson-resource"
                                            key={
                                                `${resourceUrl}-${index}`
                                            }
                                            onClick={() =>
                                                handleOpenResource(
                                                    resource
                                                )
                                            }
                                            disabled={!resourceUrl}
                                        >

                                            <div className="ViewMyLesson-resource-icon">

                                                <i className="fa-solid fa-link"></i>

                                            </div>


                                            <span>

                                                {resourceUrl ||
                                                    "Resource unavailable"}

                                            </span>


                                            {resourceUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewMyLesson-resource-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewMyLesson-empty-text">
                                No resources added.
                            </p>

                        )}

                    </div>

                </div>


                {/* =================================================
                   ATTACHMENTS
                ================================================= */}

                <div className="ViewMyLesson-section">

                    <div className="ViewMyLesson-section-header">

                        <div className="ViewMyLesson-section-icon">

                            <i className="fa-solid fa-paperclip"></i>

                        </div>

                        <h2>
                            Attachments
                        </h2>

                    </div>


                    <div className="ViewMyLesson-list">

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
                                            className="ViewMyLesson-attachment"
                                            key={
                                                `${attachment?.name || "attachment"}-${index}`
                                            }
                                            onClick={() =>
                                                handleOpenAttachment(
                                                    attachment
                                                )
                                            }
                                            disabled={!hasUrl}
                                        >

                                            <div className="ViewMyLesson-attachment-icon">

                                                <i className="fa-solid fa-file"></i>

                                            </div>


                                            <span>

                                                {attachment?.name ||
                                                    "Attachment"}

                                            </span>


                                            {hasUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewMyLesson-attachment-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewMyLesson-empty-text">
                                No attachments added.
                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );

}


export default ViewMyLesson;