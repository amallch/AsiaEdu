import "./Header.css";

import { useEffect, useState } from "react";

import {
    NavLink,
    useNavigate
} from "react-router-dom";


function Header() {

    const navigate = useNavigate();


    const [menuOpen, setMenuOpen] =
        useState(false);


    const [user, setUser] =
        useState(() => {

            const storedUser =
                localStorage.getItem("user");

            return storedUser
                ? JSON.parse(storedUser)
                : null;

        });


    /* =====================================================
       AUTHENTICATION STATE
    ====================================================== */

    useEffect(() => {

        const handleAuthChange = () => {

            const storedUser =
                localStorage.getItem("user");


            if (storedUser) {

                setUser(
                    JSON.parse(storedUser)
                );

            } else {

                setUser(null);

            }

        };


        window.addEventListener(
            "authChanged",
            handleAuthChange
        );


        return () => {

            window.removeEventListener(
                "authChanged",
                handleAuthChange
            );

        };

    }, []);


    /* =====================================================
       CLOSE MOBILE MENU
    ====================================================== */

    const closeMenu = () => {

        setMenuOpen(false);

    };


    /* =====================================================
       HEADER NAVIGATION
    ====================================================== */

    const handleNavigation = () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        closeMenu();

    };


    /* =====================================================
       LOGOUT
    ====================================================== */

    const handleLogout = () => {

        localStorage.removeItem("user");

        localStorage.removeItem("token");


        setUser(null);

        setMenuOpen(false);


        window.dispatchEvent(
            new Event("authChanged")
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        navigate("/");

    };


    /* =====================================================
       USER STATUS
    ====================================================== */

    const isStudent =
        user &&
        user.role === "student" &&
        user.studentStatus === "Active";


    const isTeacher =
        user &&
        user.role === "teacher" &&
        user.teacherStatus === "Active";


    const isAdmin =
        user &&
        user.role === "admin";


    const isActiveUser =
        isStudent || isTeacher;


    const isLoggedIn =
        user !== null;


    /* =====================================================
       DASHBOARD PATH
    ====================================================== */

    let dashboardPath = "";


    if (isTeacher) {

        dashboardPath =
            "/teacher-dashboard";

    } else if (isStudent) {

        dashboardPath =
            "/student-dashboard";

    }


    /* =====================================================
       FULL NAME
    ====================================================== */

    let fullName = "";


    if (user) {

        fullName =
            `${user.firstName || ""} ${user.lastName || ""}`.trim();

    }


    return (

        <header className="Header">

            <div className="Header-container">


                {/* =====================================================
                   LOGO
                ====================================================== */}

                <div
                    className="HeaderLogo"
                    onClick={() => {

                        handleNavigation();

                        navigate("/");

                    }}
                >

                    <div className="logo">

                        <i className="fa-solid fa-graduation-cap"></i>

                    </div>


                    <div className="webname">

                        <p>
                            AsyawiEdu
                        </p>

                        <p className="logo-desc">
                            Online Asian Language School
                        </p>

                    </div>

                </div>


                {/* =====================================================
                   DESKTOP NAVIGATION
                ====================================================== */}

                <div className="HeaderNavigation">

                    <ul>

                        <li>

                            <NavLink
                                to="/"
                                onClick={handleNavigation}
                            >
                                Home
                            </NavLink>

                        </li>


                        <li>

                            <NavLink
                                to="/courses"
                                onClick={handleNavigation}
                            >
                                Courses
                            </NavLink>

                        </li>


                        <li>

                            <NavLink
                                to="/contact"
                                onClick={handleNavigation}
                            >
                                Contact
                            </NavLink>

                        </li>


                        {/* =================================================
                           DASHBOARD
                        ================================================== */}

                        {isActiveUser && (

                            <li>

                                <NavLink
                                    to={dashboardPath}
                                    onClick={handleNavigation}
                                >
                                    My Dashboard
                                </NavLink>

                            </li>

                        )}


                        {/* =================================================
                           ADMIN DASHBOARD
                        ================================================== */}

                        {isAdmin && (

                            <li>

                                <NavLink
                                    to="/admin"
                                    onClick={handleNavigation}
                                >
                                    Admin Dashboard
                                </NavLink>

                            </li>

                        )}

                    </ul>

                </div>


                {/* =====================================================
                   HEADER ACTIONS
                ====================================================== */}

                <div className="HeaderActions">


                    {/* =================================================
                       ACCOUNT
                    ================================================== */}

                    <div className="HeaderAccount">


                        {isLoggedIn && (

                            <>

                                {/* USER INFO */}

                                <div className="HeaderUserInfo">

                                    <div className="HeaderUser">

                                        <i className="fa-regular fa-user"></i>

                                    </div>


                                    <span className="HeaderUserName">
                                        {fullName}
                                    </span>

                                </div>


                                {/* LOGOUT */}

                                <div className="HeaderLogout">

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                    >

                                        <i className="fa-solid fa-right-from-bracket"></i>

                                        <span>
                                            Logout
                                        </span>

                                    </button>

                                </div>

                            </>

                        )}


                        {!isLoggedIn && (

                            <>

                                {/* USER ICON */}

                                <div className="HeaderUser">

                                    <i className="fa-regular fa-user"></i>

                                </div>


                                <NavLink
                                    to="/signin"
                                    className="HeaderAccountLink"
                                    onClick={handleNavigation}
                                >
                                    Login
                                </NavLink>


                                <NavLink
                                    to="/signup"
                                    className="HeaderAccountLink"
                                    onClick={handleNavigation}
                                >
                                    Register
                                </NavLink>

                            </>

                        )}

                    </div>


                    {/* HAMBURGER */}

                    <button
                        className="HeaderMenuButton"
                        type="button"
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                    >

                        <i
                            className={
                                menuOpen
                                    ? "fa-solid fa-xmark"
                                    : "fa-solid fa-bars"
                            }
                        ></i>

                    </button>

                </div>

            </div>


            {/* =====================================================
               MOBILE MENU
            ====================================================== */}

            {menuOpen && (

                <div className="HeaderMobileMenu">


                    <ul>

                        <li>

                            <NavLink
                                to="/"
                                onClick={handleNavigation}
                            >
                                Home
                            </NavLink>

                        </li>


                        <li>

                            <NavLink
                                to="/courses"
                                onClick={handleNavigation}
                            >
                                Courses
                            </NavLink>

                        </li>


                        {/* =================================================
                           MOBILE DASHBOARD
                        ================================================== */}

                        {isActiveUser && (

                            <li>

                                <NavLink
                                    to={dashboardPath}
                                    onClick={handleNavigation}
                                >
                                    My Dashboard
                                </NavLink>

                            </li>

                        )}


                        {/* =================================================
                           MOBILE ADMIN DASHBOARD
                        ================================================== */}

                        {isAdmin && (

                            <li>

                                <NavLink
                                    to="/admin"
                                    onClick={handleNavigation}
                                >
                                    Admin Dashboard
                                </NavLink>

                            </li>

                        )}


                        <li>

                            <NavLink
                                to="/contact"
                                onClick={handleNavigation}
                            >
                                Contact
                            </NavLink>

                        </li>

                    </ul>


                    {/* =====================================================
                       MOBILE ACCOUNT
                    ====================================================== */}

                    <div className="HeaderMobileAccount">


                        {isLoggedIn && (

                            <>

                                <div className="HeaderMobileUser">

                                    <i className="fa-regular fa-user"></i>

                                    <span>
                                        {fullName}
                                    </span>

                                </div>


                                <div className="HeaderMobileLogout">

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                    >

                                        <i className="fa-solid fa-right-from-bracket"></i>

                                        <span>
                                            Logout
                                        </span>

                                    </button>

                                </div>

                            </>

                        )}


                        {!isLoggedIn && (

                            <>

                                <div className="HeaderMobileUser">

                                    <i className="fa-regular fa-user"></i>

                                </div>


                                <NavLink
                                    to="/signin"
                                    onClick={handleNavigation}
                                >
                                    Login
                                </NavLink>


                                <NavLink
                                    to="/signup"
                                    onClick={handleNavigation}
                                >
                                    Register
                                </NavLink>

                            </>

                        )}

                    </div>

                </div>

            )}

        </header>

    );

}


export default Header;