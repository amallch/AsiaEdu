import "./TeacherDashboard.css";

import Sidebar from "../../components/TeacherDashboard/Sidebar/Sidebar";

import {
    useEffect,
    useState
} from "react";

import {
    Navigate,
    Outlet
} from "react-router-dom";


function TeacherDashboard() {

    const [checkingStatus, setCheckingStatus] =
        useState(true);

    const [isActive, setIsActive] =
        useState(false);


    useEffect(() => {

        const checkTeacherStatus = async () => {

            try {

                const savedUser =
                    localStorage.getItem("user");


                if (!savedUser) {

                    setIsActive(false);
                    setCheckingStatus(false);

                    return;
                }


                const user =
                    JSON.parse(savedUser);


                const response =
                    await fetch(
                        `http://localhost:5000/api/teachers/user/${user.id}`
                    );


                if (!response.ok) {

                    setIsActive(false);
                    setCheckingStatus(false);

                    return;
                }


                const teacher =
                    await response.json();


                if (
                    teacher.status ===
                    "Active"
                ) {

                    setIsActive(true);

                } else {

                    setIsActive(false);

                }


                setCheckingStatus(false);

            } catch (error) {

                console.error(
                    "Error checking teacher status:",
                    error
                );

                setIsActive(false);
                setCheckingStatus(false);

            }

        };


        checkTeacherStatus();

    }, []);


    if (checkingStatus) {

        return null;

    }


    if (!isActive) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    return (

        <div className="TeacherDashboard">

            <div className="TeacherDashboard-container">

                {/* =========================
                    SIDEBAR
                ========================= */}

                <Sidebar />


                {/* =========================
                    OUTLET
                ========================= */}

                <main className="TeacherDashboard-main">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}


export default TeacherDashboard;