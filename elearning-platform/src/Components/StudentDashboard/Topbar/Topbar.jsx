import "./Topbar.css";

function Topbar() {

    return (

        <header className="Topbar">

            <div className="Topbar-left">

                <div className="Topbar-pageInfo">

                    <span>
                        Student Portal
                    </span>

                    <h2>
                        Learning Dashboard
                    </h2>

                </div>

            </div>


            <div className="Topbar-right">


                {/* =========================
                    NOTIFICATIONS
                ========================= */}

                <button className="Topbar-notification">

                    <i className="fa-regular fa-bell"></i>

                    <span className="Topbar-notification-dot"></span>

                </button>


                {/* =========================
                    DIVIDER
                ========================= */}

                <div className="Topbar-divider"></div>


                {/* =========================
                    STUDENT PROFILE
                ========================= */}

                <div className="Topbar-profile">

                    <div className="Topbar-avatar">
                        AC
                    </div>

                    <div className="Topbar-profile-info">

                        <strong>
                            Amal Chaouchi
                        </strong>

                        <span>
                            Student
                        </span>

                    </div>

                    <i className="fa-solid fa-chevron-down Topbar-profile-arrow"></i>

                </div>

            </div>

        </header>

    );

}

export default Topbar;
