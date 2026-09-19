import "./Assignments.css";

import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";


/* =====================================================
   COMPONENT
===================================================== */

function Assignments() {

    const navigate =
        useNavigate();


    /* =====================================================
       USER / STUDENT
    ===================================================== */

    const [student, setStudent] =
        useState(null);


    /* =====================================================
       COURSES
    ===================================================== */

    const [courses, setCourses] =
        useState([]);


    const [selectedCourseId, setSelectedCourseId] =
        useState("");


    /* =====================================================
       ASSIGNMENTS
    ===================================================== */

    const [assignments, setAssignments] =
        useState([]);


    /* =====================================================
       SUBMISSIONS
    ===================================================== */

    const [submissions, setSubmissions] =
        useState([]);


    /* =====================================================
       UI STATE
    ===================================================== */

    const [activeFilter, setActiveFilter] =
        useState("All Assignments");


    /* =====================================================
       LOADING / ERROR
    ===================================================== */

    const [isLoading, setIsLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    /* =====================================================
       LOAD ASSIGNMENTS
    ===================================================== */

    useEffect(() => {

        loadAssignments();

    }, []);


    /* =====================================================
       GET SESSION NAME
    ===================================================== */

    function getSessionName(session) {

        if (!session) {
            return "";
        }


        if (typeof session === "string") {
            return session;
        }


        return (
            session.name ||
            session.group ||
            ""
        );

    }


    /* =====================================================
       LOAD STUDENT DATA
    ===================================================== */

    async function loadAssignments() {

        try {

            setIsLoading(true);

            setError("");


            /* =============================================
               GET USER FROM LOCAL STORAGE
            ============================================= */

            const storedUser =
                localStorage.getItem("user");


            if (!storedUser) {

                setError(
                    "You must be logged in to view your assignments."
                );

                setIsLoading(false);

                return;
            }


            const user =
                JSON.parse(storedUser);


            const userId =
                user.id ||
                user._id;


            if (!userId) {

                setError(
                    "User ID could not be found."
                );

                setIsLoading(false);

                return;
            }


            /* =============================================
               GET STUDENT USING USER ID
            ============================================= */

            const studentResponse =
                await fetch(
                    `https://asiaedu-backend.onrender.com/api/students/user/${userId}`
                );


            const studentData =
                await studentResponse.json();


            if (!studentResponse.ok) {

                throw new Error(
                    studentData.message ||
                    "Failed to get student information."
                );

            }


            const currentStudent =
                studentData.student ||
                studentData;


            setStudent(
                currentStudent
            );


            /* =============================================
               GET STUDENT COURSES
            ============================================= */

            const studentCourses =
                currentStudent.courses || [];


            /* =============================================
               CREATE COURSE LIST
            ============================================= */

            const courseMap =
                new Map();


            studentCourses.forEach(
                (course) => {

                    if (!course.courseId) {
                        return;
                    }


                    const courseId =
                        course.courseId._id ||
                        course.courseId;


                    if (!courseMap.has(courseId)) {

                        const session =
                            getSessionName(
                                course.session
                            );


                        courseMap.set(
                            courseId,
                            {
                                id: courseId,

                                name:
                                    course.name ||
                                    course.courseId?.title ||
                                    course.courseId?.name ||
                                    "Course",

                                language:
                                    course.language ||
                                    course.courseId?.language ||
                                    "",

                                level:
                                    course.level ||
                                    course.courseId?.level ||
                                    "",

                                instructor:
                                    course.teacher ||
                                    "Teacher",

                                session:
                                    session,

                                code:
                                    getCourseCode(
                                        course.language ||
                                        course.courseId?.language
                                    )
                            }
                        );

                    }

                }
            );


            /* =============================================
               GET ASSIGNMENTS
            ============================================= */

            const assignmentsResponse =
                await fetch(
                    `https://asiaedu-backend.onrender.com/api/assignments/student/${currentStudent._id}`
                );


            const assignmentsData =
                await assignmentsResponse.json();


            if (!assignmentsResponse.ok) {

                throw new Error(
                    assignmentsData.message ||
                    "Failed to get assignments."
                );

            }


            const backendAssignments =
                assignmentsData.assignments || [];


            /* =============================================
               ADD COURSES FROM ASSIGNMENTS
            ============================================= */

            backendAssignments.forEach(
                (assignment) => {

                    if (
                        !assignment.course ||
                        !assignment.course._id
                    ) {
                        return;
                    }


                    const course =
                        assignment.course;


                    const courseId =
                        course._id.toString();


                    if (!courseMap.has(courseId)) {

                        const session =
                            getSessionName(
                                assignment.session
                            );


                        courseMap.set(
                            courseId,
                            {
                                id: courseId,

                                name:
                                    course.title ||
                                    course.name ||
                                    "Course",

                                language:
                                    course.language ||
                                    "",

                                level:
                                    course.level ||
                                    "",

                                instructor:
                                    assignment.teacher?.name ||
                                    "Teacher",

                                session:
                                    session,

                                code:
                                    getCourseCode(
                                        course.language
                                    )
                            }
                        );

                    }

                }
            );


            const realCourses =
                Array.from(
                    courseMap.values()
                );


            setCourses(
                realCourses
            );


            /* =============================================
               GET STUDENT SUBMISSIONS
            ============================================= */

            const submissionsResponse =
                await fetch(
                    `https://asiaedu-backend.onrender.com/api/submissions/student/${currentStudent._id}`
                );


            const submissionsData =
                await submissionsResponse.json();


            if (!submissionsResponse.ok) {

                throw new Error(
                    submissionsData.message ||
                    "Failed to get submissions."
                );

            }


            const backendSubmissions =
                submissionsData.submissions || [];


            setSubmissions(
                backendSubmissions
            );


            /* =============================================
               TRANSFORM ASSIGNMENTS
            ============================================= */

            const realAssignments =
                backendAssignments.map(
                    (assignment) => {

                        const course =
                            assignment.course;


                        const courseId =
                            course?._id
                                ? course._id.toString()
                                : "";


                        const existingSubmission =
                            backendSubmissions.find(
                                (submission) => {

                                    const submissionAssignment =
                                        submission.assignment;


                                    if (
                                        !submissionAssignment
                                    ) {
                                        return false;
                                    }


                                    const submissionAssignmentId =
                                        submissionAssignment._id ||
                                        submissionAssignment;


                                    return (
                                        submissionAssignmentId.toString() ===
                                        assignment._id.toString()
                                    );

                                }
                            );


                        let status =
                            "Not Submitted";


                        if (
                            existingSubmission
                        ) {

                            status =
                                "Submitted";

                        }


                        return {

                            id:
                                assignment._id,

                            courseId:
                                courseId,

                            title:
                                assignment.title,

                            description:
                                assignment.description,

                            instructions:
                                assignment.instructions,

                            dueDate:
                                assignment.dueDate,

                            points:
                                assignment.maxScore,

                            status:
                                status,

                            submission:
                                existingSubmission ||
                                null,

                            session:
                                assignment.session ||
                                null,

                            teacher:
                                assignment.teacher ||
                                null,

                            resources:
                                assignment.resources ||
                                [],

                            attachments:
                                assignment.attachments ||
                                [],

                            createdAt:
                                assignment.createdAt

                        };

                    }
                );


            setAssignments(
                realAssignments
            );


            /* =============================================
               SELECT FIRST COURSE
            ============================================= */

            if (
                realCourses.length > 0
            ) {

                setSelectedCourseId(
                    realCourses[0].id
                );

            }

        }

        catch (error) {

            console.error(
                "Load assignments error:",
                error
            );


            setError(
                error.message ||
                "Failed to load assignments."
            );

        }

        finally {

            setIsLoading(false);

        }

    }


    /* =====================================================
       GET COURSE CODE
    ===================================================== */

    function getCourseCode(language) {

        if (!language) {
            return "CO";
        }


        const languageLower =
            language.toLowerCase();


        if (
            languageLower.includes("chinese")
        ) {
            return "CN";
        }


        if (
            languageLower.includes("japanese")
        ) {
            return "JP";
        }


        if (
            languageLower.includes("korean")
        ) {
            return "KR";
        }


        if (
            languageLower.includes("russian")
        ) {
            return "RU";
        }


        if (
            languageLower.includes("malay")
        ) {
            return "MY";
        }


        return language
            .substring(0, 2)
            .toUpperCase();

    }


    /* =====================================================
       SELECTED COURSE
    ===================================================== */

    const selectedCourse =
        courses.find(
            (course) =>
                course.id === selectedCourseId
        );


    /* =====================================================
       COURSE ASSIGNMENTS
       OLDEST -> NEWEST
    ===================================================== */

    const courseAssignments =
        assignments
            .filter(
                (assignment) =>
                    assignment.courseId ===
                    selectedCourseId
            )
            .sort(
                (a, b) => {

                    return (
                        new Date(
                            a.createdAt
                        ) -
                        new Date(
                            b.createdAt
                        )
                    );

                }
            );


    /* =====================================================
       FILTERED ASSIGNMENTS
    ===================================================== */

    const filteredAssignments =
        courseAssignments.filter(
            (assignment) => {

                if (
                    activeFilter ===
                    "All Assignments"
                ) {

                    return true;

                }


                return (
                    assignment.status ===
                    activeFilter
                );

            }
        );


    /* =====================================================
       STATISTICS
    ===================================================== */

    const submittedAssignments =
        courseAssignments.filter(
            (assignment) =>
                assignment.status ===
                "Submitted"
        ).length;


    const notSubmittedAssignments =
        courseAssignments.filter(
            (assignment) =>
                assignment.status ===
                "Not Submitted"
        ).length;


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(date) {

        if (!date) {
            return "";
        }


        const dateObject =
            new Date(date);


        return dateObject.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       COURSE CHANGE
    ===================================================== */

    function handleCourseChange(event) {

        setSelectedCourseId(
            event.target.value
        );


        setActiveFilter(
            "All Assignments"
        );

    }


    /* =====================================================
       OPEN ASSIGNMENT
    ===================================================== */

    function handleOpenAssignment(
        assignment
    ) {

        navigate(
            "/student-dashboard/assignments/view",
            {
                state: {
                    assignment:
                        assignment,

                    course:
                        selectedCourse
                }
            }
        );

    }


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (

            <section className="MyAssignments">

                <div className="MyAssignments-container">

                    <div className="MyAssignments-empty">

                        <div className="MyAssignments-emptyIcon">

                            <i className="fa-solid fa-spinner fa-spin"></i>

                        </div>

                        <h3>
                            Loading your assignments...
                        </h3>

                        <p>
                            Please wait while we load your assignments.
                        </p>

                    </div>

                </div>

            </section>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (
        error &&
        !student
    ) {

        return (

            <section className="MyAssignments">

                <div className="MyAssignments-container">

                    <div className="MyAssignments-empty">

                        <div className="MyAssignments-emptyIcon">

                            <i className="fa-solid fa-circle-exclamation"></i>

                        </div>

                        <h3>
                            Unable to load assignments
                        </h3>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            </section>

        );

    }


    /* =====================================================
       ASSIGNMENTS LIST
    ===================================================== */

    return (

        <section className="MyAssignments">

            <div className="MyAssignments-container">


                {/* =================================================
                   HEADING
                ================================================= */}

                <div className="MyAssignments-heading">

                    <div>

                        <h2>
                            Assignments
                        </h2>

                        <p>
                            Complete your assignments and track your progress.
                        </p>

                    </div>

                </div>


                {
                    courses.length === 0 ? (

                        <div className="MyAssignments-empty">

                            <div className="MyAssignments-emptyIcon">

                                <i className="fa-regular fa-file-lines"></i>

                            </div>

                            <h3>
                                No courses found
                            </h3>

                            <p>
                                You do not have any enrolled courses yet.
                            </p>

                        </div>

                    ) : (

                        <>


                            {/* =================================================
                               COURSE SELECTOR
                            ================================================= */}

                            <div className="MyAssignments-courseSelector">

                                <div className="MyAssignments-selectorHeading">

                                    <div className="MyAssignments-selectorIcon">

                                        <i className="fa-solid fa-book-open"></i>

                                    </div>


                                    <div>

                                        <span>
                                            Select Course
                                        </span>

                                        <p>
                                            Choose a course to view its assignments
                                        </p>

                                    </div>

                                </div>


                                <div className="MyAssignments-selectWrapper">

                                    <div className="MyAssignments-courseCode">

                                        {
                                            selectedCourse
                                                ? selectedCourse.code
                                                : "CO"
                                        }

                                    </div>


                                    <select
                                        value={selectedCourseId}
                                        onChange={
                                            handleCourseChange
                                        }
                                        className="MyAssignments-select"
                                        aria-label="Select course"
                                    >

                                        {
                                            courses.map(
                                                (course) => (

                                                    <option
                                                        key={course.id}
                                                        value={course.id}
                                                    >

                                                        {course.name}

                                                        {
                                                            course.session
                                                                ? ` • ${course.session}`
                                                                : ""
                                                        }

                                                    </option>

                                                )
                                            )
                                        }

                                    </select>


                                    <i className="fa-solid fa-chevron-down"></i>

                                </div>

                            </div>


                            {/* =================================================
                               SELECTED COURSE
                            ================================================= */}

                            <div className="MyAssignments-selectedCourse">

                                <div className="MyAssignments-selectedCourse-left">

                                    <div className="MyAssignments-selectedCourse-icon">

                                        {
                                            selectedCourse
                                                ? selectedCourse.code
                                                : "CO"
                                        }

                                    </div>


                                    <div>

                                        <h3>

                                            {
                                                selectedCourse
                                                    ? selectedCourse.name
                                                    : "Course"
                                            }

                                        </h3>


                                        <p>

                                            {
                                                selectedCourse
                                                    ? selectedCourse.instructor
                                                    : "Teacher"
                                            }

                                            {
                                                selectedCourse &&
                                                selectedCourse.session
                                                    ? ` • ${selectedCourse.session}`
                                                    : ""
                                            }

                                        </p>

                                    </div>

                                </div>


                                <div className="MyAssignments-selectedCourse-stats">

                                    <div>

                                        <strong>
                                            {courseAssignments.length}
                                        </strong>

                                        <span>
                                            Assignments
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {notSubmittedAssignments}
                                        </strong>

                                        <span>
                                            Not Submitted
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {submittedAssignments}
                                        </strong>

                                        <span>
                                            Submitted
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                               FILTERS
                            ================================================= */}

                            <div className="MyAssignments-filters">

                                <button
                                    className={
                                        activeFilter ===
                                        "All Assignments"
                                            ? "MyAssignments-filter active"
                                            : "MyAssignments-filter"
                                    }
                                    onClick={() =>
                                        setActiveFilter(
                                            "All Assignments"
                                        )
                                    }
                                >
                                    All Assignments
                                </button>


                                <button
                                    className={
                                        activeFilter ===
                                        "Not Submitted"
                                            ? "MyAssignments-filter active"
                                            : "MyAssignments-filter"
                                    }
                                    onClick={() =>
                                        setActiveFilter(
                                            "Not Submitted"
                                        )
                                    }
                                >
                                    Not Submitted
                                </button>


                                <button
                                    className={
                                        activeFilter ===
                                        "Submitted"
                                            ? "MyAssignments-filter active"
                                            : "MyAssignments-filter"
                                    }
                                    onClick={() =>
                                        setActiveFilter(
                                            "Submitted"
                                        )
                                    }
                                >
                                    Submitted
                                </button>

                            </div>


                            {/* =================================================
                               ASSIGNMENTS LIST
                            ================================================= */}

                            <div className="MyAssignments-list">

                                {
                                    filteredAssignments.map(
                                        (assignment, index) => (

                                            <div
                                                className="MyAssignments-card"
                                                key={
                                                    assignment.id
                                                }
                                                onClick={() =>
                                                    handleOpenAssignment(
                                                        assignment
                                                    )
                                                }
                                                role="button"
                                                tabIndex="0"
                                                onKeyDown={(event) => {

                                                    if (
                                                        event.key ===
                                                        "Enter"
                                                    ) {

                                                        handleOpenAssignment(
                                                            assignment
                                                        );

                                                    }

                                                }}
                                            >


                                                {/* =================================
                                                   NUMBER
                                                ================================= */}

                                                <div className="MyAssignments-number">

                                                    {
                                                        String(
                                                            index + 1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )
                                                    }

                                                </div>


                                                {/* =================================
                                                   CONTENT
                                                ================================= */}

                                                <div className="MyAssignments-content">

                                                    <div className="MyAssignments-title-row">

                                                        <h3>
                                                            {
                                                                assignment.title
                                                            }
                                                        </h3>

                                                    </div>


                                                    <p className="MyAssignments-description">

                                                        {
                                                            assignment.description
                                                        }

                                                    </p>


                                                    <div className="MyAssignments-details">


                                                        <span>

                                                            <i className="fa-regular fa-calendar"></i>

                                                            Due{" "}

                                                            {
                                                                formatDate(
                                                                    assignment.dueDate
                                                                )
                                                            }

                                                        </span>


                                                        <span>

                                                            <i className="fa-solid fa-star"></i>

                                                            {
                                                                assignment.points
                                                            }

                                                            {" points"}

                                                        </span>


                                                        {
                                                            assignment.resources &&
                                                            assignment.resources.length > 0 && (

                                                                <span>

                                                                    <i className="fa-solid fa-link"></i>

                                                                    {
                                                                        assignment.resources.length
                                                                    }

                                                                    {" "}

                                                                    {
                                                                        assignment.resources.length ===
                                                                        1
                                                                            ? "Resource"
                                                                            : "Resources"
                                                                    }

                                                                </span>

                                                            )
                                                        }


                                                        {
                                                            assignment.attachments &&
                                                            assignment.attachments.length > 0 && (

                                                                <span>

                                                                    <i className="fa-solid fa-paperclip"></i>

                                                                    {
                                                                        assignment.attachments.length
                                                                    }

                                                                    {" "}

                                                                    {
                                                                        assignment.attachments.length ===
                                                                        1
                                                                            ? "Attachment"
                                                                            : "Attachments"
                                                                    }

                                                                </span>

                                                            )
                                                        }

                                                    </div>

                                                </div>


                                                {/* =================================
                                                   ACTIONS
                                                ================================= */}

                                                <div className="MyAssignments-card-actions">

                                                    <span
                                                        className={
                                                            assignment.status ===
                                                            "Submitted"
                                                                ? "MyAssignments-status submitted"
                                                                : "MyAssignments-status not-submitted"
                                                        }
                                                    >

                                                        {
                                                            assignment.status
                                                        }

                                                    </span>


                                                    <button
                                                        type="button"
                                                        className="MyAssignments-action-button"
                                                        onClick={(event) => {

                                                            event.stopPropagation();


                                                            handleOpenAssignment(
                                                                assignment
                                                            );

                                                        }}
                                                    >

                                                        {
                                                            assignment.status ===
                                                            "Submitted"
                                                                ? "Review Submission"
                                                                : "Submit Assignment"
                                                        }

                                                        <i className="fa-solid fa-arrow-right"></i>

                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )
                                }


                                {/* =================================================
                                   NO ASSIGNMENTS
                                ================================================= */}

                                {
                                    filteredAssignments.length === 0 && (

                                        <div className="MyAssignments-empty">

                                            <div className="MyAssignments-emptyIcon">

                                                <i className="fa-regular fa-file-lines"></i>

                                            </div>

                                            <h3>
                                                No assignments found
                                            </h3>

                                            <p>
                                                There are no assignments matching this filter.
                                            </p>

                                        </div>

                                    )
                                }

                            </div>

                        </>

                    )
                }

            </div>

        </section>

    );

}


export default Assignments;