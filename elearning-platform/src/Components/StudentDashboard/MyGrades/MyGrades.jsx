import "./MyGrades.css";

import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";


/* =====================================================
   COMPONENT
===================================================== */

function MyGrades() {

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
       RESULTS
    ===================================================== */

    const [results, setResults] =
        useState([]);


    /* =====================================================
       UI STATE
    ===================================================== */

    const [activeFilter, setActiveFilter] =
        useState("All Results");


    /* =====================================================
       LOADING / ERROR
    ===================================================== */

    const [isLoading, setIsLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    /* =====================================================
       LOAD GRADES
    ===================================================== */

    useEffect(() => {

        loadGrades();

    }, []);


    /* =====================================================
       GET SESSION NAME
    ===================================================== */

    function getSessionName(session) {

        if (!session) {

            return "";

        }


        if (
            typeof session ===
            "string"
        ) {

            return session;

        }


        return (
            session.name ||
            session.group ||
            ""
        );

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
            languageLower.includes(
                "chinese"
            )
        ) {

            return "CN";

        }


        if (
            languageLower.includes(
                "japanese"
            )
        ) {

            return "JP";

        }


        if (
            languageLower.includes(
                "korean"
            )
        ) {

            return "KR";

        }


        if (
            languageLower.includes(
                "russian"
            )
        ) {

            return "RU";

        }


        if (
            languageLower.includes(
                "malay"
            )
        ) {

            return "MY";

        }


        return language
            .substring(
                0,
                2
            )
            .toUpperCase();

    }


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
       GET ID
    ===================================================== */

    function getId(value) {

        if (!value) {

            return "";

        }


        if (
            typeof value ===
            "object"
        ) {

            return (
                value._id ||
                ""
            );

        }


        return value;

    }


    /* =====================================================
       LOAD STUDENT GRADES
    ===================================================== */

    async function loadGrades() {

        try {

            setIsLoading(true);

            setError("");


            /* =============================================
               GET USER FROM LOCAL STORAGE
            ============================================= */

            const storedUser =
                localStorage.getItem(
                    "user"
                );


            if (!storedUser) {

                setError(
                    "You must be logged in to view your grades."
                );

                setIsLoading(false);

                return;

            }


            const user =
                JSON.parse(
                    storedUser
                );


            /* =============================================
               SAME USER ID LOGIC AS ASSIGNMENTS
            ============================================= */

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
               GET STUDENT
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


            if (
                !currentStudent ||
                !currentStudent._id
            ) {

                throw new Error(
                    "Student information could not be found."
                );

            }


            setStudent(
                currentStudent
            );


            /* =============================================
               GET STUDENT COURSES
            ============================================= */

            const studentCourses =
                currentStudent.courses ||
                [];


            /* =============================================
               CREATE COURSE MAP
            ============================================= */

            const courseMap =
                new Map();


            studentCourses.forEach(
                (course) => {

                    if (
                        !course.courseId
                    ) {

                        return;

                    }


                    const courseId =
                        course.courseId._id ||
                        course.courseId;


                    if (
                        !courseMap.has(
                            courseId
                        )
                    ) {

                        const session =
                            getSessionName(
                                course.session
                            );


                        courseMap.set(
                            courseId,
                            {

                                id:
                                    courseId,

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
               WE NEED THEM TO CONNECT RESULTS TO COURSES
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
                assignmentsData.assignments ||
                [];


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


                    if (
                        !courseMap.has(
                            courseId
                        )
                    ) {

                        const session =
                            getSessionName(
                                assignment.session
                            );


                        courseMap.set(
                            courseId,
                            {

                                id:
                                    courseId,

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


            /* =============================================
               GET SUBMISSIONS
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
                submissionsData.submissions ||
                [];


            /* =============================================
               CREATE ASSIGNMENT MAP
            ============================================= */

            const assignmentMap =
                new Map();


            backendAssignments.forEach(
                (assignment) => {

                    assignmentMap.set(
                        assignment._id.toString(),
                        assignment
                    );

                }
            );


            /* =============================================
               TRANSFORM SUBMISSIONS INTO RESULTS
            ============================================= */

            const realResults =
                backendSubmissions.map(
                    (submission) => {

                        const submissionAssignment =
                            submission.assignment;


                        const assignmentId =
                            getId(
                                submissionAssignment
                            );


                        const assignment =
                            assignmentMap.get(
                                assignmentId.toString()
                            ) ||
                            (
                                typeof submissionAssignment ===
                                "object"
                                    ? submissionAssignment
                                    : null
                            );


                        if (!assignment) {

                            return null;

                        }


                        const course =
                            assignment.course;


                        const courseId =
                            getId(
                                course
                            ).toString();


                        const session =
                            assignment.session;


                        /* =================================
                           GRADE
                        ================================= */

                        const score =
                            submission.grade ??
                            submission.score ??
                            null;


                        /* =================================
                           MAX SCORE
                        ================================= */

                        const maxScore =
                            assignment.maxScore ||
                            submission.maxScore ||
                            0;


                        /* =================================
                           PERCENTAGE
                        ================================= */

                        let percentage =
                            null;


                        if (
                            score !== null &&
                            maxScore > 0
                        ) {

                            percentage =
                                Math.round(
                                    (
                                        score /
                                        maxScore
                                    ) *
                                    100
                                );

                        }


                        /* =================================
                           STATUS
                        ================================= */

                        const status =
                            score !== null
                                ? "Graded"
                                : "Pending";


                        return {

                            id:
                                submission._id,

                            submissionId:
                                submission._id,

                            assignment:
                                assignment,

                            course:
                                course,

                            courseId:
                                courseId,

                            session:
                                session,

                            title:
                                assignment.title,

                            description:
                                assignment.description,

                            score:
                                score,

                            maxScore:
                                maxScore,

                            percentage:
                                percentage,

                            status:
                                status,

                            submittedDate:
                                formatDate(
                                    submission.submittedAt ||
                                    submission.createdAt
                                ),

                            gradedDate:
                                score !== null
                                    ? formatDate(
                                        submission.updatedAt
                                    )
                                    : null,

                            answer:
                                submission.content ||
                                submission.answer ||
                                "",

                            feedback:
                                submission.feedback ||
                                submission.teacherFeedback ||
                                "",

                            correction:
                                submission.correction ||
                                submission.teacherCorrection ||
                                "",

                            solution:
                                submission.solution ||
                                submission.correctSolution ||
                                ""

                        };

                    }
                );


            /* =============================================
               REMOVE NULL RESULTS
            ============================================= */

            const validResults =
                realResults.filter(
                    (result) =>
                        result !== null
                );


            /* =============================================
               NEWEST FIRST
            ============================================= */

            validResults.sort(
                (a, b) => {

                    const dateA =
                        new Date(
                            a.submittedDate
                        );


                    const dateB =
                        new Date(
                            b.submittedDate
                        );


                    return (
                        dateB -
                        dateA
                    );

                }
            );


            setResults(
                validResults
            );


            /* =============================================
               FINAL COURSE LIST
            ============================================= */

            const realCourses =
                Array.from(
                    courseMap.values()
                );


            setCourses(
                realCourses
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
                "Load grades error:",
                error
            );


            setError(
                error.message ||
                "Failed to load grades."
            );

        }

        finally {

            setIsLoading(false);

        }

    }


    /* =====================================================
       SELECTED COURSE
    ===================================================== */

    const selectedCourse =
        courses.find(
            (course) =>
                course.id ===
                selectedCourseId
        );


    /* =====================================================
       COURSE RESULTS
    ===================================================== */

    const courseResults =
        results.filter(
            (result) =>
                result.courseId ===
                selectedCourseId
        );


    /* =====================================================
       FILTERED RESULTS
    ===================================================== */

    const filteredResults =
        courseResults.filter(
            (result) => {

                if (
                    activeFilter ===
                    "All Results"
                ) {

                    return true;

                }


                return (
                    result.status ===
                    activeFilter
                );

            }
        );


    /* =====================================================
       STATISTICS
    ===================================================== */

    const gradedResults =
        courseResults.filter(
            (result) =>
                result.status ===
                "Graded"
        );


    const pendingResults =
        courseResults.filter(
            (result) =>
                result.status ===
                "Pending"
        );


    const totalPoints =
        gradedResults.reduce(
            (
                total,
                result
            ) => {

                return (
                    total +
                    (
                        Number(
                            result.score
                        ) || 0
                    )
                );

            },
            0
        );


    const totalPossiblePoints =
        gradedResults.reduce(
            (
                total,
                result
            ) => {

                return (
                    total +
                    (
                        Number(
                            result.maxScore
                        ) || 0
                    )
                );

            },
            0
        );


    let averagePercentage = 0;


    if (
        totalPossiblePoints > 0
    ) {

        averagePercentage =
            Math.round(
                (
                    totalPoints /
                    totalPossiblePoints
                ) *
                100
            );

    }


    /* =====================================================
       COURSE CHANGE
    ===================================================== */

    function handleCourseChange(
        event
    ) {

        setSelectedCourseId(
            event.target.value
        );


        setActiveFilter(
            "All Results"
        );

    }


    /* =====================================================
       OPEN RESULT
    ===================================================== */

    function handleOpenResult(
        result
    ) {

        navigate(
            "/student-dashboard/grades/view",
            {
                state: {

                    result:
                        result,

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

            <section className="MyGrades">

                <div className="MyGrades-container">

                    <div className="MyGrades-empty">

                        <div className="MyGrades-emptyIcon">

                            <i className="fa-solid fa-chart-column"></i>

                        </div>

                        <h3>
                            Loading your grades...
                        </h3>

                        <p>
                            Please wait while your assignment results are loading.
                        </p>

                    </div>

                </div>

            </section>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error && !student) {

        return (

            <section className="MyGrades">

                <div className="MyGrades-container">

                    <div className="MyGrades-empty">

                        <div className="MyGrades-emptyIcon">

                            <i className="fa-solid fa-circle-exclamation"></i>

                        </div>

                        <h3>
                            Unable to load grades
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
       PAGE
    ===================================================== */

    return (

        <section className="MyGrades">

            <div className="MyGrades-container">


                {/* =================================================
                   HEADING
                ================================================= */}

                <div className="MyGrades-heading">

                    <div>

                        <h2>
                            My Grades
                        </h2>

                        <p>
                            View your assignment results and teacher feedback.
                        </p>

                    </div>

                </div>


                {
                    courses.length === 0 ? (

                        <div className="MyGrades-empty">

                            <div className="MyGrades-emptyIcon">

                                <i className="fa-solid fa-chart-column"></i>

                            </div>

                            <h3>
                                No grades available
                            </h3>

                            <p>
                                You do not have any submitted assignments yet.
                            </p>

                        </div>

                    ) : (

                        <>


                            {/* =================================================
                               COURSE SELECTOR
                            ================================================= */}

                            <div className="MyGrades-courseSelector">

                                <div className="MyGrades-selectorHeading">

                                    <div className="MyGrades-selectorIcon">

                                        <i className="fa-solid fa-book-open"></i>

                                    </div>


                                    <div>

                                        <span>
                                            Select Course
                                        </span>

                                        <p>
                                            Choose a course to view your grades
                                        </p>

                                    </div>

                                </div>


                                <div className="MyGrades-selectWrapper">

                                    <div className="MyGrades-courseCode">

                                        {
                                            selectedCourse
                                                ? selectedCourse.code
                                                : "CO"
                                        }

                                    </div>


                                    <select
                                        value={
                                            selectedCourseId
                                        }
                                        onChange={
                                            handleCourseChange
                                        }
                                        className="MyGrades-select"
                                        aria-label="Select course"
                                    >

                                        {
                                            courses.map(
                                                (course) => (

                                                    <option
                                                        key={
                                                            course.id
                                                        }
                                                        value={
                                                            course.id
                                                        }
                                                    >

                                                        {
                                                            course.name
                                                        }

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

                            <div className="MyGrades-selectedCourse">

                                <div className="MyGrades-selectedCourse-left">

                                    <div className="MyGrades-selectedCourse-icon">

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


                                <div className="MyGrades-selectedCourse-stats">

                                    <div>

                                        <strong>
                                            {
                                                courseResults.length
                                            }
                                        </strong>

                                        <span>
                                            Results
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {
                                                gradedResults.length
                                            }
                                        </strong>

                                        <span>
                                            Graded
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {
                                                pendingResults.length
                                            }
                                        </strong>

                                        <span>
                                            Pending
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {
                                                averagePercentage
                                            }%
                                        </strong>

                                        <span>
                                            Average
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                               FILTERS
                            ================================================= */}

                            <div className="MyGrades-filters">

                                <button
                                    className={
                                        activeFilter ===
                                        "All Results"
                                            ? "MyGrades-filter active"
                                            : "MyGrades-filter"
                                    }
                                    onClick={() =>
                                        setActiveFilter(
                                            "All Results"
                                        )
                                    }
                                >
                                    All Results
                                </button>


                                <button
                                    className={
                                        activeFilter ===
                                        "Graded"
                                            ? "MyGrades-filter active"
                                            : "MyGrades-filter"
                                    }
                                    onClick={() =>
                                        setActiveFilter(
                                            "Graded"
                                        )
                                    }
                                >
                                    Graded
                                </button>


                                <button
                                    className={
                                        activeFilter ===
                                        "Pending"
                                            ? "MyGrades-filter active"
                                            : "MyGrades-filter"
                                    }
                                    onClick={() =>
                                        setActiveFilter(
                                            "Pending"
                                        )
                                    }
                                >
                                    Pending
                                </button>

                            </div>


                            {/* =================================================
                               RESULTS LIST
                            ================================================= */}

                            <div className="MyGrades-list">

                                {
                                    filteredResults.map(
                                        (
                                            result,
                                            index
                                        ) => (

                                            <div
                                                className="MyGrades-card"
                                                key={
                                                    result.id
                                                }
                                            >

                                                <div className="MyGrades-number">

                                                    {
                                                        String(
                                                            index + 1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )
                                                    }

                                                </div>


                                                <div className="MyGrades-content">

                                                    <div className="MyGrades-title-row">

                                                        <h3>
                                                            {
                                                                result.title
                                                            }
                                                        </h3>

                                                    </div>


                                                    <p className="MyGrades-description">

                                                        {
                                                            result.description ||
                                                            "Assignment result"
                                                        }

                                                    </p>


                                                    <div className="MyGrades-details">

                                                        <span>

                                                            <i className="fa-regular fa-calendar-check"></i>

                                                            Submitted{" "}

                                                            {
                                                                result.submittedDate
                                                            }

                                                        </span>


                                                        {
                                                            result.status ===
                                                            "Graded" && (

                                                                <span>

                                                                    <i className="fa-solid fa-check"></i>

                                                                    Graded{" "}

                                                                    {
                                                                        result.gradedDate
                                                                    }

                                                                </span>

                                                            )
                                                        }


                                                        {
                                                            result.status ===
                                                            "Pending" && (

                                                                <span>

                                                                    <i className="fa-regular fa-clock"></i>

                                                                    Waiting for correction

                                                                </span>

                                                            )
                                                        }

                                                    </div>

                                                </div>


                                                {/* =================================================
                                                   SCORE
                                                ================================================= */}

                                                <div className="MyGrades-score">

                                                    {
                                                        result.status ===
                                                        "Graded" ? (

                                                            <>

                                                                <strong
                                                                    className={
                                                                        result.percentage !== null &&
                                                                        result.percentage < 50
                                                                            ? "failed-score"
                                                                            : "passed-score"
                                                                    }
                                                                >

                                                                    {
                                                                        result.score
                                                                    }

                                                                    <span>
                                                                        /
                                                                        {
                                                                            result.maxScore
                                                                        }
                                                                    </span>

                                                                </strong>


                                                                <small
                                                                    className={
                                                                        result.percentage !== null &&
                                                                        result.percentage < 50
                                                                            ? "failed-percentage"
                                                                            : "passed-percentage"
                                                                    }
                                                                >

                                                                    {
                                                                        result.percentage
                                                                    }%

                                                                </small>

                                                            </>

                                                        ) : (

                                                            <>

                                                                <strong className="pending-score">
                                                                    —
                                                                </strong>

                                                                <small className="pending-text">
                                                                    Pending
                                                                </small>

                                                            </>

                                                        )
                                                    }

                                                </div>


                                                {/* =================================================
                                                   CARD ACTIONS
                                                ================================================= */}

                                                <div className="MyGrades-card-actions">

                                                    <span
                                                        className={
                                                            result.status ===
                                                            "Graded"
                                                                ? "MyGrades-status graded"
                                                                : "MyGrades-status pending"
                                                        }
                                                    >

                                                        {
                                                            result.status ===
                                                            "Graded" ? (
                                                                <>

                                                                    <i className="fa-solid fa-circle-check"></i>

                                                                    Graded

                                                                </>
                                                            ) : (
                                                                <>

                                                                    <i className="fa-regular fa-clock"></i>

                                                                    Pending

                                                                </>
                                                            )
                                                        }

                                                    </span>


                                                    <button
                                                        type="button"
                                                        className="MyGrades-action-button"
                                                        onClick={() =>
                                                            handleOpenResult(
                                                                result
                                                            )
                                                        }
                                                    >

                                                        {
                                                            result.status ===
                                                            "Graded"
                                                                ? "View Result"
                                                                : "View Submission"
                                                        }

                                                        <i className="fa-solid fa-arrow-right"></i>

                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )
                                }


                                {
                                    filteredResults.length === 0 && (

                                        <div className="MyGrades-empty">

                                            <div className="MyGrades-emptyIcon">

                                                <i className="fa-solid fa-chart-column"></i>

                                            </div>

                                            <h3>
                                                No results found
                                            </h3>

                                            <p>
                                                There are no results matching this filter.
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


export default MyGrades;