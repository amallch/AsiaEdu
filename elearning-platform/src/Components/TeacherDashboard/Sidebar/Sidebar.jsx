import "./Sidebar.css";

import { NavLink } from "react-router-dom";


const NAVIGATION_GROUPS = [
    {
        title: "MAIN",
        items: [
            {
                to: "/teacher-dashboard",
                icon: "fa-solid fa-house",
                label: "Dashboard",
                end: true
            }
        ]
    },
    {
        title: "ACADEMIC",
        items: [
            {
                to: "/teacher-dashboard/lessons",
                icon: "fa-solid fa-book-open",
                label: "My Lessons"
            },
            {
                to: "/teacher-dashboard/assignments",
                icon: "fa-solid fa-file-lines",
                label: "Assignments"
            },
            {
                to: "/teacher-dashboard/submissions",
                icon: "fa-solid fa-clipboard-check",
                label: "Submissions"
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

                                            <i className={item.icon}></i>

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