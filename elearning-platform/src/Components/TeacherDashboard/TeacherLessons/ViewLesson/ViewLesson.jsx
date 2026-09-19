import "./ViewLesson.css";

import { useLocation, useNavigate } from "react-router-dom";


/* =========================================================
   VIEW LESSON
   AsiaEdu Teacher Dashboard
========================================================= */

function ViewLesson() {

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
            <div className="ViewLesson">

                <div className="ViewLesson-container">

                    <div className="ViewLesson-empty">

                        <div className="ViewLesson-empty-icon">
                            <i className="fa-solid fa-book-open"></i>
                        </div>

                        <h2>
                            Lesson Not Found
                        </h2>

                        <p>
                            We could not find the lesson you are looking for.
                        </p>

                        <button
                            className="ViewLesson-back-button"
                            onClick={() => navigate(-1)}
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

        navigate(-1);

    }


    /* =====================================================
       EDIT
    ===================================================== */

    function handleEdit() {

        navigate("/teacher-dashboard/lessons/edit", {
            state: {
                lesson,
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
            "Are you sure you want to delete this lesson?"
        );


        if (!confirmed) {

            return;

        }


        try {

            const response = await fetch(
                `https://asiaedu-backend.onrender.com/api/lessons/${lesson._id}`,
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete lesson."
                );

            }


            alert(
                "Lesson deleted successfully."
            );


            navigate(
                "/teacher-dashboard/lessons"
            );


        } catch (error) {

            console.error(
                "Delete lesson error:",
                error
            );


            alert(
                error.message ||
                "Something went wrong while deleting the lesson."
            );

        }

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

        <div className="ViewLesson">

            <div className="ViewLesson-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="ViewLesson-header">

                    <button
                        className="ViewLesson-back"
                        onClick={handleBack}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Lessons

                    </button>


                    <div className="ViewLesson-actions">

                        <button
                            className="ViewLesson-edit"
                            onClick={handleEdit}
                        >

                            <i className="fa-solid fa-pen"></i>

                            Edit Lesson

                        </button>


                        <button
                            className="ViewLesson-delete"
                            onClick={handleDelete}
                        >

                            <i className="fa-solid fa-trash"></i>

                            Delete Lesson

                        </button>

                    </div>

                </div>


                {/* =================================================
                   TITLE SECTION
                ================================================= */}

                <div className="ViewLesson-title-section">

                    <div className="ViewLesson-title-icon">

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

                <div className="ViewLesson-info-grid">

                    <div className="ViewLesson-info-card">

                        <span className="ViewLesson-info-label">
                            Course
                        </span>

                        <strong>
                            {course?.title || "Not available"}
                        </strong>

                    </div>


                    <div className="ViewLesson-info-card">

                        <span className="ViewLesson-info-label">
                            Session
                        </span>

                        <strong>
                            {session
                                ? `${session.group} • ${session.startDate}`
                                : "Not available"}
                        </strong>

                    </div>


                    <div className="ViewLesson-info-card">

                        <span className="ViewLesson-info-label">
                            Program Type
                        </span>

                        <strong>
                            {session?.programType ||
                                "Not available"}
                        </strong>

                    </div>


                    <div className="ViewLesson-info-card">

                        <span className="ViewLesson-info-label">
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

                <div className="ViewLesson-section">

                    <div className="ViewLesson-section-header">

                        <div className="ViewLesson-section-icon">

                            <i className="fa-solid fa-align-left"></i>

                        </div>

                        <h2>
                            Description
                        </h2>

                    </div>


                    <div className="ViewLesson-content">

                        <p>
                            {lesson.description ||
                                "No description provided."}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   LESSON CONTENT
                ================================================= */}

                <div className="ViewLesson-section">

                    <div className="ViewLesson-section-header">

                        <div className="ViewLesson-section-icon">

                            <i className="fa-solid fa-book"></i>

                        </div>

                        <h2>
                            Lesson Content
                        </h2>

                    </div>


                    <div className="ViewLesson-content">

                        <p>
                            {lesson.content ||
                                "No lesson content provided."}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   RESOURCES
                ================================================= */}

                <div className="ViewLesson-section">

                    <div className="ViewLesson-section-header">

                        <div className="ViewLesson-section-icon">

                            <i className="fa-solid fa-link"></i>

                        </div>

                        <h2>
                            Resources
                        </h2>

                    </div>


                    <div className="ViewLesson-list">

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
                                            className="ViewLesson-resource"
                                            key={index}
                                            onClick={() =>
                                                handleOpenResource(
                                                    resource
                                                )
                                            }
                                            disabled={!resourceUrl}
                                        >

                                            <div className="ViewLesson-resource-icon">

                                                <i className="fa-solid fa-link"></i>

                                            </div>


                                            <span>
                                                {resourceUrl ||
                                                    "Resource unavailable"}
                                            </span>


                                            {resourceUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewLesson-resource-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewLesson-empty-text">
                                No resources added.
                            </p>

                        )}

                    </div>

                </div>


                {/* =================================================
                   ATTACHMENTS
                ================================================= */}

                <div className="ViewLesson-section">

                    <div className="ViewLesson-section-header">

                        <div className="ViewLesson-section-icon">

                            <i className="fa-solid fa-paperclip"></i>

                        </div>

                        <h2>
                            Attachments
                        </h2>

                    </div>


                    <div className="ViewLesson-list">

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
                                            className="ViewLesson-attachment"
                                            key={index}
                                            onClick={() =>
                                                handleOpenAttachment(
                                                    attachment
                                                )
                                            }
                                            disabled={!hasUrl}
                                        >

                                            <div className="ViewLesson-attachment-icon">

                                                <i className="fa-solid fa-file"></i>

                                            </div>


                                            <span>
                                                {attachment.name ||
                                                    "Attachment"}
                                            </span>


                                            {hasUrl && (

                                                <i className="fa-solid fa-arrow-up-right-from-square ViewLesson-attachment-open"></i>

                                            )}

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <p className="ViewLesson-empty-text">
                                No attachments added.
                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );

}


export default ViewLesson;