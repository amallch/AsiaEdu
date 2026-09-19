import "./TeachersSection.css";
import Hero from "../../Components/Hero/Hero";

import teacherImg1 from "../../assets/teacher1.webp";
import teacherImg2 from "../../assets/teacher2.jpg";
import teacherImg3 from "../../assets/teacher3.jpg";
import teacherImg4 from "../../assets/teacher4.jpg";
import teacherImg5 from "../../assets/teacher5.avif";

import chinaflag from "../../assets/chinaflagbadge.avif";
import japanflag from "../../assets/japanflagbadge.jpg";
import koreaflag from "../../assets/koreaflagbadge.jpg";
import russiaflag from "../../assets/russiaflagbadge.jpg";
import malayflag from "../../assets/malysiaflagbadge.jpg";

function TeachersSection() {
    const teachers = [
        {
            id: 1,
            name: "Li Ming",
            role: "Chinese Teacher",
            flag: chinaflag,
            image: teacherImg1,
            experience: "8 years",
            students: "2.4k"
        },
        {
            id: 2,
            name: "Sakura Tanaka",
            role: "Japanese Teacher",
            flag: japanflag,
            image: teacherImg4,
            experience: "6 years",
            students: "1.8k"
        },
        {
            id: 3,
            name: "Kim Ji-hoon",
            role: "Korean Teacher",
            flag: koreaflag,
            image: teacherImg5,
            experience: "5 years",
            students: "1.5k"
        },
        {
            id: 4,
            name: "Anna Ivanova",
            role: "Russian Teacher",
            flag: russiaflag,
            image: teacherImg2,
            experience: "7 years",
            students: "1.9k"
        },
        {
            id: 5,
            name: "Aisha Rahman",
            role: "Malay Teacher",
            flag: malayflag,
            image: teacherImg3,
            experience: "4 years",
            students: "1.2k"
        }
    ];

    return (
        <section className="TeachersSection">
            <div className="TeachersSection-container">
                <Hero
                    center
                    badge="Our Teachers"
                    title="Meet Our"
                    highlight="Teachers"
                    description="Five languages, five passionate native instructors — here to guide you from your first word to real fluency."
                />

                <div className="TeachersGrid">
                    {teachers.map((teacher) => (
                        <div className="TeacherCard" key={teacher.id}>
                            <div className="TeacherCard-avatar">
                                <img src={teacher.image} alt={teacher.name} />
                                <div className="TeacherCard-flag">
                                    <img src={teacher.flag} alt="" />
                                </div>
                            </div>

                            <div className="TeacherCard-body">
                                <h3>{teacher.name}</h3>
                                <span className="TeacherCard-role">{teacher.role}</span>
                                
                                <div className="TeacherCard-info">
                                    <div className="info-item">
                                        <i className="fa-regular fa-clock"></i>
                                        <span>{teacher.experience}</span>
                                    </div>
                                    <div className="info-item">
                                        <i className="fa-regular fa-user"></i>
                                        <span>{teacher.students} students</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TeachersSection;