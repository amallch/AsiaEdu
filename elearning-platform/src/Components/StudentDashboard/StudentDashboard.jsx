import "./StudentDashboard.css";

import Sidebar from "../../components/StudentDashboard/Sidebar/Sidebar";

import {
    useEffect,
    useState
} from "react";

import {
    Navigate,
    Outlet
} from "react-router-dom";


function StudentDashboard() {

    const [checkingStatus, setCheckingStatus] =
        useState(true);

    const [isActive, setIsActive] =
        useState(false);


    useEffect(() => {

        const checkStudentStatus = async () => {

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
                        `http://localhost:5000/api/students/user/${user.id}`
                    );


                if (!response.ok) {

                    setIsActive(false);
                    setCheckingStatus(false);

                    return;
                }


                const student =
                    await response.json();


                if (
                    student.status ===
                    "Active"
                ) {

                    setIsActive(true);

                } else {

                    setIsActive(false);

                }


                setCheckingStatus(false);

            } catch (error) {

                console.error(
                    "Error checking student status:",
                    error
                );

                setIsActive(false);
                setCheckingStatus(false);

            }

        };


        checkStudentStatus();

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

        <div className="StudentDashboard">

            <div className="StudentDashboard-container">

                <Sidebar />

                <main className="StudentDashboard-main">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}


export default StudentDashboard;