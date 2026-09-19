import "./ProgramCard.css";

import Button from "../../Utiles/Button/Button";
import ReadMore from "../../Utiles/ReadMore/ReadMore";

function ProgramCard(props) {

    return (
        <div className="ProgramCard">

            <div
                className="ProgramCard-image"
                style={{
                    backgroundImage: `url(${props.program.image})`
                }}
            >

                <div className="ProgramCard-badge">
                    <Button
                        text={props.program.badge}
                        type="category"
                    />
                </div>

            </div>

            <div className="ProgramCard-content">

                <div className="ProgramCard-container">

                    <div className="ProgramCard-title">
                        <h3>{props.program.title}</h3>
                    </div>

                    <div className="ProgramCard-description">
                        <p>{props.program.description}</p>
                    </div>

                    <div className="ProgramCard-details">

                        <div className="ProgramCard-detail">
                            <i className="fa-regular fa-calendar"></i>
                            <span>{props.program.duration}</span>
                        </div>

                        <div className="ProgramCard-detail">
                            <i className="fa-solid fa-users"></i>
                            <span>{props.program.classSize}</span>
                        </div>

                        <div className="ProgramCard-detail">
                            <i className="fa-regular fa-clock"></i>
                            <span>{props.program.schedule}</span>
                        </div>

                        <div className="ProgramCard-detail">
                            <i className="fa-solid fa-award"></i>
                            <span>{props.program.certificate}</span>
                        </div>

                    </div>

                    <div className="ProgramCard-separation"></div>

                    <div className="ProgramCard-button">
                        <ReadMore />
                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProgramCard;