import "./Sidebar.css";

import { NavLink } from "react-router-dom";


const NAVIGATION_GROUPS = [
    {
        title: "MAIN",
        items: [
            {
                to: "/admin",
                icon: "fa-solid fa-house",
                label: "Dashboard",
                end: true
            }
        ]
    },
    {
        title: "PEOPLE",
        items: [
            {
                to: "/admin/students",
                icon: "fa-solid fa-user-graduate",
                label: "Students"
            },
            {
                to: "/admin/teachers",
                icon: "fa-solid fa-chalkboard-user",
                label: "Teachers"
            }
        ]
    },
    {
        title: "ACADEMIC",
        items: [
            {
                to: "/admin/courses",
                icon: "fa-solid fa-book",
                label: "Courses"
            },
            {
                to: "/admin/sessions",
                icon: "fa-solid fa-users",
                label: "Sessions"
            },
            {
                to: "/admin/lessons",
                icon: "fa-solid fa-book-open",
                label: "Lessons"
            },
            {
                to: "/admin/assignments",
                icon: "fa-solid fa-file-lines",
                label: "Assignments"
            },
            {
                to: "/admin/submissions",
                icon: "fa-solid fa-clipboard-check",
                label: "Submissions"
            },
            {
                to: "/admin/grades",
                icon: "fa-solid fa-chart-line",
                label: "Grades"
            }
        ]
    },
    {
        title: "MANAGEMENT",
        items: [
            {
                to: "/admin/enrollments",
                icon: "fa-solid fa-user-plus",
                label: "Enrollments"
            },
            {
                to: "/admin/tutor-applications",
                icon: "fa-solid fa-chalkboard-user",
                label: "Tutor Applications"
            },
            {
                to: "/admin/contact",
                icon: "fa-solid fa-envelope",
                label: "Contact Messages"
            },
            {
                to: "/admin/reviews",
                icon: "fa-solid fa-star",
                label: "Reviews"
            }
        ]
    }
];


function Sidebar() {

    return (

        <aside className="Sidebar">


            {/* =================================================
               NAVIGATION
            ================================================= */}

            <nav className="Sidebar-nav">

                {NAVIGATION_GROUPS.map(
                    (group) => (

                        <div
                            className="Sidebar-group"
                            key={group.title}
                        >

                            <div className="Sidebar-group-title">
                                {group.title}
                            </div>


                            <div className="Sidebar-group-items">

                                {group.items.map(
                                    (item) => (

                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            end={item.end}
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "Sidebar-link active"
                                                    : "Sidebar-link"
                                            }
                                        >

                                            <i
                                                className={item.icon}
                                            ></i>

                                            <span>
                                                {item.label}
                                            </span>

                                        </NavLink>

                                    )
                                )}

                            </div>

                        </div>

                    )
                )}

            </nav>

        </aside>

    );

}


export default Sidebar;