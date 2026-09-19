import "./Profile.css";

import { useState } from "react";

function Profile() {

    const [activeTab, setActiveTab] = useState("personal");

    return (

        <section className="Profile">

            <div className="Profile-container">

                {/* Heading */}

                <div className="Profile-heading">

                    <h2>
                        Profile Settings
                    </h2>

                    <p>
                        Manage your account settings and preferences
                    </p>

                </div>


                {/* Profile Overview */}

                <div className="Profile-overview">

                    <div className="Profile-user">

                        <div className="Profile-avatar">
                            JD
                        </div>


                        <div className="Profile-user-info">

                            <h3>
                                John Doe
                            </h3>

                            <p>
                                john.doe@student.edu
                            </p>


                            <div className="Profile-badges">

                                <span className="Profile-role">
                                    Student
                                </span>

                                <span className="Profile-status">
                                    Active
                                </span>

                            </div>

                        </div>

                    </div>


                    <button className="Profile-photo-button">
                        Change Photo
                    </button>


                    {/* Statistics */}

                    <div className="Profile-statistics">

                        <div className="Profile-stat">

                            <strong>
                                4
                            </strong>

                            <span>
                                Courses
                            </span>

                        </div>


                        <div className="Profile-stat">

                            <strong>
                                58
                            </strong>

                            <span>
                                Lessons
                            </span>

                        </div>


                        <div className="Profile-stat">

                            <strong>
                                92%
                            </strong>

                            <span>
                                Avg Grade
                            </span>

                        </div>


                        <div className="Profile-stat">

                            <strong>
                                3
                            </strong>

                            <span>
                                Certificates
                            </span>

                        </div>

                    </div>

                </div>


                {/* Tabs */}

                <div className="Profile-tabs">

                    <button
                        className={
                            activeTab === "personal"
                                ? "Profile-tab active"
                                : "Profile-tab"
                        }
                        onClick={() => setActiveTab("personal")}
                    >
                        Personal Info
                    </button>


                    <button
                        className={
                            activeTab === "notifications"
                                ? "Profile-tab active"
                                : "Profile-tab"
                        }
                        onClick={() => setActiveTab("notifications")}
                    >
                        Notifications
                    </button>


                    <button
                        className={
                            activeTab === "security"
                                ? "Profile-tab active"
                                : "Profile-tab"
                        }
                        onClick={() => setActiveTab("security")}
                    >
                        Security
                    </button>

                </div>


                {/* Personal Information */}

                {activeTab === "personal" && (

                    <div className="Profile-information">

                        <h3>
                            Personal Information
                        </h3>


                        <div className="Profile-form">

                            <div className="Profile-field">

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    value="John"
                                    readOnly
                                />

                            </div>


                            <div className="Profile-field">

                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    value="Doe"
                                    readOnly
                                />

                            </div>


                            <div className="Profile-field">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value="john.doe@student.edu"
                                    readOnly
                                />

                            </div>


                            <div className="Profile-field">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    value="+213 555 123 456"
                                    readOnly
                                />

                            </div>


                            <div className="Profile-field Profile-field-full">

                                <label>
                                    Country
                                </label>

                                <input
                                    type="text"
                                    value="Algeria"
                                    readOnly
                                />

                            </div>

                        </div>


                        <div className="Profile-actions">

                            <button className="Profile-save-button">
                                Save Changes
                            </button>

                        </div>

                    </div>

                )}


                {/* Notifications */}

                {activeTab === "notifications" && (

                    <div className="Profile-information">

                        <h3>
                            Notification Settings
                        </h3>


                        <div className="Profile-setting">

                            <div>

                                <h4>
                                    Course Updates
                                </h4>

                                <p>
                                    Receive notifications about your courses.
                                </p>

                            </div>

                            <input
                                type="checkbox"
                                defaultChecked
                            />

                        </div>


                        <div className="Profile-setting">

                            <div>

                                <h4>
                                    Assignment Reminders
                                </h4>

                                <p>
                                    Get reminders about upcoming assignments.
                                </p>

                            </div>

                            <input
                                type="checkbox"
                                defaultChecked
                            />

                        </div>


                        <div className="Profile-setting">

                            <div>

                                <h4>
                                    New Messages
                                </h4>

                                <p>
                                    Receive notifications when you get a message.
                                </p>

                            </div>

                            <input
                                type="checkbox"
                                defaultChecked
                            />

                        </div>

                    </div>

                )}


                {/* Security */}

                {activeTab === "security" && (

                    <div className="Profile-information">

                        <h3>
                            Security
                        </h3>


                        <div className="Profile-field">

                            <label>
                                Current Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter current password"
                            />

                        </div>


                        <div className="Profile-field">

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter new password"
                            />

                        </div>


                        <div className="Profile-field">

                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                placeholder="Confirm new password"
                            />

                        </div>


                        <div className="Profile-actions">

                            <button className="Profile-save-button">
                                Update Password
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </section>
    );
}

export default Profile;