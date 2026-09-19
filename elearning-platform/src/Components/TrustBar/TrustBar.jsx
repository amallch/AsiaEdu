import "./TrustBar.css";


function TrustBar() {

    const stats = [

        {
            number: "5,000+",
            label: "Students Enrolled",
            icon: "fa-solid fa-graduation-cap"
        },

        {
            number: "4.9/5",
            label: "Average Rating",
            icon: "fa-solid fa-star"
        },

        {
            number: "50+",
            label: "Countries Reached",
            icon: "fa-solid fa-earth-asia"
        },

        {
            number: "98%",
            label: "Success Rate",
            icon: "fa-solid fa-trophy"
        }

    ];


    return (

        <section className="TrustBar">

            <div className="TrustBar-container">


                {/* =====================================================
                   HEADER
                ===================================================== */}

                <div className="TrustBar-header">

                    <span className="TrustBar-badge">
                        Why Learners Trust Us
                    </span>

                    <h2>
                        Learning That Makes a <span>Difference</span>
                    </h2>

                    <p>
                        Thousands of learners are already building their language
                        skills with AsiaEdu.
                    </p>

                </div>


                {/* =====================================================
                   STATS
                ===================================================== */}

                <div className="TrustBar-stats">

                    {stats.map((stat, index) => (

                        <div
                            className="TrustBar-stat"
                            key={index}
                        >

                            <div className="TrustBar-icon">

                                <i className={stat.icon}></i>

                            </div>


                            <div className="TrustBar-content">

                                <span className="TrustBar-number">
                                    {stat.number}
                                </span>

                                <span className="TrustBar-label">
                                    {stat.label}
                                </span>

                            </div>


                            {index < stats.length - 1 && (

                                <div className="TrustBar-divider"></div>

                            )}

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}


export default TrustBar;