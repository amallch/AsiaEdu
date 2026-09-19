import "./Students.css";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


function Students() {

    const [students, setStudents] = useState([]);

    const [courses, setCourses] = useState([]);

    const [search, setSearch] = useState("");

    const [courseFilter, setCourseFilter] = useState("All");

    const [yearFilter, setYearFilter] = useState("All");

    const [deleteStudent, setDeleteStudent] = useState(null);

    const [statusStudent, setStatusStudent] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const navigate = useNavigate();


    /* =====================================================
       GET STUDENTS AND COURSES FROM BACKEND
    ===================================================== */

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);

                setError("");


                /* =============================================
                   GET STUDENTS
                ============================================= */

                const studentsResponse =
                    await fetch(
                        "http://localhost:5000/api/students"
                    );


                if (!studentsResponse.ok) {

                    throw new Error(
                        "Failed to fetch students"
                    );

                }


                const studentsData =
                    await studentsResponse.json();


                setStudents(
                    studentsData
                );


                /* =============================================
                   GET COURSES
                ============================================= */

                const coursesResponse =
                    await fetch(
                        "http://localhost:5000/api/courses"
                    );


                if (!coursesResponse.ok) {

                    throw new Error(
                        "Failed to fetch courses"
                    );

                }


                const coursesData =
                    await coursesResponse.json();


                setCourses(
                    coursesData
                );


            }

            catch (error) {

                console.error(error);

                setError(
                    "Failed to load students."
                );

            }

            finally {

                setLoading(false);

            }

        };


        fetchData();

    }, []);


    /* =====================================================
       GET COURSE NAME
    ===================================================== */

    const getCourseName = (course) => {

        if (!course) {

            return "";

        }


        /* =================================================
           COURSE OBJECT WITH NAME
        ================================================= */

        if (course.name) {

            return course.name;

        }


        /* =================================================
           COURSE OBJECT WITH TITLE
        ================================================= */

        if (course.title) {

            return course.title;

        }


        /* =================================================
           COURSE ID
        ================================================= */

        if (
            course.id !== undefined &&
            course.id !== null
        ) {

            const matchingCourse =
                courses.find(
                    (item) =>
                        String(item.id) ===
                        String(course.id)
                );


            if (matchingCourse) {

                return matchingCourse.title;

            }

        }


        /* =================================================
           MONGODB OBJECT ID
        ================================================= */

        if (course._id) {

            const matchingCourse =
                courses.find(
                    (item) =>
                        String(item._id) ===
                        String(course._id)
                );


            if (matchingCourse) {

                return matchingCourse.title;

            }

        }


        return "";

    };


    /* =====================================================
       CHECK COURSE FILTER
    ===================================================== */

    const studentHasCourse = (
        student,
        selectedCourse
    ) => {

        if (
            selectedCourse === "All"
        ) {

            return true;

        }


        if (
            !student.courses ||
            !student.courses.length
        ) {

            return false;

        }


        return student.courses.some(
            (studentCourse) => {

                const courseName =
                    getCourseName(
                        studentCourse
                    );


                return (
                    courseName ===
                    selectedCourse
                );

            }
        );

    };


    /* =====================================================
       GET AVAILABLE YEARS
    ===================================================== */

    const availableYears = [
        ...new Set(
            students
                .filter(
                    (student) =>
                        student.createdAt
                )
                .map(
                    (student) =>
                        new Date(
                            student.createdAt
                        ).getFullYear()
                )
        )
    ].sort(
        (a, b) => b - a
    );


    /* =====================================================
       FILTER STUDENTS
    ===================================================== */

    const filteredStudents =
        students.filter(
            (student) => {

                const studentName =
                    student.name?.toLowerCase() ||
                    "";

                const studentEmail =
                    student.email?.toLowerCase() ||
                    "";

                const studentId =
                    student.studentId?.toLowerCase() ||
                    "";


                const searchValue =
                    search.toLowerCase();


                const matchesSearch =
                    studentName.includes(
                        searchValue
                    ) ||

                    studentEmail.includes(
                        searchValue
                    ) ||

                    studentId.includes(
                        searchValue
                    );


                const matchesCourse =
                    studentHasCourse(
                        student,
                        courseFilter
                    );


                /* =============================================
                   YEAR FILTER
                ============================================= */

                let matchesYear = true;


                if (
                    yearFilter !== "All"
                ) {

                    matchesYear =
                        student.createdAt &&
                        new Date(
                            student.createdAt
                        ).getFullYear() ===
                        Number(yearFilter);

                }


                return (
                    matchesSearch &&
                    matchesCourse &&
                    matchesYear
                );

            }
        );


    /* =====================================================
       VIEW STUDENT DETAILS
    ===================================================== */

    const viewStudentDetails = (
        studentId
    ) => {

        navigate(
            `/admin/students/${studentId}`
        );

    };


    /* =====================================================
       OPEN STATUS CONFIRMATION
    ===================================================== */

    const handleStatusClick = (
        student
    ) => {

        setStatusStudent(
            student
        );

    };


    /* =====================================================
       SAVE STUDENT STATUS
    ===================================================== */

    const saveStudentStatus = async () => {

        if (!statusStudent) {

            return;

        }


        try {

            setError("");


            const newStatus =
                statusStudent.status === "Active"
                    ? "Inactive"
                    : "Active";


            const response =
                await fetch(
                    `http://localhost:5000/api/students/${statusStudent._id}`,
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
                    "Failed to update student status"
                );

            }


            setStudents(
                (currentStudents) =>
                    currentStudents.map(
                        (student) => {

                            if (
                                student._id ===
                                statusStudent._id
                            ) {

                                return {
                                    ...student,
                                    status: newStatus
                                };

                            }


                            return student;

                        }
                    )
            );


            setStatusStudent(null);

        }

        catch (error) {

            console.error(error);

            setError(
                "Failed to update student status."
            );

        }

    };


    /* =====================================================
       DELETE STUDENT
    ===================================================== */

    const confirmDelete = async () => {

        if (!deleteStudent) {

            return;

        }


        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/students/${deleteStudent._id}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete student"
                );

            }


            setStudents(
                (currentStudents) =>
                    currentStudents.filter(
                        (student) =>
                            student._id !==
                            deleteStudent._id
                    )
            );


            setDeleteStudent(null);


        }

        catch (error) {

            console.error(error);

            setError(
                "Failed to delete student."
            );

        }

    };


    return (

        <div className="Students">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="Students-header">

                <div>

                    <span>
                        Management
                    </span>

                    <h1>
                        Students
                    </h1>

                    <p>
                        Manage all students registered on the platform.
                    </p>

                </div>


                <div className="Students-total">

                    <strong>
                        {students.length}
                    </strong>

                    <span>
                        Total Students
                    </span>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="Students-filters">

                <div className="Students-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <div className="Students-course-filter">

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


                        {courses.map(
                            (course) => (

                                <option
                                    key={course._id}
                                    value={course.title}
                                >

                                    {course.title}

                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* =================================================
                    YEAR FILTER
                ================================================= */}

                <div className="Students-year-filter">

                    <i className="fa-solid fa-calendar"></i>

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
                ERROR
            ================================================= */}

            {error && (

                <div className="Students-error">

                    {error}

                </div>

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="Students-card">

                <div className="Students-table-wrapper">

                    <table className="Students-table">

                        <thead>

                            <tr>

                                <th>
                                    Full Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Student ID
                                </th>

                                <th>
                                    Enrolled Courses
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

                            {loading && (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="Students-empty"
                                    >

                                        Loading students...

                                    </td>

                                </tr>

                            )}


                            {/* =================================================
                                STUDENTS
                            ================================================= */}

                            {!loading &&
                                filteredStudents.map(
                                    (student) => (

                                        <tr
                                            key={
                                                student._id
                                            }
                                        >


                                            {/* FULL NAME */}

                                            <td>

                                                <div className="Students-user">

                                                    <div className="Students-avatar">

                                                        {student.name
                                                            ?.split(" ")
                                                            .map(
                                                                (name) =>
                                                                    name[0]
                                                            )
                                                            .join("")
                                                        }

                                                    </div>


                                                    <strong className="Students-name">

                                                        {student.name}

                                                    </strong>

                                                </div>

                                            </td>


                                            {/* EMAIL */}

                                            <td>

                                                <span className="Students-email">

                                                    {student.email}

                                                </span>

                                            </td>


                                            {/* STUDENT ID */}

                                            <td>

                                                <span className="Students-id">

                                                    {student.studentId}

                                                </span>

                                            </td>


                                            {/* ENROLLED COURSES */}

                                            <td>

                                                <div className="Students-courses">

                                                    <strong>

                                                        {
                                                            student.courses?.length ||
                                                            0
                                                        }

                                                    </strong>


                                                    <span>

                                                        {
                                                            student.courses?.length ===
                                                            1
                                                                ? "Course"
                                                                : "Courses"
                                                        }

                                                    </span>

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        student.status ===
                                                        "Active"
                                                            ? "Students-status active"
                                                            : "Students-status inactive"
                                                    }

                                                    onClick={() =>
                                                        handleStatusClick(
                                                            student
                                                        )
                                                    }

                                                    title="Click to change status"

                                                    style={{
                                                        cursor: "pointer"
                                                    }}
                                                >

                                                    <span className="Students-status-dot"></span>

                                                    {
                                                        student.status
                                                    }

                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="Students-actions">


                                                    {/* VIEW */}

                                                    <button
                                                        className="Students-arrow"
                                                        onClick={() =>
                                                            viewStudentDetails(
                                                                student._id
                                                            )
                                                        }
                                                        aria-label="View student details"
                                                    >

                                                        <i className="fa-solid fa-eye"></i>

                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        className="Students-delete"
                                                        onClick={() =>
                                                            setDeleteStudent(
                                                                student
                                                            )
                                                        }
                                                        aria-label="Delete student"
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
                                filteredStudents.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="Students-empty"
                                        >

                                            No students found.

                                        </td>

                                    </tr>

                                )
                            }


                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                STATUS CONFIRMATION
            ================================================= */}

            {statusStudent && (

                <div className="Students-modal-overlay">

                    <div className="Students-delete-modal">

                        <div className="Students-delete-icon">

                            <i className="fa-solid fa-user-pen"></i>

                        </div>


                        <h2>
                            Change Status?
                        </h2>


                        <p>

                            Are you sure you want to change{" "}

                            <strong>
                                {statusStudent.name}
                            </strong>

                            from{" "}

                            <strong>
                                {statusStudent.status}
                            </strong>

                            {" "}to{" "}

                            <strong>
                                {
                                    statusStudent.status ===
                                    "Active"
                                        ? "Inactive"
                                        : "Active"
                                }
                            </strong>

                            ?

                        </p>


                        <div className="Students-delete-actions">

                            <button
                                className="Students-cancel-delete"
                                onClick={() =>
                                    setStatusStudent(
                                        null
                                    )
                                }
                            >

                                Cancel

                            </button>


                            <button
                                className="Students-confirm-delete"
                                onClick={
                                    saveStudentStatus
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

            {deleteStudent && (

                <div className="Students-modal-overlay">

                    <div className="Students-delete-modal">


                        <div className="Students-delete-icon">

                            <i className="fa-solid fa-trash"></i>

                        </div>


                        <h2>
                            Delete Student?
                        </h2>


                        <p>

                            Are you sure you want to delete{" "}

                            <strong>
                                {deleteStudent.name}
                            </strong>

                            ? This action cannot be undone.

                        </p>


                        <div className="Students-delete-actions">

                            <button
                                className="Students-cancel-delete"
                                onClick={() =>
                                    setDeleteStudent(
                                        null
                                    )
                                }
                            >

                                Cancel

                            </button>


                            <button
                                className="Students-confirm-delete"
                                onClick={
                                    confirmDelete
                                }
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


export default Students;