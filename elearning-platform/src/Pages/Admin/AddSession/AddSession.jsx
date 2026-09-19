import "./AddSession.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const SESSIONS_API =
    "http://localhost:5000/api/sessions";

const COURSES_API =
    "http://localhost:5000/api/courses";

const TEACHERS_API =
    "http://localhost:5000/api/teachers";


const INITIAL_FORM = {
    course: "",
    group: "",
    instructor: "",
    startDate: "",
    programType: "Normal",
    capacity: "",
    enrolled: 0
};


function AddSession() {

    const navigate = useNavigate();


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

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    /* =====================================================
       FETCH COURSES + TEACHERS
    ===================================================== */

    const fetchData = async () => {

        try {

            setIsLoading(true);
            setErrorMessage("");

            const [
                coursesResponse,
                teachersResponse
            ] = await Promise.all([
                fetch(COURSES_API),
                fetch(TEACHERS_API)
            ]);


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


            const coursesData =
                await coursesResponse.json();

            const teachersData =
                await teachersResponse.json();


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

        } catch (error) {

            console.error(
                "Error fetching session data:",
                error
            );

            setErrorMessage(
                "Unable to load courses and teachers. Please try again."
            );

        } finally {

            setIsLoading(false);

        }

    };


    useEffect(() => {

        fetchData();

    }, []);


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

    };


    /* =====================================================
       SAVE SESSION
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
                    SESSIONS_API,
                    {
                        method: "POST",

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
                    "Failed to create session."
                );

            }


            setSuccessMessage(
                "Session created successfully."
            );


            setTimeout(() => {

                navigate(
                    "/admin/sessions"
                );

            }, 800);


        } catch (error) {

            console.error(
                "Error creating session:",
                error
            );

            setErrorMessage(
                error.message ||
                "Unable to create session."
            );

        } finally {

            setIsSaving(false);

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
       RENDER
    ===================================================== */

    return (

        <div className="AddSession">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="AddSession-header">

                <div>

                    <span>
                        Management / Sessions
                    </span>

                    <h1>
                        Add Session
                    </h1>

                    <p>
                        Create a new course group and assign its instructor.
                    </p>

                </div>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
                className="AddSession-form"
                onSubmit={handleSave}
            >


                {/* =================================================
                    ERROR
                ================================================= */}

                {errorMessage && (

                    <div className="AddSession-message error">

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

                    <div className="AddSession-message success">

                        <i className="fa-solid fa-circle-check"></i>

                        <span>
                            {successMessage}
                        </span>

                    </div>

                )}


                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <div className="AddSession-section">

                    <div className="AddSession-section-title">

                        <div className="AddSession-section-icon">

                            <i className="fa-solid fa-book"></i>

                        </div>

                        <div>

                            <h2>
                                Session Information
                            </h2>

                            <p>
                                Choose the course and define the session group.
                            </p>

                        </div>

                    </div>


                    <div className="AddSession-grid">


                        {/* =========================
                            COURSE
                        ========================= */}

                        <div className="AddSession-group">

                            <label>
                                Course
                            </label>

                            <select
                                name="course"
                                value={form.course}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            >

                                <option value="">
                                    {isLoading
                                        ? "Loading courses..."
                                        : "Select a course"}
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

                        <div className="AddSession-group">

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

                        <div className="AddSession-group">

                            <label>
                                Instructor
                            </label>

                            <select
                                name="instructor"
                                value={form.instructor}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            >

                                <option value="">
                                    {isLoading
                                        ? "Loading instructors..."
                                        : "Select an instructor"}
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

                        <div className="AddSession-group">

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

                        <div className="AddSession-group">

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

                        <div className="AddSession-group">

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

                        <div className="AddSession-group">

                            <label>
                                Enrolled
                            </label>

                            <input
                                type="number"
                                name="enrolled"
                                value={form.enrolled}
                                onChange={handleInputChange}
                                min="0"
                                placeholder="Example: 0"
                            />

                            <small>
                                Use 0 for a new session with no students yet.
                            </small>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="AddSession-actions">

                    <button
                        type="button"
                        className="AddSession-cancel"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="AddSession-save"
                        disabled={
                            isSaving ||
                            isLoading
                        }
                    >

                        {isSaving ? (

                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>

                                <span>
                                    Creating...
                                </span>
                            </>

                        ) : (

                            <>
                                <i className="fa-solid fa-plus"></i>

                                <span>
                                    Create Session
                                </span>
                            </>

                        )}

                    </button>

                </div>


            </form>


        </div>

    );

}


export default AddSession;