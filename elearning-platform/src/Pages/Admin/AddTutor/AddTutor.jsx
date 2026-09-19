import "./AddTutor.css";

import {
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";


function AddTutor() {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    /* =====================================================
       APPLICATION
    ===================================================== */

    const application =
        location.state?.application || null;


    /* =====================================================
       FORM DATA
    ===================================================== */

    const [formData] =
        useState(() => {

            const fullName =
                `${application?.firstName || ""} ${application?.lastName || ""}`
                    .trim();


            return {

                fullName,

                email:
                    application?.email || "",

                phone:
                    application?.phone || "",

                phone2:
                    "",

                language:
                    application?.language || "",

                experience:
                    application?.experience || "",

                education:
                    application?.education || "",

                joinedDate:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                status:
                    "Active"

            };

        });


    /* =====================================================
       COURSES
    ===================================================== */

    const [
        courses,
        setCourses
    ] = useState([]);


    const [
        isLoadingCourses,
        setIsLoadingCourses
    ] = useState(true);


    /* =====================================================
       SELECTED COURSES
    ===================================================== */

    const [
        selectedCourses,
        setSelectedCourses
    ] = useState([]);


    /* =====================================================
       SUBMIT / ERROR STATE
    ===================================================== */

    const [
        isSubmitting,
        setIsSubmitting
    ] = useState(false);


    const [
        errorMessage,
        setErrorMessage
    ] = useState("");


    /* =====================================================
       CHECK IF TEACHER WAS ALREADY CREATED
    ===================================================== */

    const teacherAlreadyCreated =
        application?.teacherCreated === true ||
        Boolean(application?.teacherId);


    /* =====================================================
       LOAD COURSES FROM BACKEND
    ===================================================== */

    useEffect(() => {

        const fetchCourses = async () => {

            try {

                setIsLoadingCourses(true);

                const response =
                    await fetch(
                        "https://asiaedu-backend.onrender.com/api/courses"
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load courses."
                    );

                }


                /*
                   The API normally returns
                   an array of courses.
                */

                if (Array.isArray(data)) {

                    setCourses(data);

                } else if (
                    data.courses &&
                    Array.isArray(data.courses)
                ) {

                    setCourses(
                        data.courses
                    );

                } else {

                    setCourses([]);

                }

            } catch (error) {

                console.error(
                    "Error loading courses:",
                    error
                );


                setCourses([]);

                setErrorMessage(
                    "Unable to load courses."
                );

            } finally {

                setIsLoadingCourses(false);

            }

        };


        fetchCourses();

    }, []);


    /* =====================================================
       FILTER COURSES BY TEACHING LANGUAGE
    ===================================================== */

    const availableCourses =
        courses.filter(
            (course) =>
                course.language ===
                formData.language
        );


    /* =====================================================
       HANDLE COURSE SELECTION
    ===================================================== */

    const handleCourseSelect =
        (courseId) => {

            if (teacherAlreadyCreated) {

                return;

            }


            const courseAlreadySelected =
                selectedCourses.includes(
                    courseId
                );


            if (courseAlreadySelected) {

                setSelectedCourses(
                    selectedCourses.filter(
                        (id) =>
                            id !== courseId
                    )
                );

            } else {

                setSelectedCourses([
                    ...selectedCourses,
                    courseId
                ]);

            }

        };


    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit =
        async (event) => {

            event.preventDefault();


            setErrorMessage("");


            /* =================================================
               APPLICATION CHECK
            ================================================= */

            if (!application?._id) {

                setErrorMessage(
                    "No tutor application was provided."
                );

                return;

            }


            /* =================================================
               DUPLICATE CHECK
            ================================================= */

            if (teacherAlreadyCreated) {

                setErrorMessage(
                    "A teacher has already been created from this application."
                );

                return;

            }


            /* =================================================
               COURSE CHECK
            ================================================= */

            if (
                selectedCourses.length === 0
            ) {

                setErrorMessage(
                    "Please select at least one teaching course."
                );

                return;

            }


            try {

                setIsSubmitting(true);


                /* =================================================
                   GET SELECTED REAL COURSES
                ================================================= */

                const selectedCourseData =
                    courses.filter(
                        (course) =>
                            selectedCourses.includes(
                                course._id
                            )
                    );


                /* =================================================
                   MAKE SURE COURSES WERE FOUND
                ================================================= */

                if (
                    selectedCourseData.length === 0
                ) {

                    setErrorMessage(
                        "The selected courses could not be found."
                    );

                    setIsSubmitting(false);

                    return;

                }


                /* =================================================
                   FORMAT REAL COURSES
                ================================================= */

                const teacherCourses =
                    selectedCourseData.map(
                        (course) => {

                            return {

                                id:
                                    course.id,

                                courseId:
                                    String(
                                        course._id
                                    ),

                                enrollmentId:
                                    "",

                                name:
                                    course.title ||
                                    course.name ||
                                    "",

                                language:
                                    course.language ||
                                    "",

                                level:
                                    course.level ||
                                    "",

                                session:
                                    "",

                                teacher:
                                    formData.fullName,

                                startDate:
                                    course.startDate ||
                                    "",

                                duration:
                                    course.duration ||
                                    "",

                                price:
                                    course.price ||
                                    0,

                                programType:
                                    "normal",

                                status:
                                    "Active",

                                students:
                                    course.students ||
                                    0

                            };

                        }
                    );


                /* =================================================
                   TEACHER DATA
                ================================================= */

                const teacherData = {

                    name:
                        formData.fullName,

                    email:
                        formData.email,

                    phone:
                        formData.phone,

                    phone2:
                        formData.phone2,

                    language:
                        formData.language,

                    experience:
                        formData.experience,

                    education:
                        formData.education,

                    joinedDate:
                        formData.joinedDate,

                    status:
                        formData.status,

                    courses:
                        teacherCourses

                };


                /* =================================================
                   CREATE TEACHER FROM APPLICATION
                ================================================= */

                const response =
                    await fetch(
                        `https://asiaedu-backend.onrender.com/api/tutor-applications/${application._id}/create-teacher`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    teacherData
                                )

                        }
                    );


                const data =
                    await response.json();


                /* =================================================
                   CHECK RESPONSE
                ================================================= */

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to create teacher."
                    );

                }


                /* =================================================
                   SUCCESS
                ================================================= */

                console.log(
                    "Teacher created successfully:",
                    data.teacher
                );


                navigate(
                    "/admin/teachers"
                );

            } catch (error) {

                console.error(
                    "Error creating teacher:",
                    error
                );


                setErrorMessage(
                    error.message ||
                    "Unable to create teacher. Please try again."
                );

            } finally {

                setIsSubmitting(false);

            }

        };


    /* =====================================================
       NO APPLICATION
    ===================================================== */

    if (!application) {

        return (

            <div className="AddTutor">

                <div className="AddTutor-courses-empty">

                    <i className="fa-solid fa-file-circle-exclamation"></i>

                    <h3>
                        Tutor Application Not Found
                    </h3>

                    <p>
                        This page must be opened from a confirmed tutor application.
                    </p>


                    <button
                        type="button"
                        className="AddTutor-submit"
                        onClick={() =>
                            navigate(
                                "/admin/tutor-applications"
                            )
                        }
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        Back to Applications

                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="AddTutor">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="AddTutor-header">

                <button
                    type="button"
                    className="AddTutor-back"
                    onClick={() =>
                        navigate(
                            "/admin/teachers"
                        )
                    }
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    <span>
                        Back to Teachers
                    </span>

                </button>


                <span className="AddTutor-label">
                    Teacher Management
                </span>


                <h1>
                    Add New Tutor
                </h1>


                <p>
                    Review the tutor's information and assign the courses they will teach.
                </p>

            </div>


            {/* =================================================
                APPLICATION NOTICE
            ================================================= */}

            <div
                className={
                    teacherAlreadyCreated
                        ? "AddTutor-application-notice created"
                        : "AddTutor-application-notice"
                }
            >

                <div className="AddTutor-application-icon">

                    <i
                        className={
                            teacherAlreadyCreated
                                ? "fa-solid fa-user-check"
                                : "fa-solid fa-circle-check"
                        }
                    ></i>

                </div>


                <div>

                    <strong>

                        {teacherAlreadyCreated
                            ? "Teacher Already Created"
                            : "Tutor Application Confirmed"
                        }

                    </strong>


                    <p>

                        {teacherAlreadyCreated
                            ? "This tutor application has already been converted into a teacher. A second teacher cannot be created from the same application."
                            : "Personal and professional information has been automatically filled from the confirmed tutor application."
                        }

                    </p>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {errorMessage && (

                <div className="AddTutor-error">

                    <i className="fa-solid fa-circle-exclamation"></i>

                    <span>
                        {errorMessage}
                    </span>

                </div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <form
                className="AddTutor-form"
                onSubmit={handleSubmit}
            >


                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <div className="AddTutor-section">

                    <div className="AddTutor-section-header">

                        <div className="AddTutor-section-icon">

                            <i className="fa-solid fa-user"></i>

                        </div>


                        <div>

                            <h2>
                                Personal Information
                            </h2>

                            <p>
                                Information provided by the tutor applicant.
                            </p>

                        </div>

                    </div>


                    <div className="AddTutor-grid">


                        <div className="AddTutor-field">

                            <label>
                                Full Name
                            </label>

                            <div className="AddTutor-input-wrapper">

                                <i className="fa-solid fa-user"></i>

                                <input
                                    type="text"
                                    value={formData.fullName}
                                    readOnly
                                />

                            </div>

                        </div>


                        <div className="AddTutor-field">

                            <label>
                                Email Address
                            </label>

                            <div className="AddTutor-input-wrapper">

                                <i className="fa-solid fa-envelope"></i>

                                <input
                                    type="email"
                                    value={formData.email}
                                    readOnly
                                />

                            </div>

                        </div>


                        <div className="AddTutor-field">

                            <label>
                                Phone Number
                            </label>

                            <div className="AddTutor-input-wrapper">

                                <i className="fa-solid fa-phone"></i>

                                <input
                                    type="tel"
                                    value={formData.phone}
                                    readOnly
                                />

                            </div>

                        </div>


                        <div className="AddTutor-field">

                            <label>
                                Teacher ID
                            </label>

                            <div className="AddTutor-input-wrapper">

                                <i className="fa-solid fa-id-card"></i>

                                <input
                                    type="text"
                                    value="Generated by backend"
                                    readOnly
                                />

                            </div>

                        </div>


                    </div>

                </div>


                {/* =================================================
                    PROFESSIONAL INFORMATION
                ================================================= */}

                <div className="AddTutor-section">

                    <div className="AddTutor-section-header">

                        <div className="AddTutor-section-icon">

                            <i className="fa-solid fa-chalkboard-user"></i>

                        </div>


                        <div>

                            <h2>
                                Professional Information
                            </h2>

                            <p>
                                Information automatically provided from the tutor application.
                            </p>

                        </div>

                    </div>


                    <div className="AddTutor-grid">


                        <div className="AddTutor-field">

                            <label>
                                Teaching Language
                            </label>

                            <div className="AddTutor-input-wrapper">

                                <i className="fa-solid fa-language"></i>

                                <input
                                    type="text"
                                    value={formData.language}
                                    readOnly
                                />

                            </div>

                        </div>


                        <div className="AddTutor-field">

                            <label>
                                Experience
                            </label>

                            <div className="AddTutor-input-wrapper">

                                <i className="fa-solid fa-briefcase"></i>

                                <input
                                    type="text"
                                    value={formData.experience}
                                    readOnly
                                />

                            </div>

                        </div>


                        <div className="AddTutor-field">

                            <label>
                                Education
                            </label>

                            <div className="AddTutor-input-wrapper">

                                <i className="fa-solid fa-graduation-cap"></i>

                                <input
                                    type="text"
                                    value={formData.education}
                                    readOnly
                                />

                            </div>

                        </div>


                        <div className="AddTutor-field">

                            <label>
                                Joined Date
                            </label>

                            <div className="AddTutor-input-wrapper">

                                <i className="fa-regular fa-calendar"></i>

                                <input
                                    type="date"
                                    value={formData.joinedDate}
                                    readOnly
                                />

                            </div>

                        </div>


                        <div className="AddTutor-field">

                            <label>
                                Status
                            </label>

                            <div className="AddTutor-input-wrapper">

                                <i className="fa-solid fa-circle-check"></i>

                                <input
                                    type="text"
                                    value={formData.status}
                                    readOnly
                                />

                            </div>

                        </div>


                    </div>

                </div>


                {/* =================================================
                    TEACHING COURSES
                ================================================= */}

                <div className="AddTutor-section">

                    <div className="AddTutor-section-header">

                        <div className="AddTutor-section-icon">

                            <i className="fa-solid fa-book-open"></i>

                        </div>


                        <div>

                            <h2>
                                Teaching Courses
                            </h2>

                            <p>
                                Select the courses that this tutor will teach.
                            </p>

                        </div>


                        {formData.language && (

                            <div className="AddTutor-course-count">

                                <strong>
                                    {selectedCourses.length}
                                </strong>

                                <span>

                                    {selectedCourses.length === 1
                                        ? "Course Selected"
                                        : "Courses Selected"
                                    }

                                </span>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        LOADING COURSES
                    ================================================= */}

                    {isLoadingCourses && (

                        <div className="AddTutor-courses-empty">

                            <i className="fa-solid fa-spinner fa-spin"></i>

                            <h3>
                                Loading Courses
                            </h3>

                            <p>
                                Please wait while the available courses are loaded.
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        COURSES
                    ================================================= */}

                    {!isLoadingCourses &&
                        formData.language &&
                        availableCourses.length > 0 && (

                            <div className="AddTutor-courses-grid">

                                {availableCourses.map(
                                    (course) => {

                                        const isSelected =
                                            selectedCourses.includes(
                                                course._id
                                            );


                                        return (

                                            <button
                                                type="button"
                                                className={
                                                    isSelected
                                                        ? "AddTutor-course-card selected"
                                                        : "AddTutor-course-card"
                                                }
                                                key={course._id}
                                                onClick={() =>
                                                    handleCourseSelect(
                                                        course._id
                                                    )
                                                }
                                                disabled={
                                                    teacherAlreadyCreated
                                                }
                                            >

                                                <div className="AddTutor-course-check">

                                                    {isSelected && (

                                                        <i className="fa-solid fa-check"></i>

                                                    )}

                                                </div>


                                                <div className="AddTutor-course-card-icon">

                                                    <i className="fa-solid fa-book-open"></i>

                                                </div>


                                                <div className="AddTutor-course-card-content">

                                                    <span className="AddTutor-course-card-title-label">
                                                        Title
                                                    </span>


                                                    <h3>
                                                        {course.title ||
                                                            course.name ||
                                                            "Untitled Course"
                                                        }
                                                    </h3>


                                                    <div className="AddTutor-course-card-details">

                                                        <div>

                                                            <span>
                                                                Level
                                                            </span>

                                                            <strong>
                                                                {course.level ||
                                                                    "N/A"
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div>

                                                            <span>
                                                                Class Type
                                                            </span>

                                                            <strong>
                                                                {course.classType ||
                                                                    "N/A"
                                                                }
                                                            </strong>

                                                        </div>


                                                        <div>

                                                            <span>
                                                                Start Date
                                                            </span>

                                                            <strong>
                                                                {course.startDate ||
                                                                    "N/A"
                                                                }
                                                            </strong>

                                                        </div>

                                                    </div>

                                                </div>

                                            </button>

                                        );

                                    }
                                )}

                            </div>

                        )}


                    {/* =================================================
                        NO COURSES FOR LANGUAGE
                    ================================================= */}

                    {!isLoadingCourses &&
                        formData.language &&
                        availableCourses.length === 0 && (

                            <div className="AddTutor-courses-empty">

                                <i className="fa-solid fa-book-open"></i>

                                <h3>
                                    No Courses Available
                                </h3>

                                <p>
                                    There are currently no courses available for this teaching language.
                                </p>

                            </div>

                        )}


                    {/* =================================================
                        NO LANGUAGE
                    ================================================= */}

                    {!isLoadingCourses &&
                        !formData.language && (

                            <div className="AddTutor-courses-empty">

                                <i className="fa-solid fa-language"></i>

                                <h3>
                                    Teaching Language Required
                                </h3>

                                <p>
                                    No teaching language was provided by the tutor application.
                                </p>

                            </div>

                        )}

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="AddTutor-actions">

                    <button
                        type="button"
                        className="AddTutor-cancel"
                        onClick={() =>
                            navigate(
                                "/admin/teachers"
                            )
                        }
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="AddTutor-submit"
                        disabled={
                            isSubmitting ||
                            teacherAlreadyCreated
                        }
                    >

                        <i
                            className={
                                teacherAlreadyCreated
                                    ? "fa-solid fa-user-check"
                                    : "fa-solid fa-user-plus"
                            }
                        ></i>


                        {teacherAlreadyCreated
                            ? "Teacher Already Created"
                            : isSubmitting
                                ? "Creating Tutor..."
                                : "Create Tutor"
                        }

                    </button>

                </div>


            </form>

        </div>

    );

}


export default AddTutor;