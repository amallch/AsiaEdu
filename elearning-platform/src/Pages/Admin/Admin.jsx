import "./Admin.css";

import Sidebar from "./Sidebar/Sidebar";

import { Outlet } from "react-router-dom";


function Admin() {

    return (

        <div className="Admin">

            <div className="Admin-container">

                <Sidebar />

                <main className="Admin-main">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}


export default Admin;