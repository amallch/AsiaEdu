import "./ContactMessages.css";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


function ContactMessages() {

    const [contacts, setContacts] = useState([]);

    const [search, setSearch] = useState("");

    const [yearFilter, setYearFilter] = useState("All");

    const [deleteContact, setDeleteContact] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const navigate = useNavigate();


    /* =====================================================
       GET CONTACT MESSAGES FROM BACKEND
    ===================================================== */

    useEffect(() => {

        const fetchContacts = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    "http://localhost:5000/api/contact"
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch contact messages"
                    );

                }


                const data = await response.json();


                setContacts(
                    data.contacts || []
                );

                setError("");

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load contact messages."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchContacts();

    }, []);


    /* =====================================================
       AVAILABLE YEARS
    ===================================================== */

    const availableYears = [
        ...new Set(
            contacts
                .map((contact) => {

                    if (!contact.createdAt) {

                        return null;

                    }

                    return new Date(
                        contact.createdAt
                    ).getFullYear();

                })
                .filter(Boolean)
        )
    ].sort((a, b) => b - a);


    /* =====================================================
       FILTER CONTACT MESSAGES
    ===================================================== */

    const filteredContacts = contacts.filter((contact) => {

        const fullName =
            `${contact.firstName || ""} ${contact.lastName || ""}`
                .toLowerCase();

        const email =
            contact.email?.toLowerCase() || "";

        const subject =
            contact.subject?.toLowerCase() || "";

        const message =
            contact.message?.toLowerCase() || "";

        const searchValue =
            search.toLowerCase();


        const matchesSearch =
            fullName.includes(searchValue) ||
            email.includes(searchValue) ||
            subject.includes(searchValue) ||
            message.includes(searchValue);


        const matchesYear =
            yearFilter === "All" ||
            (
                contact.createdAt &&
                new Date(
                    contact.createdAt
                ).getFullYear() ===
                Number(yearFilter)
            );


        return (
            matchesSearch &&
            matchesYear
        );

    });


    /* =====================================================
       VIEW CONTACT MESSAGE
    ===================================================== */

    const viewContactMessage = (contactId) => {

        navigate(
            `/admin/contact/${contactId}`
        );

    };


    /* =====================================================
       DELETE CONTACT MESSAGE
    ===================================================== */

    const confirmDelete = async () => {

        if (!deleteContact) {

            return;

        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/contact/${deleteContact._id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete contact message"
                );

            }


            setContacts((currentContacts) =>
                currentContacts.filter(
                    (contact) =>
                        contact._id !== deleteContact._id
                )
            );


            setDeleteContact(null);


        } catch (error) {

            console.error(error);

            setError(
                "Failed to delete contact message."
            );

        }

    };


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (date) => {

        if (!date) {

            return "N/A";

        }


        return new Date(date).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    };


    return (

        <div className="ContactMessages">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="ContactMessages-header">

                <div>

                    <span>
                        Management
                    </span>

                    <h1>
                        Contact Messages
                    </h1>

                    <p>
                        Manage messages received from AsiaEdu visitors.
                    </p>

                </div>


                <div className="ContactMessages-total">

                    <strong>
                        {contacts.length}
                    </strong>

                    <span>
                        Total Messages
                    </span>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="ContactMessages-filters">


                {/* SEARCH */}

                <div className="ContactMessages-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>


                {/* YEAR FILTER */}

                <div className="ContactMessages-year-filter">

                    <i className="fa-regular fa-calendar"></i>

                    <select
                        value={yearFilter}
                        onChange={(event) =>
                            setYearFilter(event.target.value)
                        }
                    >

                        <option value="All">
                            All Years
                        </option>

                        {availableYears.map(
                            (year) => (

                                <option
                                    key={year}
                                    value={year}
                                >
                                    {year}
                                </option>

                            )
                        )}

                    </select>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="ContactMessages-error">

                    {error}

                </div>

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="ContactMessages-card">

                <div className="ContactMessages-table-wrapper">

                    <table className="ContactMessages-table">

                        <thead>

                            <tr>

                                <th>
                                    Sender
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Phone
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {/* =================================================
                                LOADING
                            ================================================= */}

                            {loading && (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="ContactMessages-empty"
                                    >

                                        Loading contact messages...

                                    </td>

                                </tr>

                            )}


                            {/* =================================================
                                CONTACT MESSAGES
                            ================================================= */}

                            {!loading &&
                                filteredContacts.map((contact) => (

                                    <tr key={contact._id}>


                                        {/* SENDER */}

                                        <td>

                                            <div className="ContactMessages-user">

                                                <div className="ContactMessages-avatar">

                                                    {`${contact.firstName || ""} ${contact.lastName || ""}`
                                                        .trim()
                                                        .split(" ")
                                                        .map(
                                                            (name) =>
                                                                name[0]
                                                        )
                                                        .join("")
                                                    }

                                                </div>


                                                <strong className="ContactMessages-name">

                                                    {contact.firstName}{" "}
                                                    {contact.lastName}

                                                </strong>

                                            </div>

                                        </td>


                                        {/* EMAIL */}

                                        <td>

                                            <span className="ContactMessages-email">

                                                {contact.email}

                                            </span>

                                        </td>


                                        {/* PHONE */}

                                        <td>

                                            <span className="ContactMessages-phone">

                                                {contact.phone}

                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td>

                                            <span className="ContactMessages-date">

                                                {formatDate(
                                                    contact.createdAt
                                                )}

                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="ContactMessages-actions">


                                                {/* VIEW */}

                                                <button
                                                    className="ContactMessages-view"
                                                    onClick={() =>
                                                        viewContactMessage(
                                                            contact._id
                                                        )
                                                    }
                                                    aria-label="View contact message"
                                                >

                                                    <i className="fa-solid fa-eye"></i>

                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    className="ContactMessages-delete"
                                                    onClick={() =>
                                                        setDeleteContact(
                                                            contact
                                                        )
                                                    }
                                                    aria-label="Delete contact message"
                                                >

                                                    <i className="fa-solid fa-trash"></i>

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))
                            }


                            {/* =================================================
                                EMPTY
                            ================================================= */}

                            {!loading &&
                                filteredContacts.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="ContactMessages-empty"
                                        >

                                            No contact messages found.

                                        </td>

                                    </tr>

                                )
                            }

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            {deleteContact && (

                <div className="ContactMessages-modal-overlay">

                    <div className="ContactMessages-delete-modal">


                        <div className="ContactMessages-delete-icon">

                            <i className="fa-solid fa-trash"></i>

                        </div>


                        <h2>
                            Delete Message?
                        </h2>


                        <p>

                            Are you sure you want to delete the message from{" "}

                            <strong>
                                {deleteContact.firstName}{" "}
                                {deleteContact.lastName}
                            </strong>

                            ? This action cannot be undone.

                        </p>


                        <div className="ContactMessages-delete-actions">

                            <button
                                className="ContactMessages-cancel-delete"
                                onClick={() =>
                                    setDeleteContact(null)
                                }
                            >

                                Cancel

                            </button>


                            <button
                                className="ContactMessages-confirm-delete"
                                onClick={confirmDelete}
                            >

                                <i className="fa-solid fa-trash"></i>

                                Delete

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default ContactMessages;