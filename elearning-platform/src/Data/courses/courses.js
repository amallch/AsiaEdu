import chinaflag from "../../assets/chinaflagbadge.avif";
import japanflag from "../../assets/japanflagbadge.jpg";
import koreaflag from "../../assets/koreaflagbadge.jpg";
import russianflag from "../../assets/russiaflagbadge.jpg";
import malayflag from "../../assets/malysiaflagbadge.jpg";


const courses = [

    // =====================================================
    // CHINESE — BEGINNER
    // =====================================================

    {
        id: 1,
        language: "Chinese",
        flag: chinaflag,
        level: "Beginner",
        classType: "Small Group",
        startDate: "Sep 15",
        title: "Chinese HSK 1",
        teacher: "Li Ming",
        rating: "4.9",
        students: "1.2K",
        lessons: 24,
        duration: "8 Weeks",
        price: "9,800 DA",
        image: null,

        description:
            "A complete beginner Chinese course designed to help you build a strong foundation in Mandarin through practical conversations, pronunciation, vocabulary, and HSK 1 preparation.",

        learnPoints: [
            "Master Pinyin and Mandarin pronunciation",
            "Build a vocabulary of 500+ essential Chinese words",
            "Introduce yourself and communicate in everyday situations",
            "Understand basic Chinese sentence structures",
            "Talk about family, food, shopping, and daily activities",
            "Understand numbers, dates, time, and prices",
            "Read and write essential Chinese characters",
            "Prepare confidently for the HSK 1 examination"
        ],

        syllabus: [
            {
                title: "Module 1: Mandarin Foundations",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Introduction to Mandarin Chinese",
                    "Pinyin and Initial Sounds",
                    "Mandarin Tones and Pronunciation",
                    "Basic Greetings and Introductions",
                    "Numbers and Basic Counting",
                    "Dates, Time and Days of the Week"
                ]
            },
            {
                title: "Module 2: Everyday Chinese",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Talking About Yourself",
                    "Family and Relationships",
                    "Countries and Nationalities",
                    "Daily Routines",
                    "Food and Drinks",
                    "Ordering at a Restaurant"
                ]
            },
            {
                title: "Module 3: Communication Skills",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Shopping and Prices",
                    "Asking for Directions",
                    "Transportation",
                    "Weather and Seasons",
                    "Making Simple Plans",
                    "Expressing Likes and Dislikes"
                ]
            },
            {
                title: "Module 4: HSK 1 Practice",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Essential HSK 1 Vocabulary Review",
                    "Basic Grammar Review",
                    "Reading Practice",
                    "Listening Practice",
                    "Speaking Practice",
                    "HSK 1 Mock Examination"
                ]
            }
        ],

        instructor: {
            name: "Li Ming",
            credentials: "Native Mandarin Instructor • HSK Certified • 8+ Years Experience",
            avatar: chinaflag,
            stats: [
                { label: "Students", value: "1.2K" },
                { label: "Courses", value: "5" },
                { label: "Rating", value: "4.9" }
            ],
            bio: "Li Ming is a native Mandarin speaker and experienced Chinese language instructor. He specializes in helping international students build confidence from their first Chinese words. His lessons combine structured HSK preparation with practical conversations, pronunciation training, and real-life situations."
        },

        reviews: {
            average: "4.9",
            count: "186",
            list: [
                {
                    name: "Sarah Williams",
                    date: "2 weeks ago",
                    stars: 5,
                    comment: "Li Ming explains pronunciation incredibly well. I finally understand Mandarin tones and feel much more confident speaking Chinese."
                },
                {
                    name: "Adam Johnson",
                    date: "1 month ago",
                    stars: 5,
                    comment: "The classes are very interactive and practical. We don't just memorize vocabulary; we actually use it in conversations."
                },
                {
                    name: "Nour Benali",
                    date: "1 month ago",
                    stars: 5,
                    comment: "Perfect course for beginners. The HSK exercises and listening activities helped me improve much faster than I expected."
                }
            ]
        }
    },


    {
        id: 2,
        language: "Chinese",
        flag: chinaflag,
        level: "Beginner",
        classType: "Small Group",
        startDate: "Sep 18",
        title: "Chinese HSK 2",
        teacher: "Chen Wei",
        rating: "4.9",
        students: "980",
        lessons: 26,
        duration: "9 Weeks",
        price: "9,800 DA",
        image: null,

        description:
            "Continue your Mandarin journey with HSK 2. This course expands your vocabulary, grammar, listening, and speaking skills while introducing more natural everyday conversations.",

        learnPoints: [
            "Build a vocabulary of 800+ Chinese words",
            "Use common Chinese grammar patterns naturally",
            "Talk about daily routines and personal experiences",
            "Describe people, places, and activities",
            "Understand short everyday conversations",
            "Improve Chinese reading and writing",
            "Handle shopping, travel, and social situations",
            "Prepare for the HSK 2 examination"
        ],

        syllabus: [
            {
                title: "Module 1: Expanding Your Vocabulary",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "HSK 2 Vocabulary Foundations",
                    "Daily Activities and Routines",
                    "Describing People",
                    "Describing Places",
                    "Common Adjectives",
                    "Vocabulary Review"
                ]
            },
            {
                title: "Module 2: Practical Conversations",
                summary: "7 lessons • 2 weeks",
                lessons: [
                    "Making Appointments",
                    "Talking About Hobbies",
                    "Shopping and Bargaining",
                    "Transportation and Travel",
                    "At the Doctor",
                    "Talking About the Weather",
                    "Conversation Workshop"
                ]
            },
            {
                title: "Module 3: Grammar & Sentence Building",
                summary: "7 lessons • 2 weeks",
                lessons: [
                    "Time Expressions",
                    "Comparisons",
                    "Using 过",
                    "Using 在 and 正在",
                    "Result Complements",
                    "Common Question Patterns",
                    "Grammar Practice"
                ]
            },
            {
                title: "Module 4: HSK 2 Preparation",
                summary: "6 lessons • 3 weeks",
                lessons: [
                    "Reading Strategies",
                    "Listening Strategies",
                    "Speaking Practice",
                    "Vocabulary Review",
                    "Mock Test",
                    "Final HSK 2 Preparation"
                ]
            }
        ],

        instructor: {
            name: "Chen Wei",
            credentials: "Mandarin Instructor • HSK Specialist • 7+ Years Experience",
            avatar: chinaflag,
            stats: [
                { label: "Students", value: "980" },
                { label: "Courses", value: "4" },
                { label: "Rating", value: "4.9" }
            ],
            bio: "Chen Wei is an experienced Mandarin instructor specializing in helping beginner and lower-intermediate students move beyond memorized phrases. His teaching focuses on practical communication, grammar accuracy, and building confidence through guided conversation."
        },

        reviews: {
            average: "4.9",
            count: "154",
            list: [
                {
                    name: "Maya Carter",
                    date: "1 week ago",
                    stars: 5,
                    comment: "Chen Wei makes grammar much easier to understand. Every lesson feels organized and useful."
                },
                {
                    name: "Youssef K.",
                    date: "3 weeks ago",
                    stars: 5,
                    comment: "I can now have simple conversations in Chinese without constantly translating in my head."
                },
                {
                    name: "Emily Brown",
                    date: "1 month ago",
                    stars: 4,
                    comment: "Very good course with lots of speaking practice. The listening exercises were especially helpful."
                }
            ]
        }
    },


    // =====================================================
    // JAPANESE — BEGINNER
    // =====================================================

    {
        id: 7,
        language: "Japanese",
        flag: japanflag,
        level: "Beginner",
        classType: "Small Group",
        startDate: "Sep 16",
        title: "Japanese JLPT N5",
        teacher: "Sakura Tanaka",
        rating: "4.8",
        students: "1.0K",
        lessons: 24,
        duration: "8 Weeks",
        price: "9,800 DA",
        image: null,

        description:
            "A complete Japanese beginner course covering Hiragana, Katakana, essential grammar, everyday vocabulary, and JLPT N5 preparation.",

        learnPoints: [
            "Read and write Hiragana",
            "Read and write Katakana",
            "Build essential Japanese vocabulary",
            "Master basic Japanese sentence patterns",
            "Introduce yourself in Japanese",
            "Talk about daily activities",
            "Understand basic Japanese conversations",
            "Prepare for JLPT N5"
        ],

        syllabus: [
            {
                title: "Module 1: Japanese Writing & Sounds",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Introduction to Japanese",
                    "Hiragana",
                    "Katakana",
                    "Japanese Pronunciation",
                    "Greetings and Introductions",
                    "Numbers and Time"
                ]
            },
            {
                title: "Module 2: Basic Japanese",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Particles は and が",
                    "Particles を and に",
                    "Family and People",
                    "Daily Activities",
                    "Food and Drinks",
                    "Shopping"
                ]
            },
            {
                title: "Module 3: Everyday Conversations",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Talking About Hobbies",
                    "Making Plans",
                    "Asking for Directions",
                    "Transportation",
                    "Weather",
                    "Simple Conversations"
                ]
            },
            {
                title: "Module 4: JLPT N5 Preparation",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "N5 Vocabulary Review",
                    "N5 Grammar Review",
                    "Reading Practice",
                    "Listening Practice",
                    "Mock Test",
                    "Final JLPT N5 Preparation"
                ]
            }
        ],

        instructor: {
            name: "Sakura Tanaka",
            credentials: "Native Japanese Instructor • JLPT Specialist • 8+ Years Experience",
            avatar: japanflag,
            stats: [
                { label: "Students", value: "1.0K" },
                { label: "Courses", value: "5" },
                { label: "Rating", value: "4.8" }
            ],
            bio: "Sakura Tanaka is a native Japanese instructor passionate about helping international students discover Japanese language and culture. Her lessons combine structured JLPT preparation with practical conversation and cultural context."
        },

        reviews: {
            average: "4.8",
            count: "163",
            list: [
                {
                    name: "Emma Davis",
                    date: "1 week ago",
                    stars: 5,
                    comment: "Sakura explains Japanese grammar in such a simple way. I especially enjoyed the speaking activities."
                },
                {
                    name: "Karim A.",
                    date: "2 weeks ago",
                    stars: 5,
                    comment: "The Hiragana and Katakana lessons were very clear. Great course for complete beginners."
                },
                {
                    name: "Lina M.",
                    date: "1 month ago",
                    stars: 4,
                    comment: "Really enjoyable course and the JLPT exercises are very useful."
                }
            ]
        }
    },


    {
        id: 8,
        language: "Japanese",
        flag: japanflag,
        level: "Beginner",
        classType: "Small Group",
        startDate: "Sep 20",
        title: "Japanese JLPT N4",
        teacher: "Yuki Nakamura",
        rating: "4.9",
        students: "860",
        lessons: 28,
        duration: "10 Weeks",
        price: "9,800 DA",
        image: null,

        description:
            "Build on your Japanese foundation and develop stronger grammar, vocabulary, reading, listening, and conversational skills for JLPT N4.",

        learnPoints: [
            "Expand Japanese vocabulary",
            "Strengthen grammar knowledge",
            "Read simple Japanese passages",
            "Understand everyday conversations",
            "Use common verb forms",
            "Talk about past and future events",
            "Improve listening comprehension",
            "Prepare for JLPT N4"
        ],

        syllabus: [
            {
                title: "Module 1: N4 Grammar Foundations",
                summary: "7 lessons • 2 weeks",
                lessons: [
                    "N4 Vocabulary",
                    "Verb Conjugation",
                    "Past and Future Forms",
                    "Adjectives",
                    "Particles Review",
                    "Giving and Receiving",
                    "Grammar Practice"
                ]
            },
            {
                title: "Module 2: Daily Japanese",
                summary: "7 lessons • 2 weeks",
                lessons: [
                    "Daily Life",
                    "School and Work",
                    "Travel",
                    "Health",
                    "Shopping",
                    "Making Requests",
                    "Social Conversations"
                ]
            },
            {
                title: "Module 3: Reading & Listening",
                summary: "7 lessons • 3 weeks",
                lessons: [
                    "Short Japanese Texts",
                    "Signs and Notices",
                    "Messages and Emails",
                    "Listening for Key Information",
                    "Conversation Listening",
                    "Reading Comprehension",
                    "Practice Workshop"
                ]
            },
            {
                title: "Module 4: JLPT N4 Preparation",
                summary: "7 lessons • 3 weeks",
                lessons: [
                    "Vocabulary Review",
                    "Grammar Review",
                    "Reading Practice",
                    "Listening Practice",
                    "Mock Examination",
                    "Error Analysis",
                    "Final Review"
                ]
            }
        ],

        instructor: {
            name: "Yuki Nakamura",
            credentials: "Japanese Language Instructor • JLPT N4 Specialist",
            avatar: japanflag,
            stats: [
                { label: "Students", value: "860" },
                { label: "Courses", value: "4" },
                { label: "Rating", value: "4.9" }
            ],
            bio: "Yuki Nakamura specializes in helping students progress from basic Japanese toward independent communication. Her lessons focus on grammar accuracy, listening comprehension, and practical Japanese used in everyday situations."
        },

        reviews: {
            average: "4.9",
            count: "127",
            list: [
                {
                    name: "Sophia Lee",
                    date: "2 weeks ago",
                    stars: 5,
                    comment: "Yuki's explanations are extremely clear. The course helped me understand Japanese grammar much better."
                },
                {
                    name: "Omar B.",
                    date: "1 month ago",
                    stars: 5,
                    comment: "Very structured course with lots of useful exercises."
                }
            ]
        }
    },


    // =====================================================
    // KOREAN — BEGINNER
    // =====================================================

    {
        id: 13,
        language: "Korean",
        flag: koreaflag,
        level: "Beginner",
        classType: "Small Group",
        startDate: "Sep 17",
        title: "Korean TOPIK 1",
        teacher: "Kim Ji-hoon",
        rating: "4.9",
        students: "860",
        lessons: 24,
        duration: "8 Weeks",
        price: "9,800 DA",
        image: null,

        description:
            "Start learning Korean from the beginning with Hangul, pronunciation, essential vocabulary, basic grammar, and TOPIK 1 preparation.",

        learnPoints: [
            "Read and write Hangul",
            "Master Korean pronunciation",
            "Build essential Korean vocabulary",
            "Introduce yourself in Korean",
            "Understand basic sentence structures",
            "Talk about everyday activities",
            "Practice basic Korean conversations",
            "Prepare for TOPIK 1"
        ],

        syllabus: [
            {
                title: "Module 1: Hangul Foundations",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Introduction to Korean",
                    "Hangul Consonants",
                    "Hangul Vowels",
                    "Writing Korean Syllables",
                    "Pronunciation Rules",
                    "Greetings"
                ]
            },
            {
                title: "Module 2: Basic Korean",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Self Introduction",
                    "Family",
                    "Numbers",
                    "Dates and Time",
                    "Daily Activities",
                    "Food and Drinks"
                ]
            },
            {
                title: "Module 3: Everyday Communication",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Shopping",
                    "Transportation",
                    "Directions",
                    "Weather",
                    "Hobbies",
                    "Making Plans"
                ]
            },
            {
                title: "Module 4: TOPIK 1 Preparation",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "TOPIK Vocabulary",
                    "Grammar Review",
                    "Reading Practice",
                    "Listening Practice",
                    "Mock Test",
                    "Final Preparation"
                ]
            }
        ],

        instructor: {
            name: "Kim Ji-hoon",
            credentials: "Native Korean Instructor • TOPIK Specialist • 8+ Years Experience",
            avatar: koreaflag,
            stats: [
                { label: "Students", value: "860" },
                { label: "Courses", value: "5" },
                { label: "Rating", value: "4.9" }
            ],
            bio: "Kim Ji-hoon is a native Korean instructor who specializes in beginner Korean and TOPIK preparation. His lessons make Korean grammar and pronunciation approachable while giving students plenty of opportunities to speak."
        },

        reviews: {
            average: "4.9",
            count: "141",
            list: [
                {
                    name: "Olivia Smith",
                    date: "1 week ago",
                    stars: 5,
                    comment: "Kim Ji-hoon made Hangul so easy to learn. The classes are fun and very practical."
                },
                {
                    name: "Amine R.",
                    date: "2 weeks ago",
                    stars: 5,
                    comment: "Great introduction to Korean. I can already read Hangul after a few weeks."
                }
            ]
        }
    },


    {
        id: 14,
        language: "Korean",
        flag: koreaflag,
        level: "Beginner",
        classType: "Small Group",
        startDate: "Sep 21",
        title: "Korean TOPIK 2",
        teacher: "Park Min-seo",
        rating: "4.8",
        students: "780",
        lessons: 28,
        duration: "9 Weeks",
        price: "9,800 DA",
        image: null,

        description:
            "Continue your Korean journey with stronger grammar, vocabulary, reading, listening, and practical conversation for TOPIK 2.",

        learnPoints: [
            "Expand Korean vocabulary",
            "Understand essential grammar patterns",
            "Describe experiences and routines",
            "Improve listening skills",
            "Read short Korean passages",
            "Write basic Korean texts",
            "Handle everyday conversations",
            "Prepare for TOPIK 2"
        ],

        syllabus: [
            {
                title: "Module 1: Korean Grammar",
                summary: "7 lessons • 2 weeks",
                lessons: [
                    "TOPIK 2 Vocabulary",
                    "Verb Conjugation",
                    "Past and Future",
                    "Particles",
                    "Adjectives",
                    "Connectors",
                    "Grammar Review"
                ]
            },
            {
                title: "Module 2: Daily Communication",
                summary: "7 lessons • 2 weeks",
                lessons: [
                    "School and Work",
                    "Shopping",
                    "Travel",
                    "Health",
                    "Making Requests",
                    "Giving Opinions",
                    "Conversation Practice"
                ]
            },
            {
                title: "Module 3: Reading & Listening",
                summary: "7 lessons • 2 weeks",
                lessons: [
                    "Short Texts",
                    "Messages",
                    "Signs",
                    "Listening for Details",
                    "Conversation Listening",
                    "Reading Comprehension",
                    "Practice Workshop"
                ]
            },
            {
                title: "Module 4: TOPIK 2 Preparation",
                summary: "7 lessons • 3 weeks",
                lessons: [
                    "Vocabulary Review",
                    "Grammar Review",
                    "Reading Test",
                    "Listening Test",
                    "Mock Examination",
                    "Error Analysis",
                    "Final Review"
                ]
            }
        ],

        instructor: {
            name: "Park Min-seo",
            credentials: "Korean Language Instructor • TOPIK Specialist • 7+ Years Experience",
            avatar: koreaflag,
            stats: [
                { label: "Students", value: "780" },
                { label: "Courses", value: "4" },
                { label: "Rating", value: "4.8" }
            ],
            bio: "Park Min-seo is a Korean language instructor focused on helping beginners develop practical communication skills. Her teaching style combines structured grammar lessons with conversation and cultural activities."
        },

        reviews: {
            average: "4.8",
            count: "126",
            list: [
                {
                    name: "Mina K.",
                    date: "2 weeks ago",
                    stars: 5,
                    comment: "Very clear explanations and lots of useful Korean expressions."
                },
                {
                    name: "Rayan B.",
                    date: "1 month ago",
                    stars: 5,
                    comment: "The listening exercises really helped me understand Korean conversations."
                }
            ]
        }
    },


    // =====================================================
    // MALAY — BEGINNER
    // =====================================================

    {
        id: 19,
        language: "Malay",
        flag: malayflag,
        level: "Beginner",
        classType: "Small Group",
        startDate: "Sep 19",
        title: "Malay Beginner 1",
        teacher: "Aisha Binti Hassan",
        rating: "4.8",
        students: "720",
        lessons: 24,
        duration: "8 Weeks",
        price: "9,800 DA",
        image: null,

        description:
            "A beginner-friendly Malay course covering pronunciation, everyday vocabulary, grammar, conversation, and practical communication.",

        learnPoints: [
            "Build essential Malay vocabulary",
            "Understand basic Malay grammar",
            "Introduce yourself",
            "Talk about family and daily life",
            "Order food and shop",
            "Ask for directions",
            "Practice everyday conversations",
            "Understand Malaysian cultural expressions"
        ],

        syllabus: [
            {
                title: "Module 1: Malay Foundations",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Introduction to Malay",
                    "Pronunciation",
                    "Greetings",
                    "Self Introduction",
                    "Numbers and Time",
                    "Family"
                ]
            },
            {
                title: "Module 2: Everyday Malay",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Daily Activities",
                    "Food and Drinks",
                    "Ordering at Restaurants",
                    "Shopping",
                    "Transportation",
                    "Directions"
                ]
            },
            {
                title: "Module 3: Communication",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Hobbies",
                    "Weather",
                    "Making Plans",
                    "Talking About Places",
                    "Describing People",
                    "Conversation Practice"
                ]
            },
            {
                title: "Module 4: Practical Malay",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Travel Situations",
                    "Hotel Conversations",
                    "Social Expressions",
                    "Cultural Vocabulary",
                    "Listening Practice",
                    "Final Conversation Workshop"
                ]
            }
        ],

        instructor: {
            name: "Aisha Binti Hassan",
            credentials: "Native Malay Instructor • 8+ Years Experience",
            avatar: malayflag,
            stats: [
                { label: "Students", value: "720" },
                { label: "Courses", value: "5" },
                { label: "Rating", value: "4.8" }
            ],
            bio: "Aisha Binti Hassan is a native Malay speaker and experienced language instructor from Malaysia. Her teaching focuses on practical communication and cultural understanding, helping students use Malay naturally in everyday situations."
        },

        reviews: {
            average: "4.8",
            count: "97",
            list: [
                {
                    name: "Sophie M.",
                    date: "2 weeks ago",
                    stars: 5,
                    comment: "Aisha makes Malay very easy to understand. I especially loved the cultural examples."
                },
                {
                    name: "Yanis B.",
                    date: "1 month ago",
                    stars: 5,
                    comment: "Very practical course. We learned phrases I could actually use when traveling."
                }
            ]
        }
    },


    {
        id: 20,
        language: "Malay",
        flag: malayflag,
        level: "Beginner",
        classType: "Small Group",
        startDate: "Sep 23",
        title: "Malay Beginner 2",
        teacher: "Raja Farid",
        rating: "4.7",
        students: "620",
        lessons: 26,
        duration: "9 Weeks",
        price: "9,800 DA",
        image: null,

        description:
            "Continue learning Malay with more vocabulary, grammar, conversations, and practical situations for everyday communication.",

        learnPoints: [
            "Expand Malay vocabulary",
            "Use common grammar patterns",
            "Talk about past activities",
            "Describe people and places",
            "Express preferences and opinions",
            "Improve listening comprehension",
            "Handle travel situations",
            "Speak more naturally"
        ],

        syllabus: [
            {
                title: "Module 1: Expanding Malay",
                summary: "7 lessons • 2 weeks",
                lessons: [
                    "Vocabulary Expansion",
                    "Daily Routines",
                    "Past Events",
                    "Descriptions",
                    "Preferences",
                    "Opinions",
                    "Review"
                ]
            },
            {
                title: "Module 2: Real-Life Situations",
                summary: "7 lessons • 2 weeks",
                lessons: [
                    "Travel",
                    "Hotels",
                    "Restaurants",
                    "Shopping",
                    "Transportation",
                    "Health",
                    "Appointments"
                ]
            },
            {
                title: "Module 3: Conversation Skills",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Social Conversations",
                    "Making Plans",
                    "Giving Advice",
                    "Describing Experiences",
                    "Listening Practice",
                    "Conversation Workshop"
                ]
            },
            {
                title: "Module 4: Practical Review",
                summary: "6 lessons • 3 weeks",
                lessons: [
                    "Vocabulary Review",
                    "Grammar Review",
                    "Listening",
                    "Speaking",
                    "Roleplay",
                    "Final Assessment"
                ]
            }
        ],

        instructor: {
            name: "Raja Farid",
            credentials: "Malay Language Instructor • 7+ Years Experience",
            avatar: malayflag,
            stats: [
                { label: "Students", value: "620" },
                { label: "Courses", value: "4" },
                { label: "Rating", value: "4.7" }
            ],
            bio: "Raja Farid is an experienced Malay instructor who specializes in practical communication. His lessons use roleplay, conversation, and real-world scenarios to help students become comfortable speaking Malay."
        },

        reviews: {
            average: "4.7",
            count: "84",
            list: [
                {
                    name: "Nora A.",
                    date: "2 weeks ago",
                    stars: 5,
                    comment: "Very practical lessons and a friendly instructor."
                },
                {
                    name: "Thomas W.",
                    date: "1 month ago",
                    stars: 4,
                    comment: "Good course with lots of conversation practice."
                }
            ]
        }
    },


    // =====================================================
    // RUSSIAN — BEGINNER
    // =====================================================

    {
        id: 25,
        language: "Russian",
        flag: russianflag,
        level: "Beginner",
        classType: "Small Group",
        startDate: "Sep 20",
        title: "Russian Beginner 1",
        teacher: "Dmitri Ivanov",
        rating: "4.8",
        students: "690",
        lessons: 24,
        duration: "8 Weeks",
        price: "9,800 DA",
        image: null,

        description:
            "Start learning Russian from the beginning with Cyrillic, pronunciation, essential vocabulary, grammar, and everyday conversations.",

        learnPoints: [
            "Read and write the Cyrillic alphabet",
            "Master Russian pronunciation",
            "Build essential vocabulary",
            "Introduce yourself in Russian",
            "Understand basic sentence structures",
            "Talk about daily life",
            "Handle simple conversations",
            "Build a strong Russian foundation"
        ],

        syllabus: [
            {
                title: "Module 1: Russian Foundations",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Introduction to Russian",
                    "Cyrillic Alphabet",
                    "Russian Pronunciation",
                    "Greetings",
                    "Self Introduction",
                    "Numbers and Time"
                ]
            },
            {
                title: "Module 2: Everyday Russian",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Family",
                    "Daily Routine",
                    "Food",
                    "Shopping",
                    "Transportation",
                    "Directions"
                ]
            },
            {
                title: "Module 3: Basic Grammar",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Nouns and Gender",
                    "Personal Pronouns",
                    "Present Tense",
                    "Past Tense",
                    "Adjectives",
                    "Basic Cases"
                ]
            },
            {
                title: "Module 4: Communication",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Travel Conversations",
                    "Restaurants",
                    "Making Plans",
                    "Talking About Hobbies",
                    "Listening Practice",
                    "Final Conversation"
                ]
            }
        ],

        instructor: {
            name: "Dmitri Ivanov",
            credentials: "Native Russian Instructor • 8+ Years Experience",
            avatar: russianflag,
            stats: [
                { label: "Students", value: "690" },
                { label: "Courses", value: "5" },
                { label: "Rating", value: "4.8" }
            ],
            bio: "Dmitri Ivanov is a native Russian instructor with extensive experience teaching international students. His lessons focus on pronunciation, practical communication, and building a strong foundation in Russian grammar."
        },

        reviews: {
            average: "4.8",
            count: "92",
            list: [
                {
                    name: "Alex Turner",
                    date: "1 week ago",
                    stars: 5,
                    comment: "Dmitri makes Russian grammar much less intimidating. Great course for beginners."
                },
                {
                    name: "Sara B.",
                    date: "3 weeks ago",
                    stars: 5,
                    comment: "I really enjoyed learning Cyrillic and practicing conversations."
                }
            ]
        }
    },


    {
        id: 26,
        language: "Russian",
        flag: russianflag,
        level: "Beginner",
        classType: "Small Group",
        startDate: "Sep 25",
        title: "Russian Beginner 2",
        teacher: "Anastasia Volkova",
        rating: "4.8",
        students: "590",
        lessons: 26,
        duration: "9 Weeks",
        price: "9,800 DA",
        image: null,

        description:
            "Continue building your Russian skills with expanded vocabulary, grammar, listening, reading, and practical conversation.",

        learnPoints: [
            "Expand Russian vocabulary",
            "Use common grammatical cases",
            "Talk about past experiences",
            "Describe people and places",
            "Improve listening comprehension",
            "Read short Russian texts",
            "Handle everyday conversations",
            "Develop greater confidence"
        ],

        syllabus: [
            {
                title: "Module 1: Russian Grammar",
                summary: "7 lessons • 2 weeks",
                lessons: [
                    "Vocabulary Expansion",
                    "Accusative Case",
                    "Prepositional Case",
                    "Past Tense",
                    "Future Tense",
                    "Adjectives",
                    "Review"
                ]
            },
            {
                title: "Module 2: Everyday Communication",
                summary: "7 lessons • 2 weeks",
                lessons: [
                    "Travel",
                    "Shopping",
                    "Work",
                    "Health",
                    "Appointments",
                    "Social Situations",
                    "Conversation Practice"
                ]
            },
            {
                title: "Module 3: Reading & Listening",
                summary: "6 lessons • 2 weeks",
                lessons: [
                    "Short Texts",
                    "Messages",
                    "Signs",
                    "Listening Practice",
                    "Reading Comprehension",
                    "Workshop"
                ]
            },
            {
                title: "Module 4: Communication Practice",
                summary: "6 lessons • 3 weeks",
                lessons: [
                    "Roleplay",
                    "Travel Scenarios",
                    "Conversation",
                    "Vocabulary Review",
                    "Grammar Review",
                    "Final Assessment"
                ]
            }
        ],

        instructor: {
            name: "Anastasia Volkova",
            credentials: "Russian Language Instructor • 7+ Years Experience",
            avatar: russianflag,
            stats: [
                { label: "Students", value: "590" },
                { label: "Courses", value: "4" },
                { label: "Rating", value: "4.8" }
            ],
            bio: "Anastasia Volkova specializes in beginner Russian and practical communication. Her lessons use structured grammar activities and realistic conversations to help students build confidence."
        },

        reviews: {
            average: "4.8",
            count: "78",
            list: [
                {
                    name: "Maya R.",
                    date: "2 weeks ago",
                    stars: 5,
                    comment: "Very clear lessons and excellent examples."
                },
                {
                    name: "Oussama K.",
                    date: "1 month ago",
                    stars: 4,
                    comment: "Good course and very helpful listening activities."
                }
            ]
        }
    }

];


export default courses;