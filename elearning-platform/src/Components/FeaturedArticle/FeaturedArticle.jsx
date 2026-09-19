import "./FeaturedArticle.css";

import ReadMore  from "../../Utiles/ReadMore/ReadMore";

function FeaturedArticle() {
    return (
        <section className="FeaturedArticle">
            <div className="FeaturedArticle-container">

                <div className="FeaturedArticleImage">

                </div>

                <div className="FeaturedArticleContent">

                    <div className="FeaturedArticleBadge">
                        Featured
                    </div>

                    <div className="FeaturedArticleTitle">
                        <h2>10 Tips for Learning a New Language Faster</h2>
                    </div>

                    <div className="FeaturedArticleDescription">
                        <p>
                            Discover proven strategies to accelerate your language
                            learning journey and achieve fluency faster than you
                            thought possible.
                        </p>
                    </div>

                    <div className="FeaturedArticleInfo">

                        <div className="FeaturedArticleAuthor">
                            <i className="fa-regular fa-user"></i>
                            <span>Sarah Johnson</span>
                        </div>

                        <div className="FeaturedArticleDate">
                            <i className="fa-regular fa-calendar"></i>
                            <span>February 10, 2026</span>
                        </div>

                    </div>

                    <div className="FeaturedArticleButton">
                        <ReadMore 
                            text="Read More"
                            icon="fa-solid fa-arrow-right"
                        />
                    </div>

                </div>

            </div>
        </section>
    );
}

export default FeaturedArticle;