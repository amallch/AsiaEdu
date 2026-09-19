import React from "react";
import "./MyCourses.css";

function MyCourses() {
  const courses = [
    {
      id: 1,
      title: "Chinese Language",
      instructor: "Li Ming",
      level: "Beginner",
      progress: 75,
      completedLessons: 18,
      totalLessons: 24,
      icon: "fa-solid fa-language",
    },
    {
      id: 2,
      title: "Japanese Language",
      instructor: "Sakura Tanaka",
      level: "Intermediate",
      progress: 60,
      completedLessons: 15,
      totalLessons: 25,
      icon: "fa-solid fa-torii-gate",
    },
    {
      id: 3,
      title: "Korean Language",
      instructor: "Kim Ji-hoon",
      level: "Beginner",
      progress: 45,
      completedLessons: 11,
      totalLessons: 24,
      icon: "fa-solid fa-comments",
    },
    {
      id: 4,
      title: "Malay Language",
      instructor: "Aisha Rahman",
      level: "Advanced",
      progress: 30,
      completedLessons: 8,
      totalLessons: 26,
      icon: "fa-solid fa-earth-asia",
    },
  ];

  return (
    <section className="MyCourses">
      <div className="MyCourses-header">
        <h2>My Courses</h2>
        <p>Continue where you left off</p>
      </div>

      <div className="MyCourses-grid">
        {courses.map((course) => (
          <div className="CourseCard" key={course.id}>
            <div className="CourseCard-top">
              <div className="CourseCard-icon">
                <i className={course.icon}></i>
              </div>
              <span className="CourseCard-level">{course.level}</span>
            </div>

            <div className="CourseCard-body">
              <h3>{course.title}</h3>
              <p className="CourseCard-instructor">
                <i className="fa-regular fa-user"></i> {course.instructor}
              </p>

              <div className="CourseCard-progress-info">
                <span>Progress</span>
                <strong>{course.progress}%</strong>
              </div>

              <div className="CourseCard-progress-bar">
                <div
                  className="CourseCard-progress-fill"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>

              <div className="CourseCard-footer">
                <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                <button className="CourseCard-btn">
                  Continue <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyCourses;