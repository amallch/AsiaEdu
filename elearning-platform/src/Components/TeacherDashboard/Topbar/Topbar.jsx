import "./Topbar.css";

function Topbar() {

    return (

        <header className="Topbar">

            <div className="Topbar-left">

                <div className="Topbar-pageInfo">

                    <span>
                        Teacher Portal
                    </span>

                    <h2>
                        Teaching Dashboard
                    </h2>

                </div>

            </div>


            <div className="Topbar-right">

                {/* Notifications */}

                <button className="Topbar-notification">

                    <i className="fa-regular fa-bell"></i>

                    <span className="Topbar-notification-dot"></span>

                </button>


                {/* Divider */}

                <div className="Topbar-divider"></div>


                {/* Teacher Profile */}

                <div className="Topbar-profile">

                    <div className="Topbar-avatar">
                        LM
                    </div>

                    <div className="Topbar-profile-info">

                        <strong>
                            Li Ming
                        </strong>

                        <span>
                            Teacher
                        </span>

                    </div>

                    <i className="fa-solid fa-chevron-down Topbar-profile-arrow"></i>

                </div>

            </div>

        </header>

    );

}

export default Topbar;