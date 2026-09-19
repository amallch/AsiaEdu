import "./StudentDetails.css";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";


function StudentDetails() {

    const navigate = useNavigate();

    const { studentId } = useParams();


    const [student, setStudent] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [changingEnrollmentId, setChangingEnrollmentId] =
        useState(null);


    /* =====================================================
       GET STUDENT FROM BACKEND
    ===================================================== */

    const fetchStudent = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `http://localhost:5000/api/students/${studentId}`
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch student"
                );

            }


            const data = await response.json();


            setStudent(data);

            setError("");

        } catch (error) {

            console.error(error);

            setError(
                "Failed to load student information."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchStudent();

    }, [studentId]);


    /* =====================================================
       CHANGE COURSE STATUS
    ===================================================== */

    const handleCourseStatusChange = async (
        enrollmentId,
        currentStatus
    ) => {

        if (!enrollmentId) {

            alert(
                "This course does not have a valid enrollment ID."
            );

            return;

        }


        const newStatus =
            currentStatus === "Active"
                ? "Inactive"
                : "Active";


        try {

            setChangingEnrollmentId(
                enrollmentId
            );


            const response = await fetch(
                `http://localhost:5000/api/enrollments/${enrollmentId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        enrollmentStatus:
                            newStatus
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update course status."
                );

            }


            // Refresh student information
            await fetchStudent();

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Failed to update course status."
            );

        } finally {

            setChangingEnrollmentId(
                null
            );

        }

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="StudentDetails-empty">

                <i className="fa-solid fa-spinner fa-spin"></i>

                <h2>
                    Loading student...
                </h2>

                <p>
                    Please wait while the student information is loaded.
                </p>

            </div>

        );

    }


    /* =====================================================
       STUDENT NOT FOUND / ERROR
    ===================================================== */

    if (!student || error) {

        return (

            <div className="StudentDetails-empty">

                <i className="fa-solid fa-user-slash"></i>

                <h2>
                    Student not found
                </h2>

                <p>
                    {error ||
                        "The student information could not be found."
                    }
                </p>

                <button
                    onClick={() =>
                        navigate("/admin/students")
                    }
                >

                    <i className="fa-solid fa-arrow-left"></i>

                    Back to Students

                </button>

            </div>

        );

    }


    return (

        <div className="StudentDetails">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="StudentDetails-header">

                <div>

                    <button
                        className="StudentDetails-back"
                        onClick={() =>
                            navigate("/admin/students")
                        }
                    >

                        <i className="fa-solid fa-arrow-left"></i>

                        <span>
                            Back to Students
                        </span>

                    </button>


                    <span className="StudentDetails-label">
                        Student Management
                    </span>


                    <h1>
                        {student.name}
                    </h1>


                    <p>
                        View student information and enrolled courses.
                    </p>

                </div>

            </div>


            {/* =================================================
                STUDENT INFORMATION
            ================================================= */}

            <div className="StudentDetails-section">

                <div className="StudentDetails-section-header">

                    <div>

                        <h2>
                            Student Information
                        </h2>

                        <p>
                            Personal information of the student.
                        </p>

                    </div>

                </div>


                <div className="StudentDetails-info-grid">


                    {/* FULL NAME */}

                    <div className="StudentDetails-info-item">

                        <div className="StudentDetails-info-icon">

                            <i className="fa-solid fa-user"></i>

                        </div>

                        <div>

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {student.name}
                            </strong>

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="StudentDetails-info-item">

                        <div className="StudentDetails-info-icon">

                            <i className="fa-solid fa-envelope"></i>

                        </div>

                        <div>

                            <span>
                                Email
                            </span>

                            <strong>
                                {student.email}
                            </strong>

                        </div>

                    </div>


                    {/* PHONE */}

                    <div className="StudentDetails-info-item">

                        <div className="StudentDetails-info-icon">

                            <i className="fa-solid fa-phone"></i>

                        </div>

                        <div>

                            <span>
                                Phone
                            </span>

                            <strong>
                                {student.phone}
                            </strong>

                        </div>

                    </div>


                    {/* SECONDARY PHONE */}

                    <div className="StudentDetails-info-item">

                        <div className="StudentDetails-info-icon">

                            <i className="fa-solid fa-mobile-screen"></i>

                        </div>

                        <div>

                            <span>
                                Secondary Phone
                            </span>

                            <strong>
                                {student.phone2 || "Not provided"}
                            </strong>

                        </div>

                    </div>


                </div>

            </div>


            {/* =================================================
                ENROLLED COURSES
            ================================================= */}

            <div className="StudentDetails-section">

                <div className="StudentDetails-section-header">

                    <div>

                        <h2>
                            Enrolled Courses
                        </h2>

                        <p>
                            Courses currently associated with this student.
                        </p>

                    </div>


                    <div className="StudentDetails-course-count">

                        <strong>
                            {student.courses?.length || 0}
                        </strong>

                        <span>
                            {student.courses?.length === 1
                                ? "Course"
                                : "Courses"
                            }
                        </span>

                    </div>

                </div>


                {/* =================================================
                    NO COURSES
                ================================================= */}

                {(!student.courses ||
                    student.courses.length === 0) && (

                    <div className="StudentDetails-empty">

                        <i className="fa-solid fa-book-open"></i>

                        <h2>
                            No enrolled courses
                        </h2>

                        <p>
                            This student has no enrolled courses yet.
                        </p>

                    </div>

                )}


                {/* =================================================
                    COURSE CARDS
                ================================================= */}

                {student.courses?.map((course) => {

                    const courseEnrollmentDate =
                        course.createdAt
                            ? new Date(
                                course.createdAt
                            ).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                }
                            )
                            : "N/A";


                    const isChanging =
                        changingEnrollmentId ===
                        course.enrollmentId;


                    const isActive =
                        course.status === "Active";


                    return (

                        <div
                            className="StudentDetails-course-card"
                            key={course._id}
                        >


                            {/* =================================================
                                COURSE HEADER
                            ================================================= */}

                            <div className="StudentDetails-course-header">

                                <div className="StudentDetails-course-title-wrapper">

                                    <div className="StudentDetails-course-icon">

                                        <i className="fa-solid fa-book-open"></i>

                                    </div>


                                    <div>

                                        <span className="StudentDetails-course-label">
                                            Course
                                        </span>

                                        <h3>
                                            {course.name}
                                        </h3>

                                        <p>
                                            {course.language} · {course.level}
                                        </p>

                                    </div>

                                </div>


                                <div className="StudentDetails-course-actions">

                                    <span
                                        className={
                                            course.status === "Active"
                                                ? "StudentDetails-status active"
                                                : course.status === "Pending"
                                                    ? "StudentDetails-status pending"
                                                    : "StudentDetails-status inactive"
                                        }
                                    >

                                        <span className="StudentDetails-status-dot"></span>

                                        {course.status}

                                    </span>


                                    {course.status !== "Pending" && (

                                        <button
                                            className={
                                                isActive
                                                    ? "StudentDetails-course-action deactivate"
                                                    : "StudentDetails-course-action activate"
                                            }
                                            onClick={() =>
                                                handleCourseStatusChange(
                                                    course.enrollmentId,
                                                    course.status
                                                )
                                            }
                                            disabled={isChanging}
                                        >

                                            {isChanging ? (

                                                <>

                                                    <i className="fa-solid fa-spinner fa-spin"></i>

                                                    Updating...

                                                </>

                                            ) : (

                                                <>

                                                    <i
                                                        className={
                                                            isActive
                                                                ? "fa-solid fa-pause"
                                                                : "fa-solid fa-play"
                                                        }
                                                    ></i>

                                                    {isActive
                                                        ? "Deactivate"
                                                        : "Activate"
                                                    }

                                                </>

                                            )}

                                        </button>

                                    )}

                                </div>

                            </div>


                            {/* =================================================
                                COURSE INFORMATION
                            ================================================= */}

                            <div className="StudentDetails-course-info-grid">


                                {/* LANGUAGE */}

                                <div className="StudentDetails-course-info-item">

                                    <span>
                                        Language
                                    </span>

                                    <strong>
                                        {course.language}
                                    </strong>

                                </div>


                                {/* LEVEL */}

                                <div className="StudentDetails-course-info-item">

                                    <span>
                                        Level
                                    </span>

                                    <strong>
                                        {course.level}
                                    </strong>

                                </div>


                                {/* SESSION */}

                                <div className="StudentDetails-course-info-item">

                                    <span>
                                        Session
                                    </span>

                                    <strong>
                                        {course.session || "N/A"}
                                    </strong>

                                </div>


                                {/* TEACHER */}

                                <div className="StudentDetails-course-info-item">

                                    <span>
                                        Teacher
                                    </span>

                                    <strong>
                                        {course.teacher}
                                    </strong>

                                </div>


                                {/* START DATE */}

                                <div className="StudentDetails-course-info-item">

                                    <span>
                                        Start Date
                                    </span>

                                    <strong>
                                        {course.startDate}
                                    </strong>

                                </div>


                                {/* DURATION */}

                                <div className="StudentDetails-course-info-item">

                                    <span>
                                        Duration
                                    </span>

                                    <strong>
                                        {course.duration}
                                    </strong>

                                </div>


                                {/* PRICE */}

                                <div className="StudentDetails-course-info-item">

                                    <span>
                                        Price
                                    </span>

                                    <strong>
                                        {course.price?.toLocaleString()} DA
                                    </strong>

                                </div>


                                {/* PROGRAM TYPE */}

                                <div className="StudentDetails-course-info-item">

                                    <span>
                                        Program Type
                                    </span>

                                    <strong>
                                        {course.programType}
                                    </strong>

                                </div>


                            </div>


                            {/* =================================================
                                ENROLLMENT INFORMATION
                            ================================================= */}

                            <div className="StudentDetails-enrollment">


                                {/* ENROLLMENT DATE */}

                                <div className="StudentDetails-enrollment-item">

                                    <i className="fa-regular fa-calendar-plus"></i>

                                    <div>

                                        <span>
                                            Enrollment Date
                                        </span>

                                        <strong>
                                            {courseEnrollmentDate}
                                        </strong>

                                    </div>

                                </div>


                                {/* ENROLLMENT ID */}

                                <div className="StudentDetails-enrollment-item">

                                    <i className="fa-solid fa-fingerprint"></i>

                                    <div>

                                        <span>
                                            Enrollment ID
                                        </span>

                                        <strong>
                                            {course.enrollmentId}
                                        </strong>

                                    </div>

                                </div>


                                {/* COURSE ID */}

                                <div className="StudentDetails-enrollment-item">

                                    <i className="fa-solid fa-book"></i>

                                    <div>

                                        <span>
                                            Course ID
                                        </span>

                                        <strong>
                                            {course.courseId}
                                        </strong>

                                    </div>

                                </div>


                            </div>

                        </div>

                    );

                })}

            </div>


        </div>

    );

}


export default StudentDetails;