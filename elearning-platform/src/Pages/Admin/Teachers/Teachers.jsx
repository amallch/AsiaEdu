import "./Teachers.css";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


function Teachers() {

    const navigate = useNavigate();


    const [teachers, setTeachers] = useState([]);

    const [search, setSearch] = useState("");

    const [languageFilter, setLanguageFilter] = useState("All");

    const [yearFilter, setYearFilter] = useState("All");

    const [deleteTeacher, setDeleteTeacher] = useState(null);

    const [statusTeacher, setStatusTeacher] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");


    /* =====================================================
       LOAD TEACHERS AND SESSIONS FROM MONGODB
    ===================================================== */

    useEffect(() => {

        const fetchTeachers = async () => {

            try {

                setIsLoading(true);

                setErrorMessage("");


                /* =================================================
                   LOAD TEACHERS
                ================================================= */

                const teachersResponse =
                    await fetch(
                        "http://localhost:5000/api/teachers"
                    );


                if (!teachersResponse.ok) {

                    throw new Error(
                        "Failed to fetch teachers."
                    );

                }


                const teachersData =
                    await teachersResponse.json();


                /* =================================================
                   LOAD SESSIONS
                ================================================= */

                const sessionsResponse =
                    await fetch(
                        "http://localhost:5000/api/sessions"
                    );


                if (!sessionsResponse.ok) {

                    throw new Error(
                        "Failed to fetch sessions."
                    );

                }


                const sessionsData =
                    await sessionsResponse.json();


                /* =================================================
                   FORMAT TEACHERS
                ================================================= */

                const formattedTeachers =
                    teachersData.map((teacher) => {

                        /* =========================================
                           FIND ALL SESSIONS FOR THIS TEACHER
                        ========================================= */

                        const teacherSessions =
                            sessionsData.filter(
                                (session) => {

                                    if (
                                        !session.instructor
                                    ) {

                                        return false;

                                    }


                                    if (
                                        typeof session.instructor ===
                                        "object"
                                    ) {

                                        return (
                                            String(
                                                session.instructor._id
                                            ) === String(
                                                teacher._id
                                            )
                                        );

                                    }


                                    return (
                                        String(
                                            session.instructor
                                        ) === String(
                                            teacher._id
                                        )
                                    );

                                }
                            );


                        /* =========================================
                           GET UNIQUE COURSES
                        ========================================= */

                        const teacherCourses = [];


                        teacherSessions.forEach(
                            (session) => {

                                if (
                                    !session.course
                                ) {

                                    return;

                                }


                                const courseId =
                                    session.course._id ||
                                    session.course;


                                const alreadyExists =
                                    teacherCourses.some(
                                        (course) =>
                                            String(
                                                course._id ||
                                                course.id
                                            ) === String(
                                                courseId
                                            )
                                    );


                                if (
                                    !alreadyExists
                                ) {

                                    teacherCourses.push(
                                        session.course
                                    );

                                }

                            }
                        );


                        /* =========================================
                           CALCULATE STUDENTS FROM SESSIONS
                        ========================================= */

                        let totalStudents = 0;


                        teacherSessions.forEach(
                            (session) => {

                                totalStudents +=
                                    session.enrolled || 0;

                            }
                        );


                        /*
                            If there are no session values yet,
                            keep the teacher's stored student count.
                        */

                        if (
                            totalStudents === 0 &&
                            teacher.students
                        ) {

                            totalStudents =
                                teacher.students;

                        }


                        return {

                            id:
                                teacher._id,

                            teacherId:
                                teacher.teacherId || "",

                            name:
                                teacher.name || "",

                            email:
                                teacher.email || "",

                            phone:
                                teacher.phone || "",

                            phone2:
                                teacher.phone2 || "",

                            language:
                                teacher.language || "",

                            experience:
                                teacher.experience || "",

                            education:
                                teacher.education || "",

                            joinedDate:
                                teacher.joinedDate
                                    ? new Date(
                                        teacher.joinedDate
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        }
                                    )
                                    : "N/A",

                            /* =====================================
                               CREATED DATE
                               Used for the dynamic year filter
                            ===================================== */

                            createdAt:
                                teacher.createdAt || null,

                            status:
                                teacher.status || "Active",

                            students:
                                totalStudents,

                            courses:
                                teacherCourses,

                            sessions:
                                teacherSessions

                        };

                    });


                setTeachers(
                    formattedTeachers
                );

            } catch (error) {

                console.error(
                    "Error loading teachers:",
                    error
                );

                setErrorMessage(
                    "Unable to load teachers. Please try again."
                );

            } finally {

                setIsLoading(false);

            }

        };


        fetchTeachers();

    }, []);


    /* =====================================================
       GET AVAILABLE YEARS
    ===================================================== */

    const availableYears = [
        ...new Set(
            teachers
                .map((teacher) => {

                    if (!teacher.createdAt) {

                        return null;

                    }


                    const year =
                        new Date(
                            teacher.createdAt
                        ).getFullYear();


                    return year;

                })
                .filter(Boolean)
        )
    ].sort(
        (a, b) => b - a
    );


    /* =====================================================
       FILTER TEACHERS
    ===================================================== */

    const filteredTeachers =
        teachers.filter((teacher) => {

            const teacherName =
                teacher.name || "";

            const teacherEmail =
                teacher.email || "";

            const teacherId =
                teacher.teacherId || "";


            const searchValue =
                search.toLowerCase();


            const matchesSearch =
                teacherName
                    .toLowerCase()
                    .includes(searchValue) ||

                teacherEmail
                    .toLowerCase()
                    .includes(searchValue) ||

                teacherId
                    .toLowerCase()
                    .includes(searchValue);


            const matchesLanguage =
                languageFilter === "All" ||
                teacher.language === languageFilter;


            /* ================================================
               YEAR FILTER
            ================================================ */

            const matchesYear =
                yearFilter === "All" ||
                (
                    teacher.createdAt &&
                    new Date(
                        teacher.createdAt
                    ).getFullYear() ===
                    Number(yearFilter)
                );


            return (
                matchesSearch &&
                matchesLanguage &&
                matchesYear
            );

        });


    /* =====================================================
       VIEW TEACHER DETAILS
    ===================================================== */

    const handleViewDetails = (teacher) => {

        navigate(
            `/admin/teachers/${teacher.id}`,
            {
                state: {
                    teacher: teacher
                }
            }
        );

    };


    /* =====================================================
       OPEN DELETE MODAL
    ===================================================== */

    const handleDeleteClick = (teacher) => {

        setDeleteTeacher(teacher);

    };


    /* =====================================================
       OPEN STATUS CONFIRMATION
    ===================================================== */

    const handleStatusClick = (
        teacher
    ) => {

        setStatusTeacher(
            teacher
        );

    };


    /* =====================================================
       SAVE TEACHER STATUS
    ===================================================== */

    const saveTeacherStatus = async () => {

        if (!statusTeacher) {

            return;

        }


        try {

            setErrorMessage("");


            const newStatus =
                statusTeacher.status === "Active"
                    ? "Inactive"
                    : "Active";


            const response =
                await fetch(
                    `http://localhost:5000/api/teachers/${statusTeacher.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            status: newStatus
                        })
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to update teacher status."
                );

            }


            setTeachers(
                (currentTeachers) =>
                    currentTeachers.map(
                        (teacher) => {

                            if (
                                teacher.id ===
                                statusTeacher.id
                            ) {

                                return {
                                    ...teacher,
                                    status: newStatus
                                };

                            }


                            return teacher;

                        }
                    )
            );


            setStatusTeacher(null);

        } catch (error) {

            console.error(
                "Error updating teacher status:",
                error
            );

            setErrorMessage(
                "Unable to update teacher status. Please try again."
            );

        }

    };


    /* =====================================================
       DELETE TEACHER FROM MONGODB
    ===================================================== */

    const confirmDelete = async () => {

        if (!deleteTeacher) {

            return;

        }


        try {

            setErrorMessage("");


            const response = await fetch(
                `http://localhost:5000/api/teachers/${deleteTeacher.id}`,
                {
                    method: "DELETE"
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to delete teacher."
                );

            }


            /*
                Remove the deleted teacher from
                the current frontend state.
            */

            setTeachers(
                (currentTeachers) =>
                    currentTeachers.filter(
                        (teacher) =>
                            teacher.id !==
                            deleteTeacher.id
                    )
            );


            setDeleteTeacher(null);

        } catch (error) {

            console.error(
                "Error deleting teacher:",
                error
            );

            setErrorMessage(
                "Unable to delete teacher. Please try again."
            );

            setDeleteTeacher(null);

        }

    };


    return (

        <div className="Teachers">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="Teachers-header">

                <div>

                    <span>
                        Management
                    </span>

                    <h1>
                        Teachers
                    </h1>

                    <p>
                        Manage teachers and monitor their teaching activity.
                    </p>

                </div>


                <div className="Teachers-header-right">

                    <div className="Teachers-total">

                        <strong>
                            {teachers.length}
                        </strong>

                        <span>
                            Total Teachers
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="Teachers-filters">

                <div className="Teachers-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search teachers..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <div className="Teachers-language-filter">

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


                {/* =================================================
                    YEAR FILTER
                ================================================= */}

                <div className="Teachers-year-filter">

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
                        backgroundColor:
                            "rgba(182, 92, 92, 0.08)",
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

            <div className="Teachers-card">

                <div className="Teachers-table-wrapper">

                    <table className="Teachers-table">

                        <thead>

                            <tr>

                                <th>
                                    Teacher
                                </th>

                                <th>
                                    Language
                                </th>

                                <th>
                                    Joined Date
                                </th>

                                <th>
                                    Courses
                                </th>

                                <th>
                                    Students
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
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
                                        className="Teachers-empty"
                                    >

                                        Loading teachers...

                                    </td>

                                </tr>

                            )}


                            {/* =================================================
                                TEACHERS
                            ================================================= */}

                            {!isLoading &&
                                filteredTeachers.map(
                                    (teacher) => {

                                        const teacherCourses =
                                            teacher.courses || [];


                                        const totalStudents =
                                            teacher.students || 0;


                                        return (

                                            <tr
                                                key={
                                                    teacher.id
                                                }
                                            >


                                                {/* =================================================
                                                    TEACHER
                                                ================================================= */}

                                                <td>

                                                    <div className="Teachers-user">

                                                        <div className="Teachers-avatar">

                                                            {teacher.name
                                                                ?.split(" ")
                                                                .map(
                                                                    (name) =>
                                                                        name[0]
                                                                )
                                                                .join("")
                                                            }

                                                        </div>


                                                        <div className="Teachers-user-info">

                                                            <strong>
                                                                {teacher.name}
                                                            </strong>

                                                            <span>
                                                                {teacher.email}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    LANGUAGE
                                                ================================================= */}

                                                <td>

                                                    <span className="Teachers-language">

                                                        {teacher.language}

                                                    </span>

                                                </td>


                                                {/* =================================================
                                                    JOINED DATE
                                                ================================================= */}

                                                <td>

                                                    <div className="Teachers-date">

                                                        <i className="fa-regular fa-calendar"></i>

                                                        <span>
                                                            {teacher.joinedDate}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    COURSES
                                                ================================================= */}

                                                <td>

                                                    <div className="Teachers-courses">

                                                        <strong>
                                                            {
                                                                teacherCourses.length
                                                            }
                                                        </strong>

                                                        <span>

                                                            {
                                                                teacherCourses.length === 1
                                                                    ? "Course"
                                                                    : "Courses"
                                                            }

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    STUDENTS
                                                ================================================= */}

                                                <td>

                                                    <div className="Teachers-students">

                                                        <i className="fa-solid fa-users"></i>

                                                        <span>
                                                            {
                                                                totalStudents
                                                            }
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    STATUS
                                                ================================================= */}

                                                <td>

                                                    <span
                                                        className={
                                                            teacher.status ===
                                                            "Active"
                                                                ? "Teachers-status active"
                                                                : "Teachers-status inactive"
                                                        }

                                                        onClick={() =>
                                                            handleStatusClick(
                                                                teacher
                                                            )
                                                        }

                                                        title="Click to change status"

                                                        style={{
                                                            cursor: "pointer"
                                                        }}
                                                    >

                                                        <span className="Teachers-status-dot"></span>

                                                        {
                                                            teacher.status
                                                        }

                                                    </span>

                                                </td>


                                                {/* =================================================
                                                    ACTIONS
                                                ================================================= */}

                                                <td>

                                                    <div className="Teachers-action-wrapper">


                                                        {/* VIEW */}

                                                        <button
                                                            className="Teachers-action"
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    teacher
                                                                )
                                                            }
                                                            aria-label="View teacher details"
                                                        >

                                                            <i className="fa-solid fa-eye"></i>

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            className="Teachers-delete"
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    teacher
                                                                )
                                                            }
                                                            aria-label="Delete teacher"
                                                        >

                                                            <i className="fa-solid fa-trash"></i>

                                                        </button>


                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}


                            {/* =================================================
                                EMPTY
                            ================================================= */}

                            {!isLoading &&
                                filteredTeachers.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="Teachers-empty"
                                        >

                                            No teachers found.

                                        </td>

                                    </tr>

                                )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                STATUS CONFIRMATION
            ================================================= */}

            {statusTeacher && (

                <div className="Teachers-modal-overlay">

                    <div className="Teachers-delete-modal">

                        <div className="Teachers-delete-icon">

                            <i className="fa-solid fa-user-pen"></i>

                        </div>


                        <h2>
                            Change Status?
                        </h2>


                        <p>

                            Are you sure you want to change{" "}

                            <strong>
                                {statusTeacher.name}
                            </strong>

                            from{" "}

                            <strong>
                                {statusTeacher.status}
                            </strong>

                            {" "}to{" "}

                            <strong>
                                {
                                    statusTeacher.status ===
                                    "Active"
                                        ? "Inactive"
                                        : "Active"
                                }
                            </strong>

                            ?

                        </p>


                        <div className="Teachers-delete-actions">

                            <button
                                className="Teachers-cancel-delete"
                                onClick={() =>
                                    setStatusTeacher(
                                        null
                                    )
                                }
                            >

                                Cancel

                            </button>


                            <button
                                className="Teachers-confirm-delete"
                                onClick={
                                    saveTeacherStatus
                                }
                            >

                                <i className="fa-solid fa-check"></i>

                                Save Change

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            {deleteTeacher && (

                <div className="Teachers-modal-overlay">

                    <div className="Teachers-delete-modal">


                        <div className="Teachers-delete-icon">

                            <i className="fa-solid fa-trash"></i>

                        </div>


                        <h2>
                            Delete Teacher?
                        </h2>


                        <p>

                            Are you sure you want to delete{" "}

                            <strong>
                                {deleteTeacher.name}
                            </strong>

                            ? This action cannot be undone.

                        </p>


                        <div className="Teachers-delete-actions">

                            <button
                                className="Teachers-cancel-delete"
                                onClick={() =>
                                    setDeleteTeacher(null)
                                }
                            >

                                Cancel

                            </button>


                            <button
                                className="Teachers-confirm-delete"
                                onClick={confirmDelete}
                            >

                                <i className="fa-solid fa-trash"></i>

                                Delete

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Teachers;