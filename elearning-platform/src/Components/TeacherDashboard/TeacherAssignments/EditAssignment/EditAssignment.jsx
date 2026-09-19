import "./EditAssignment.css";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


/* =========================================================
   EDIT ASSIGNMENT
   AsiaEdu Teacher Dashboard
========================================================= */

function EditAssignment() {

    const location = useLocation();
    const navigate = useNavigate();

    const assignment = location.state?.assignment;
    const course = location.state?.course;
    const session = location.state?.session;
    const teacher = location.state?.teacher;


    /* =====================================================
       FORM
    ===================================================== */

    const [title, setTitle] = useState(
        assignment?.title || ""
    );

    const [description, setDescription] = useState(
        assignment?.description || ""
    );

    const [instructions, setInstructions] = useState(
        assignment?.instructions || ""
    );

    const [dueDate, setDueDate] = useState(
        assignment?.dueDate
            ? new Date(assignment.dueDate)
                .toISOString()
                .split("T")[0]
            : ""
    );

    const [maxScore, setMaxScore] = useState(
        assignment?.maxScore || 100
    );

    const [resources, setResources] = useState(
        assignment?.resources?.length
            ? assignment.resources
            : [""]
    );

    const [attachments, setAttachments] = useState(
        assignment?.attachments || []
    );

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    /* =====================================================
       IF NO ASSIGNMENT
    ===================================================== */

    if (!assignment) {

        return (

            <div className="EditAssignment">

                <div className="EditAssignment-container">

                    <div className="EditAssignment-empty">

                        <div className="EditAssignment-empty-icon">
                            <i className="fa-solid fa-file-circle-xmark"></i>
                        </div>

                        <h2>Assignment Not Found</h2>

                        <p>
                            We could not find the assignment you want to edit.
                        </p>

                        <button
                            className="EditAssignment-back-button"
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

        const updatedResources = resources.filter(
            (_, resourceIndex) => resourceIndex !== index
        );

        setResources(updatedResources);
    }


    /* =====================================================
       ATTACHMENTS
    ===================================================== */

    async function handleAttachmentChange(event) {

        const files = Array.from(event.target.files);


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
                "http://localhost:5000/api/assignments/upload",
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
                "Upload assignment files error:",
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

        const updatedAttachments = attachments.filter(
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


        const cleanResources = resources.filter(
            (resource) => resource.trim() !== ""
        );


        const updatedAssignment = {

            title: title,

            description: description,

            instructions: instructions,

            course: assignment.course,

            session: assignment.session,

            teacher: assignment.teacher,

            dueDate: dueDate,

            maxScore: Number(maxScore),

            resources: cleanResources,

            attachments: attachments

        };


        try {

            const response = await fetch(
                `http://localhost:5000/api/assignments/${assignment._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(updatedAssignment)
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Failed to update assignment."
                );
            }


            navigate(
                "/teacher-dashboard/assignments/view",
                {
                    state: {
                        assignment: data.assignment || {
                            ...assignment,
                            ...updatedAssignment
                        },
                        course: course,
                        session: session,
                        teacher: teacher
                    }
                }
            );

        } catch (error) {

            setError(
                error.message ||
                "Something went wrong while updating the assignment."
            );

        } finally {

            setLoading(false);
        }
    }


    return (

        <div className="EditAssignment">

            <div className="EditAssignment-container">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="EditAssignment-header">

                    <button
                        className="EditAssignment-back"
                        onClick={handleCancel}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Back to Assignment
                    </button>

                </div>


                {/* =================================================
                   TITLE
                ================================================= */}

                <div className="EditAssignment-title-section">

                    <div className="EditAssignment-title-icon">
                        <i className="fa-solid fa-pen"></i>
                    </div>

                    <div>

                        <h1>
                            Edit Assignment
                        </h1>

                        <p>
                            {course?.title || "Assignment"}
                        </p>

                    </div>

                </div>


                {/* =================================================
                   FORM
                ================================================= */}

                <form
                    className="EditAssignment-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                       ASSIGNMENT INFORMATION
                    ================================================= */}

                    <div className="EditAssignment-section">

                        <div className="EditAssignment-section-header">

                            <div className="EditAssignment-section-icon">
                                <i className="fa-solid fa-file-lines"></i>
                            </div>

                            <h2>
                                Assignment Information
                            </h2>

                        </div>


                        <div className="EditAssignment-fields">


                            {/* TITLE */}

                            <div className="EditAssignment-field">

                                <label>
                                    Assignment Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    placeholder="Enter assignment title"
                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="EditAssignment-field">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    placeholder="Enter assignment description"
                                    rows="4"
                                />

                            </div>


                            {/* INSTRUCTIONS */}

                            <div className="EditAssignment-field">

                                <label>
                                    Instructions
                                </label>

                                <textarea
                                    value={instructions}
                                    onChange={(event) =>
                                        setInstructions(event.target.value)
                                    }
                                    placeholder="Enter instructions for students"
                                    rows="5"
                                />

                            </div>


                            {/* DATE + SCORE */}

                            <div className="EditAssignment-row">

                                <div className="EditAssignment-field">

                                    <label>
                                        Due Date
                                    </label>

                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(event) =>
                                            setDueDate(event.target.value)
                                        }
                                    />

                                </div>


                                <div className="EditAssignment-field">

                                    <label>
                                        Maximum Score
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={maxScore}
                                        onChange={(event) =>
                                            setMaxScore(event.target.value)
                                        }
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                       RESOURCES
                    ================================================= */}

                    <div className="EditAssignment-section">

                        <div className="EditAssignment-section-header">

                            <div className="EditAssignment-section-icon">
                                <i className="fa-solid fa-link"></i>
                            </div>

                            <h2>
                                Resources
                            </h2>

                        </div>


                        <div className="EditAssignment-resources">

                            {resources.map((resource, index) => (

                                <div
                                    className="EditAssignment-resource-row"
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
                                        className="EditAssignment-remove-button"
                                        onClick={() =>
                                            handleRemoveResource(index)
                                        }
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>

                                </div>

                            ))}


                            <button
                                type="button"
                                className="EditAssignment-add-resource"
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

                    <div className="EditAssignment-section">

                        <div className="EditAssignment-section-header">

                            <div className="EditAssignment-section-icon">
                                <i className="fa-solid fa-paperclip"></i>
                            </div>

                            <h2>
                                Attachments
                            </h2>

                        </div>


                        <div className="EditAssignment-attachments">


                            <label className="EditAssignment-upload">

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
                                    onChange={handleAttachmentChange}
                                />

                            </label>


                            {attachments.length > 0 && (

                                <div className="EditAssignment-attachment-list">

                                    {attachments.map(
                                        (attachment, index) => (

                                            <div
                                                className="EditAssignment-attachment"
                                                key={index}
                                            >

                                                <div className="EditAssignment-attachment-info">

                                                    <div className="EditAssignment-attachment-icon">
                                                        <i className="fa-solid fa-file"></i>
                                                    </div>

                                                    <span>
                                                        {attachment.name}
                                                    </span>

                                                </div>


                                                <button
                                                    type="button"
                                                    className="EditAssignment-remove-button"
                                                    onClick={() =>
                                                        handleRemoveAttachment(index)
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

                        <div className="EditAssignment-error">

                            <i className="fa-solid fa-circle-exclamation"></i>

                            <span>
                                {error}
                            </span>

                        </div>
                    )}


                    {/* =================================================
                       ACTIONS
                    ================================================= */}

                    <div className="EditAssignment-actions">

                        <button
                            type="button"
                            className="EditAssignment-cancel"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="EditAssignment-save"
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


export default EditAssignment;