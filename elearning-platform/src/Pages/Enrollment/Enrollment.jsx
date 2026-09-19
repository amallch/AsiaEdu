import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import "./Enrollment.css";

// =====================================================
// LEVEL COLORS
// =====================================================

const LEVEL_META = {
    Beginner: {
        badgeBg: "#D8F6E9",
        badgeColor: "#0E9E68"
    },

    Intermediate: {
        badgeBg: "#FFE8D6",
        badgeColor: "#E35D1C"
    },

    Advanced: {
        badgeBg: "#E9E3FF",
        badgeColor: "#6D4FDB"
    }
};

// =====================================================
// API
// =====================================================

const SESSIONS_API =
    "https://asiaedu-backend.onrender.com/api/sessions";

const STUDENTS_API =
    "https://asiaedu-backend.onrender.com/api/students";

// =====================================================
// COMPONENT
// =====================================================

function Enrollment() {

    const location = useLocation();

    const navigate = useNavigate();

    const { course } =
        location.state || {};

    const [step, setStep] =
        useState(1);

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const storedUser =
        localStorage.getItem("user");

    const user =
        storedUser
            ? JSON.parse(storedUser)
            : null;

    const userId =
        user?.id || user?._id;

    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] =
        useState({
            fullName: "",
            email: "",
            phone: "",
            phone2: ""
        });

    // =====================================================
    // EXISTING STUDENT STATE
    // =====================================================

    const [isLoadingStudent, setIsLoadingStudent] =
        useState(false);

    // =====================================================
    // SESSION STATE
    // =====================================================

    const [sessionList, setSessionList] =
        useState([]);

    const [selectedSession, setSelectedSession] =
        useState(null);

    const [isLoadingSessions, setIsLoadingSessions] =
        useState(false);

    // =====================================================
    // OTHER STATES
    // =====================================================

    const [errors, setErrors] =
        useState({});

    const [confirmed, setConfirmed] =
        useState(false);

    const [termsAccepted, setTermsAccepted] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [serverError, setServerError] =
        useState("");

    // =====================================================
    // ALREADY ENROLLED MODAL
    // =====================================================

    const [showAlreadyEnrolledModal, setShowAlreadyEnrolledModal] =
        useState(false);

    const [alreadyEnrolledMessage, setAlreadyEnrolledMessage] =
        useState("");

    // =====================================================
    // CHECK COURSE
    // =====================================================

    if (!course) {

        return (
            <section className="Enrollment-empty">

                <div className="Enrollment-empty-content">

                    <div className="Enrollment-empty-icon">

                        <i className="fa-solid fa-calendar-xmark"></i>

                    </div>

                    <h2>
                        No course selected
                    </h2>

                    <p>
                        Please select a course before continuing with enrollment.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/courses")
                        }
                    >
                        Browse Courses
                    </button>

                </div>

            </section>
        );
    }

    // =====================================================
    // LEVEL COLOR
    // =====================================================

    const levelColor =
        LEVEL_META[course.level] ||
        LEVEL_META.Beginner;

    // =====================================================
    // GET COURSE ID
    // =====================================================

    const courseId =
        course._id || course.id;

    // =====================================================
    // FETCH EXISTING STUDENT PROFILE
    // =====================================================

    useEffect(() => {

        if (!userId) {
            return;
        }

        const fetchStudentProfile =
            async () => {

                try {

                    setIsLoadingStudent(true);

                    const response =
                        await fetch(
                            `${STUDENTS_API}/user/${userId}`
                        );

                    if (!response.ok) {

                        return;
                    }

                    const student =
                        await response.json();

                    setFormData({
                        fullName:
                            student.name ||
                            `${user.firstName || ""} ${user.lastName || ""}`.trim(),

                        email:
                            student.email ||
                            user.email ||
                            "",

                        phone:
                            student.phone ||
                            "",

                        phone2:
                            student.phone2 ||
                            ""
                    });

                }
                catch (error) {

                    console.error(
                        "Error fetching student profile:",
                        error
                    );

                    setFormData({
                        fullName:
                            `${user.firstName || ""} ${user.lastName || ""}`.trim(),

                        email:
                            user.email || "",

                        phone: "",

                        phone2: ""
                    });

                }
                finally {

                    setIsLoadingStudent(false);

                }

            };

        fetchStudentProfile();

    }, [userId]);

    // =====================================================
    // FETCH SESSIONS
    // =====================================================

    useEffect(() => {

        if (!courseId) {
            return;
        }

        const fetchSessions =
            async () => {

                try {

                    setIsLoadingSessions(true);

                    setServerError("");

                    const response =
                        await fetch(
                            SESSIONS_API
                        );

                    const data =
                        await response.json();

                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Failed to load sessions."
                        );

                    }

                    const courseSessions =
                        data.filter(
                            (session) => {

                                if (!session.course) {
                                    return false;
                                }

                                return (
                                    String(
                                        session.course._id
                                    ) ===
                                    String(courseId)
                                );
                            }
                        );

                    setSessionList(
                        courseSessions
                    );

                }
                catch (error) {

                    console.error(
                        "Error fetching sessions:",
                        error
                    );

                    setServerError(
                        "Unable to load available sessions."
                    );

                }
                finally {

                    setIsLoadingSessions(false);

                }

            };

        fetchSessions();

    }, [courseId]);

    // =====================================================
    // FORM HANDLER
    // =====================================================

    function handleChange(event) {

        const {
            name,
            value
        } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
        });

        setServerError("");

    }

    // =====================================================
    // SESSION HANDLER
    // =====================================================

    function handleSessionSelect(session) {

        setSelectedSession(
            session
        );

        setServerError("");

    }

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    function validateForm() {

        const newErrors = {};

        // =================================================
        // FULL NAME
        // =================================================

        if (!formData.fullName.trim()) {

            newErrors.fullName =
                "Please enter your full name.";

        }

        // =================================================
        // EMAIL
        // =================================================

        if (!formData.email.trim()) {

            newErrors.email =
                "Please enter your email address.";

        }
        else if (
            !/^\S+@\S+\.\S+$/.test(
                formData.email
            )
        ) {

            newErrors.email =
                "Please enter a valid email address.";

        }

        // =================================================
        // PHONE
        // =================================================

        if (!formData.phone.trim()) {

            newErrors.phone =
                "Please enter your phone number.";

        }

        setErrors(
            newErrors
        );

        return (
            Object.keys(newErrors).length === 0
        );

    }

    // =====================================================
    // NEXT STEP
    // =====================================================

    function handleNext() {

        if (step === 1) {

            if (!selectedSession) {

                setServerError(
                    "Please select a session before continuing."
                );

                return;
            }

            setServerError("");

            setStep(2);

            return;

        }

        if (step === 2) {

            const isValid =
                validateForm();

            if (!isValid) {
                return;
            }

            setStep(3);

        }

    }

    // =====================================================
    // PREVIOUS STEP
    // =====================================================

    function handleBack() {

        if (step > 1) {

            setStep(
                step - 1
            );

        }

    }

    // =====================================================
    // CONFIRM ENROLLMENT
    // =====================================================

    async function handleConfirm() {

        // =================================================
        // CHECK TERMS
        // =================================================

        if (!termsAccepted) {
            return;
        }

        // =================================================
        // CLEAR OLD ERROR
        // =================================================

        setServerError("");

        // =================================================
        // CHECK USER
        // =================================================

        if (!userId) {

            setServerError(
                "You must be logged in before enrolling in a course."
            );

            console.log(
                "User ID not found in localStorage."
            );

            return;
        }

        // =================================================
        // CHECK COURSE
        // =================================================

        if (!courseId) {

            setServerError(
                "Course information is missing."
            );

            console.log(
                "Course ID not found."
            );

            return;
        }

        // =================================================
        // CHECK SESSION
        // =================================================

        if (!selectedSession) {

            setServerError(
                "Please select a session."
            );

            return;
        }

        // =================================================
        // CHECK SESSION CAPACITY
        // =================================================

        if (
            selectedSession.isFull ||
            selectedSession.available <= 0
        ) {

            setServerError(
                "This session is full. Please choose another session."
            );

            return;
        }

        try {

            setIsSubmitting(true);

            // =================================================
            // PREPARE ENROLLMENT DATA
            // =================================================

            const enrollmentData = {

                userId:
                    userId,

                fullName:
                    formData.fullName.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim(),

                phone2:
                    formData.phone2.trim(),

                courseId:
                    courseId,

                sessionId:
                    selectedSession._id

            };

            console.log(
                "Sending enrollment:",
                enrollmentData
            );

            // =================================================
            // SEND TO BACKEND
            // =================================================

            const response =
                await fetch(
                    "https://asiaedu-backend.onrender.com/api/enrollments",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                enrollmentData
                            )
                    }
                );

            // =================================================
            // READ RESPONSE
            // =================================================

            const data =
                await response.json();

            console.log(
                "Enrollment response:",
                data
            );

            // =================================================
            // HANDLE ERROR
            // =================================================

            if (!response.ok) {

                const message =
                    data.message ||
                    "Failed to create enrollment.";

                // =================================================
                // ALREADY ENROLLED
                // =================================================

                if (
                    message
                        .toLowerCase()
                        .includes("already enrolled")
                ) {

                    setAlreadyEnrolledMessage(
                        message
                    );

                    setShowAlreadyEnrolledModal(
                        true
                    );

                    setServerError("");

                    return;

                }

                // =================================================
                // OTHER ERROR
                // =================================================

                setServerError(
                    message
                );

                console.log(
                    "Enrollment error:",
                    data
                );

                return;

            }

            // =================================================
            // SUCCESS
            // =================================================

            console.log(
                "Enrollment created successfully:",
                data
            );

            setConfirmed(
                true
            );

        }
        catch (error) {

            console.log(
                "Server error:",
                error
            );

            setServerError(
                "Unable to connect to the server. Please try again."
            );

        }
        finally {

            setIsSubmitting(
                false
            );

        }

    }

    // =====================================================
    // SUCCESS PAGE
    // =====================================================

    if (confirmed) {

        return (

            <>

                <section className="Enrollment-success">

                    <div className="Enrollment-success-container">

                        <div className="Enrollment-success-icon">

                            <i className="fa-solid fa-check"></i>

                        </div>

                        <span className="Enrollment-success-label">
                            Enrollment Successful
                        </span>

                        <h2>
                            You're officially enrolled!
                        </h2>

                        <p className="Enrollment-success-description">
                            Thank you for enrolling. We look forward to seeing you in class.
                        </p>

                        <div className="Enrollment-success-card">

                            <div className="Enrollment-success-card-top">

                                <div>

                                    <span>
                                        COURSE
                                    </span>

                                    <h3>
                                        {course.title}
                                    </h3>

                                </div>

                                <div className="Enrollment-success-card-price">

                                    {course.price} DA

                                </div>

                                <div className="Enrollment-success-check">

                                    <i className="fa-solid fa-check"></i>

                                </div>

                            </div>

                            <div className="Enrollment-success-info">

                                <div>

                                    <span>
                                        Instructor
                                    </span>

                                    <strong>

                                        {selectedSession &&
                                        selectedSession.instructor
                                            ? selectedSession.instructor.name
                                            : "-"}

                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Session
                                    </span>

                                    <strong>

                                        {selectedSession
                                            ? selectedSession.group
                                            : "-"}

                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Start Date
                                    </span>

                                    <strong>

                                        {selectedSession
                                            ? selectedSession.startDate
                                            : "-"}

                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Programme
                                    </span>

                                    <strong>

                                        {selectedSession &&
                                        selectedSession.programType
                                            ? selectedSession.programType === "Normal"
                                                ? "Normal Programme"
                                                : "Summer Camp"
                                            : "-"}

                                    </strong>

                                </div>

                            </div>

                        </div>

                        <button
                            className="Enrollment-button"
                            onClick={() =>
                                navigate("/courses")
                            }
                        >

                            Browse More Courses

                            <i className="fa-solid fa-arrow-right"></i>

                        </button>

                    </div>

                </section>

            </>

        );

    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <>

            <section className="Enrollment">

                <div className="Enrollment-container">

                    {/* =================================================
                        STEPS
                    ================================================= */}

                    <div className="Enrollment-steps">

                        {/* STEP 1 */}

                        <div
                            className={
                                `Enrollment-step ${
                                    step >= 1
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <div className="Enrollment-step-number">

                                {step > 1 && (
                                    <i className="fa-solid fa-check"></i>
                                )}

                                {step <= 1 && "1"}

                            </div>

                            <span>
                                Review
                            </span>

                        </div>

                        <div
                            className={
                                `Enrollment-step-line ${
                                    step >= 2
                                        ? "active"
                                        : ""
                                }`
                            }
                        >
                        </div>

                        {/* STEP 2 */}

                        <div
                            className={
                                `Enrollment-step ${
                                    step >= 2
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <div className="Enrollment-step-number">

                                {step > 2 && (
                                    <i className="fa-solid fa-check"></i>
                                )}

                                {step <= 2 && "2"}

                            </div>

                            <span>
                                Your Info
                            </span>

                        </div>

                        <div
                            className={
                                `Enrollment-step-line ${
                                    step >= 3
                                        ? "active"
                                        : ""
                                }`
                            }
                        >
                        </div>

                        {/* STEP 3 */}

                        <div
                            className={
                                `Enrollment-step ${
                                    step >= 3
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <div className="Enrollment-step-number">
                                3
                            </div>

                            <span>
                                Confirm
                            </span>

                        </div>

                    </div>

                    {/* =================================================
                        MAIN PANEL
                    ================================================= */}

                    <div className="Enrollment-panel">

                        {/* =================================================
                            STEP 1
                        ================================================= */}

                        {step === 1 && (

                            <div className="Enrollment-content">

                                <div className="Enrollment-heading">

                                    <span className="Enrollment-section-label">
                                        Step 01
                                    </span>

                                    <h2>
                                        Review your course
                                    </h2>

                                    <p>
                                        Choose the session you want to join before continuing.
                                    </p>

                                </div>

                                {/* COURSE HEADER */}

                                <div className="Enrollment-item-header">

                                    <div className="Enrollment-item-header-content">

                                        <div className="Enrollment-badges">

                                            <span
                                                className="Enrollment-badge"
                                                style={{
                                                    backgroundColor:
                                                        levelColor.badgeBg,

                                                    color:
                                                        levelColor.badgeColor
                                                }}
                                            >
                                                {course.level}
                                            </span>

                                            <span className="Enrollment-badge neutral">
                                                {course.language}
                                            </span>

                                        </div>

                                        <h3 className="Enrollment-title">
                                            {course.title}
                                        </h3>

                                    </div>

                                </div>

                                {/* SESSION SELECTION */}

                                <div className="Enrollment-program">

                                    <div className="Enrollment-program-header">

                                        <div>

                                            <span className="Enrollment-program-label">
                                                Available Sessions
                                            </span>

                                            <p>
                                                Select the group and schedule you want to join.
                                            </p>

                                        </div>

                                    </div>

                                    {isLoadingSessions && (

                                        <div className="Enrollment-session-loading">

                                            <i className="fa-solid fa-spinner fa-spin"></i>

                                            <span>
                                                Loading available sessions...
                                            </span>

                                        </div>

                                    )}

                                    {!isLoadingSessions &&
                                    sessionList.length === 0 && (

                                        <div className="Enrollment-session-loading">

                                            <i className="fa-solid fa-calendar-xmark"></i>

                                            <span>
                                                No sessions are currently available for this course.
                                            </span>

                                        </div>

                                    )}

                                    {!isLoadingSessions &&
                                    sessionList.length > 0 && (

                                        <div className="Enrollment-program-options">

                                            {sessionList.map(
                                                (session) => {

                                                    const isSelected =
                                                        selectedSession &&
                                                        String(
                                                            selectedSession._id
                                                        ) ===
                                                        String(
                                                            session._id
                                                        );

                                                    const isFull =
                                                        session.isFull ||
                                                        session.available <= 0;

                                                    return (

                                                        <button
                                                            key={
                                                                session._id
                                                            }

                                                            type="button"

                                                            className={
                                                                `Enrollment-program-option ${
                                                                    isSelected
                                                                        ? "active"
                                                                        : ""
                                                                }`
                                                            }

                                                            onClick={() => {

                                                                if (!isFull) {

                                                                    handleSessionSelect(
                                                                        session
                                                                    );

                                                                }

                                                            }}

                                                            disabled={
                                                                isFull
                                                            }
                                                        >

                                                            <div className="Enrollment-program-option-icon">

                                                                <i className="fa-solid fa-users"></i>

                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {session.group}
                                                                </strong>

                                                                <span>
                                                                    Instructor:{" "}
                                                                    {session.instructor &&
                                                                    session.instructor.name
                                                                        ? session.instructor.name
                                                                        : "Not assigned"}
                                                                </span>

                                                                <span>
                                                                    Starts:{" "}
                                                                    {session.startDate}
                                                                </span>

                                                                <span>
                                                                    {session.programType}
                                                                </span>

                                                                <span>
                                                                    Available Seats:{" "}
                                                                    {session.available}
                                                                </span>

                                                            </div>

                                                            <div className="Enrollment-program-radio">

                                                                {isSelected && (

                                                                    <i className="fa-solid fa-check"></i>

                                                                )}

                                                            </div>

                                                        </button>

                                                    );

                                                }
                                            )}

                                        </div>

                                    )}

                                </div>

                                {/* SELECTED SESSION DETAILS */}

                                {selectedSession && (

                                    <div className="Enrollment-details">

                                        <div className="Enrollment-detail">

                                            <div className="Enrollment-detail-icon">

                                                <i className="fa-solid fa-users"></i>

                                            </div>

                                            <div>

                                                <span>
                                                    Session
                                                </span>

                                                <strong>
                                                    {selectedSession.group}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="Enrollment-detail">

                                            <div className="Enrollment-detail-icon">

                                                <i className="fa-regular fa-calendar"></i>

                                            </div>

                                            <div>

                                                <span>
                                                    Start Date
                                                </span>

                                                <strong>
                                                    {selectedSession.startDate}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="Enrollment-detail">

                                            <div className="Enrollment-detail-icon">

                                                <i className="fa-solid fa-user"></i>

                                            </div>

                                            <div>

                                                <span>
                                                    Instructor
                                                </span>

                                                <strong>

                                                    {selectedSession.instructor &&
                                                    selectedSession.instructor.name
                                                        ? selectedSession.instructor.name
                                                        : "Not assigned"}

                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                )}

                                {/* DATE + PRICE */}

                                <div className="Enrollment-bottom">

                                    <div className="Enrollment-date">

                                        <div className="Enrollment-date-icon">

                                            <i className="fa-regular fa-calendar"></i>

                                        </div>

                                        <div>

                                            <span>
                                                Starts
                                            </span>

                                            <strong>

                                                {selectedSession
                                                    ? selectedSession.startDate
                                                    : "Select a session"}

                                            </strong>

                                        </div>

                                    </div>

                                    <div className="Enrollment-price-wrapper">

                                        <span>
                                            Total
                                        </span>

                                        <div className="Enrollment-price">

                                            {course.price} DA

                                        </div>

                                    </div>

                                </div>

                                {/* SERVER ERROR */}

                                {serverError && (

                                    <div className="Enrollment-error">
                                        {serverError}
                                    </div>

                                )}

                                {/* ACTION */}

                                <div className="Enrollment-actions">

                                    <button
                                        className={
                                            `Enrollment-button ${
                                                !selectedSession
                                                    ? "Enrollment-button-disabled"
                                                    : ""
                                            }`
                                        }

                                        onClick={
                                            handleNext
                                        }

                                        disabled={
                                            !selectedSession
                                        }
                                    >

                                        Continue

                                        <i className="fa-solid fa-arrow-right"></i>

                                    </button>

                                </div>

                            </div>

                        )}

                        {/* =================================================
                            STEP 2
                        ================================================= */}

                        {step === 2 && (

                            <div className="Enrollment-content">

                                <div className="Enrollment-heading">

                                    <span className="Enrollment-section-label">
                                        Step 02
                                    </span>

                                    <h2>
                                        Your information
                                    </h2>

                                    <p>
                                        Enter your details so we can confirm your enrollment.
                                    </p>

                                </div>

                                {isLoadingStudent && (

                                    <div className="Enrollment-session-loading">

                                        <i className="fa-solid fa-spinner fa-spin"></i>

                                        <span>
                                            Loading your information...
                                        </span>

                                    </div>

                                )}

                                <div className="Enrollment-form">

                                    {/* FULL NAME */}

                                    <div className="Enrollment-field">

                                        <label htmlFor="fullName">
                                            Full Name
                                        </label>

                                        <div className="Enrollment-input-wrapper">

                                            <i className="fa-regular fa-user"></i>

                                            <input
                                                id="fullName"
                                                type="text"
                                                name="fullName"
                                                value={
                                                    formData.fullName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter your full name"
                                            />

                                        </div>

                                        {errors.fullName && (

                                            <span className="Enrollment-error">
                                                {errors.fullName}
                                            </span>

                                        )}

                                    </div>

                                    {/* EMAIL */}

                                    <div className="Enrollment-field">

                                        <label htmlFor="email">
                                            Email Address
                                        </label>

                                        <div className="Enrollment-input-wrapper">

                                            <i className="fa-regular fa-envelope"></i>

                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={
                                                    formData.email
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter your email address"
                                            />

                                        </div>

                                        {errors.email && (

                                            <span className="Enrollment-error">
                                                {errors.email}
                                            </span>

                                        )}

                                    </div>

                                    {/* PHONE */}

                                    <div className="Enrollment-field">

                                        <label htmlFor="phone">
                                            Phone Number
                                        </label>

                                        <div className="Enrollment-input-wrapper">

                                            <i className="fa-solid fa-phone"></i>

                                            <input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                value={
                                                    formData.phone
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter your phone number"
                                            />

                                        </div>

                                        {errors.phone && (

                                            <span className="Enrollment-error">
                                                {errors.phone}
                                            </span>

                                        )}

                                    </div>

                                    {/* PHONE 2 */}

                                    <div className="Enrollment-field">

                                        <label htmlFor="phone2">

                                            Phone Number 2

                                            <span>
                                                Optional
                                            </span>

                                        </label>

                                        <div className="Enrollment-input-wrapper">

                                            <i className="fa-solid fa-phone"></i>

                                            <input
                                                id="phone2"
                                                type="tel"
                                                name="phone2"
                                                value={
                                                    formData.phone2
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter a second phone number"
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* ACTIONS */}

                                <div className="Enrollment-actions Enrollment-actions-between">

                                    <button
                                        className="Enrollment-button Enrollment-button-outline"
                                        onClick={
                                            handleBack
                                        }
                                    >

                                        <i className="fa-solid fa-arrow-left"></i>

                                        Back

                                    </button>

                                    <button
                                        className="Enrollment-button"
                                        onClick={
                                            handleNext
                                        }
                                    >

                                        Review Registration

                                        <i className="fa-solid fa-arrow-right"></i>

                                    </button>

                                </div>

                            </div>

                        )}

                        {/* =================================================
                            STEP 3
                        ================================================= */}

                        {step === 3 && (

                            <div className="Enrollment-content">

                                <div className="Enrollment-heading">

                                    <span className="Enrollment-section-label">
                                        Step 03
                                    </span>

                                    <h2>
                                        Confirm your enrollment
                                    </h2>

                                    <p>
                                        Review your registration details before confirming.
                                    </p>

                                </div>

                                {/* COURSE SUMMARY */}

                                <div className="Enrollment-summary">

                                    <div className="Enrollment-summary-header">

                                        <div>

                                            <span>
                                                COURSE SUMMARY
                                            </span>

                                            <h3>
                                                {course.title}
                                            </h3>

                                        </div>

                                        <div className="Enrollment-summary-price">

                                            {course.price} DA

                                        </div>

                                    </div>

                                    <div className="Enrollment-summary-grid">

                                        <div>

                                            <span>
                                                Instructor
                                            </span>

                                            <strong>

                                                {selectedSession &&
                                                selectedSession.instructor
                                                    ? selectedSession.instructor.name
                                                    : "-"}

                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Session
                                            </span>

                                            <strong>

                                                {selectedSession
                                                    ? selectedSession.group
                                                    : "-"}

                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Language
                                            </span>

                                            <strong>
                                                {course.language}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Level
                                            </span>

                                            <strong>
                                                {course.level}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Duration
                                            </span>

                                            <strong>
                                                {course.duration}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Start Date
                                            </span>

                                            <strong>

                                                {selectedSession
                                                    ? selectedSession.startDate
                                                    : "-"}

                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Programme
                                            </span>

                                            <strong>

                                                {selectedSession &&
                                                selectedSession.programType
                                                    ? selectedSession.programType === "Normal"
                                                        ? "Normal Programme"
                                                        : "Summer Camp"
                                                    : "-"}

                                            </strong>

                                        </div>

                                    </div>

                                </div>

                                {/* USER SUMMARY */}

                                <div className="Enrollment-user-summary">

                                    <div className="Enrollment-user-summary-header">

                                        <h3>
                                            Your Information
                                        </h3>

                                        <button
                                            onClick={() =>
                                                setStep(2)
                                            }
                                        >
                                            Edit
                                        </button>

                                    </div>

                                    <div className="Enrollment-user-grid">

                                        <div>

                                            <span>
                                                Full Name
                                            </span>

                                            <strong>
                                                {formData.fullName}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Email
                                            </span>

                                            <strong>
                                                {formData.email}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Phone
                                            </span>

                                            <strong>
                                                {formData.phone}
                                            </strong>

                                        </div>

                                        {formData.phone2 && (

                                            <div>

                                                <span>
                                                    Phone Number 2
                                                </span>

                                                <strong>
                                                    {formData.phone2}
                                                </strong>

                                            </div>

                                        )}

                                    </div>

                                </div>

                                {/* TERMS */}

                                <div className="Enrollment-terms">

                                    <label>

                                        <input
                                            type="checkbox"
                                            checked={
                                                termsAccepted
                                            }
                                            onChange={(event) =>
                                                setTermsAccepted(
                                                    event.target.checked
                                                )
                                            }
                                        />

                                        <span>
                                            I agree to the terms and conditions and confirm that the information provided is correct.
                                        </span>

                                    </label>

                                </div>

                                {/* SERVER ERROR */}

                                {serverError && (

                                    <div className="Enrollment-error">
                                        {serverError}
                                    </div>

                                )}

                                {/* ACTIONS */}

                                <div className="Enrollment-actions Enrollment-actions-between">

                                    <button
                                        className="Enrollment-button Enrollment-button-outline"
                                        onClick={
                                            handleBack
                                        }
                                        disabled={
                                            isSubmitting
                                        }
                                    >

                                        <i className="fa-solid fa-arrow-left"></i>

                                        Back

                                    </button>

                                    <button
                                        className={
                                            `Enrollment-button ${
                                                !termsAccepted
                                                    ? "Enrollment-button-disabled"
                                                    : ""
                                            }`
                                        }
                                        onClick={
                                            handleConfirm
                                        }
                                        disabled={
                                            !termsAccepted ||
                                            isSubmitting
                                        }
                                    >

                                        {isSubmitting && (

                                            <i className="fa-solid fa-spinner fa-spin"></i>

                                        )}

                                        {!isSubmitting && (

                                            <span>
                                                Confirm Enrollment
                                            </span>

                                        )}

                                        {isSubmitting && (

                                            <span>
                                                Submitting...
                                            </span>

                                        )}

                                        {!isSubmitting && (

                                            <i className="fa-solid fa-check"></i>

                                        )}

                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </section>

            {/* =====================================================
                ALREADY ENROLLED MODAL
            ===================================================== */}

            {showAlreadyEnrolledModal && (

                <div
                    className="Enrollment-modal-overlay"
                    onClick={() =>
                        setShowAlreadyEnrolledModal(false)
                    }
                >

                    <div
                        className="Enrollment-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="Enrollment-modal-icon">

                            <i className="fa-solid fa-circle-exclamation"></i>

                        </div>

                        <h2>
                            Already Enrolled
                        </h2>

                        <p>
                            {alreadyEnrolledMessage ||
                                "You are already enrolled in this course. You cannot enroll again in another session of the same course."}
                        </p>

                        <div className="Enrollment-modal-course">

                            <span>
                                Course
                            </span>

                            <strong>
                                {course.title}
                            </strong>

                        </div>

                        <div className="Enrollment-modal-actions">

                            <button
                                type="button"
                                className="Enrollment-modal-button Enrollment-modal-button-outline"
                                onClick={() =>
                                    navigate("/courses")
                                }
                            >
                                Browse Courses
                            </button>

                            <button
                                type="button"
                                className="Enrollment-modal-button"
                                onClick={() => {

                                    setShowAlreadyEnrolledModal(
                                        false
                                    );

                                }}
                            >
                                OK
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>

    );

}

export default Enrollment;