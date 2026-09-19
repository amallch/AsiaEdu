import "./HomeCourseCard.css";

function HomeCourseCard({ course }) {
    return (
        <div className="HomeCourseCard">

            {/* =========================
                IMAGE
            ========================= */}

            <div
                className="HomeCourseCardImage"
                style={{
                    backgroundImage: `url(${course.image})`
                }}
            >

                <div className="HomeCourseCardImageOverlay"></div>

                {course.badge && (
                    <span className="HomeCourseCardBadge">
                        {course.badge}
                    </span>
                )}

            </div>


            {/* =========================
                CONTENT
            ========================= */}

            <div className="HomeCourseCardContent">

                <div className="HomeCourseCardHeader">

                    <div className="HomeCourseCardTitle">

                        <h3 className="HomeCourseCardLanguage">
                            {course.language}
                        </h3>

                        <div
                            className="HomeCourseCardFlag"
                            style={{
                                backgroundImage: `url(${course.flag})`
                            }}
                        ></div>

                    </div>


                    <div className="HomeCourseCardRating">

                        <i className="fas fa-star"></i>

                        <span>
                            {course.rating || "4.8"}
                        </span>

                    </div>

                </div>


                <p className="HomeCourseCardDescription">
                    {course.description}
                </p>


                {/* =========================
                    PRICE
                ========================= */}

                <div className="HomeCourseCardFooter">

                    <div className="HomeCourseCardPrice">

                        <span>
                            Starting from
                        </span>

                        <strong>
                            {course.price}
                        </strong>

                    </div>

                    <div className="HomeCourseCardArrow">
                        <i className="fas fa-arrow-right"></i>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default HomeCourseCard;