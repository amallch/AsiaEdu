import "./EditLesson.css";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


/* =========================================================
   EDIT LESSON
   AsiaEdu Teacher Dashboard
========================================================= */

function EditLesson() {

    const location = useLocation();
    const navigate = useNavigate();

    const lesson = location.state?.lesson;
    const course = location.state?.course;
    const session = location.state?.session;
    const teacher = location.state?.teacher;


    /* =====================================================
       FORM
    ===================================================== */

    const [title, setTitle] = useState(
        lesson?.title || ""
    );

    const [description, setDescription] = useState(
        lesson?.description || ""
    );

    const [content, setContent] = useState(
        lesson?.content || ""
    );

    const [resources, setResources] = useState(
        lesson?.resources?.length
            ? lesson.resources
            : [""]
    );

    const [attachments, setAttachments] = useState(
        lesson?.attachments || []
    );

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    /* =====================================================
       IF NO LESSON
    ===================================================== */

    if (!lesson) {

        return (

            <div className="EditLesson">

                <div className="EditLesson-container">

                    <div className="EditLesson-empty">

                        <div className="EditLesson-empty-icon">

                            <i className="fa-solid fa-book-circle-xmark"></i>

                        </div>

                        <h2>
                            Lesson Not Found
                        </h2>

                        <p>
                            We could not find the lesson you want to edit.
                        </p>

                        <button
                            className="EditLesson-back-button"
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
       RESOURCES
    ===================================================== */

    function handleResourceChange(index, value) {

        const updatedResources = [...resources];

        updatedResources[index] = value;

        setResources(updatedResources);

    }


    function handleAddResource() {

        setResources([
            ...resources,
            ""
        ]);

    }


    function handleRemoveResource(index) {

        if (resources.length === 1) {

            setResources([""]);

            return;

        }


        const updatedResources =
            resources.filter(
                (_, resourceIndex) =>
                    resourceIndex !== index
            );

        setResources(updatedResources);

    }


    /* =====================================================
       ATTACHMENTS
    ===================================================== */

    async function handleAttachmentChange(event) {

        const files = Array.from(
            event.target.files
        );


        if (files.length === 0) {

            return;

        }


        try {

            setError("");


            const formData = new FormData();


            files.forEach((file) => {

                formData.append(
                    "files",
                    file
                );

            });


            const response = await fetch(
                "https://asiaedu-backend.onrender.com/api/lessons/upload",
                {
                    method: "POST",
                    body: formData
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to upload files."
                );

            }


            setAttachments(
                (previousAttachments) => [

                    ...previousAttachments,

                    ...data.attachments

                ]
            );


        } catch (error) {

            console.error(
                "Upload lesson files error:",
                error
            );


            setError(
                error.message ||
                "Failed to upload files."
            );

        }


        event.target.value = "";

    }


    function handleRemoveAttachment(index) {

        const updatedAttachments =
            attachments.filter(
                (_, attachmentIndex) =>
                    attachmentIndex !== index
            );

        setAttachments(updatedAttachments);

    }


    /* =====================================================
       CANCEL
    ===================================================== */

    function handleCancel() {

        navigate(-1);

    }


    /* =====================================================
       SAVE
    ===================================================== */

    async function handleSubmit(event) {

        event.preventDefault();

        setLoading(true);
        setError("");


        const cleanResources =
            resources.filter(
                (resource) =>
                    resource.trim() !== ""
            );


        const updatedLesson = {

            title: title,

            description: description,

            content: content,

            course: lesson.course,

            session: lesson.session,

            teacher: lesson.teacher,

            resources: cleanResources,

            attachments: attachments

        };


        try {

            const response = await fetch(
                `https://asiaedu-backend.onrender.com/api/lessons/${lesson._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(
                        updatedLesson
                    )
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update lesson."
                );

            }


            navigate(
                "/teacher-dashboard/lessons/view",
                {
                    state: {

                        lesson:
                            data.lesson ||
                            {
                                ...lesson,
                                ...updatedLesson
                            },

                        course: course,

                        session: session,

                        teacher: teacher

                    }
                }
            );


        } catch (error) {

            console.error(
                "Update lesson error:",
                error
            );


            setError(
                error.message ||
                "Something went wrong while updating the lesson."
            );


        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="EditLesson">

            <div className="EditLesson-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="EditLesson-header">

                    <button
                        className="EditLesson-back"
                        onClick={handleCancel}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Lesson

                    </button>

                </div>


                {/* =================================================
                   TITLE
                ================================================= */}

                <div className="EditLesson-title-section">

                    <div className="EditLesson-title-icon">

                        <i className="fa-solid fa-pen"></i>

                    </div>


                    <div>

                        <h1>
                            Edit Lesson
                        </h1>

                        <p>
                            {course?.title || "Lesson"}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   FORM
                ================================================= */}

                <form
                    className="EditLesson-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                       LESSON INFORMATION
                    ================================================= */}

                    <div className="EditLesson-section">

                        <div className="EditLesson-section-header">

                            <div className="EditLesson-section-icon">

                                <i className="fa-solid fa-book-open"></i>

                            </div>

                            <h2>
                                Lesson Information
                            </h2>

                        </div>


                        <div className="EditLesson-fields">


                            {/* TITLE */}

                            <div className="EditLesson-field">

                                <label>
                                    Lesson Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter lesson title"
                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="EditLesson-field">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter lesson description"
                                    rows="4"
                                    required
                                />

                            </div>


                            {/* CONTENT */}

                            <div className="EditLesson-field">

                                <label>
                                    Lesson Content
                                </label>

                                <textarea
                                    value={content}
                                    onChange={(event) =>
                                        setContent(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter lesson content"
                                    rows="8"
                                    required
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                       RESOURCES
                    ================================================= */}

                    <div className="EditLesson-section">

                        <div className="EditLesson-section-header">

                            <div className="EditLesson-section-icon">

                                <i className="fa-solid fa-link"></i>

                            </div>

                            <h2>
                                Resources
                            </h2>

                        </div>


                        <div className="EditLesson-resources">

                            {resources.map(
                                (resource, index) => (

                                    <div
                                        className="EditLesson-resource-row"
                                        key={index}
                                    >

                                        <input
                                            type="text"
                                            value={resource}
                                            onChange={(event) =>
                                                handleResourceChange(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter resource URL"
                                        />


                                        <button
                                            type="button"
                                            className="EditLesson-remove-button"
                                            onClick={() =>
                                                handleRemoveResource(
                                                    index
                                                )
                                            }
                                        >

                                            <i className="fa-solid fa-trash"></i>

                                        </button>

                                    </div>

                                )
                            )}


                            <button
                                type="button"
                                className="EditLesson-add-resource"
                                onClick={handleAddResource}
                            >

                                <i className="fa-solid fa-plus"></i>

                                Add Resource

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                       ATTACHMENTS
                    ================================================= */}

                    <div className="EditLesson-section">

                        <div className="EditLesson-section-header">

                            <div className="EditLesson-section-icon">

                                <i className="fa-solid fa-paperclip"></i>

                            </div>

                            <h2>
                                Attachments
                            </h2>

                        </div>


                        <div className="EditLesson-attachments">


                            <label className="EditLesson-upload">

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
                                        handleAttachmentChange
                                    }
                                />

                            </label>


                            {attachments.length > 0 && (

                                <div className="EditLesson-attachment-list">

                                    {attachments.map(
                                        (attachment, index) => (

                                            <div
                                                className="EditLesson-attachment"
                                                key={index}
                                            >

                                                <div className="EditLesson-attachment-info">

                                                    <div className="EditLesson-attachment-icon">

                                                        <i className="fa-solid fa-file"></i>

                                                    </div>

                                                    <span>
                                                        {attachment.name}
                                                    </span>

                                                </div>


                                                <button
                                                    type="button"
                                                    className="EditLesson-remove-button"
                                                    onClick={() =>
                                                        handleRemoveAttachment(
                                                            index
                                                        )
                                                    }
                                                >

                                                    <i className="fa-solid fa-trash"></i>

                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                       ERROR
                    ================================================= */}

                    {error && (

                        <div className="EditLesson-error">

                            <i className="fa-solid fa-circle-exclamation"></i>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                       ACTIONS
                    ================================================= */}

                    <div className="EditLesson-actions">

                        <button
                            type="button"
                            className="EditLesson-cancel"
                            onClick={handleCancel}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="EditLesson-save"
                            disabled={loading}
                        >

                            {loading ? (

                                <>

                                    <i className="fa-solid fa-spinner fa-spin"></i>

                                    Saving...

                                </>

                            ) : (

                                <>

                                    <i className="fa-solid fa-check"></i>

                                    Save Changes

                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default EditLesson;