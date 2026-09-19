import "./TestimonialCard.css";


function TestimonialCard({ testimonial }) {

    const nameParts =
        testimonial.name.trim().split(" ");


    const initials =
        nameParts.length >= 2
            ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
            : nameParts[0].charAt(0);


    return (

        <div className="TestimonialCard">


            <div className="TestimonialCard-accent"></div>


            <div className="TestimonialCard-content">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="TestimonialCard-header">

                    <div className="TestimonialCard-quote">
                        "
                    </div>


                    <div className="TestimonialCard-rating">

                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>

                    </div>

                </div>


                {/* =================================================
                   COMMENT
                ================================================= */}

                <p className="TestimonialCard-comment">
                    {testimonial.comment}
                </p>


                {/* =================================================
                   SEPARATOR
                ================================================= */}

                <div className="TestimonialCard-line"></div>


                {/* =================================================
                   USER
                ================================================= */}

                <div className="TestimonialCard-user">


                    <div className="TestimonialCard-initials">

                        {initials}

                    </div>


                    <div className="TestimonialCard-user-info">

                        <h4>
                            {testimonial.name}
                        </h4>


                        <p>
                            {testimonial.job}
                        </p>

                    </div>

                </div>


            </div>

        </div>

    );

}


export default TestimonialCard;