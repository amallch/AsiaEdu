const dns = require("dns");

const cors = require("cors");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollments");
const tutorApplicationRoutes = require("./routes/TutorApplicationRoutes");
const contactRoutes = require("./routes/contact");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/TeacherRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const sessionRoutes = require("./routes/SessionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");


const app = express();

app.use(cors());

app.use(express.json());


// =====================================================
// SERVE UPLOADED FILES
// =====================================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/tutor-applications", tutorApplicationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);


mongoose.connect(process.env.MONGO_URI)

    .then(() => {

        console.log("MongoDB connected");

    })

    .catch((error) => {

        console.log("MongoDB connection error:", error);

    });


const PORT = process.env.PORT || 5000;


app.get("/", (req, res) => {

    res.send("AsiaEdu Backend is running!");

});


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});