import "./Settings.css";

import { useState } from "react";


function Settings() {

    const [platformName, setPlatformName] = useState("AsiaEdu");

    const [description, setDescription] = useState(
        "Online Asian Language School"
    );

    const [email, setEmail] = useState("admin@asiaedu.com");

    const [newEnrollments, setNewEnrollments] = useState(true);

    const [newSubmissions, setNewSubmissions] = useState(true);

    const [teacherActivity, setTeacherActivity] = useState(true);

    const [systemAlerts, setSystemAlerts] = useState(true);

    const [saved, setSaved] = useState(false);


    const handleSave = () => {

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2500);

    };


    return (

        <div className="Settings">


            <div className="Settings-header">

                <div>

                    <span>
                        Administration
                    </span>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage your AsiaEdu platform and administration preferences.
                    </p>

                </div>

            </div>


            <div className="Settings-content">


                {/* =========================
                    ADMIN PROFILE
                ========================= */}

                <section className="Settings-section">

                    <div className="Settings-section-header">

                        <div className="Settings-section-icon">

                            <i className="fa-regular fa-user"></i>

                        </div>

                        <div>

                            <h2>
                                Admin Profile
                            </h2>

                            <p>
                                Your administrator account information.
                            </p>

                        </div>

                    </div>


                    <div className="Settings-profile">

                        <div className="Settings-avatar">
                            AD
                        </div>

                        <div className="Settings-profile-info">

                            <strong>
                                Admin
                            </strong>

                            <span>
                                Administrator
                            </span>

                            <small>
                                admin@asiaedu.com
                            </small>

                        </div>

                    </div>


                    <div className="Settings-divider"></div>


                    <div className="Settings-form-grid">

                        <div className="Settings-field">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                value="Admin"
                                readOnly
                            />

                        </div>


                        <div className="Settings-field">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                            />

                        </div>

                    </div>

                </section>


                {/* =========================
                    PLATFORM SETTINGS
                ========================= */}

                <section className="Settings-section">

                    <div className="Settings-section-header">

                        <div className="Settings-section-icon">

                            <i className="fa-solid fa-globe"></i>

                        </div>

                        <div>

                            <h2>
                                Platform Settings
                            </h2>

                            <p>
                                Customize the basic information of your platform.
                            </p>

                        </div>

                    </div>


                    <div className="Settings-form">

                        <div className="Settings-field">

                            <label>
                                Website Name
                            </label>

                            <input
                                type="text"
                                value={platformName}
                                onChange={(event) =>
                                    setPlatformName(event.target.value)
                                }
                            />

                        </div>


                        <div className="Settings-field">

                            <label>
                                Website Description
                            </label>

                            <input
                                type="text"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />

                        </div>

                    </div>

                </section>


                {/* =========================
                    NOTIFICATIONS
                ========================= */}

                <section className="Settings-section">

                    <div className="Settings-section-header">

                        <div className="Settings-section-icon">

                            <i className="fa-regular fa-bell"></i>

                        </div>

                        <div>

                            <h2>
                                Notification Settings
                            </h2>

                            <p>
                                Choose which activities you want to monitor.
                            </p>

                        </div>

                    </div>


                    <div className="Settings-options">


                        <div className="Settings-option">

                            <div>

                                <strong>
                                    New Enrollments
                                </strong>

                                <span>
                                    Notify me when a student enrolls in a course.
                                </span>

                            </div>


                            <button
                                className={
                                    newEnrollments
                                        ? "Settings-toggle active"
                                        : "Settings-toggle"
                                }
                                onClick={() =>
                                    setNewEnrollments(!newEnrollments)
                                }
                            >

                                <span></span>

                            </button>

                        </div>


                        <div className="Settings-option">

                            <div>

                                <strong>
                                    New Submissions
                                </strong>

                                <span>
                                    Notify me when students submit assignments.
                                </span>

                            </div>


                            <button
                                className={
                                    newSubmissions
                                        ? "Settings-toggle active"
                                        : "Settings-toggle"
                                }
                                onClick={() =>
                                    setNewSubmissions(!newSubmissions)
                                }
                            >

                                <span></span>

                            </button>

                        </div>


                        <div className="Settings-option">

                            <div>

                                <strong>
                                    Teacher Activity
                                </strong>

                                <span>
                                    Notify me about important teacher activity.
                                </span>

                            </div>


                            <button
                                className={
                                    teacherActivity
                                        ? "Settings-toggle active"
                                        : "Settings-toggle"
                                }
                                onClick={() =>
                                    setTeacherActivity(!teacherActivity)
                                }
                            >

                                <span></span>

                            </button>

                        </div>


                        <div className="Settings-option">

                            <div>

                                <strong>
                                    System Alerts
                                </strong>

                                <span>
                                    Receive important platform alerts.
                                </span>

                            </div>


                            <button
                                className={
                                    systemAlerts
                                        ? "Settings-toggle active"
                                        : "Settings-toggle"
                                }
                                onClick={() =>
                                    setSystemAlerts(!systemAlerts)
                                }
                            >

                                <span></span>

                            </button>

                        </div>

                    </div>

                </section>


                {/* =========================
                    SECURITY
                ========================= */}

                <section className="Settings-section">

                    <div className="Settings-section-header">

                        <div className="Settings-section-icon">

                            <i className="fa-solid fa-shield-halved"></i>

                        </div>

                        <div>

                            <h2>
                                Security
                            </h2>

                            <p>
                                Manage your administrator account security.
                            </p>

                        </div>

                    </div>


                    <div className="Settings-security">


                        <div className="Settings-security-item">

                            <div>

                                <strong>
                                    Password
                                </strong>

                                <span>
                                    Last changed recently
                                </span>

                            </div>


                            <button>
                                Change Password
                            </button>

                        </div>


                        <div className="Settings-security-item">

                            <div>

                                <strong>
                                    Administrator Access
                                </strong>

                                <span>
                                    Full administrative access
                                </span>

                            </div>


                            <span className="Settings-role">
                                Administrator
                            </span>

                        </div>

                    </div>

                </section>


            </div>


            {/* =========================
                SAVE
            ========================= */}

            <div className="Settings-footer">

                {saved && (

                    <span className="Settings-saved">

                        <i className="fa-solid fa-circle-check"></i>

                        Settings saved successfully

                    </span>

                )}


                <button
                    className="Settings-save"
                    onClick={handleSave}
                >

                    <i className="fa-solid fa-check"></i>

                    Save Changes

                </button>

            </div>


        </div>

    );

}


export default Settings;