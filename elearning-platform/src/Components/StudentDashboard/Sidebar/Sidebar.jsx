import "./Sidebar.css";

import { NavLink } from "react-router-dom";


const NAVIGATION_GROUPS = [
    {
        title: "MAIN",
        items: [
            {
                to: "/student-dashboard",
                icon: "fa-solid fa-house",
                label: "Dashboard",
                end: true
            }
        ]
    },
    {
        title: "LEARNING",
        items: [
            {
                to: "/student-dashboard/lessons",
                icon: "fa-solid fa-book-open",
                label: "My Lessons"
            },
            {
                to: "/student-dashboard/assignments",
                icon: "fa-solid fa-file-lines",
                label: "Assignments"
            },
            {
                to: "/student-dashboard/grades",
                icon: "fa-solid fa-chart-line",
                label: "Grades"
            }
        ]
    },
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