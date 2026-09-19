import "./SpeakingClasses.css";
import Button from "../../Utiles/Button/Button";
import { useNavigate } from "react-router-dom";

function SpeakingClasses() {
    const navigate = useNavigate();
    return (
        <section className="SpeakingClasses">
            <div className="SpeakingClasses-container">
                {/* Left Content */}
                <div className="SpeakingClasses-content">
                    <span className="SpeakingClasses-eyebrow">Speaking Classes</span>
                    <h2>Real conversations. <br/>Real progress.</h2>
                    <p>
                        Practice speaking with native tutors through voice messages,
                        group discussions, or live 1:1 video classes.
                    </p>
                    <div className="SpeakingClasses-features">
                        <span>🎙️ Voice messages</span>
                        <span>👥 1:1 or group</span>
                        <span>📹 Live classes</span>
                    </div>
                    <Button
                        text="Book a Speaking Class"
                        type="primary"
                        onClick={() => navigate("/speaking")}
                    />
                </div>

                {/* Right Visual */}
                <div className="SpeakingClasses-visual">
                    {/* Live Call Card */}
                    <div className="SpeakingClasses-phone">
                        <div className="SpeakingClasses-call-header">
                            <span className="SpeakingClasses-live-badge">
                                <span className="SpeakingClasses-live-dot"></span>
                                LIVE
                            </span>
                            <span className="SpeakingClasses-call-time">12:34</span>
                        </div>

                        <div className="SpeakingClasses-call-main">
                            <div className="SpeakingClasses-tutor">
                                <div className="SpeakingClasses-tutor-avatar">W</div>
                                <span className="SpeakingClasses-tutor-name">Wei · Tutor</span>
                            </div>
                            <div className="SpeakingClasses-participants">
                                <span className="participant">M</span>
                                <span className="participant">Y</span>
                                <span className="participant">+2</span>
                            </div>
                        </div>

                        <div className="SpeakingClasses-correction">
                            <p className="SpeakingClasses-original">"你好吗？" (Nǐ hǎo ma?)</p>
                            <div className="SpeakingClasses-feedback">
                                <span>💡 Tutor correction</span>
                                "Hǎo" needs the full 3rd tone ↘↗
                            </div>
                        </div>

                        <div className="SpeakingClasses-controls">
                            <span>🎤</span>
                            <span>📷</span>
                            <span className="SpeakingClasses-end-call">📞</span>
                        </div>
                    </div>

                    {/* Floating Badges */}
                    <div className="SpeakingClasses-badge SpeakingClasses-score-badge">
                        <span className="SpeakingClasses-score-number">98%</span>
                        <span>Pronunciation</span>
                    </div>

                    <div className="SpeakingClasses-badge SpeakingClasses-meet-badge">
                        <span>🎥</span>
                        <div>
                            <strong>Google Meet</strong>
                            <span>Book anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SpeakingClasses;