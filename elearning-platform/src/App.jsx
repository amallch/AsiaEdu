import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Header from "./Layout/Header/Header";


/* =========================================================
   PUBLIC PAGES
========================================================= */

import Home from "./Pages/Home/Home";

import Courses from "./Pages/Courses/Courses";

import Programs from "./Pages/Programs/Programs";

import Blog from "./Pages/Blog/Blog";

import ArticleDetails
    from "./Pages/ArticleDetails/ArticleDetails";

import Contact from "./Pages/Contact/Contact";

import About from "./Pages/About/About";

import ApplyToTeach
    from "./Pages/ApplyToTeach/ApplyToTeach";


/* =========================================================
   AUTHENTICATION
========================================================= */

import SignIn from "./Pages/SignIn/SignIn";

import SignUp from "./Pages/SignUp/SignUp";

import ForgotPassword
    from "./Pages/ForgotPassword/ForgotPassword";

import ResetPassword
    from "./Pages/ResetPassword/ResetPassword";


/* =========================================================
   SPEAKING / COURSES
========================================================= */

import Speaking from "./Pages/speaking/speaking";

import CourseDetails
    from "./Pages/CourseDetails/CourseDetails";

import Enrollment
    from "./Pages/Enrollment/Enrollment";


/* =========================================================
   STUDENT DASHBOARD
========================================================= */

import StudentDashboard
    from "./pages/StudentDashboard/StudentDashboard";

import Dashboard
    from "./Components/StudentDashboard/Dashboard/Dashboard";

import Assignments
    from "./Components/StudentDashboard/Assignments/Assignments";

import ViewMyAssignment
    from "./Components/StudentDashboard/Assignments/ViewMyAssignment/ViewMyAssignment";

import MyGrades
    from "./Components/StudentDashboard/MyGrades/MyGrades";

import ViewResult
    from "./Components/StudentDashboard/MyGrades/ViewResult/ViewResult";

import Profile
    from "./Components/StudentDashboard/Profile/Profile";

import MyLessons
    from "./Components/StudentDashboard/MyLessons/MyLessons";

import ViewMyLesson
    from "./Components/StudentDashboard/MyLessons/ViewMyLesson/ViewMyLesson";


/* =========================================================
   TEACHER DASHBOARD
========================================================= */

import TeacherDashboard
    from "./pages/TeacherDashboard/TeacherDashboard";

import TeacherDashboardHome
    from "./Components/TeacherDashboard/TeacherDashboardHome/TeacherDashboardHome";

import TeacherLessons
    from "./Components/TeacherDashboard/TeacherLessons/TeacherLessons";

import ViewLesson
    from "./Components/TeacherDashboard/TeacherLessons/ViewLesson/ViewLesson";

import EditLesson
    from "./Components/TeacherDashboard/TeacherLessons/EditLesson/EditLesson";

import AddLesson
    from "./Components/TeacherDashboard/TeacherLessons/AddLesson/AddLesson";

import TeacherAssignments
    from "./Components/TeacherDashboard/TeacherAssignments/TeacherAssignments";

import AddAssignment
    from "./Components/TeacherDashboard/TeacherAssignments/AddAssignment/AddAssignment";

import ViewAssignment
    from "./Components/TeacherDashboard/TeacherAssignments/ViewAssignment/ViewAssignment";

import EditAssignment
    from "./Components/TeacherDashboard/TeacherAssignments/EditAssignment/EditAssignment";

import TeacherStudents
    from "./Components/TeacherDashboard/TeacherStudents/TeacherStudents";

import TeacherSubmissions
    from "./Components/TeacherDashboard/TeacherSubmissions/TeacherSubmissions";


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

import Admin from "./Pages/Admin/Admin";


/* =========================================================
   ADMIN DASHBOARD HOME
========================================================= */

import AdminDashboard
    from "./Pages/Admin/Dashboard/Dashboard";


/* =========================================================
   ADMIN STUDENTS
========================================================= */

import Students
    from "./Pages/Admin/Students/Students";

import StudentDetails
    from "./Pages/Admin/StudentDetails/StudentDetails";


/* =========================================================
   ADMIN TEACHERS
========================================================= */

import Teachers
    from "./Pages/Admin/Teachers/Teachers";

import AddTutor
    from "./Pages/Admin/AddTutor/AddTutor";

import TeacherDetails
    from "./Pages/Admin/TeacherDetails/TeacherDetails";


/* =========================================================
   ADMIN COURSES
========================================================= */

import AdminCourses
    from "./Pages/Admin/Courses/Courses";

import AddCourse
    from "./Pages/Admin/AddCourse/AddCourse";

import EditCourse
    from "./Pages/Admin/EditCourse/EditCourse";

import ViewCourse
    from "./Pages/Admin/Courses/ViewCourse/ViewCourse";


/* =========================================================
   ADMIN SESSIONS
========================================================= */

import AdminSessions
    from "./Pages/Admin/Sessions/Sessions";

import AddSession
    from "./Pages/Admin/AddSession/AddSession";

import EditSession
    from "./Pages/Admin/EditSession/EditSession";

import SessionDetails
    from "./Pages/Admin/Sessions/SessionDetails/SessionDetails";


/* =========================================================
   ADMIN LESSONS
========================================================= */

import AdminLessons
    from "./Pages/Admin/Lessons/Lessons";

import ViewAdminLesson
    from "./Pages/Admin/Lessons/ViewAdminLesson/ViewAdminLesson";


/* =========================================================
   ADMIN ASSIGNMENTS
========================================================= */

import AdminAssignments
    from "./Pages/Admin/Assignments/Assignments";

import ViewAdminAssignment
    from "./Pages/Admin/Assignments/ViewAdminAssignment/ViewAdminAssignment";


/* =========================================================
   ADMIN SUBMISSIONS
========================================================= */

import AdminSubmissions
    from "./Pages/Admin/Submissions/Submissions";


/* =========================================================
   ADMIN GRADES
========================================================= */

import AdminGrades
    from "./Pages/Admin/AdminGrades/AdminGrades";

import AdminViewResult
    from "./Pages/Admin/AdminGrades/AdminViewResult/AdminViewResult";


/* =========================================================
   ADMIN ENROLLMENTS
========================================================= */

import AdminEnrollments
    from "./Pages/Admin/Enrollments/Enrollments";

import EnrollmentDetails
    from "./Pages/Admin/EnrollmentDetails/EnrollmentDetails";


/* =========================================================
   ADMIN TUTOR APPLICATIONS
========================================================= */

import AdminTutorApplications
    from "./Pages/Admin/TutorApplications/TutorApplications";

import TutorApplicationsDetails
    from "./Pages/Admin/TutorApplicationDetails/TutorApplicationDetails";


/* =========================================================
   ADMIN NOTIFICATIONS
========================================================= */

import AdminNotifications
    from "./Pages/Admin/Notifications/Notifications";


/* =========================================================
   ADMIN CONTACT MESSAGES
========================================================= */

import ContactMessages
    from "./Pages/Admin/ContactMessages/ContactMessages";

import ViewContactMessage
    from "./Pages/Admin/ContactMessages/ViewContactMessage/ViewContactMessage";


/* =========================================================
   ADMIN SETTINGS
========================================================= */

import AdminSettings
    from "./Pages/Admin/Settings/Settings";


/* =========================================================
   ADMIN ROUTE PROTECTION
========================================================= */

function AdminRoute({ children }) {

    const storedUser =
        localStorage.getItem("user");

    const user =
        storedUser
            ? JSON.parse(storedUser)
            : null;


    if (!user || user.role !== "admin") {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    return children;

}


function App() {

    return (

        <BrowserRouter>

            <Header />

            <Routes>


                {/* =====================================================
                    PUBLIC PAGES
                ===================================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />


                <Route
                    path="/courses"
                    element={<Courses />}
                />


                <Route
                    path="/courses/:id"
                    element={<CourseDetails />}
                />


                <Route
                    path="/programs"
                    element={<Programs />}
                />


                <Route
                    path="/programs/:id"
                    element={<Programs />}
                />


                {/* =================================================
                    BLOG
                ================================================= */}

                <Route
                    path="/blog"
                    element={<Blog />}
                />


                <Route
                    path="/blog/:id"
                    element={<ArticleDetails />}
                />


                <Route
                    path="/contact"
                    element={<Contact />}
                />


                <Route
                    path="/about"
                    element={<About />}
                />


                <Route
                    path="/apply-to-teach"
                    element={<ApplyToTeach />}
                />


                <Route
                    path="/speaking"
                    element={<Speaking />}
                />


                <Route
                    path="/enrollment"
                    element={<Enrollment />}
                />


                {/* =====================================================
                    AUTHENTICATION
                ===================================================== */}

                <Route
                    path="/signin"
                    element={<SignIn />}
                />


                <Route
                    path="/signup"
                    element={<SignUp />}
                />


                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />


                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* =====================================================
                    STUDENT DASHBOARD
                ===================================================== */}

                <Route
                    path="/student-dashboard"
                    element={<StudentDashboard />}
                >

                    <Route
                        index
                        element={<Dashboard />}
                    />


                    <Route
                        path="assignments"
                        element={<Assignments />}
                    />


                    <Route
                        path="assignments/view"
                        element={<ViewMyAssignment />}
                    />


                    <Route
                        path="grades"
                        element={<MyGrades />}
                    />


                    <Route
                        path="grades/view"
                        element={<ViewResult />}
                    />


                    <Route
                        path="profile"
                        element={<Profile />}
                    />


                    <Route
                        path="lessons"
                        element={<MyLessons />}
                    />


                    <Route
                        path="lessons/view"
                        element={<ViewMyLesson />}
                    />

                </Route>


                {/* =====================================================
                    TEACHER DASHBOARD
                ===================================================== */}

                <Route
                    path="/teacher-dashboard"
                    element={<TeacherDashboard />}
                >

                    <Route
                        index
                        element={<TeacherDashboardHome />}
                    />


                    <Route
                        path="lessons"
                        element={<TeacherLessons />}
                    />


                    <Route
                        path="lessons/view"
                        element={<ViewLesson />}
                    />


                    <Route
                        path="lessons/edit"
                        element={<EditLesson />}
                    />


                    <Route
                        path="lessons/add"
                        element={<AddLesson />}
                    />


                    <Route
                        path="assignments"
                        element={<TeacherAssignments />}
                    />


                    <Route
                        path="assignments/add"
                        element={<AddAssignment />}
                    />


                    <Route
                        path="assignments/view"
                        element={<ViewAssignment />}
                    />


                    <Route
                        path="assignments/edit"
                        element={<EditAssignment />}
                    />


                    <Route
                        path="students"
                        element={<TeacherStudents />}
                    />


                    <Route
                        path="submissions"
                        element={<TeacherSubmissions />}
                    />

                </Route>


                {/* =====================================================
                    ADMIN DASHBOARD
                ===================================================== */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <Admin />
                        </AdminRoute>
                    }
                >

                    <Route
                        index
                        element={<AdminDashboard />}
                    />


                    {/* =================================================
                        STUDENTS
                    ================================================= */}

                    <Route
                        path="students"
                        element={<Students />}
                    />


                    <Route
                        path="students/:studentId"
                        element={<StudentDetails />}
                    />


                    {/* =================================================
                        TEACHERS
                    ================================================= */}

                    <Route
                        path="teachers"
                        element={<Teachers />}
                    />


                    <Route
                        path="teachers/add"
                        element={<AddTutor />}
                    />


                    <Route
                        path="teachers/:id"
                        element={<TeacherDetails />}
                    />


                    {/* =================================================
                        COURSES
                    ================================================= */}

                    <Route
                        path="courses"
                        element={<AdminCourses />}
                    />


                    <Route
                        path="courses/add"
                        element={<AddCourse />}
                    />


                    <Route
                        path="courses/:id"
                        element={<ViewCourse />}
                    />


                    <Route
                        path="courses/edit/:id"
                        element={<EditCourse />}
                    />


                    {/* =================================================
                        SESSIONS
                    ================================================= */}

                    <Route
                        path="sessions"
                        element={<AdminSessions />}
                    />


                    <Route
                        path="sessions/add"
                        element={<AddSession />}
                    />


                    <Route
                        path="sessions/edit/:id"
                        element={<EditSession />}
                    />


                    <Route
                        path="sessions/:sessionId"
                        element={<SessionDetails />}
                    />


                    {/* =================================================
                        LESSONS
                    ================================================= */}

                    <Route
                        path="lessons"
                        element={<AdminLessons />}
                    />


                    <Route
                        path="lessons/view"
                        element={<ViewAdminLesson />}
                    />


                    {/* =================================================
                        ASSIGNMENTS
                    ================================================= */}

                    <Route
                        path="assignments"
                        element={<AdminAssignments />}
                    />


                    <Route
                        path="assignments/view"
                        element={<ViewAdminAssignment />}
                    />


                    {/* =================================================
                        SUBMISSIONS
                    ================================================= */}

                    <Route
                        path="submissions"
                        element={<AdminSubmissions />}
                    />


                    {/* =================================================
                        GRADES
                    ================================================= */}

                    <Route
                        path="grades"
                        element={<AdminGrades />}
                    />


                    <Route
                        path="grades/view"
                        element={<AdminViewResult />}
                    />


                    {/* =================================================
                        ENROLLMENTS
                    ================================================= */}

                    <Route
                        path="enrollments"
                        element={<AdminEnrollments />}
                    />


                    <Route
                        path="enrollments/:enrollmentId"
                        element={<EnrollmentDetails />}
                    />


                    {/* =================================================
                        TUTOR APPLICATIONS
                    ================================================= */}

                    <Route
                        path="tutor-applications"
                        element={<AdminTutorApplications />}
                    />


                    <Route
                        path="tutor-applications/:id"
                        element={<TutorApplicationsDetails />}
                    />


                    {/* =================================================
                        NOTIFICATIONS
                    ================================================= */}

                    <Route
                        path="notifications"
                        element={<AdminNotifications />}
                    />


                    {/* =================================================
                        CONTACT MESSAGES
                    ================================================= */}

                    <Route
                        path="contact"
                        element={<ContactMessages />}
                    />


                    <Route
                        path="contact/:id"
                        element={<ViewContactMessage />}
                    />


                    {/* =================================================
                        SETTINGS
                    ================================================= */}

                    <Route
                        path="settings"
                        element={<AdminSettings />}
                    />

                </Route>


            </Routes>

        </BrowserRouter>

    );

}


export default App;