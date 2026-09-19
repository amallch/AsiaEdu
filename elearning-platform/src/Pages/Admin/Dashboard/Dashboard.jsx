import "./Dashboard.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Dashboard() {

    const navigate = useNavigate();


    /* =================================================
       DATA
    ================================================= */

    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [tutorApplications, setTutorApplications] = useState([]);

    const [loading, setLoading] = useState(true);


    /* =================================================
       LOAD DASHBOARD DATA
    ================================================= */

    useEffect(() => {

        async function loadDashboardData() {

            try {

                setLoading(true);


                const [
                    studentsResponse,
                    teachersResponse,
                    coursesResponse,
                    sessionsResponse,
                    enrollmentsResponse,
                    tutorApplicationsResponse
                ] = await Promise.all([

                    fetch("http://localhost:5000/api/students"),

                    fetch("http://localhost:5000/api/teachers"),

                    fetch("http://localhost:5000/api/courses"),

                    fetch("http://localhost:5000/api/sessions"),

                    fetch("http://localhost:5000/api/enrollments"),

                    fetch("http://localhost:5000/api/tutor-applications")

                ]);


                const studentsData =
                    await studentsResponse.json();

                const teachersData =
                    await teachersResponse.json();

                const coursesData =
                    await coursesResponse.json();

                const sessionsData =
                    await sessionsResponse.json();

                const enrollmentsData =
                    await enrollmentsResponse.json();

                const tutorApplicationsData =
                    await tutorApplicationsResponse.json();


                /* =================================================
                   SAVE DATA
                ================================================= */

                if (Array.isArray(studentsData)) {

                    setStudents(studentsData);

                } else if (studentsData.students) {

                    setStudents(studentsData.students);

                }


                if (Array.isArray(teachersData)) {

                    setTeachers(teachersData);

                } else if (teachersData.teachers) {

                    setTeachers(teachersData.teachers);

                }


                if (Array.isArray(coursesData)) {

                    setCourses(coursesData);

                } else if (coursesData.courses) {

                    setCourses(coursesData.courses);

                }


                if (Array.isArray(sessionsData)) {

                    setSessions(sessionsData);

                } else if (sessionsData.sessions) {

                    setSessions(sessionsData.sessions);

                }


                if (Array.isArray(enrollmentsData)) {

                    setEnrollments(enrollmentsData);

                } else if (enrollmentsData.enrollments) {

                    setEnrollments(
                        enrollmentsData.enrollments
                    );

                }


                if (Array.isArray(tutorApplicationsData)) {

                    setTutorApplications(
                        tutorApplicationsData
                    );

                } else if (
                    tutorApplicationsData.applications
                ) {

                    setTutorApplications(
                        tutorApplicationsData.applications
                    );

                }

            } catch (error) {

                console.error(
                    "Error loading admin dashboard:",
                    error
                );

            } finally {

                setLoading(false);

            }

        }


        loadDashboardData();

    }, []);


    /* =================================================
       COURSE OVERVIEW
    ================================================= */

    function getCourseCode(course) {

        if (!course) {
            return "";
        }


        const language =
            course.language ||
            "";


        if (language === "Chinese") {
            return "CN";
        }


        if (language === "Japanese") {
            return "JP";
        }


        if (language === "Korean") {
            return "KR";
        }


        if (language === "Malay") {
            return "MY";
        }


        if (language === "Russian") {
            return "RU";
        }


        if (language.length >= 2) {

            return language
                .substring(0, 2)
                .toUpperCase();

        }


        return "AS";

    }


    function getCourseName(course) {

        if (!course) {
            return "Course";
        }


        return (
            course.title ||
            course.name ||
            "Course"
        );

    }


    function getCourseSessions(course) {

        if (!course) {
            return [];
        }


        return sessions.filter(
            (session) => {

                const sessionCourse =
                    session.course;


                if (!sessionCourse) {
                    return false;
                }


                if (
                    typeof sessionCourse === "string"
                ) {

                    return (
                        sessionCourse ===
                        course._id
                    );

                }


                return (
                    sessionCourse._id ===
                    course._id
                );

            }
        );

    }


    function getCourseTeachers(course) {

        const courseSessions =
            getCourseSessions(course);


        const teacherIds = [];


        courseSessions.forEach(
            (session) => {

                if (!session.instructor) {
                    return;
                }


                let teacherId;


                if (
                    typeof session.instructor ===
                    "string"
                ) {

                    teacherId =
                        session.instructor;

                } else {

                    teacherId =
                        session.instructor._id;

                }


                if (
                    teacherId &&
                    !teacherIds.includes(teacherId)
                ) {

                    teacherIds.push(
                        teacherId
                    );

                }

            }
        );


        /*
         * Also check Course.teacherId
         * because some courses are linked
         * directly to a teacher.
         */

        if (course.teacherId) {

            let teacherId;


            if (
                typeof course.teacherId ===
                "string"
            ) {

                teacherId =
                    course.teacherId;

            } else {

                teacherId =
                    course.teacherId._id;

            }


            if (
                teacherId &&
                !teacherIds.includes(teacherId)
            ) {

                teacherIds.push(
                    teacherId
                );

            }

        }


        /*
         * Check Teacher.courses as well.
         */

        teachers.forEach(
            (teacher) => {

                if (
                    !Array.isArray(
                        teacher.courses
                    )
                ) {

                    return;

                }


                const teachesCourse =
                    teacher.courses.some(
                        (teacherCourse) => {

                            if (
                                !teacherCourse.courseId
                            ) {

                                return false;

                            }


                            if (
                                typeof teacherCourse.courseId ===
                                "string"
                            ) {

                                return (
                                    teacherCourse.courseId ===
                                    course._id
                                );

                            }


                            return (
                                teacherCourse.courseId._id ===
                                course._id
                            );

                        }
                    );


                if (teachesCourse) {

                    const teacherId =
                        teacher._id;


                    if (
                        teacherId &&
                        !teacherIds.includes(
                            teacherId
                        )
                    ) {

                        teacherIds.push(
                            teacherId
                        );

                    }

                }

            }
        );


        return teacherIds.length;

    }


    function getCourseStudents(course) {

        if (!course) {
            return 0;
        }


        let count = 0;


        students.forEach(
            (student) => {

                if (
                    !Array.isArray(
                        student.courses
                    )
                ) {

                    return;

                }


                const enrolled =
                    student.courses.some(
                        (studentCourse) => {

                            if (
                                !studentCourse.courseId
                            ) {

                                return false;

                            }


                            if (
                                typeof studentCourse.courseId ===
                                "string"
                            ) {

                                return (
                                    studentCourse.courseId ===
                                    course._id
                                );

                            }


                            return (
                                studentCourse.courseId._id ===
                                course._id
                            );

                        }
                    );


                if (enrolled) {

                    count++;

                }

            }
        );


        return count;

    }


    function getCourseStatus(course) {

        const courseSessions =
            getCourseSessions(course);


        if (courseSessions.length === 0) {
            return "Inactive";
        }


        const hasActiveSession =
            courseSessions.some(
                (session) => {

                    if (
                        session.enrolled >=
                        session.capacity
                    ) {

                        return false;

                    }


                    return true;

                }
            );


        if (hasActiveSession) {
            return "Active";
        }


        return "Full";

    }


    /* =================================================
       STATISTICS
    ================================================= */

    const STATS = [

        {
            icon: "fa-solid fa-user-graduate",
            value: loading
                ? "..."
                : students.length,
            label: "Students",
            path: "/admin/students"
        },

        {
            icon: "fa-solid fa-chalkboard-user",
            value: loading
                ? "..."
                : teachers.length,
            label: "Teachers",
            path: "/admin/teachers"
        },

        {
            icon: "fa-solid fa-book",
            value: loading
                ? "..."
                : courses.length,
            label: "Courses",
            path: "/admin/courses"
        },

        {
            icon: "fa-solid fa-calendar-days",
            value: loading
                ? "..."
                : sessions.length,
            label: "Sessions",
            path: "/admin/sessions"
        }

    ];


    /* =================================================
       PENDING / ATTENTION
    ================================================= */

    const PENDING = [

        {
            icon: "fa-solid fa-user-plus",
            title: "Enrollments",
            description:
                "Student enrollments to manage",
            count: loading
                ? "..."
                : enrollments.filter(
                    (enrollment) =>
                        enrollment.status === "Pending"
                ).length,
            path: "/admin/enrollments"
        },

        {
            icon: "fa-solid fa-user-tie",
            title: "Tutor Applications",
            description:
                "Applications waiting for review",
            count: loading
                ? "..."
                : tutorApplications.filter(
                    (application) =>
                        application.status === "Pending"
                ).length,
            path: "/admin/tutor-applications"
        }

    ];

    return (

        <div className="Dashboard">


            {/* =================================================
                WELCOME
            ================================================= */}

            <div className="Dashboard-welcome">

                <div className="Dashboard-welcome-text">

                    <span>
                        ADMINISTRATION
                    </span>

                    <h1>
                        Welcome back, Admin!
                    </h1>

                    <p>
                        Here's what's happening across AsiaEdu today.
                    </p>

                </div>


                <div className="Dashboard-welcome-icon">

                    <i className="fa-solid fa-graduation-cap"></i>

                </div>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="Dashboard-stats">

                {STATS.map((stat) => (

                    <button
                        className="Dashboard-stat"
                        key={stat.label}
                        onClick={() =>
                            navigate(stat.path)
                        }
                    >

                        <div className="Dashboard-stat-top">

                            <div className="Dashboard-stat-icon">

                                <i
                                    className={
                                        stat.icon
                                    }
                                ></i>

                            </div>


                            <i className="fa-solid fa-arrow-up Dashboard-stat-arrow"></i>

                        </div>


                        <strong>
                            {stat.value}
                        </strong>


                        <span className="Dashboard-stat-label">
                            {stat.label}
                        </span>

                    </button>

                ))}

            </div>


            {/* =================================================
                ATTENTION
            ================================================= */}

            <div className="Dashboard-main-grid">

                <section className="Dashboard-card Dashboard-attention">

                    <div className="Dashboard-card-header">

                        <div>

                            <span>
                                ATTENTION
                            </span>

                            <h2>
                                Needs Your Attention
                            </h2>

                        </div>


                        <i className="fa-solid fa-circle-exclamation"></i>

                    </div>


                    <div className="Dashboard-pending-list">

                        {PENDING.map((item) => (

                            <button
                                className="Dashboard-pending"
                                key={item.title}
                                onClick={() =>
                                    navigate(
                                        item.path
                                    )
                                }
                            >

                                <div className="Dashboard-pending-icon">

                                    <i
                                        className={
                                            item.icon
                                        }
                                    ></i>

                                </div>


                                <div className="Dashboard-pending-info">

                                    <strong>
                                        {item.title}
                                    </strong>

                                    <span>
                                        {item.description}
                                    </span>

                                </div>


                                <b>
                                    {item.count}
                                </b>


                                <i className="fa-solid fa-chevron-right"></i>

                            </button>

                        ))}

                    </div>

                </section>

            </div>


            {/* =================================================
                COURSE OVERVIEW
            ================================================= */}

            <section className="Dashboard-card Dashboard-courses">

                <div className="Dashboard-card-header">

                    <div>

                        <span>
                            ACADEMIC
                        </span>

                        <h2>
                            Course Overview
                        </h2>

                    </div>


                    <button
                        className="Dashboard-view-all"
                        onClick={() =>
                            navigate(
                                "/admin/courses"
                            )
                        }
                    >

                        View all

                        <i className="fa-solid fa-arrow-right"></i>

                    </button>

                </div>


                <div className="Dashboard-course-header">

                    <span>
                        COURSE
                    </span>

                    <span>
                        N° SESSIONS
                    </span>

                    <span>
                        N° TEACHERS
                    </span>

                    <span>
                        N° STUDENTS
                    </span>

                    <span>
                        STATUS
                    </span>

                </div>


                <div className="Dashboard-course-list">

                    {loading && (

                        <div className="Dashboard-course-row">

                            <div className="Dashboard-course-name">

                                <strong>
                                    Loading courses...
                                </strong>

                            </div>

                        </div>

                    )}


                    {!loading &&
                        courses.length === 0 && (

                            <div className="Dashboard-course-row">

                                <div className="Dashboard-course-name">

                                    <strong>
                                        No courses found
                                    </strong>

                                </div>

                            </div>

                        )}


                    {!loading &&
                        courses.map(
                            (course) => {

                                const courseSessions =
                                    getCourseSessions(
                                        course
                                    );


                                const teacherCount =
                                    getCourseTeachers(
                                        course
                                    );


                                const studentCount =
                                    getCourseStudents(
                                        course
                                    );


                                const status =
                                    getCourseStatus(
                                        course
                                    );


                                return (

                                    <div
                                        className="Dashboard-course-row"
                                        key={
                                            course._id
                                        }
                                    >

                                        <div className="Dashboard-course-name">

                                            <div className="Dashboard-course-code">

                                                {getCourseCode(
                                                    course
                                                )}

                                            </div>

                                            <strong>

                                                {getCourseName(
                                                    course
                                                )}

                                            </strong>

                                        </div>


                                        <span>
                                            {
                                                courseSessions.length
                                            }
                                        </span>


                                        <span>
                                            {
                                                teacherCount
                                            }
                                        </span>


                                        <span>
                                            {
                                                studentCount
                                            }
                                        </span>


                                        <b className="Dashboard-course-status">

                                            {
                                                status
                                            }

                                        </b>

                                    </div>

                                );

                            }
                        )}

                </div>

            </section>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="Dashboard-quick">

                <div className="Dashboard-quick-title">

                    <span>
                        QUICK ACTIONS
                    </span>

                    <h2>
                        Manage AsiaEdu
                    </h2>

                </div>


                <div className="Dashboard-quick-actions">

                    <button
                        onClick={() =>
                            navigate(
                                "/admin/lessons"
                            )
                        }
                    >

                        <i className="fa-solid fa-book-open"></i>

                        <span>
                            Lessons
                        </span>

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/admin/assignments"
                            )
                        }
                    >

                        <i className="fa-solid fa-file-lines"></i>

                        <span>
                            Assignments
                        </span>

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/admin/submissions"
                            )
                        }
                    >

                        <i className="fa-solid fa-clipboard-check"></i>

                        <span>
                            Submissions
                        </span>

                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/admin/grades"
                            )
                        }
                    >

                        <i className="fa-solid fa-chart-line"></i>

                        <span>
                            Grades
                        </span>

                    </button>

                </div>

            </section>


        </div>

    );

}


export default Dashboard;