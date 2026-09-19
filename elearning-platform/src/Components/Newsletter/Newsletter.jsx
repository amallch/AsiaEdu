import "./Newsletter.css";

import Button from "../../Utiles/Button/Button";

function Newsletter() {
    return (
        <section className="Newsletter">

            <div className="Newsletter-container">

                <div className="Newsletter-glyphs" aria-hidden="true">
                    <span>あ</span>
                    <span>Ж</span>
                    <span>ع</span>
                    <span>字</span>
                    <span>Ω</span>
                </div>

                <div className="Newsletter-content">

                    <span className="Newsletter-eyebrow">Join 20,000+ learners</span>

                    <h2>Stay in the loop</h2>

                    <p>
                        Language learning tips, course announcements, and
                        exclusive offers — straight to your inbox, no fluff.
                    </p>

                </div>

                <form className="Newsletter-form">

                    <div className="Newsletter-input-wrap">
                        <svg className="Newsletter-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M3 6.5C3 5.67157 3.67157 5 4.5 5H19.5C20.3284 5 21 5.67157 21 6.5V17.5C21 18.3284 20.3284 19 19.5 19H4.5C3.67157 19 3 18.3284 3 17.5V6.5Z" stroke="currentColor" strokeWidth="1.6"/>
                            <path d="M4 6.5L12 12.5L20 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            aria-label="Email address"
                        />
                    </div>

                    <Button
                        text="Subscribe"
                        type="primary"
                    />

                </form>

            </div>

        </section>
    );
}

export default Newsletter;