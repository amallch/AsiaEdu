import "./Sessions.css";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


const API_URL =
    "https://asiaedu-backend.onrender.com/api/sessions";

const COURSES_API =
    "https://asiaedu-backend.onrender.com/api/courses";


function Sessions() {

    const navigate = useNavigate();


    /* =========================================================
       SESSIONS STATE
    ========================================================= */

    const [sessionList, setSessionList] =
        useState([]);


    /* =========================================================
       COURSES STATE
    ========================================================= */

    const [courseList, setCourseList] =
        useState([]);


    /* =========================================================
       FILTER STATE
    ========================================================= */

    const [search, setSearch] =
        useState("");

    const [courseFilter, setCourseFilter] =
        useState("All");

    const [programTypeFilter, setProgramTypeFilter] =
        useState("All");

    const [yearFilter, setYearFilter] =
        useState("All");


    /* =========================================================
       PAGE STATE
    ========================================================= */

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");


    /* =========================================================
       FETCH SESSIONS
    ========================================================= */

    const fetchSessions = async () => {

        try {

            const response =
                await fetch(API_URL);


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch sessions."
                );

            }


            const data =
                await response.json();


            setSessionList(data);

        }

        catch (error) {

            console.error(
                "Error fetching sessions:",
                error
            );


            setErrorMessage(
                "Unable to load sessions. Please try again."
            );

        }

    };


    /* =========================================================
       FETCH COURSES
    ========================================================= */

    const fetchCourses = async () => {

        try {

            const response =
                await fetch(COURSES_API);


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch courses."
                );

            }


            const data =
                await response.json();


            setCourseList(data);

        }

        catch (error) {

            console.error(
                "Error fetching courses:",
                error
            );


            setErrorMessage(
                "Unable to load courses. Please try again."
            );

        }

    };


    /* =========================================================
       LOAD DATA
    ========================================================= */

    useEffect(() => {

        const loadData = async () => {

            try {

                setIsLoading(true);

                setErrorMessage("");


                await Promise.all([
                    fetchSessions(),
                    fetchCourses()
                ]);

            }

            catch (error) {

                console.error(
                    "Error loading data:",
                    error
                );

            }

            finally {

                setIsLoading(false);

            }

        };


        loadData();

    }, []);


    /* =========================================================
       GET AVAILABLE YEARS
    ========================================================= */

    const availableYears = [
        ...new Set(
            sessionList
                .map((session) => {

                    if (!session.createdAt) {

                        return null;

                    }


                    return new Date(
                        session.createdAt
                    ).getFullYear();

                })
                .filter(Boolean)
        )
    ].sort(
        (a, b) => b - a
    );


    /* =========================================================
       FILTER SESSIONS
    ========================================================= */

    const filteredSessions =
        sessionList.filter((session) => {

            const searchValue =
                search.toLowerCase();


            const courseTitle =
                session.course &&
                session.course.title
                    ? session.course.title.toLowerCase()
                    : "";


            const language =
                session.course &&
                session.course.language
                    ? session.course.language.toLowerCase()
                    : "";


            const group =
                session.group
                    ? session.group.toLowerCase()
                    : "";


            const instructor =
                session.instructor &&
                session.instructor.name
                    ? session.instructor.name.toLowerCase()
                    : "";


            const matchesSearch =
                courseTitle.includes(searchValue) ||
                language.includes(searchValue) ||
                group.includes(searchValue) ||
                instructor.includes(searchValue);


            const matchesCourse =
                courseFilter === "All" ||
                (
                    session.course &&
                    String(session.course._id) ===
                    String(courseFilter)
                );


            const matchesProgramType =
                programTypeFilter === "All" ||
                session.programType ===
                    programTypeFilter;


            /* =================================================
               YEAR FILTER
            ================================================= */

            const matchesYear =
                yearFilter === "All" ||
                (
                    session.createdAt &&
                    new Date(
                        session.createdAt
                    ).getFullYear() ===
                    Number(yearFilter)
                );


            return (
                matchesSearch &&
                matchesCourse &&
                matchesProgramType &&
                matchesYear
            );

        });


    /* =========================================================
       DELETE SESSION
    ========================================================= */

    const handleDelete = async (session) => {

        const courseTitle =
            session.course &&
            session.course.title
                ? session.course.title
                : "this session";


        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${courseTitle} - ${session.group}?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setErrorMessage("");


            const sessionId =
                session._id;


            const response =
                await fetch(
                    `${API_URL}/${sessionId}`,
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


            setSessionList(
                sessionList.filter(
                    (item) =>
                        String(item._id) !==
                        String(sessionId)
                )
            );

        }

        catch (error) {

            console.error(
                "Error deleting session:",
                error
            );


            setErrorMessage(
                error.message ||
                "Unable to delete session."
            );

        }

    };


    /* =========================================================
       FORMAT START DATE
    ========================================================= */

    const formatStartDate = (date) => {

        if (!date) {

            return "Coming Soon";

        }


        const parts =
            String(date).split("-");


        if (parts.length !== 3) {

            return date;

        }


        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]);

        const day =
            Number(parts[2]);


        const monthNames = [

            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"

        ];


        if (
            Number.isNaN(year) ||
            Number.isNaN(month) ||
            Number.isNaN(day) ||
            !monthNames[month - 1]
        ) {

            return date;

        }


        return (
            `${monthNames[month - 1]} ` +
            `${day}, ` +
            `${year}`
        );

    };


    /* =========================================================
       PAGE
    ========================================================= */

    return (

        <div className="Sessions">


            {/* =====================================================
               HEADER
            ===================================================== */}

            <div className="Sessions-header">

                <div>

                    <span>
                        Management
                    </span>

                    <h1>
                        Sessions
                    </h1>

                    <p>
                        Manage course groups, instructors, schedules and capacity.
                    </p>

                </div>


                <button
                    type="button"
                    className="Sessions-add-button"
                    onClick={() =>
                        navigate("/admin/sessions/add")
                    }
                >

                    <i className="fa-solid fa-plus"></i>

                    <span>
                        Add Session
                    </span>

                </button>

            </div>


            {/* =====================================================
               ERROR
            ===================================================== */}

            {errorMessage && (

                <div className="Sessions-error">

                    <i className="fa-solid fa-circle-exclamation"></i>

                    <span>
                        {errorMessage}
                    </span>

                </div>

            )}


            {/* =====================================================
               FILTERS
            ===================================================== */}

            <div className="Sessions-filters">


                {/* =================================================
                   SEARCH
                ================================================= */}

                <div className="Sessions-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search sessions..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* =================================================
                   COURSE FILTER
                ================================================= */}

                <div className="Sessions-class-filter">

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


                        {courseList.map(
                            (course) => (

                                <option
                                    key={course._id}
                                    value={course._id}
                                >
                                    {course.title}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* =================================================
                   PROGRAM TYPE FILTER
                ================================================= */}

                <div className="Sessions-class-filter">

                    <i className="fa-solid fa-users"></i>

                    <select
                        value={programTypeFilter}
                        onChange={(event) =>
                            setProgramTypeFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Program Types
                        </option>

                        <option value="Normal">
                            Normal
                        </option>

                        <option value="Summer Camp">
                            Summer Camp
                        </option>

                    </select>

                </div>


                {/* =================================================
                   YEAR FILTER
                ================================================= */}

                <div className="Sessions-year-filter">

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


            {/* =====================================================
               LOADING
            ===================================================== */}

            {isLoading && (

                <div className="Sessions-empty">

                    <i className="fa-solid fa-spinner fa-spin"></i>

                    <span>
                        Loading sessions...
                    </span>

                </div>

            )}


            {/* =====================================================
               SESSIONS
            ===================================================== */}

            {!isLoading && (

                <div className="Sessions-grid">


                    {filteredSessions.map(
                        (session) => (

                            <div
                                className="Sessions-simple-card"
                                key={session._id}
                                onClick={() =>
                                    navigate(
                                        `/admin/sessions/${session._id}`
                                    )
                                }
                            >


                                {/* =================================================
                                   CARD TOP
                                ================================================= */}

                                <div className="Sessions-simple-card-top">

                                    <div className="Sessions-session-icon">

                                        <i className="fa-solid fa-users"></i>

                                    </div>


                                    <div className="Sessions-group">

                                        {session.group || "Group"}

                                    </div>

                                </div>


                                {/* =================================================
                                   CONTENT
                                ================================================= */}

                                <div className="Sessions-simple-card-content">

                                    <span className="Sessions-course-language">

                                        {session.course &&
                                        session.course.language
                                            ? session.course.language
                                            : "Language"}

                                    </span>


                                    <h2>

                                        {session.course &&
                                        session.course.title
                                            ? session.course.title
                                            : "Untitled Course"}

                                    </h2>


                                    {/* INSTRUCTOR */}

                                    <div className="Sessions-instructor">

                                        <i className="fa-solid fa-user"></i>

                                        <span>

                                            {session.instructor &&
                                            session.instructor.name
                                                ? session.instructor.name
                                                : "No instructor"}

                                        </span>

                                    </div>

                                </div>


                                {/* =================================================
                                   SESSION INFORMATION
                                ================================================= */}

                                <div className="Sessions-simple-card-info">


                                    {/* LEVEL */}

                                    <div>

                                        <span>
                                            Level
                                        </span>

                                        <strong>

                                            {session.course &&
                                            session.course.level
                                                ? session.course.level
                                                : "-"}

                                        </strong>

                                    </div>


                                    {/* START DATE */}

                                    <div>

                                        <span>
                                            Start Date
                                        </span>

                                        <strong>
                                            {formatStartDate(
                                                session.startDate
                                            )}
                                        </strong>

                                    </div>


                                    {/* PROGRAM TYPE */}

                                    <div>

                                        <span>
                                            Program Type
                                        </span>

                                        <strong>
                                            {session.programType || "-"}
                                        </strong>

                                    </div>

                                </div>


                                {/* =================================================
                                   CAPACITY
                                ================================================= */}

                                <div className="Sessions-capacity">

                                    <div className="Sessions-capacity-item">

                                        <span>
                                            Capacity
                                        </span>

                                        <strong>
                                            {session.capacity}
                                        </strong>

                                    </div>


                                    <div className="Sessions-capacity-item">

                                        <span>
                                            Enrolled
                                        </span>

                                        <strong>
                                            {session.enrolled}
                                        </strong>

                                    </div>


                                    <div
                                        className={
                                            session.isFull
                                                ? "Sessions-capacity-item full"
                                                : "Sessions-capacity-item available"
                                        }
                                    >

                                        <span>
                                            Available
                                        </span>

                                        <strong>
                                            {session.available}
                                        </strong>

                                    </div>

                                </div>


                                {/* =================================================
                                   CARD FOOTER
                                ================================================= */}

                                <div className="Sessions-simple-card-footer">

                                    <span
                                        className={
                                            session.isFull
                                                ? "Sessions-full-label"
                                                : "Sessions-open-label"
                                        }
                                    >

                                        {session.isFull
                                            ? "Session Full"
                                            : "Seats Available"}

                                    </span>


                                    <i className="fa-solid fa-arrow-right"></i>

                                </div>


                                {/* =================================================
                                   DELETE
                                ================================================= */}

                                <button
                                    type="button"
                                    className="Sessions-delete-button"
                                    onClick={(event) => {

                                        event.stopPropagation();

                                        handleDelete(session);

                                    }}
                                    title="Delete session"
                                >

                                    <i className="fa-solid fa-trash"></i>

                                </button>


                            </div>

                        )
                    )}


                    {/* =================================================
                       NO RESULTS
                    ================================================= */}

                    {filteredSessions.length === 0 && (

                        <div className="Sessions-empty">

                            <i className="fa-solid fa-users"></i>

                            <span>
                                No sessions found.
                            </span>

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}


export default Sessions;