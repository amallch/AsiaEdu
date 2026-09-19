import "./Notifications.css";

import { useState } from "react";


const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        type: "enrollment",
        icon: "fa-solid fa-user-plus",
        title: "New Student Enrollment",
        message: "Amal Chaouchi enrolled in Chinese Language.",
        time: "10 minutes ago",
        read: false
    },
    {
        id: 2,
        type: "submission",
        icon: "fa-solid fa-file-circle-check",
        title: "New Submission",
        message: "Sara Benali submitted Chinese Greetings Practice.",
        time: "35 minutes ago",
        read: false
    },
    {
        id: 3,
        type: "teacher",
        icon: "fa-solid fa-chalkboard-user",
        title: "Teacher Activity",
        message: "Li Ming created a new assignment.",
        time: "1 hour ago",
        read: true
    },
    {
        id: 4,
        type: "enrollment",
        icon: "fa-solid fa-user-plus",
        title: "New Student Enrollment",
        message: "Yasmine Haddad enrolled in Korean Language.",
        time: "2 hours ago",
        read: true
    },
    {
        id: 5,
        type: "submission",
        icon: "fa-solid fa-file-circle-check",
        title: "Pending Submission",
        message: "Lina Haddad's Hangul Vocabulary submission is waiting for grading.",
        time: "3 hours ago",
        read: false
    },
    {
        id: 6,
        type: "system",
        icon: "fa-solid fa-circle-info",
        title: "System Update",
        message: "The platform settings were successfully updated.",
        time: "Yesterday",
        read: true
    }
];


function Notifications() {

    const [notifications, setNotifications] = useState(
        INITIAL_NOTIFICATIONS
    );

    const [filter, setFilter] = useState("All");


    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;


    const filteredNotifications = notifications.filter(
        (notification) => {

            if (filter === "Unread") {
                return !notification.read;
            }

            if (filter === "Read") {
                return notification.read;
            }

            return true;

        }
    );


    const markAsRead = (id) => {

        setNotifications(
            notifications.map((notification) => {

                if (notification.id === id) {

                    return {
                        ...notification,
                        read: true
                    };

                }

                return notification;

            })
        );

    };


    const markAllAsRead = () => {

        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                read: true
            }))
        );

    };


    const deleteNotification = (id) => {

        setNotifications(
            notifications.filter(
                (notification) => notification.id !== id
            )
        );

    };


    return (

        <div className="Notifications">


            <div className="Notifications-header">

                <div>

                    <span>
                        System Center
                    </span>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Stay updated with important activity across AsiaEdu.
                    </p>

                </div>


                <div className="Notifications-header-actions">

                    {unreadCount > 0 && (

                        <button
                            className="Notifications-mark-all"
                            onClick={markAllAsRead}
                        >

                            <i className="fa-solid fa-check-double"></i>

                            Mark all as read

                        </button>

                    )}

                </div>

            </div>


            <div className="Notifications-toolbar">


                <div className="Notifications-count">

                    <strong>
                        {unreadCount}
                    </strong>

                    <span>
                        Unread notifications
                    </span>

                </div>


                <div className="Notifications-filters">

                    <button
                        className={
                            filter === "All"
                                ? "Notifications-filter active"
                                : "Notifications-filter"
                        }
                        onClick={() => setFilter("All")}
                    >
                        All
                    </button>

                    <button
                        className={
                            filter === "Unread"
                                ? "Notifications-filter active"
                                : "Notifications-filter"
                        }
                        onClick={() => setFilter("Unread")}
                    >
                        Unread
                    </button>

                    <button
                        className={
                            filter === "Read"
                                ? "Notifications-filter active"
                                : "Notifications-filter"
                        }
                        onClick={() => setFilter("Read")}
                    >
                        Read
                    </button>

                </div>

            </div>


            <div className="Notifications-list">


                {filteredNotifications.map((notification) => (

                    <div
                        key={notification.id}
                        className={
                            notification.read
                                ? "Notifications-item"
                                : "Notifications-item unread"
                        }
                    >


                        <div
                            className={
                                "Notifications-icon " +
                                notification.type
                            }
                        >

                            <i className={notification.icon}></i>

                        </div>


                        <div className="Notifications-content">

                            <div className="Notifications-title-row">

                                <strong>
                                    {notification.title}
                                </strong>

                                {!notification.read && (

                                    <span className="Notifications-new">
                                        New
                                    </span>

                                )}

                            </div>


                            <p>
                                {notification.message}
                            </p>


                            <span className="Notifications-time">

                                <i className="fa-regular fa-clock"></i>

                                {notification.time}

                            </span>

                        </div>


                        <div className="Notifications-actions">


                            {!notification.read && (

                                <button
                                    title="Mark as read"
                                    onClick={() =>
                                        markAsRead(notification.id)
                                    }
                                >

                                    <i className="fa-solid fa-check"></i>

                                </button>

                            )}


                            <button
                                title="Delete"
                                onClick={() =>
                                    deleteNotification(notification.id)
                                }
                            >

                                <i className="fa-solid fa-trash"></i>

                            </button>

                        </div>

                    </div>

                ))}


                {filteredNotifications.length === 0 && (

                    <div className="Notifications-empty">

                        <div className="Notifications-empty-icon">

                            <i className="fa-regular fa-bell-slash"></i>

                        </div>

                        <strong>
                            No notifications
                        </strong>

                        <span>
                            You're all caught up.
                        </span>

                    </div>

                )}

            </div>

        </div>

    );

}


export default Notifications;