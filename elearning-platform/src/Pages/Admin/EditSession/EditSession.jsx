import "./EditSession.css";

import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";


const SESSIONS_API =
    "https://asiaedu-backend.onrender.com/api/sessions";

const COURSES_API =
    "https://asiaedu-backend.onrender.com/api/courses";

const TEACHERS_API =
    "https://asiaedu-backend.onrender.com/api/teachers";


const INITIAL_FORM = {
    course: "",
    group: "",
    instructor: "",
    startDate: "",
    programType: "Normal",
    capacity: "",
    enrolled: 0
};


function EditSession() {

    const navigate = useNavigate();

    const { id } = useParams();


    /* =====================================================
       STATE
    ===================================================== */

    const [form, setForm] =
        useState(INITIAL_FORM);

    const [courses, setCourses] =
        useState([]);

    const [teachers, setTeachers] =
        useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [isDeleting, setIsDeleting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    /* =====================================================
       FETCH SESSION + COURSES + TEACHERS
    ===================================================== */

    const fetchData = async () => {

        try {

            setIsLoading(true);
            setErrorMessage("");


            const [
                sessionResponse,
                coursesResponse,
                teachersResponse
            ] = await Promise.all([

                fetch(
                    `${SESSIONS_API}/${id}`
                ),

                fetch(COURSES_API),

                fetch(TEACHERS_API)

            ]);


            if (!sessionResponse.ok) {

                throw new Error(
                    "Failed to fetch session."
                );

            }


            if (!coursesResponse.ok) {

                throw new Error(
                    "Failed to fetch courses."
                );

            }


            if (!teachersResponse.ok) {

                throw new Error(
                    "Failed to fetch teachers."
                );

            }


            const sessionData =
                await sessionResponse.json();

            const coursesData =
                await coursesResponse.json();

            const teachersData =
                await teachersResponse.json();


            const session =
                sessionData;


            setCourses(
                Array.isArray(coursesData)
                    ? coursesData
                    : []
            );


            setTeachers(
                Array.isArray(teachersData)
                    ? teachersData
                    : []
            );


            setForm({

                course:
                    session.course &&
                    session.course._id
                        ? session.course._id
                        : session.course || "",

                group:
                    session.group || "",

                instructor:
                    session.instructor &&
                    session.instructor._id
                        ? session.instructor._id
                        : session.instructor || "",

                startDate:
                    session.startDate || "",

                programType:
                    session.programType ||
                    "Normal",

                capacity:
                    session.capacity !== undefined
                        ? session.capacity
                        : "",

                enrolled:
                    session.enrolled !== undefined
                        ? session.enrolled
                        : 0

            });


        } catch (error) {

            console.error(
                "Error fetching session data:",
                error
            );

            setErrorMessage(
                error.message ||
                "Unable to load session."
            );

        } finally {

            setIsLoading(false);

        }

    };


    useEffect(() => {

        if (id) {

            fetchData();

        }

    }, [id]);


    /* =====================================================
       INPUT CHANGE
    ===================================================== */

    const handleInputChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm({
            ...form,
            [name]: value
        });


        setErrorMessage("");
        setSuccessMessage("");

    };


    /* =====================================================
       SAVE CHANGES
    ===================================================== */

    const handleSave = async (event) => {

        event.preventDefault();


        setErrorMessage("");
        setSuccessMessage("");


        /* =========================
           VALIDATION
        ========================= */

        if (!form.course) {

            setErrorMessage(
                "Please select a course."
            );

            return;

        }


        if (!form.group.trim()) {

            setErrorMessage(
                "Please enter a group name."
            );

            return;

        }


        if (!form.instructor) {

            setErrorMessage(
                "Please select an instructor."
            );

            return;

        }


        if (!form.startDate) {

            setErrorMessage(
                "Please select a start date."
            );

            return;

        }


        if (!form.capacity) {

            setErrorMessage(
                "Please enter the session capacity."
            );

            return;

        }


        const capacityValue =
            Number(form.capacity);

        const enrolledValue =
            Number(form.enrolled);


        if (capacityValue < 1) {

            setErrorMessage(
                "Capacity must be at least 1."
            );

            return;

        }


        if (enrolledValue < 0) {

            setErrorMessage(
                "Enrolled cannot be negative."
            );

            return;

        }


        if (enrolledValue > capacityValue) {

            setErrorMessage(
                "Enrolled cannot be greater than capacity."
            );

            return;

        }


        /* =========================
           DATA TO SEND
        ========================= */

        const sessionData = {

            course:
                form.course,

            group:
                form.group.trim(),

            instructor:
                form.instructor,

            startDate:
                form.startDate,

            programType:
                form.programType,

            capacity:
                capacityValue,

            enrolled:
                enrolledValue

        };


        try {

            setIsSaving(true);


            const response =
                await fetch(
                    `${SESSIONS_API}/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                sessionData
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update session."
                );

            }


            setSuccessMessage(
                "Session updated successfully."
            );


            setTimeout(() => {

                navigate(
                    "/admin/sessions"
                );

            }, 800);


        } catch (error) {

            console.error(
                "Error updating session:",
                error
            );

            setErrorMessage(
                error.message ||
                "Unable to update session."
            );

        } finally {

            setIsSaving(false);

        }

    };


    /* =====================================================
       DELETE SESSION
    ===================================================== */

    const handleDelete = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this session?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setIsDeleting(true);
            setErrorMessage("");


            const response =
                await fetch(
                    `${SESSIONS_API}/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete session."
                );

            }


            navigate(
                "/admin/sessions"
            );


        } catch (error) {

            console.error(
                "Error deleting session:",
                error
            );

            setErrorMessage(
                error.message ||
                "Unable to delete session."
            );

        } finally {

            setIsDeleting(false);

        }

    };


    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {

        navigate(
            "/admin/sessions"
        );

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <div className="EditSession-loading">

                <i className="fa-solid fa-spinner fa-spin"></i>

                <span>
                    Loading session...
                </span>

            </div>

        );

    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="EditSession">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="EditSession-header">

                <div>

                    <span>
                        Management / Sessions
                    </span>

                    <h1>
                        Edit Session
                    </h1>

                    <p>
                        Update the course group, instructor, schedule and capacity.
                    </p>

                </div>


                <button
                    type="button"
                    className="EditSession-delete-top"
                    onClick={handleDelete}
                    disabled={
                        isDeleting ||
                        isSaving
                    }
                >

                    <i className="fa-solid fa-trash"></i>

                    <span>
                        {isDeleting
                            ? "Deleting..."
                            : "Delete Session"}
                    </span>

                </button>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
                className="EditSession-form"
                onSubmit={handleSave}
            >


                {/* =================================================
                    ERROR
                ================================================= */}

                {errorMessage && (

                    <div className="EditSession-message error">

                        <i className="fa-solid fa-circle-exclamation"></i>

                        <span>
                            {errorMessage}
                        </span>

                    </div>

                )}


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {successMessage && (

                    <div className="EditSession-message success">

                        <i className="fa-solid fa-circle-check"></i>

                        <span>
                            {successMessage}
                        </span>

                    </div>

                )}


                {/* =================================================
                    SESSION INFORMATION
                ================================================= */}

                <div className="EditSession-section">

                    <div className="EditSession-section-title">

                        <div className="EditSession-section-icon">

                            <i className="fa-solid fa-users"></i>

                        </div>

                        <div>

                            <h2>
                                Session Information
                            </h2>

                            <p>
                                Update the course and group details.
                            </p>

                        </div>

                    </div>


                    <div className="EditSession-grid">


                        {/* =========================
                            COURSE
                        ========================= */}

                        <div className="EditSession-group">

                            <label>
                                Course
                            </label>

                            <select
                                name="course"
                                value={form.course}
                                onChange={handleInputChange}
                            >

                                <option value="">
                                    Select a course
                                </option>


                                {courses.map(
                                    (course) => (

                                        <option
                                            key={course._id}
                                            value={course._id}
                                        >
                                            {course.title}
                                            {course.language
                                                ? ` — ${course.language}`
                                                : ""}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =========================
                            GROUP
                        ========================= */}

                        <div className="EditSession-group">

                            <label>
                                Group
                            </label>

                            <input
                                type="text"
                                name="group"
                                value={form.group}
                                onChange={handleInputChange}
                                placeholder="Example: Group A"
                            />

                        </div>


                        {/* =========================
                            INSTRUCTOR
                        ========================= */}

                        <div className="EditSession-group">

                            <label>
                                Instructor
                            </label>

                            <select
                                name="instructor"
                                value={form.instructor}
                                onChange={handleInputChange}
                            >

                                <option value="">
                                    Select an instructor
                                </option>


                                {teachers.map(
                                    (teacher) => (

                                        <option
                                            key={teacher._id}
                                            value={teacher._id}
                                        >
                                            {teacher.name}
                                            {teacher.language
                                                ? ` — ${teacher.language}`
                                                : ""}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =========================
                            START DATE
                        ========================= */}

                        <div className="EditSession-group">

                            <label>
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleInputChange}
                            />

                        </div>


                        {/* =========================
                            PROGRAM TYPE
                        ========================= */}

                        <div className="EditSession-group">

                            <label>
                                Program Type
                            </label>

                            <select
                                name="programType"
                                value={form.programType}
                                onChange={handleInputChange}
                            >

                                <option value="Normal">
                                    Normal
                                </option>

                                <option value="Summer Camp">
                                    Summer Camp
                                </option>

                            </select>

                        </div>


                        {/* =========================
                            CAPACITY
                        ========================= */}

                        <div className="EditSession-group">

                            <label>
                                Capacity
                            </label>

                            <input
                                type="number"
                                name="capacity"
                                value={form.capacity}
                                onChange={handleInputChange}
                                min="1"
                                placeholder="Example: 15"
                            />

                        </div>


                        {/* =========================
                            ENROLLED
                        ========================= */}

                        <div className="EditSession-group">

                            <label>
                                Enrolled
                            </label>

                            <input
                                type="number"
                                name="enrolled"
                                value={form.enrolled}
                                onChange={handleInputChange}
                                min="0"
                            />

                            <small>
                                This represents the number of students currently enrolled.
                            </small>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="EditSession-actions">

                    <button
                        type="button"
                        className="EditSession-cancel"
                        onClick={handleCancel}
                        disabled={
                            isSaving ||
                            isDeleting
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="EditSession-save"
                        disabled={
                            isSaving ||
                            isDeleting
                        }
                    >

                        {isSaving ? (

                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>

                                <span>
                                    Saving...
                                </span>
                            </>

                        ) : (

                            <>
                                <i className="fa-solid fa-floppy-disk"></i>

                                <span>
                                    Save Changes
                                </span>
                            </>

                        )}

                    </button>

                </div>


            </form>


        </div>

    );

}


export default EditSession;