import "./Grades.css";

function Grades() {

    return (
        <section className="Grades">

            <div className="Grades-container">

                {/* Heading */}

                <div className="Grades-heading">

                    <h2>
                        Grades & Results
                    </h2>

                    <p>
                        Track your academic performance
                    </p>

                </div>


                {/* Statistics */}

                <div className="Grades-statistics">

                    {/* Average Grade */}

                    <div className="Grades-stat-card">

                        <div className="Grades-stat-content">

                            <span>
                                Average Grade
                            </span>

                            <strong>
                                95.0%
                            </strong>

                            <p className="Grades-positive">
                                ↗ Above class average
                            </p>

                        </div>

                        <div className="Grades-stat-icon">
                            ★
                        </div>

                    </div>


                    {/* Graded Assignments */}

                    <div className="Grades-stat-card">

                        <div className="Grades-stat-content">

                            <span>
                                Graded Assignments
                            </span>

                            <strong>
                                1
                            </strong>

                            <p>
                                Out of 4 total
                            </p>

                        </div>

                        <div className="Grades-stat-icon">
                            ◎
                        </div>

                    </div>


                    {/* Course Completion */}

                    <div className="Grades-stat-card">

                        <div className="Grades-stat-content">

                            <span>
                                Course Completion
                            </span>

                            <strong>
                                60%
                            </strong>

                            <div className="Grades-course-progress">

                                <div className="Grades-course-progress-fill"></div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Bottom Content */}

                <div className="Grades-bottom">

                    {/* Recent Grades */}

                    <div className="Grades-recent">

                        <h3>
                            Recent Grades
                        </h3>


                        <div className="Grades-recent-card">

                            <div className="Grades-recent-info">

                                <h4>
                                    Design a Mobile App Interface
                                </h4>

                                <p>
                                    UI/UX Design Fundamentals
                                </p>


                                <div className="Grades-assignment-progress">

                                    <div className="Grades-assignment-progress-bar">

                                        <div className="Grades-assignment-progress-fill"></div>

                                    </div>

                                    <span>
                                        95/100 points
                                    </span>

                                </div>

                            </div>


                            <div className="Grades-result">

                                <strong>
                                    95%
                                </strong>

                                <span>
                                    A
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* Grade Distribution */}

                    <div className="Grades-distribution">

                        <h3>
                            Grade Distribution
                        </h3>

                        <div className="Grades-chart">

                            <div className="Grades-chart-inner">
                                A
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Grades;