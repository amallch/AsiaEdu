import "./Enrollments.css";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


function Enrollments() {

    const [enrollments, setEnrollments] = useState([]);

    const [search, setSearch] = useState("");

    const [courseFilter, setCourseFilter] = useState("All");

    const [statusFilter, setStatusFilter] = useState("All");

    const [yearFilter, setYearFilter] = useState("All");

    const [deleteEnrollment, setDeleteEnrollment] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const navigate = useNavigate();


    /* =====================================================
       GET ENROLLMENTS FROM BACKEND
    ===================================================== */

    useEffect(() => {

        const fetchEnrollments = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await fetch(
                    "http://localhost:5000/api/enrollments"
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch enrollments"
                    );

                }


                const data = await response.json();


                setEnrollments(data);

            } catch (error) {

                console.log(
                    "Failed to fetch enrollments:",
                    error
                );


                setError(
                    "Failed to load enrollments."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchEnrollments();

    }, []);


    /* =====================================================
       AVAILABLE YEARS
    ===================================================== */

    const availableYears = [
        ...new Set(
            enrollments
                .map((enrollment) => {

                    if (!enrollment.createdAt) {

                        return null;

                    }

                    return new Date(
                        enrollment.createdAt
                    ).getFullYear();

                })
                .filter(Boolean)
        )
    ].sort(
        (a, b) => b - a
    );


    /* =====================================================
       FILTER ENROLLMENTS
    ===================================================== */

    const filteredEnrollments = enrollments.filter(
        (enrollment) => {

            const searchValue =
                search.toLowerCase();


            const matchesSearch =
                (enrollment.fullName || "")
                    .toLowerCase()
                    .includes(searchValue) ||

                (enrollment.email || "")
                    .toLowerCase()
                    .includes(searchValue) ||

                (enrollment.courseTitle || "")
                    .toLowerCase()
                    .includes(searchValue);


            const matchesCourse =
                courseFilter === "All" ||
                enrollment.language === courseFilter;


            const matchesStatus =
                statusFilter === "All" ||
                enrollment.status === statusFilter;


            const matchesYear =
                yearFilter === "All" ||
                (
                    enrollment.createdAt &&
                    new Date(
                        enrollment.createdAt
                    ).getFullYear() ===
                    Number(yearFilter)
                );


            return (
                matchesSearch &&
                matchesCourse &&
                matchesStatus &&
                matchesYear
            );

        }
    );


    /* =====================================================
       OPEN ENROLLMENT DETAILS
    ===================================================== */

    const viewEnrollmentDetails = (enrollmentId) => {

        navigate(
            `/admin/enrollments/${enrollmentId}`
        );

    };


    /* =====================================================
       OPEN DELETE CONFIRMATION
    ===================================================== */

    const openDeleteConfirmation = (enrollment) => {

        setDeleteEnrollment(enrollment);

    };


    /* =====================================================
       CANCEL DELETE
    ===================================================== */

    const cancelDelete = () => {

        setDeleteEnrollment(null);

    };


    /* =====================================================
       DELETE ENROLLMENT
    ===================================================== */

    const confirmDelete = async () => {

        if (!deleteEnrollment) {

            return;

        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/enrollments/${deleteEnrollment._id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete enrollment"
                );

            }


            const updatedEnrollments =
                enrollments.filter(
                    (enrollment) =>
                        enrollment._id !==
                        deleteEnrollment._id
                );


            setEnrollments(
                updatedEnrollments
            );


            setDeleteEnrollment(null);

        } catch (error) {

            console.log(
                "Failed to delete enrollment:",
                error
            );

        }

    };


    return (

        <div className="Enrollments">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="Enrollments-header">

                <div>

                    <span>
                        Student Management
                    </span>

                    <h1>
                        Enrollments
                    </h1>

                    <p>
                        Review and manage student enrollment requests.
                    </p>

                </div>


                <div className="Enrollments-summary">


                    <div>

                        <strong>
                            {enrollments.length}
                        </strong>

                        <span>
                            Total
                        </span>

                    </div>


                    <div>

                        <strong>
                            {
                                enrollments.filter(
                                    (enrollment) =>
                                        enrollment.status ===
                                        "Pending"
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
                                enrollments.filter(
                                    (enrollment) =>
                                        enrollment.status ===
                                        "Confirmed"
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

            <div className="Enrollments-filters">


                {/* SEARCH */}

                <div className="Enrollments-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search student or course..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* COURSE FILTER */}

                <div className="Enrollments-filter">

                    <i className="fa-solid fa-book"></i>

                    <select
                        value={courseFilter}
                        onChange={(event) =>
                            setCourseFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Courses
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

                <div className="Enrollments-filter">

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

                    </select>

                </div>


                {/* YEAR FILTER */}

                <div className="Enrollments-year-filter">

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
                TABLE
            ================================================= */}

            <div className="Enrollments-table-container">

                <table className="Enrollments-table">

                    <thead>

                        <tr>

                            <th>
                                Student
                            </th>

                            <th>
                                Course
                            </th>

                            <th>
                                Level
                            </th>

                            <th>
                                Enrolled
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

                        {loading && (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="Enrollments-empty"
                                >

                                    Loading enrollments...

                                </td>

                            </tr>

                        )}


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {!loading && error && (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="Enrollments-empty"
                                >

                                    {error}

                                </td>

                            </tr>

                        )}


                        {/* =================================================
                            ENROLLMENTS
                        ================================================= */}

                        {!loading &&
                            !error &&
                            filteredEnrollments.map(
                                (enrollment) => (

                                    <tr
                                        key={enrollment._id}
                                    >


                                        {/* STUDENT */}

                                        <td>

                                            <div className="Enrollments-student">

                                                <div className="Enrollments-avatar">

                                                    {
                                                        (enrollment.fullName || "")
                                                            .split(" ")
                                                            .map(
                                                                (name) =>
                                                                    name[0]
                                                            )
                                                            .join("")
                                                    }

                                                </div>


                                                <div className="Enrollments-student-info">

                                                    <strong>
                                                        {
                                                            enrollment.fullName
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            enrollment.email
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* COURSE */}

                                        <td>

                                            <div className="Enrollments-course-info">

                                                <strong>
                                                    {
                                                        enrollment.courseTitle
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        enrollment.language
                                                    }
                                                </span>

                                            </div>

                                        </td>


                                        {/* LEVEL */}

                                        <td>

                                            <span className="Enrollments-level">

                                                {
                                                    enrollment.level
                                                }

                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td>

                                            <span className="Enrollments-date">

                                                {
                                                    new Date(
                                                        enrollment.createdAt
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        }
                                                    )
                                                }

                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={
                                                    enrollment.status ===
                                                    "Confirmed"

                                                        ? "Enrollments-status confirmed"

                                                        : "Enrollments-status pending"
                                                }
                                            >

                                                <span className="Enrollments-status-dot"></span>

                                                {
                                                    enrollment.status
                                                }

                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <div className="Enrollments-actions">

                                                <button
                                                    className="Enrollments-arrow"
                                                    onClick={() =>
                                                        viewEnrollmentDetails(
                                                            enrollment._id
                                                        )
                                                    }
                                                    aria-label="View enrollment details"
                                                >

                                                    <i className="fa-solid fa-eye"></i>

                                                </button>


                                                <button
                                                    className="Enrollments-delete"
                                                    onClick={() =>
                                                        openDeleteConfirmation(
                                                            enrollment
                                                        )
                                                    }
                                                    aria-label="Delete enrollment"
                                                >

                                                    <i className="fa-solid fa-trash"></i>

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )
                        }


                        {/* =================================================
                            EMPTY
                        ================================================= */}

                        {!loading &&
                            !error &&
                            filteredEnrollments.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="Enrollments-empty"
                                    >

                                        No enrollments found.

                                    </td>

                                </tr>

                            )}

                    </tbody>

                </table>

            </div>


            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            {deleteEnrollment && (

                <div className="Enrollments-modal-overlay">

                    <div className="Enrollments-modal">

                        <div className="Enrollments-modal-icon">

                            <i className="fa-solid fa-trash"></i>

                        </div>


                        <h2>
                            Delete Enrollment?
                        </h2>


                        <p>

                            Are you sure you want to delete
                            the enrollment of{" "}

                            <strong>
                                {deleteEnrollment.fullName}
                            </strong>
                            ?

                            This action cannot be undone.

                        </p>


                        <div className="Enrollments-modal-actions">

                            <button
                                className="Enrollments-cancel"
                                onClick={cancelDelete}
                            >

                                Cancel

                            </button>


                            <button
                                className="Enrollments-delete-confirm"
                                onClick={confirmDelete}
                            >

                                <i className="fa-solid fa-trash"></i>

                                Delete Enrollment

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Enrollments;