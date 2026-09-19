import "./ArticleDetails.css";

import { useNavigate, useParams } from "react-router-dom";

import Button from "../../Utiles/Button/Button";

import articles from "../../Data/articles/articles";


function ArticleDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    const article = articles.find(
        (article) => article.id === Number(id)
    );


    if (!article) {

        return (

            <section className="ArticleDetails">

                <div className="ArticleDetails-empty">

                    <h2>
                        Article Not Found
                    </h2>

                    <p>
                        Sorry, we couldn't find the article you're looking for.
                    </p>

                    <Button
                        text="Back to Blog"
                        type="primary"
                        onClick={() => navigate("/blog")}
                    />

                </div>

            </section>

        );

    }


    return (

        <section className="ArticleDetails">

            <div className="ArticleDetails-container">


                {/* =================================================
                    ARTICLE HEADER
                ================================================= */}

                <div className="ArticleDetails-header">


                    {/* BACK BUTTON */}

                    <div className="ArticleDetails-back">

                        <Button
                            text="Back to Blog"
                            type="outline"
                            onClick={() => navigate("/blog")}
                        />

                    </div>


                    {/* CATEGORY */}

                    <div className="ArticleDetails-category">

                        <Button
                            text={article.category}
                            type="category"
                        />

                    </div>


                    {/* TITLE */}

                    <h1>
                        {article.title}
                    </h1>


                    {/* INFO */}

                    <div className="ArticleDetails-info">

                        <div className="ArticleDetails-author">

                            <i className="fa-regular fa-user"></i>

                            <span>
                                {article.author}
                            </span>

                        </div>


                        <div className="ArticleDetails-date">

                            <i className="fa-regular fa-calendar"></i>

                            <span>
                                {article.date}
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ARTICLE IMAGE
                ================================================= */}

                <div className="ArticleDetails-image">

                    <img
                        src={article.image}
                        alt={article.title}
                    />

                </div>


                {/* =================================================
                    ARTICLE CONTENT
                ================================================= */}

                <div className="ArticleDetails-content">

                    <p className="ArticleDetails-description">
                        {article.description}
                    </p>


                    <div className="ArticleDetails-separation"></div>


                    <div className="ArticleDetails-text">

                        {article.content.map((paragraph, index) => (

                            <p key={index}>
                                {paragraph}
                            </p>

                        ))}

                    </div>


                    {/* BACK BUTTON */}

                    <div className="ArticleDetails-button">

                        <Button
                            text="Back to Blog"
                            type="primary"
                            onClick={() => navigate("/blog")}
                        />

                    </div>

                </div>

            </div>

        </section>

    );

}


export default ArticleDetails;