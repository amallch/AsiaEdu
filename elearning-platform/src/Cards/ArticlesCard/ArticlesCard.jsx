import "./ArticlesCard.css";

import { useNavigate } from "react-router-dom";

import Button from "../../Utiles/Button/Button";
import ReadMore from "../../Utiles/ReadMore/ReadMore";


function ArticlesCard(props) {

    const navigate = useNavigate();


    const handleArticleClick = () => {

        navigate(`/blog/${props.article.id}`);

    };


    return (

        <div
            className="ArticlesCard"
            onClick={handleArticleClick}
        >

            <div
                className="ArticlesCard-image"
                style={{
                    backgroundImage: `url(${props.article.image})`
                }}
            >

                <div className="ArticlesCard-category">

                    <Button
                        text={props.article.category}
                        type="category"
                    />

                </div>

            </div>


            <div className="ArticlesCard-content">

                <div className="ArticlesCard-content-container">


                    <div className="ArticlesCard-title">

                        <h3>
                            {props.article.title}
                        </h3>

                    </div>


                    <div className="ArticlesCard-desc">

                        <p>
                            {props.article.description}
                        </p>

                    </div>


                    <div className="ArticlesCardInfo">

                        <div className="ArticlesCardAuthor">

                            <i className="fa-regular fa-user"></i>

                            <span>
                                {props.article.author}
                            </span>

                        </div>


                        <div className="ArticlesCardDate">

                            <i className="fa-regular fa-calendar"></i>

                            <span>
                                {props.article.date}
                            </span>

                        </div>

                    </div>


                    <div className="ArticlesCard-seperation"></div>


                    <div className="ReadMore-button">

                        <ReadMore />

                    </div>


                </div>

            </div>

        </div>

    );

}


export default ArticlesCard;