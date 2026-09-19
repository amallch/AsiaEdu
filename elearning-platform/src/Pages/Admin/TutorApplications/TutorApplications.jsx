import "./TutorApplications.css";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


function TutorApplications() {

    const [applications, setApplications] = useState([]);

    const [search, setSearch] = useState("");

    const [languageFilter, setLanguageFilter] = useState("All");

    const [statusFilter, setStatusFilter] = useState("All");

    const [yearFilter, setYearFilter] = useState("All");

    const [deleteApplication, setDeleteApplication] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");


    const navigate = useNavigate();


    /* =====================================================
       LOAD TUTOR APPLICATIONS FROM MONGODB
    ===================================================== */

    useEffect(() => {

        const fetchApplications = async () => {

            try {

                setIsLoading(true);

                setErrorMessage("");


                const response = await fetch(
                    "http://localhost:5000/api/tutor-applications"
                );


                const result = await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to fetch tutor applications."
                    );

                }


                setApplications(result);

            } catch (error) {

                console.error(
                    "Error loading tutor applications:",
                    error
                );


                setErrorMessage(
                    "Unable to load tutor applications. Please try again."
                );

            } finally {

                setIsLoading(false);

            }

        };


        fetchApplications();

    }, []);


    /* =====================================================
       AVAILABLE YEARS
    ===================================================== */

    const availableYears = [
        ...new Set(
            applications
                .map((application) => {

                    if (!application.createdAt) {

                        return null;

                    }

                    return new Date(
                        application.createdAt
                    ).getFullYear();

                })
                .filter(Boolean)
        )
    ].sort(
        (a, b) => b - a
    );


    /* =====================================================
       FILTER TUTOR APPLICATIONS
    ===================================================== */

    const filteredApplications = applications.filter(
        (application) => {

            /*
                MongoDB stores firstName and lastName
                separately, so create the full name here.
            */

            const fullName =
                `${application.firstName || ""} ${application.lastName || ""}`
                    .trim();


            const email =
                application.email || "";


            const language =
                application.language || "";


            const searchValue =
                search.toLowerCase();


            const matchesSearch =
                fullName
                    .toLowerCase()
                    .includes(searchValue) ||

                email
                    .toLowerCase()
                    .includes(searchValue) ||

                language
                    .toLowerCase()
                    .includes(searchValue);


            const matchesLanguage =
                languageFilter === "All" ||
                language === languageFilter;


            const matchesStatus =
                statusFilter === "All" ||
                application.status === statusFilter;


            const matchesYear =
                yearFilter === "All" ||
                (
                    application.createdAt &&
                    new Date(
                        application.createdAt
                    ).getFullYear() ===
                    Number(yearFilter)
                );


            return (
                matchesSearch &&
                matchesLanguage &&
                matchesStatus &&
                matchesYear
            );

        }
    );


    /* =====================================================
       OPEN APPLICATION DETAILS
    ===================================================== */

    const viewApplicationDetails = (applicationId) => {

        navigate(
            `/admin/tutor-applications/${applicationId}`
        );

    };


    /* =====================================================
       OPEN DELETE CONFIRMATION
    ===================================================== */

    const openDeleteConfirmation = (application) => {

        setDeleteApplication(application);

    };


    /* =====================================================
       CANCEL DELETE
    ===================================================== */

    const cancelDelete = () => {

        setDeleteApplication(null);

    };


    /* =====================================================
       DELETE APPLICATION FROM MONGODB
    ===================================================== */

    const confirmDelete = async () => {

        if (!deleteApplication) {

            return;

        }


        try {

            setErrorMessage("");


            const response = await fetch(
                `http://localhost:5000/api/tutor-applications/${deleteApplication._id}`,
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


            /*
                Remove the deleted application
                from the current frontend state.
            */

            setApplications((currentApplications) =>
                currentApplications.filter(
                    (application) =>
                        application._id !==
                        deleteApplication._id
                )
            );


            setDeleteApplication(null);

        } catch (error) {

            console.error(
                "Error deleting tutor application:",
                error
            );


            setErrorMessage(
                "Unable to delete tutor application. Please try again."
            );


            setDeleteApplication(null);

        }

    };


    /* =====================================================
       GET FULL NAME
    ===================================================== */

    const getFullName = (application) => {

        return (
            `${application.firstName || ""} ${application.lastName || ""}`
                .trim()
        );

    };


    /* =====================================================
       GET INITIALS
    ===================================================== */

    const getInitials = (application) => {

        const firstName =
            application.firstName || "";

        const lastName =
            application.lastName || "";


        const firstInitial =
            firstName.charAt(0);


        const lastInitial =
            lastName.charAt(0);


        return (
            `${firstInitial}${lastInitial}`
                .toUpperCase()
        );

    };


    return (

        <div className="TutorApplications">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="TutorApplications-header">

                <div>

                    <span>
                        Teacher Management
                    </span>

                    <h1>
                        Tutor Applications
                    </h1>

                    <p>
                        Review and manage applications from users who want to become tutors.
                    </p>

                </div>


                <div className="TutorApplications-summary">


                    <div>

                        <strong>
                            {applications.length}
                        </strong>

                        <span>
                            Total
                        </span>

                    </div>


                    <div>

                        <strong>
                            {
                                applications.filter(
                                    (application) =>
                                        application.status === "Pending"
                                ).length
                            }
                        </strong>

                        <span>
                            Pending
                        </span>

                    </div>


                    <div>

                        <strong>
                            {
                                applications.filter(
                                    (application) =>
                                        application.status === "Confirmed"
                                ).length
                            }
                        </strong>

                        <span>
                            Confirmed
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="TutorApplications-filters">


                {/* SEARCH */}

                <div className="TutorApplications-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search applicant or language..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>


                {/* LANGUAGE FILTER */}

                <div className="TutorApplications-filter">

                    <i className="fa-solid fa-language"></i>

                    <select
                        value={languageFilter}
                        onChange={(event) =>
                            setLanguageFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Languages
                        </option>

                        <option value="Chinese">
                            Chinese
                        </option>

                        <option value="Japanese">
                            Japanese
                        </option>

                        <option value="Korean">
                            Korean
                        </option>

                        <option value="Russian">
                            Russian
                        </option>

                        <option value="Malay">
                            Malay
                        </option>

                    </select>

                </div>


                {/* STATUS FILTER */}

                <div className="TutorApplications-filter">

                    <i className="fa-solid fa-filter"></i>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Confirmed">
                            Confirmed
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>

                    </select>

                </div>


                {/* YEAR FILTER */}

                <div className="TutorApplications-year-filter">

                    <i className="fa-regular fa-calendar"></i>

                    <select
                        value={yearFilter}
                        onChange={(event) =>
                            setYearFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Years
                        </option>

                        {availableYears.map(
                            (year) => (

                                <option
                                    key={year}
                                    value={year}
                                >
                                    {year}
                                </option>

                            )
                        )}

                    </select>

                </div>

            </div>


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {errorMessage && (

                <div
                    style={{
                        marginBottom: "15px",
                        padding: "12px 15px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(182, 92, 92, 0.08)",
                        color: "#B65C5C",
                        fontSize: "10px"
                    }}
                >

                    {errorMessage}

                </div>

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="TutorApplications-table-container">

                <table className="TutorApplications-table">

                    <thead>

                        <tr>

                            <th>
                                Applicant
                            </th>

                            <th>
                                Language
                            </th>

                            <th>
                                Level
                            </th>

                            <th>
                                Experience
                            </th>

                            <th>
                                Applied
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {isLoading && (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="TutorApplications-empty"
                                >

                                    Loading tutor applications...

                                </td>

                            </tr>

                        )}


                        {/* =================================================
                            APPLICATIONS
                        ================================================= */}

                        {!isLoading &&
                            filteredApplications.map(
                                (application) => (

                                    <tr
                                        key={application._id}
                                    >


                                        {/* APPLICANT */}

                                        <td>

                                            <div className="TutorApplications-applicant">

                                                <div className="TutorApplications-avatar">

                                                    {getInitials(
                                                        application
                                                    )}

                                                </div>


                                                <div className="TutorApplications-applicant-info">

                                                    <strong>
                                                        {getFullName(
                                                            application
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {application.email || "N/A"}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* LANGUAGE */}

                                        <td>

                                            <div className="TutorApplications-language-info">

                                                <strong>
                                                    {application.language || "N/A"}
                                                </strong>

                                            </div>

                                        </td>


                                        {/* LEVEL */}

                                        <td>

                                            <span className="TutorApplications-level">

                                                {application.level || "N/A"}

                                            </span>

                                        </td>


                                        {/* EXPERIENCE */}

                                        <td>

                                            <span className="TutorApplications-experience">

                                                {application.experience || "N/A"}

                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td>

                                            <span className="TutorApplications-date">

                                                {
                                                    application.createdAt
                                                        ? new Date(
                                                            application.createdAt
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric"
                                                            }
                                                        )
                                                        : "N/A"
                                                }

                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={
                                                    application.status === "Confirmed"
                                                        ? "TutorApplications-status confirmed"
                                                        : application.status === "Rejected"
                                                            ? "TutorApplications-status rejected"
                                                            : "TutorApplications-status pending"
                                                }
                                            >

                                                <span className="TutorApplications-status-dot"></span>

                                                {application.status || "Pending"}

                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="TutorApplications-actions">


                                                {/* VIEW */}

                                                <button
                                                    className="TutorApplications-view"
                                                    onClick={() =>
                                                        viewApplicationDetails(
                                                            application._id
                                                        )
                                                    }
                                                    aria-label="View tutor application details"
                                                >

                                                    <i className="fa-solid fa-eye"></i>

                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    className="TutorApplications-delete"
                                                    onClick={() =>
                                                        openDeleteConfirmation(
                                                            application
                                                        )
                                                    }
                                                    aria-label="Delete tutor application"
                                                >

                                                    <i className="fa-solid fa-trash"></i>

                                                </button>


                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}


                        {/* =================================================
                            EMPTY
                        ================================================= */}

                        {!isLoading &&
                            filteredApplications.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="TutorApplications-empty"
                                    >

                                        No tutor applications found.

                                    </td>

                                </tr>

                            )}

                    </tbody>

                </table>

            </div>


            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            {deleteApplication && (

                <div className="TutorApplications-modal-overlay">

                    <div className="TutorApplications-modal">


                        <div className="TutorApplications-modal-icon">

                            <i className="fa-solid fa-trash"></i>

                        </div>


                        <h2>
                            Delete Application?
                        </h2>


                        <p>

                            Are you sure you want to delete the tutor
                            application of{" "}

                            <strong>
                                {getFullName(deleteApplication)}
                            </strong>

                            ?

                            {" "}This action cannot be undone.

                        </p>


                        <div className="TutorApplications-modal-actions">


                            <button
                                className="TutorApplications-cancel"
                                onClick={cancelDelete}
                            >

                                Cancel

                            </button>


                            <button
                                className="TutorApplications-delete-confirm"
                                onClick={confirmDelete}
                            >

                                <i className="fa-solid fa-trash"></i>

                                Delete Application

                            </button>


                        </div>

                    </div>

                </div>

            )}


        </div>

    );

}


export default TutorApplications;