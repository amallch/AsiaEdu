import "./TeacherStudents.css";

import { useState } from "react";


const COURSES = [
    {
        id: 1,
        name: "Chinese Language",
        level: "Beginner",
        icon: "🇨🇳"
    },
    {
        id: 2,
        name: "Japanese Language",
        level: "Intermediate",
        icon: "🇯🇵"
    },
    {
        id: 3,
        name: "Korean Language",
        level: "Beginner",
        icon: "🇰🇷"
    },
    {
        id: 4,
        name: "Malay Language",
        level: "Advanced",
        icon: "🇲🇾"
    }
];


const STUDENTS = [
    {
        id: 1,
        courseId: 1,
        name: "Amal Chaouchi",
        email: "amal@example.com",
        level: "Beginner",
        progress: 78,
        lessons: "8 / 10",
        assignments: "3 / 4",
        status: "Active"
    },
    {
        id: 2,
        courseId: 1,
        name: "Sarah Benali",
        email: "sarah@example.com",
        level: "Beginner",
        progress: 92,
        lessons: "9 / 10",
        assignments: "4 / 4",
        status: "Active"
    },
    {
        id: 3,
        courseId: 1,
        name: "Yasmine Haddad",
        email: "yasmine@example.com",
        level: "Beginner",
        progress: 61,
        lessons: "6 / 10",
        assignments: "2 / 4",
        status: "Active"
    },
    {
        id: 4,
        courseId: 2,
        name: "Lina Mansouri",
        email: "lina@example.com",
        level: "Intermediate",
        progress: 85,
        lessons: "8 / 10",
        assignments: "4 / 4",
        status: "Active"
    },
    {
        id: 5,
        courseId: 2,
        name: "Meriem Saidi",
        email: "meriem@example.com",
        level: "Intermediate",
        progress: 73,
        lessons: "7 / 10",
        assignments: "3 / 4",
        status: "Active"
    },
    {
        id: 6,
        courseId: 3,
        name: "Aya Khelifa",
        email: "aya@example.com",
        level: "Beginner",
        progress: 66,
        lessons: "6 / 10",
        assignments: "2 / 4",
        status: "Active"
    },
    {
        id: 7,
        courseId: 4,
        name: "Nour Boudiaf",
        email: "nour@example.com",
        level: "Advanced",
        progress: 94,
        lessons: "9 / 10",
        assignments: "4 / 4",
        status: "Active"
    }
];


function TeacherStudents() {

    const [selectedCourseId, setSelectedCourseId] = useState(1);

    const selectedCourse = COURSES.find(
        (course) => course.id === selectedCourseId
    );


    const courseStudents = STUDENTS.filter(
        (student) => student.courseId === selectedCourseId
    );


    const activeStudents = courseStudents.filter(
        (student) => student.status === "Active"
    ).length;


    const averageProgress = courseStudents.length > 0
        ? Math.round(
            courseStudents.reduce(
                (total, student) => total + student.progress,
                0
            ) / courseStudents.length
        )
        : 0;


    return (

        <section className="TeacherStudents">

            <div className="TeacherStudents-container">


                {/* =========================
                    HEADING
                ========================= */}

                <div className="TeacherStudents-heading">

                    <h2>
                        My Students
                    </h2>

                    <p>
                        View and manage the students enrolled in your courses.
                    </p>

                </div>


                {/* =========================
                    COURSE SELECTOR
                ========================= */}

                <div className="TeacherStudents-courseSelector">

                    <div className="TeacherStudents-selectorHeading">

                        <div className="TeacherStudents-selectorIcon">

                            <i className="fa-solid fa-users"></i>

                        </div>

                        <div>

                            <span>
                                Select Course
                            </span>

                            <p>
                                Choose a course to view its students
                            </p>

                        </div>

                    </div>


                    <div className="TeacherStudents-selectWrapper">

                        <span className="TeacherStudents-courseFlag">
                            {selectedCourse.icon}
                        </span>

                        <select
                            value={selectedCourseId}
                            onChange={(event) =>
                                setSelectedCourseId(
                                    Number(event.target.value)
                                )
                            }
                            className="TeacherStudents-select"
                        >

                            {COURSES.map((course) => (

                                <option
                                    key={course.id}
                                    value={course.id}
                                >
                                    {course.name} • {course.level}
                                </option>

                            ))}

                        </select>

                        <i className="fa-solid fa-chevron-down"></i>

                    </div>

                </div>


                {/* =========================
                    SELECTED COURSE
                ========================= */}

                <div className="TeacherStudents-selectedCourse">

                    <div className="TeacherStudents-selectedCourse-left">

                        <div className="TeacherStudents-selectedCourse-icon">
                            {selectedCourse.icon}
                        </div>

                        <div>

                            <h3>
                                {selectedCourse.name}
                            </h3>

                            <p>
                                {selectedCourse.level} • Your enrolled students
                            </p>

                        </div>

                    </div>


                    <div className="TeacherStudents-selectedCourse-stats">

                        <div>

                            <strong>
                                {courseStudents.length}
                            </strong>

                            <span>
                                Students
                            </span>

                        </div>


                        <div>

                            <strong>
                                {activeStudents}
                            </strong>

                            <span>
                                Active
                            </span>

                        </div>


                        <div>

                            <strong>
                                {averageProgress}%
                            </strong>

                            <span>
                                Avg. Progress
                            </span>

                        </div>

                    </div>

                </div>


                {/* =========================
                    STUDENTS LIST
                ========================= */}

                <div className="TeacherStudents-list">

                    {courseStudents.map((student) => (

                        <div
                            className="TeacherStudents-card"
                            key={student.id}
                        >


                            {/* Student Avatar */}

                            <div className="TeacherStudents-avatar">

                                {student.name.charAt(0)}

                            </div>


                            {/* Student Information */}

                            <div className="TeacherStudents-content">

                                <div className="TeacherStudents-titleRow">

                                    <div>

                                        <h3>
                                            {student.name}
                                        </h3>

                                        <p>
                                            {student.email}
                                        </p>

                                    </div>


                                    <span className="TeacherStudents-status">
                                        {student.status}
                                    </span>

                                </div>


                                {/* Details */}

                                <div className="TeacherStudents-details">

                                    <span>

                                        <i className="fa-solid fa-signal"></i>

                                        {student.level}

                                    </span>


                                    <span>

                                        <i className="fa-solid fa-book-open"></i>

                                        {student.lessons} Lessons

                                    </span>


                                    <span>

                                        <i className="fa-solid fa-file-lines"></i>

                                        {student.assignments} Assignments

                                    </span>

                                </div>


                                {/* Progress */}

                                <div className="TeacherStudents-progressSection">

                                    <div className="TeacherStudents-progressInfo">

                                        <span>
                                            Course Progress
                                        </span>

                                        <strong>
                                            {student.progress}%
                                        </strong>

                                    </div>


                                    <div className="TeacherStudents-progress">

                                        <div
                                            className="TeacherStudents-progressFill"
                                            style={{
                                                width: `${student.progress}%`
                                            }}
                                        ></div>

                                    </div>

                                </div>

                            </div>


                            {/* Action */}

                            <button className="TeacherStudents-button">

                                View Student

                                <i className="fa-solid fa-arrow-right"></i>

                            </button>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}


export default TeacherStudents;