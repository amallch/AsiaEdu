import { useEffect, useState } from "react";

import "./LimitedOffer.css";


function LimitedOffer() {

    const [timeLeft, setTimeLeft] = useState({
        days: 3,
        hours: 12,
        minutes: 45,
        seconds: 30
    });


    const [isVisible, setIsVisible] = useState(true);


    useEffect(() => {

        const timer = setInterval(() => {

            setTimeLeft((prev) => {

                let {
                    days,
                    hours,
                    minutes,
                    seconds
                } = prev;


                if (seconds > 0) {
                    seconds--;
                }

                else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                }

                else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                }

                else if (days > 0) {
                    days--;
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }


                return {
                    days,
                    hours,
                    minutes,
                    seconds
                };

            });

        }, 1000);


        return () => clearInterval(timer);

    }, []);


    if (!isVisible) {
        return null;
    }


    return (

        <section className="LimitedOffer">

            <div className="LimitedOffer-container">


                {/* =====================================================
                   OFFER INFO
                ===================================================== */}

                <div className="LimitedOffer-info">

                    <div className="LimitedOffer-icon">

                        <i className="fa-solid fa-bolt"></i>

                    </div>


                    <div className="LimitedOffer-text">

                        <h3>
                            Early Bird Special
                        </h3>

                        <p>
                            Get <strong>20% off</strong> all courses
                        </p>

                    </div>

                </div>


                {/* =====================================================
                   TIMER
                ===================================================== */}

                <div className="LimitedOffer-timer">


                    <div className="LimitedOffer-time">

                        <span>
                            {String(timeLeft.days).padStart(2, "0")}
                        </span>

                        <small>
                            Days
                        </small>

                    </div>


                    <b>
                        :
                    </b>


                    <div className="LimitedOffer-time">

                        <span>
                            {String(timeLeft.hours).padStart(2, "0")}
                        </span>

                        <small>
                            Hours
                        </small>

                    </div>


                    <b>
                        :
                    </b>


                    <div className="LimitedOffer-time">

                        <span>
                            {String(timeLeft.minutes).padStart(2, "0")}
                        </span>

                        <small>
                            Min
                        </small>

                    </div>


                    <b>
                        :
                    </b>


                    <div className="LimitedOffer-time">

                        <span>
                            {String(timeLeft.seconds).padStart(2, "0")}
                        </span>

                        <small>
                            Sec
                        </small>

                    </div>

                </div>


                {/* =====================================================
                   CTA
                ===================================================== */}

                <button
                    className="LimitedOffer-button"
                    type="button"
                >
                    Claim 20% Off
                </button>


                {/* =====================================================
                   CLOSE
                ===================================================== */}

                <button
                    className="LimitedOffer-close"
                    type="button"
                    onClick={() => setIsVisible(false)}
                    aria-label="Close offer"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

            </div>

        </section>

    );

}


export default LimitedOffer;