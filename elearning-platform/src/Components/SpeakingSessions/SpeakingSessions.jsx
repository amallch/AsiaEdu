import "./SpeakingSessions.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import chinaflag from "../../assets/chinaflagbadge.avif";
import japanflag from "../../assets/japanflagbadge.jpg";
import koreaflag from "../../assets/koreaflagbadge.jpg";
import russianflag from "../../assets/russiaflagbadge.jpg";
import malayflag from "../../assets/malysiaflagbadge.jpg";


/* =========================================================
   LANGUAGE FLAGS
========================================================= */

const LANGUAGE_FLAGS = {

    Chinese: chinaflag,
    Japanese: japanflag,
    Korean: koreaflag,
    Russian: russianflag,
    Malay: malayflag

};


/* =========================================================
   LEVEL META
========================================================= */

const LEVEL_META = {

    Intermediate: {
        badgeBg: "#FFE8D6",
        badgeColor: "#E35D1C"
    },

    Advanced: {
        badgeBg: "#E9E3FF",
        badgeColor: "#6D4FDB"
    }

};


/* =========================================================
   TEACHERS
========================================================= */

const TEACHERS = {

    Chinese: {
        name: "Li Ming"
    },

    Japanese: {
        name: "Sakura Tanaka"
    },

    Korean: {
        name: "Kim Ji-hoon"
    },

    Russian: {
        name: "Anna Ivanova"
    },

    Malay: {
        name: "Aisha Rahman"
    }

};


/* =========================================================
   SESSIONS
========================================================= */

const SESSIONS = [

    {
        id: 2,
        language: "Chinese",
        level: "Intermediate",
        category: "Conversation",
        classType: "Small Group",
        title: "Daily Mandarin Conversations",
        description:
            "Practise real-life Chinese conversations and build confidence through everyday topics and situations.",
        topics: [
            "Restaurant & shopping",
            "Directions",
            "Small talk"
        ],
        duration: "45 min",
        price: "12,000 DA",
        startDate: "August 16, 2026"
    },

    {
        id: 3,
        language: "Chinese",
        level: "Advanced",
        category: "Business",
        classType: "Individual",
        title: "Business Chinese & Debate",
        description:
            "Discuss business, culture, and current events while developing natural and persuasive Mandarin.",
        topics: [
            "Business meetings",
            "Chengyu & idioms",
            "Persuasive speaking"
        ],
        duration: "1 hour",
        price: "500 DA / hour",
        startDate: "August 17, 2026"
    },


    {
        id: 5,
        language: "Japanese",
        level: "Intermediate",
        category: "Culture",
        classType: "Small Group",
        title: "Everyday Japanese Conversations",
        description:
            "Build fluency through real dialogues, everyday situations, and Japanese cultural topics.",
        topics: [
            "Restaurant & shopping",
            "Giving directions",
            "Small talk"
        ],
        duration: "45 min",
        price: "12,000 DA",
        startDate: "August 19, 2026"
    },

    {
        id: 6,
        language: "Japanese",
        level: "Advanced",
        category: "Business",
        classType: "Individual",
        title: "Business Japanese & Keigo",
        description:
            "Master keigo, discuss current events, and communicate confidently in professional Japanese.",
        topics: [
            "Business meetings",
            "Keigo (honorifics)",
            "News discussion"
        ],
        duration: "1 hour",
        price: "500 DA / hour",
        startDate: "August 20, 2026"
    },


    {
        id: 8,
        language: "Korean",
        level: "Intermediate",
        category: "Conversation",
        classType: "Small Group",
        title: "Daily Korean Conversations",
        description:
            "Practice real conversations and understand how Korean formality levels affect everyday speech.",
        topics: [
            "Restaurant & shopping",
            "Directions",
            "Formality levels"
        ],
        duration: "45 min",
        price: "12,000 DA",
        startDate: "August 22, 2026"
    },

    {
        id: 9,
        language: "Korean",
        level: "Advanced",
        category: "Culture",
        classType: "Individual",
        title: "Advanced Korean & Debate",
        description:
            "Discuss business, culture, and current events using natural Korean expressions and vocabulary.",
        topics: [
            "Business meetings",
            "Idioms & slang",
            "News discussion"
        ],
        duration: "1 hour",
        price: "500 DA / hour",
        startDate: "August 23, 2026"
    },


    {
        id: 11,
        language: "Russian",
        level: "Intermediate",
        category: "Conversation",
        classType: "Small Group",
        title: "Daily Russian Conversations",
        description:
            "Practice real dialogues and develop your Russian through practical everyday conversations.",
        topics: [
            "Restaurant & shopping",
            "Directions",
            "Cases in context"
        ],
        duration: "45 min",
        price: "12,000 DA",
        startDate: "August 25, 2026"
    },

    {
        id: 12,
        language: "Russian",
        level: "Advanced",
        category: "Business",
        classType: "Individual",
        title: "Business Russian & Debate",
        description:
            "Hold confident professional and cultural discussions using natural Russian expressions.",
        topics: [
            "Business meetings",
            "Idioms & proverbs",
            "News discussion"
        ],
        duration: "1 hour",
        price: "500 DA / hour",
        startDate: "August 26, 2026"
    },


    {
        id: 14,
        language: "Malay",
        level: "Intermediate",
        category: "Conversation",
        classType: "Small Group",
        title: "Daily Malay Conversations",
        description:
            "Build real fluency through everyday conversations and common Malay word-building patterns.",
        topics: [
            "Restaurant & shopping",
            "Directions",
            "Affixes in context"
        ],
        duration: "45 min",
        price: "12,000 DA",
        startDate: "August 28, 2026"
    },

    {
        id: 15,
        language: "Malay",
        level: "Advanced",
        category: "Business",
        classType: "Individual",
        title: "Business Malay & Debate",
        description:
            "Discuss business and current events fluently using natural expressions and persuasive speech.",
        topics: [
            "Business meetings",
            "Idioms & proverbs",
            "News discussion"
        ],
        duration: "1 hour",
        price: "500 DA / hour",
        startDate: "August 29, 2026"
    }

];


const LANGUAGES = [
    "Chinese",
    "Japanese",
    "Korean",
    "Russian",
    "Malay"
];

const LEVELS = [
    "Intermediate",
    "Advanced"
];

const CLASS_TYPES = [
    "Individual",
    "Small Group"
];


/* =========================================================
   COMPONENT
========================================================= */

function SpeakingSessions() {

    const navigate = useNavigate();

    const [language, setLanguage] = useState("All");
    const [level, setLevel] = useState("All");
    const [classType, setClassType] = useState("All");
    const [search, setSearch] = useState("");


    /* =====================================================
       FILTER
    ===================================================== */

    const filtered = SESSIONS.filter((session) => {

        const matchesLanguage =
            language === "All" ||
            session.language === language;

        const matchesLevel =
            level === "All" ||
            session.level === level;

        const matchesClassType =
            classType === "All" ||
            session.classType === classType;

        const searchText = search.toLowerCase();

        const matchesSearch =
            session.title.toLowerCase().includes(searchText) ||
            session.language.toLowerCase().includes(searchText) ||
            session.category.toLowerCase().includes(searchText) ||
            session.description.toLowerCase().includes(searchText) ||
            session.topics.some((topic) =>
                topic.toLowerCase().includes(searchText)
            );

        return (
            matchesLanguage &&
            matchesLevel &&
            matchesClassType &&
            matchesSearch
        );

    });


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const clearFilters = () => {

        setLanguage("All");
        setLevel("All");
        setClassType("All");
        setSearch("");

    };


    /* =====================================================
       BOOK SESSION
    ===================================================== */

    const handleBookSession = (session) => {

        const teacher = TEACHERS[session.language];
        const meta = LEVEL_META[session.level];

        navigate("/enrollment", {

            state: {
                type: "session",
                item: session,
                teacher,
                meta
            }

        });

    };


    /* =====================================================
       REQUIREMENT
    ===================================================== */

    const getRequirement = (session) => {

        if (session.level === "Intermediate") {

            if (session.language === "Chinese") {

                return "Basics required • Beginner course + HSK 2";

            }

            return "Basics required • Beginner course completed";

        }


        if (session.level === "Advanced") {

            return "Intermediate level required";

        }


        return "";

    };


    return (

        <section className="SpeakingSessions">

            <div className="SpeakingSessions-container">


                {/* =================================================
                   FILTERS
                ================================================= */}

                <div className="SessionFilters">

                    <div className="SessionFilters-header">

                        <h3>
                            <i className="fa-solid fa-sliders"></i>
                            Filters
                        </h3>

                        <button
                            type="button"
                            className="SessionFilters-clear"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>

                    </div>


                    {/* SEARCH */}

                    <div className="SessionSearch">

                        <i className="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            placeholder="Search sessions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>


                    <div className="SessionFilters-options">


                        {/* LANGUAGE */}

                        <div className="SessionFilters-group">

                            <label>Language</label>

                            <select
                                value={language}
                                onChange={(e) =>
                                    setLanguage(e.target.value)
                                }
                            >

                                <option value="All">
                                    All Languages
                                </option>

                                {LANGUAGES.map((item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* LEVEL */}

                        <div className="SessionFilters-group">

                            <label>Level</label>

                            <select
                                value={level}
                                onChange={(e) =>
                                    setLevel(e.target.value)
                                }
                            >

                                <option value="All">
                                    All Levels
                                </option>

                                {LEVELS.map((item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* GROUP TYPE */}

                        <div className="SessionFilters-group">

                            <label>Group Type</label>

                            <select
                                value={classType}
                                onChange={(e) =>
                                    setClassType(e.target.value)
                                }
                            >

                                <option value="All">
                                    Individual or Small Group
                                </option>

                                {CLASS_TYPES.map((item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                </div>


                {/* =================================================
                   SESSIONS
                ================================================= */}

                <div className="SessionsList">

                    {filtered.length === 0 ? (

                        <div className="SessionsList-empty">

                            <i className="fa-regular fa-face-frown"></i>

                            <p>
                                No sessions match your filters.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        </div>

                    ) : (

                        filtered.map((session) => {

                            const meta =
                                LEVEL_META[session.level];

                            const teacher =
                                TEACHERS[session.language];

                            const flag =
                                LANGUAGE_FLAGS[session.language];


                            return (

                                <div
                                    className="SessionRow"
                                    key={session.id}
                                    onClick={() =>
                                        handleBookSession(session)
                                    }
                                >

                                    <div className="SessionRow-main">


                                        {/* =================================================
                                           LEFT
                                        ================================================= */}

                                        <div className="SessionRow-info">


                                            {/* TOP */}

                                            <div className="SessionRow-top">

                                                <div className="SessionRow-language">

                                                    <img
                                                        src={flag}
                                                        alt={session.language}
                                                    />

                                                    <span>
                                                        {session.language}
                                                    </span>

                                                </div>


                                                <span
                                                    className="SessionBadge level"
                                                    style={{
                                                        background:
                                                            meta.badgeBg,
                                                        color:
                                                            meta.badgeColor
                                                    }}
                                                >
                                                    {session.level}
                                                </span>

                                            </div>


                                            {/* TITLE */}

                                            <h3>
                                                {session.title}
                                            </h3>


                                            {/* TEACHER */}

                                            <div className="SessionRow-teacher">

                                                <i className="fa-solid fa-chalkboard-user"></i>

                                                <span>
                                                    {teacher.name}
                                                </span>

                                            </div>


                                            {/* DESCRIPTION */}

                                            <p>
                                                {session.description}
                                            </p>


                                            {/* TOPICS */}

                                            <div className="SessionRow-topics">

                                                <span className="SessionTopics-label">
                                                    Topics:
                                                </span>

                                                {session.topics.map(
                                                    (topic, index) => (

                                                        <span
                                                            key={index}
                                                        >
                                                            {topic}
                                                        </span>

                                                    )
                                                )}

                                            </div>


                                            {/* REQUIREMENT */}

                                            <div className="SessionRow-requirement">

                                                <i className="fa-solid fa-circle-info"></i>

                                                <span>
                                                    <strong>
                                                        Requirement:
                                                    </strong>{" "}
                                                    {getRequirement(session)}
                                                </span>

                                            </div>

                                        </div>


                                        {/* =================================================
                                           RIGHT
                                        ================================================= */}

                                        <div className="SessionRow-side">


                                            {/* DETAILS */}

                                            <div className="SessionRow-details">


                                                <div className="SessionRow-detail">

                                                    <i className="fa-regular fa-clock"></i>

                                                    <span>
                                                        {session.duration}
                                                    </span>

                                                </div>


                                                <div className="SessionRow-detail">

                                                    {session.classType === "Small Group" ? (

                                                        <i className="fa-solid fa-users"></i>

                                                    ) : (

                                                        <i className="fa-solid fa-user"></i>

                                                    )}

                                                    <span>
                                                        {session.classType}
                                                    </span>

                                                </div>


                                                <div className="SessionRow-detail">

                                                    <i className="fa-regular fa-calendar"></i>

                                                    <span>
                                                        {session.startDate}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* PRICE */}

                                            <div className="SessionRow-priceBlock">

                                                <span>
                                                    {session.classType ===
                                                    "Small Group"
                                                        ? "Course price"
                                                        : "Hourly price"}
                                                </span>

                                                <strong>
                                                    {session.price}
                                                </strong>

                                            </div>


                                            {/* BUTTON */}

                                            <button
                                                type="button"
                                                className="SessionRow-book"
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    handleBookSession(
                                                        session
                                                    );

                                                }}
                                            >
                                                Book Session
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );

                        })

                    )}

                </div>

            </div>

        </section>

    );

}


export default SpeakingSessions;