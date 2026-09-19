import "./WhyChooseCard.css";


function WhyChooseCard({ item }) {

    return (

        <div className="WhyChooseCard">

            <div className="WhyChooseCard-top">

                <div className="WhyChooseCard-icon">

                    <i className={item.icon}></i>

                </div>


                <h3>

                    {item.title1}

                    <br />

                    {item.title2}

                </h3>

            </div>


            <div className="WhyChooseCard-line"></div>


            <p>
                {item.description}
            </p>

        </div>

    );

}


export default WhyChooseCard;