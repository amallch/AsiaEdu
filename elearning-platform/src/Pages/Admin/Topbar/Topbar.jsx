import "./Topbar.css";


function Topbar() {

    return (

        <header className="Topbar">

            {/* =========================
                LEFT
            ========================= */}

            <div className="Topbar-left">

                <div className="Topbar-pageInfo">

                    <span>
                        Admin Portal
                    </span>

                    <h2>
                        Administration Dashboard
                    </h2>

                </div>

            </div>


            {/* =========================
                RIGHT
            ========================= */}

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
                    ADMIN PROFILE
                ========================= */}

                <div className="Topbar-profile">

                    <div className="Topbar-avatar">
                        AD
                    </div>

                    <div className="Topbar-profile-info">

                        <strong>
                            Admin
                        </strong>

                        <span>
                            Administrator
                        </span>

                    </div>

                    <i className="fa-solid fa-chevron-down Topbar-profile-arrow"></i>

                </div>

            </div>

        </header>

    );

}


export default Topbar;