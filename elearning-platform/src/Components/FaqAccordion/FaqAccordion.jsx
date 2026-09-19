import "./FaqAccordion.css";

import { useEffect, useRef, useState } from "react";

import Hero from "../../Components/Hero/Hero";


const FAQ_ITEMS = [

    {
        question: "How can I know my level of knowledge?",
        answer:
            "By the end of the trial lesson, you will be able to determine for yourself whether this kind of online lesson is right for you or not. In our experience, most students appreciate the benefits of online education and decide to study online."
    },

    {
        question: "Do I need to buy materials for lessons?",
        answer:
            "No, all the materials you need are provided by your teacher during the lessons. You're welcome to bring your own notebook if you'd like to keep track of what you learn."
    },

    {
        question: "Can I do it individually or only in a group?",
        answer:
            "Both options are available. You can choose one-on-one lessons for a fully personalized pace, or join a group session to learn alongside other students."
    },

    {
        question: "Are you adjusting to the student's schedule?",
        answer:
            "Yes, lessons are scheduled around your availability. You can pick times that work best for you and reschedule when needed."
    },

    {
        question: "What is the maximum group size?",
        answer:
            "Group lessons are kept small, with a maximum of six students, so everyone still gets plenty of individual attention."
    },

    {
        question: "How will the first lesson with the teacher be?",
        answer:
            "The first lesson is a friendly introduction where your teacher gets to know your goals and current level. You will also experience how our lessons work and decide whether the learning style is right for you."
    }

];


function FaqAccordion() {

    const [openIndex, setOpenIndex] = useState(0);

    const sectionRef = useRef(null);


    useEffect(() => {

        const section = sectionRef.current;

        if (!section) {
            return;
        }


        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        section.classList.add(
                            "FaqAccordion-visible"
                        );

                    }
                    else {

                        section.classList.remove(
                            "FaqAccordion-visible"
                        );

                    }

                });

            },

            {
                threshold: 0.15
            }

        );


        observer.observe(section);


        return () => {

            observer.disconnect();

        };

    }, []);


    const toggle = (index) => {

        if (openIndex === index) {

            setOpenIndex(null);

        }
        else {

            setOpenIndex(index);

        }

    };


    const firstColumn =
        FAQ_ITEMS.filter(
            (_, index) => index % 2 === 0
        );


    const secondColumn =
        FAQ_ITEMS.filter(
            (_, index) => index % 2 !== 0
        );


    const renderItem = (item, index) => {

        const isOpen = openIndex === index;


        return (

            <div
                className={`FaqAccordion-item ${
                    isOpen
                        ? "FaqAccordion-item-open"
                        : ""
                }`}
                key={item.question}
            >

                <button
                    type="button"
                    className="FaqAccordion-question"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                >

                    <div className="FaqAccordion-question-left">

                        <span className="FaqAccordion-number">
                            {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="FaqAccordion-question-text">
                            {item.question}
                        </span>

                    </div>


                    <span className="FaqAccordion-icon">

                        {isOpen ? "−" : "+"}

                    </span>

                </button>


                <div
                    className={`FaqAccordion-answer-wrapper ${
                        isOpen
                            ? "FaqAccordion-answer-wrapper-open"
                            : ""
                    }`}
                >

                    <div className="FaqAccordion-answer">

                        <p>
                            {item.answer}
                        </p>

                    </div>

                </div>

            </div>

        );

    };


    return (

        <section
            className="FaqAccordion"
            ref={sectionRef}
        >

            <div className="FaqAccordion-container">


                {/* =====================================================
                    HERO
                ===================================================== */}

                <Hero
                    center
                    badge="Common Questions"
                    title="Frequently Asked"
                    highlight="Questions"
                    description="Browse our most frequently asked questions to learn more about AsiaEdu and make your learning journey even smoother."
                />


                {/* =====================================================
                    FAQ LIST
                ===================================================== */}

                <div className="FaqAccordion-list">


                    <div className="FaqAccordion-column">

                        {firstColumn.map((item) => {

                            const originalIndex =
                                FAQ_ITEMS.indexOf(item);

                            return renderItem(
                                item,
                                originalIndex
                            );

                        })}

                    </div>


                    <div className="FaqAccordion-column">

                        {secondColumn.map((item) => {

                            const originalIndex =
                                FAQ_ITEMS.indexOf(item);

                            return renderItem(
                                item,
                                originalIndex
                            );

                        })}

                    </div>


                </div>

            </div>

        </section>

    );

}


export default FaqAccordion;