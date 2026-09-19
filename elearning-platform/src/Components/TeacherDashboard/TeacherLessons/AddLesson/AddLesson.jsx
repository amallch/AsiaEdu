import "./AddLesson.css";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const EMPTY_FORM = {
    title: "",
    description: "",
    content: "",
    resources: [""],
    attachments: []
};


function AddLesson() {

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
                    "https://asiaedu-backend.onrender.com/api/lessons/upload",
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
                "Upload lesson files error:",
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



    async function handleSaveLesson(
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
                    "https://asiaedu-backend.onrender.com/api/lessons",
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

                                content:
                                    form.content,

                                course:
                                    course._id,

                                session:
                                    session._id,

                                teacher:
                                    teacher._id,

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
                    "Failed to create lesson"
                );

            }


            console.log(
                "Lesson created successfully:",
                data.lesson
            );


            navigate(-1);

        }

        catch (error) {

            console.error(
                "Create lesson error:",
                error
            );


            alert(
                error.message ||
                "Failed to create lesson. Please try again."
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

            <section className="AddLesson">

                <div className="AddLesson-container">

                    <div className="AddLesson-empty">

                        <div className="AddLesson-empty-icon">

                            <i className="fa-solid fa-triangle-exclamation"></i>

                        </div>


                        <h2>
                            Lesson information is missing
                        </h2>


                        <p>
                            Please return to lessons and select a course and session first.
                        </p>


                        <button
                            type="button"
                            className="AddLesson-back-button"
                            onClick={handleCancel}
                        >

                            <i className="fa-solid fa-arrow-left"></i>

                            Back to Lessons

                        </button>

                    </div>

                </div>

            </section>

        );

    }



    return (

        <section className="AddLesson">

            <div className="AddLesson-container">


                <div className="AddLesson-header">

                    <button
                        type="button"
                        className="AddLesson-back"
                        onClick={handleCancel}
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Lessons

                    </button>

                </div>



                <div className="AddLesson-title-section">

                    <div className="AddLesson-title-icon">

                        <i className="fa-solid fa-book-open"></i>

                    </div>


                    <div>

                        <h1>
                            Create a New Lesson
                        </h1>


                        <p>

                            Add a new lesson to{" "}

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
                        handleSaveLesson
                    }
                >


                    <div className="AddLesson-section">

                        <div className="AddLesson-section-header">

                            <div className="AddLesson-section-icon">

                                <i className="fa-solid fa-file-lines"></i>

                            </div>


                            <h2>
                                Lesson Information
                            </h2>

                        </div>


                        <div className="AddLesson-fields">


                            <div className="AddLesson-field">

                                <label>
                                    Lesson Title
                                </label>


                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter lesson title"
                                    required
                                />

                            </div>



                            <div className="AddLesson-field">

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
                                    placeholder="Enter a short lesson description"
                                    required
                                />

                            </div>

                        </div>

                    </div>



                    <div className="AddLesson-section">

                        <div className="AddLesson-section-header">

                            <div className="AddLesson-section-icon">

                                <i className="fa-solid fa-align-left"></i>

                            </div>


                            <h2>
                                Lesson Content
                            </h2>

                        </div>


                        <div className="AddLesson-fields">

                            <div className="AddLesson-field">

                                <label>
                                    Content
                                </label>


                                <textarea
                                    className="AddLesson-content"
                                    name="content"
                                    value={
                                        form.content
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Write the lesson content here..."
                                    required
                                />

                            </div>

                        </div>

                    </div>



                    <div className="AddLesson-section">

                        <div className="AddLesson-section-header">

                            <div className="AddLesson-section-icon">

                                <i className="fa-solid fa-link"></i>

                            </div>


                            <h2>
                                Resources
                            </h2>

                        </div>


                        <div className="AddLesson-resources">

                            {form.resources.map(
                                (
                                    resource,
                                    index
                                ) => (

                                    <div
                                        className="AddLesson-resource-row"
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
                                                className="AddLesson-remove-button"
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
                                className="AddLesson-add-resource"
                                onClick={
                                    handleAddResource
                                }
                            >

                                <i className="fa-solid fa-plus"></i>

                                Add Resource

                            </button>

                        </div>

                    </div>



                    <div className="AddLesson-section">

                        <div className="AddLesson-section-header">

                            <div className="AddLesson-section-icon">

                                <i className="fa-solid fa-paperclip"></i>

                            </div>


                            <h2>
                                Attachments
                            </h2>

                        </div>


                        <div className="AddLesson-attachments">


                            <label className="AddLesson-upload">

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

                                <div className="AddLesson-attachment-list">

                                    {form.attachments.map(
                                        (
                                            attachment,
                                            index
                                        ) => (

                                            <div
                                                className="AddLesson-attachment"
                                                key={index}
                                            >

                                                <div className="AddLesson-attachment-info">

                                                    <div className="AddLesson-attachment-icon">

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
                                                    className="AddLesson-remove-button"
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



                    <div className="AddLesson-actions">


                        <button
                            type="button"
                            className="AddLesson-cancel"
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
                            className="AddLesson-save"
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

                                    Create Lesson

                                </>

                            )}

                        </button>

                    </div>


                </form>

            </div>

        </section>

    );

}


export default AddLesson;