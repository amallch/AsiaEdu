import "./TutorApplicationDetails.css";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";


function TutorApplicationsDetails() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();


    /* =====================================================
       APPLICATION
    ===================================================== */

    const [
        application,
        setApplication
    ] = useState(null);


    const [
        isLoading,
        setIsLoading
    ] = useState(true);


    const [
        errorMessage,
        setErrorMessage
    ] = useState("");


    const [
        showDeleteModal,
        setShowDeleteModal
    ] = useState(false);


    const [
        isUpdating,
        setIsUpdating
    ] = useState(false);


    /* =====================================================
       LOAD APPLICATION
    ===================================================== */

    useEffect(() => {

        const fetchApplication =
            async () => {

                try {

                    setIsLoading(true);

                    setErrorMessage("");


                    const response =
                        await fetch(
                            `http://localhost:5000/api/tutor-applications/${id}`
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Failed to load tutor application."
                        );

                    }


                    setApplication(
                        result
                    );

                } catch (error) {

                    console.error(
                        "Error loading tutor application:",
                        error
                    );


                    setErrorMessage(
                        "Unable to load tutor application. Please try again."
                    );

                } finally {

                    setIsLoading(false);

                }

            };


        fetchApplication();

    }, [id]);


    /* =====================================================
       BACK
    ===================================================== */

    const goBack = () => {

        navigate(
            "/admin/tutor-applications"
        );

    };


    /* =====================================================
       UPDATE STATUS
    ===================================================== */

    const updateStatus =
        async (status) => {

            if (
                !application ||
                isUpdating
            ) {

                return;

            }


            /*
                Once a teacher has been created,
                the application cannot be changed.
            */

            if (
                application.teacherCreated === true
            ) {

                return;

            }


            try {

                setIsUpdating(true);

                setErrorMessage("");


                const response =
                    await fetch(
                        `http://localhost:5000/api/tutor-applications/${application._id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    status:
                                        status
                                })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to update application."
                    );

                }


                setApplication(
                    result.application
                );

            } catch (error) {

                console.error(
                    "Error updating tutor application:",
                    error
                );


                setErrorMessage(
                    error.message ||
                    "Unable to update application. Please try again."
                );

            } finally {

                setIsUpdating(false);

            }

        };


    /* =====================================================
       CONFIRM APPLICATION
    ===================================================== */

    const confirmApplication =
        async () => {

            if (
                !application ||
                isUpdating
            ) {

                return;

            }


            /* =================================================
               ALREADY CONFIRMED
            ================================================= */

            if (
                application.status ===
                "Confirmed"
            ) {

                return;

            }


            /* =================================================
               ALREADY CREATED
            ================================================= */

            if (
                application.teacherCreated ===
                true
            ) {

                return;

            }


            try {

                setIsUpdating(true);

                setErrorMessage("");


                const response =
                    await fetch(
                        `http://localhost:5000/api/tutor-applications/${application._id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    status:
                                        "Confirmed"
                                })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to confirm application."
                    );

                }


                const updatedApplication =
                    result.application;


                setApplication(
                    updatedApplication
                );


                /*
                    Now that the application is confirmed,
                    go to Add Tutor.

                    The application itself contains:

                    status: "Confirmed"

                    teacherCreated: false

                    teacherId: null
                */

                navigate(
                    "/admin/teachers/add",
                    {
                        state: {
                            application:
                                updatedApplication
                        }
                    }
                );

            } catch (error) {

                console.error(
                    "Error confirming tutor application:",
                    error
                );


                setErrorMessage(
                    error.message ||
                    "Unable to confirm application. Please try again."
                );

            } finally {

                setIsUpdating(false);

            }

        };


    /* =====================================================
       GO TO ADD TUTOR
    ===================================================== */

    const goToAddTutor =
        () => {

            if (
                !application ||
                application.teacherCreated === true
            ) {

                return;

            }


            navigate(
                "/admin/teachers/add",
                {
                    state: {
                        application:
                            application
                    }
                }
            );

        };


    /* =====================================================
       DELETE APPLICATION
    ===================================================== */

    const deleteApplication =
        async () => {

            if (
                !application ||
                isUpdating
            ) {

                return;

            }


            try {

                setIsUpdating(true);

                setErrorMessage("");


                const response =
                    await fetch(
                        `http://localhost:5000/api/tutor-applications/${application._id}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to delete tutor application."
                    );

                }


                setShowDeleteModal(
                    false
                );


                navigate(
                    "/admin/tutor-applications"
                );

            } catch (error) {

                console.error(
                    "Error deleting tutor application:",
                    error
                );


                setErrorMessage(
                    "Unable to delete application. Please try again."
                );

            } finally {

                setIsUpdating(false);

            }

        };


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <div className="TutorApplicationsDetails-notFound">

                <div className="TutorApplicationsDetails-notFoundIcon">

                    <i className="fa-solid fa-spinner fa-spin"></i>

                </div>


                <h2>
                    Loading Application
                </h2>


                <p>
                    Please wait while the tutor application is being loaded.
                </p>

            </div>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (
        errorMessage &&
        !application
    ) {

        return (

            <div className="TutorApplicationsDetails-notFound">

                <div className="TutorApplicationsDetails-notFoundIcon">

                    <i className="fa-solid fa-circle-exclamation"></i>

                </div>


                <h2>
                    Something Went Wrong
                </h2>


                <p>
                    {errorMessage}
                </p>


                <button
                    onClick={goBack}
                    className="TutorApplicationsDetails-backButton"
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    Back to Applications

                </button>

            </div>

        );

    }


    /* =====================================================
       APPLICATION NOT FOUND
    ===================================================== */

    if (!application) {

        return (

            <div className="TutorApplicationsDetails-notFound">

                <div className="TutorApplicationsDetails-notFoundIcon">

                    <i className="fa-regular fa-file"></i>

                </div>


                <h2>
                    Application Not Found
                </h2>


                <p>
                    The tutor application you are looking for
                    does not exist or has been deleted.
                </p>


                <button
                    onClick={goBack}
                    className="TutorApplicationsDetails-backButton"
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    Back to Applications

                </button>

            </div>

        );

    }


    /* =====================================================
       STATES
    ===================================================== */

    const isConfirmed =
        application.status ===
        "Confirmed";


    const isRejected =
        application.status ===
        "Rejected";


    const teacherCreated =
        application.teacherCreated ===
        true ||
        Boolean(
            application.teacherId
        );


    return (

        <div className="TutorApplicationsDetails">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="TutorApplicationsDetails-header">


                <button
                    className="TutorApplicationsDetails-back"
                    onClick={goBack}
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    Back to Applications

                </button>


                <div className="TutorApplicationsDetails-headerActions">


                    {/* =================================================
                        PENDING → CONFIRM
                    ================================================= */}

                    {!isConfirmed &&
                        !teacherCreated &&
                        !isRejected && (

                            <button
                                className="TutorApplicationsDetails-confirm"
                                onClick={
                                    confirmApplication
                                }
                                disabled={
                                    isUpdating
                                }
                            >

                                <i className="fa-solid fa-check"></i>

                                {isUpdating
                                    ? "Processing..."
                                    : "Confirm Application"
                                }

                            </button>

                        )}


                    {/* =================================================
                        CONFIRMED → CREATE TUTOR
                    ================================================= */}

                    {isConfirmed &&
                        !teacherCreated && (

                            <button
                                className="TutorApplicationsDetails-confirm"
                                onClick={
                                    goToAddTutor
                                }
                                disabled={
                                    isUpdating
                                }
                            >

                                <i className="fa-solid fa-user-plus"></i>

                                Create Tutor

                            </button>

                        )}


                    {/* =================================================
                        TEACHER ALREADY CREATED
                    ================================================= */}

                    {teacherCreated && (

                        <button
                            className="TutorApplicationsDetails-confirm"
                            type="button"
                            disabled
                        >

                            <i className="fa-solid fa-user-check"></i>

                            Teacher Created

                        </button>

                    )}


                    {/* =================================================
                        REJECT
                    ================================================= */}

                    {!isRejected &&
                        !teacherCreated && (

                            <button
                                className="TutorApplicationsDetails-reject"
                                onClick={() =>
                                    updateStatus(
                                        "Rejected"
                                    )
                                }
                                disabled={
                                    isUpdating
                                }
                            >

                                <i className="fa-solid fa-xmark"></i>

                                Reject

                            </button>

                        )}


                    {/* =================================================
                        DELETE
                    ================================================= */}

                    <button
                        className="TutorApplicationsDetails-delete"
                        onClick={() =>
                            setShowDeleteModal(
                                true
                            )
                        }
                        disabled={
                            isUpdating
                        }
                    >

                        <i className="fa-solid fa-trash"></i>

                        Delete

                    </button>


                </div>


            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {errorMessage && (

                <div
                    style={{
                        marginBottom:
                            "15px",

                        padding:
                            "12px 15px",

                        borderRadius:
                            "8px",

                        backgroundColor:
                            "rgba(182, 92, 92, 0.08)",

                        color:
                            "#B65C5C",

                        fontSize:
                            "10px"
                    }}
                >

                    {errorMessage}

                </div>

            )}


            {/* =================================================
                PROFILE
            ================================================= */}

            <div className="TutorApplicationsDetails-profile">


                <div className="TutorApplicationsDetails-avatar">

                    {
                        `${application.firstName || ""} ${application.lastName || ""}`
                            .trim()
                            .split(" ")
                            .filter(Boolean)
                            .map(
                                (name) =>
                                    name[0]
                            )
                            .join("")
                    }

                </div>


                <div className="TutorApplicationsDetails-profileInfo">


                    <div className="TutorApplicationsDetails-nameRow">


                        <h1>

                            {
                                `${application.firstName || ""} ${application.lastName || ""}`
                                    .trim()
                            }

                        </h1>


                        <span
                            className={
                                teacherCreated
                                    ? "TutorApplicationsDetails-status confirmed"
                                    : application.status === "Confirmed"
                                        ? "TutorApplicationsDetails-status confirmed"
                                        : application.status === "Rejected"
                                            ? "TutorApplicationsDetails-status rejected"
                                            : "TutorApplicationsDetails-status pending"
                            }
                        >

                            <span className="TutorApplicationsDetails-statusDot"></span>


                            {teacherCreated
                                ? "Teacher Created"
                                : application.status
                            }

                        </span>


                    </div>


                    <p>
                        Tutor Application
                    </p>


                    <span className="TutorApplicationsDetails-date">

                        Applied on{" "}

                        {
                            application.createdAt
                                ? new Date(
                                    application.createdAt
                                ).toLocaleDateString(
                                    "en-US",
                                    {
                                        month:
                                            "long",

                                        day:
                                            "numeric",

                                        year:
                                            "numeric"
                                    }
                                )
                                : "N/A"
                        }

                    </span>


                </div>


            </div>


            {/* =================================================
                INFORMATION GRID
            ================================================= */}

            <div className="TutorApplicationsDetails-grid">


                {/* PERSONAL INFORMATION */}

                <div className="TutorApplicationsDetails-card">


                    <div className="TutorApplicationsDetails-cardHeader">

                        <div className="TutorApplicationsDetails-cardIcon">

                            <i className="fa-regular fa-user"></i>

                        </div>


                        <div>

                            <h2>
                                Personal Information
                            </h2>

                            <p>
                                Applicant contact details
                            </p>

                        </div>

                    </div>


                    <div className="TutorApplicationsDetails-infoList">


                        <div className="TutorApplicationsDetails-infoItem">

                            <span>
                                Full Name
                            </span>

                            <strong>

                                {
                                    `${application.firstName || ""} ${application.lastName || ""}`
                                        .trim()
                                }

                            </strong>

                        </div>


                        <div className="TutorApplicationsDetails-infoItem">

                            <span>
                                Email Address
                            </span>

                            <strong>
                                {application.email || "N/A"}
                            </strong>

                        </div>


                        <div className="TutorApplicationsDetails-infoItem">

                            <span>
                                Phone Number
                            </span>

                            <strong>
                                {application.phone || "N/A"}
                            </strong>

                        </div>


                    </div>

                </div>


                {/* TEACHING INFORMATION */}

                <div className="TutorApplicationsDetails-card">


                    <div className="TutorApplicationsDetails-cardHeader">

                        <div className="TutorApplicationsDetails-cardIcon">

                            <i className="fa-solid fa-chalkboard-user"></i>

                        </div>


                        <div>

                            <h2>
                                Teaching Information
                            </h2>

                            <p>
                                Tutor qualifications
                            </p>

                        </div>

                    </div>


                    <div className="TutorApplicationsDetails-infoList">


                        <div className="TutorApplicationsDetails-infoItem">

                            <span>
                                Language
                            </span>

                            <strong className="highlight">
                                {application.language || "N/A"}
                            </strong>

                        </div>


                        <div className="TutorApplicationsDetails-infoItem">

                            <span>
                                Level
                            </span>

                            <strong>
                                {application.level || "N/A"}
                            </strong>

                        </div>


                        <div className="TutorApplicationsDetails-infoItem">

                            <span>
                                Teaching Experience
                            </span>

                            <strong>
                                {application.experience || "N/A"}
                            </strong>

                        </div>


                        <div className="TutorApplicationsDetails-infoItem">

                            <span>
                                Education
                            </span>

                            <strong>
                                {application.education || "N/A"}
                            </strong>

                        </div>


                    </div>

                </div>


                {/* ABOUT */}

                <div className="TutorApplicationsDetails-card fullWidth">


                    <div className="TutorApplicationsDetails-cardHeader">

                        <div className="TutorApplicationsDetails-cardIcon">

                            <i className="fa-regular fa-message"></i>

                        </div>


                        <div>

                            <h2>
                                About the Applicant
                            </h2>

                            <p>
                                Personal introduction and teaching approach
                            </p>

                        </div>

                    </div>


                    <div className="TutorApplicationsDetails-text">

                        <p>
                            {application.bio || "N/A"}
                        </p>

                    </div>


                </div>


                {/* AVAILABILITY */}

                <div className="TutorApplicationsDetails-card fullWidth">


                    <div className="TutorApplicationsDetails-cardHeader">

                        <div className="TutorApplicationsDetails-cardIcon">

                            <i className="fa-regular fa-clock"></i>

                        </div>


                        <div>

                            <h2>
                                Availability
                            </h2>

                            <p>
                                Tutor's available teaching schedule
                            </p>

                        </div>

                    </div>


                    <div className="TutorApplicationsDetails-availability">

                        <i className="fa-regular fa-calendar"></i>

                        <span>
                            {application.availability || "N/A"}
                        </span>

                    </div>


                </div>


            </div>


            {/* =================================================
                METADATA
            ================================================= */}

            <div className="TutorApplicationsDetails-metadata">


                <div>

                    <span>
                        Application ID
                    </span>

                    <strong>
                        {application._id}
                    </strong>

                </div>


                <div>

                    <span>
                        Last Updated
                    </span>

                    <strong>

                        {
                            application.updatedAt
                                ? new Date(
                                    application.updatedAt
                                ).toLocaleDateString(
                                    "en-US",
                                    {
                                        month:
                                            "short",

                                        day:
                                            "numeric",

                                        year:
                                            "numeric"
                                    }
                                )
                                : "N/A"
                        }

                    </strong>

                </div>


                {teacherCreated && (

                    <div>

                        <span>
                            Teacher
                        </span>

                        <strong>
                            Created Successfully
                        </strong>

                    </div>

                )}


            </div>


            {/* =================================================
                DELETE MODAL
            ================================================= */}

            {showDeleteModal && (

                <div className="TutorApplicationsDetails-modalOverlay">


                    <div className="TutorApplicationsDetails-modal">


                        <div className="TutorApplicationsDetails-modalIcon">

                            <i className="fa-solid fa-trash"></i>

                        </div>


                        <h2>
                            Delete Application?
                        </h2>


                        <p>

                            Are you sure you want to delete the tutor
                            application of{" "}

                            <strong>

                                {
                                    `${application.firstName || ""} ${application.lastName || ""}`
                                        .trim()
                                }

                            </strong>

                            ?

                            {" "}This action cannot be undone.

                        </p>


                        <div className="TutorApplicationsDetails-modalActions">


                            <button
                                className="TutorApplicationsDetails-cancel"
                                onClick={() =>
                                    setShowDeleteModal(
                                        false
                                    )
                                }
                                disabled={
                                    isUpdating
                                }
                            >

                                Cancel

                            </button>


                            <button
                                className="TutorApplicationsDetails-deleteConfirm"
                                onClick={
                                    deleteApplication
                                }
                                disabled={
                                    isUpdating
                                }
                            >

                                <i className="fa-solid fa-trash"></i>

                                {isUpdating
                                    ? "Deleting..."
                                    : "Delete Application"
                                }

                            </button>


                        </div>


                    </div>


                </div>

            )}


        </div>

    );

}


export default TutorApplicationsDetails;