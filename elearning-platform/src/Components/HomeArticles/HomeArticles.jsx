import "./HomeArticles.css";

import { useNavigate } from "react-router-dom";

import Button from "../../Utiles/Button/Button";

import ArticlesCard from "../../Cards/ArticlesCard/ArticlesCard";

import Hero from "../../Components/Hero/Hero";

import articles from "../../Data/articles/articles";


function HomeArticles() {

    const navigate = useNavigate();


    return (

        <section className="HomeArticles">

            <div className="HomeArticles-container">


                {/* =================================================
                   HERO
                ================================================= */}

                <Hero
                    center
                    badge="Our Blog"
                    title="Latest Articles"
                    description="Discover useful tips, learning resources, and insights to help you on your Asian language journey."
                />


                {/* =================================================
                   ARTICLE CARDS
                ================================================= */}

                <div className="HomeArticles-cards">

                    {articles.slice(0, 3).map((article) => (

                        <ArticlesCard
                            key={article.id}
                            article={article}
                        />

                    ))}

                </div>


                {/* =================================================
                   VIEW ALL
                ================================================= */}

                <div className="HomeArticles-button">

                    <Button
                        text="View All Articles"
                        type="outline"
                        onClick={() => navigate("/blog")}
                    />

                </div>


            </div>

        </section>

    );

}


export default HomeArticles;