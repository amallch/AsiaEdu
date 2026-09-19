import "./AddAssignment.css";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EMPTY_FORM = {
    title: "",
    description: "",
    instructions: "",
    dueDate: "",
    maxScore: 100,
    resources: [""],
    attachments: []
};

function AddAssignment() {

    const navigate = useNavigate();
    const location = useLocation();

    const course =
        location.state?.course || null;

    const session =
        location.state?.session || null;

    const teacher =
        location.state?.teacher || null;


    const [form, setForm] =
        useState(EMPTY_FORM);

    const [isSaving, setIsSaving] =
        useState(false);


    function handleChange(event) {

        const {
            name,
            value
        } = event.target;


        setForm({

            ...form,

            [name]:
                value

        });

    }


    function handleResourceChange(
        index,
        value
    ) {

        const updatedResources =
            [...form.resources];


        updatedResources[index] =
            value;


        setForm({

            ...form,

            resources:
                updatedResources

        });

    }


    function handleAddResource() {

        setForm({

            ...form,

            resources: [

                ...form.resources,

                ""

            ]

        });

    }


    function handleRemoveResource(index) {

        const updatedResources =
            form.resources.filter(
                (_, resourceIndex) =>
                    resourceIndex !== index
            );


        let resources =
            updatedResources;


        if (
            resources.length === 0
        ) {

            resources = [""];

        }


        setForm({

            ...form,

            resources

        });

    }


    async function handleAttachmentChange(
        event
    ) {

        const files =
            Array.from(
                event.target.files
            );


        if (files.length === 0) {

            return;

        }


        try {

            const formData =
                new FormData();


            files.forEach((file) => {

                formData.append(
                    "files",
                    file
                );

            });


            const response =
                await fetch(
                    "http://localhost:5000/api/assignments/upload",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to upload files"
                );

            }


            setForm(
                (previousForm) => ({

                    ...previousForm,

                    attachments: [

                        ...previousForm.attachments,

                        ...data.attachments

                    ]

                })
            );


        }

        catch (error) {

            console.error(
                "Upload assignment files error:",
                error
            );


            alert(
                error.message ||
                "Failed to upload files"
            );

        }


        event.target.value = "";

    }


    function handleRemoveAttachment(index) {

        const updatedAttachments =
            form.attachments.filter(
                (_, attachmentIndex) =>
                    attachmentIndex !== index
            );


        setForm({

            ...form,

            attachments:
                updatedAttachments

        });

    }


    function handleCancel() {

        navigate(-1);

    }


    async function handleSaveAssignment(
        event
    ) {

        event.preventDefault();


        if (!course?._id) {

            alert(
                "Course information is missing."
            );

            return;

        }


        if (!session?._id) {

            alert(
                "Session information is missing."
            );

            return;

        }


        if (!teacher?._id) {

            alert(
                "Teacher information is missing."
            );

            return;

        }


        try {

            setIsSaving(true);


            const response =
                await fetch(
                    "http://localhost:5000/api/assignments",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                title:
                                    form.title,

                                description:
                                    form.description,

                                instructions:
                                    form.instructions,

                                course:
                                    course._id,

                                session:
                                    session._id,

                                teacher:
                                    teacher._id,

                                dueDate:
                                    form.dueDate,

                                maxScore:
                                    Number(
                                        form.maxScore
                                    ),

                                resources:
                                    form.resources.filter(
                                        (resource) =>
                                            resource.trim() !== ""
                                    ),

                                attachments:
                                    form.attachments

                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to create assignment"
                );

            }


            console.log(
                "Assignment created successfully:",
                data.assignment
            );


            navigate(-1);

        }

        catch (error) {

            console.error(
                "Create assignment error:",
                error
            );


            alert(
                error.message ||
                "Failed to create assignment. Please try again."
            );

        }

        finally {

            setIsSaving(false);

        }

    }


    if (
        !course ||
        !session ||
        !teacher
    ) {

        return (

            <section className="AddAssignment">

                <div className="AddAssignment-container">

                    <div className="AddAssignment-empty">

                        <div className="AddAssignment-empty-icon">

                            <i className="fa-solid fa-triangle-exclamation"></i>

                        </div>


                        <h2>
                            Assignment information is missing
                        </h2>


                        <p>
                            Please return to assignments and select a course and session first.
                        </p>


                        <button
                            type="button"
                            className="AddAssignment-back-button"
                            onClick={handleCancel}
                        >

                            <i className="fa-solid fa-arrow-left"></i>

                            Back to Assignments

                        </button>

                    </div>

                </div>

            </section>

        );

    }


    return (

        <section className="AddAssignment">

            <div className="AddAssignment-container">


                <div className="AddAssignment-header">

                    <button
                        type="button"
                        className="AddAssignment-back"
                        onClick={handleCancel}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Assignments

                    </button>

                </div>



                <div className="AddAssignment-title-section">

                    <div className="AddAssignment-title-icon">

                        <i className="fa-solid fa-file-circle-plus"></i>

                    </div>


                    <div>

                        <h1>
                            Create a New Assignment
                        </h1>


                        <p>

                            Add a new assignment to{" "}

                            <strong>
                                {course.title}
                            </strong>

                            {" "}

                            for session{" "}

                            <strong>
                                {session.group}
                            </strong>.

                        </p>

                    </div>

                </div>



                <form
                    onSubmit={
                        handleSaveAssignment
                    }
                >


                    <div className="AddAssignment-section">

                        <div className="AddAssignment-section-header">

                            <div className="AddAssignment-section-icon">

                                <i className="fa-solid fa-file-lines"></i>

                            </div>


                            <h2>
                                Assignment Information
                            </h2>

                        </div>


                        <div className="AddAssignment-fields">


                            <div className="AddAssignment-field">

                                <label>
                                    Assignment Title
                                </label>


                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter assignment title"
                                    required
                                />

                            </div>



                            <div className="AddAssignment-field">

                                <label>
                                    Description
                                </label>


                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter a short assignment description"
                                    required
                                />

                            </div>



                            <div className="AddAssignment-row">


                                <div className="AddAssignment-field">

                                    <label>
                                        Due Date
                                    </label>


                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={
                                            form.dueDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>



                                <div className="AddAssignment-field">

                                    <label>
                                        Maximum Score
                                    </label>


                                    <input
                                        type="number"
                                        name="maxScore"
                                        value={
                                            form.maxScore
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="1"
                                        placeholder="100"
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                    </div>



                    <div className="AddAssignment-section">

                        <div className="AddAssignment-section-header">

                            <div className="AddAssignment-section-icon">

                                <i className="fa-solid fa-list-check"></i>

                            </div>


                            <h2>
                                Assignment Instructions
                            </h2>

                        </div>


                        <div className="AddAssignment-fields">

                            <div className="AddAssignment-field">

                                <label>
                                    Instructions
                                </label>


                                <textarea
                                    name="instructions"
                                    value={
                                        form.instructions
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Write the instructions students should follow..."
                                    required
                                />

                            </div>

                        </div>

                    </div>



                    <div className="AddAssignment-section">

                        <div className="AddAssignment-section-header">

                            <div className="AddAssignment-section-icon">

                                <i className="fa-solid fa-link"></i>

                            </div>


                            <h2>
                                Resources
                            </h2>

                        </div>


                        <div className="AddAssignment-resources">

                            {form.resources.map(
                                (
                                    resource,
                                    index
                                ) => (

                                    <div
                                        className="AddAssignment-resource-row"
                                        key={index}
                                    >

                                        <input
                                            type="url"
                                            value={
                                                resource
                                            }
                                            onChange={
                                                (
                                                    event
                                                ) =>
                                                    handleResourceChange(
                                                        index,
                                                        event.target.value
                                                    )
                                            }
                                            placeholder="https://example.com/resource"
                                        />


                                        {form.resources.length > 1 && (

                                            <button
                                                type="button"
                                                className="AddAssignment-remove-button"
                                                onClick={() =>
                                                    handleRemoveResource(
                                                        index
                                                    )
                                                }
                                                aria-label="Remove resource"
                                            >

                                                <i className="fa-solid fa-xmark"></i>

                                            </button>

                                        )}

                                    </div>

                                )
                            )}



                            <button
                                type="button"
                                className="AddAssignment-add-resource"
                                onClick={
                                    handleAddResource
                                }
                            >

                                <i className="fa-solid fa-plus"></i>

                                Add Resource

                            </button>

                        </div>

                    </div>



                    <div className="AddAssignment-section">

                        <div className="AddAssignment-section-header">

                            <div className="AddAssignment-section-icon">

                                <i className="fa-solid fa-paperclip"></i>

                            </div>


                            <h2>
                                Attachments
                            </h2>

                        </div>


                        <div className="AddAssignment-attachments">


                            <label className="AddAssignment-upload">

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



                            {form.attachments.length > 0 && (

                                <div className="AddAssignment-attachment-list">

                                    {form.attachments.map(
                                        (
                                            attachment,
                                            index
                                        ) => (

                                            <div
                                                className="AddAssignment-attachment"
                                                key={index}
                                            >

                                                <div className="AddAssignment-attachment-info">

                                                    <div className="AddAssignment-attachment-icon">

                                                        <i className="fa-solid fa-file"></i>

                                                    </div>


                                                    <span>
                                                        {
                                                            attachment.name
                                                        }
                                                    </span>

                                                </div>


                                                <button
                                                    type="button"
                                                    className="AddAssignment-remove-button"
                                                    onClick={() =>
                                                        handleRemoveAttachment(
                                                            index
                                                        )
                                                    }
                                                    aria-label="Remove attachment"
                                                >

                                                    <i className="fa-solid fa-xmark"></i>

                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>



                    <div className="AddAssignment-actions">


                        <button
                            type="button"
                            className="AddAssignment-cancel"
                            onClick={
                                handleCancel
                            }
                            disabled={
                                isSaving
                            }
                        >

                            Cancel

                        </button>



                        <button
                            type="submit"
                            className="AddAssignment-save"
                            disabled={
                                isSaving
                            }
                        >

                            {isSaving ? (

                                <>

                                    <i className="fa-solid fa-spinner fa-spin"></i>

                                    Creating...

                                </>

                            ) : (

                                <>

                                    <i className="fa-solid fa-plus"></i>

                                    Create Assignment

                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </section>

    );

}


export default AddAssignment;