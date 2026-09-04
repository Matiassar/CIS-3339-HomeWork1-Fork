require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Endpoint to search for a student by name
app.post('/find-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const student = await Student.findOne({ name });
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        res.send(student);
    } catch (error) {
        console.error('Error finding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to save a student
app.post('/add-student', async (req, res) => {
    try {
        const { name, id, phone, zip } = req.body;
        if (!name || !id || !phone || !zip) {
            return res.status(400).send({ error: 'All fields (name, id, phone, zip) are required' });
        }

        const existing = await Student.findOne({ id });
        if (existing) {
            return res.status(409).send({ error: 'A student with that ID already exists' });
        }

        const newStudent = await Student.create({ name, id, phone, zip });
        res.status(201).send({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to delete a student by name
app.post('/delete-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const deletedStudent = await Student.findOneAndDelete({ name });
        if (!deletedStudent) {
            return res.status(404).send({ error: 'Student not found' });
        }
        await Enrollment.deleteMany({ studentId: deletedStudent.id });

        res.send({ message: 'Student deleted successfully', student: deletedStudent });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

//Endpoint to list all courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.send(courses);
    } catch (error) {
        console.error('Error listing courses:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

//Endpoint to add a course
app.post('/add-course', async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!id || !name) {
            return res.status(400).send({ error: 'Both fields (id, name)' });
        }

        const existing = await Course.findOne({ id });
        if (existing) {
            return res.status(409).send({ error: 'A course with that ID already exists' });
        }

        const newCourse = await Course.create({ id, name });
        res.status(201).send({ message: 'Course added successfully', course: newCourse });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

//Endpoint to delete a course by id
app.post('/delete-course', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send({ error: 'Course id is required' });
        }

        const deletedCourse = await Course.findOneAndDelete({ id });
        if (!deletedCourse) {
            return res.status(404).send({ error: 'Course not found' });
        }
        await Enrollment.deleteMany({ courseId: deletedCourse.id });

        res.send({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

//Endpoint to list all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (error) {
        console.error('Error listing students:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

//Endpoint to enroll a student in a course
app.post('/enroll', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        if (!studentId || !courseId) {
            return res.status(400).send({ error: 'Both fields (studentId, courseId) are required' });
        }

        const student = await Student.findOne({ id: studentId });
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        const course = await Course.findOne({ id: courseId });
        if (!course) {
            return res.status(404).send({ error: 'Course not found' });
        }

        const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
        if (existingEnrollment) {
            return res.status(409).send({ error: 'Student is already enrolled in this course' });
        }

        const newEnrollment = await Enrollment.create({ studentId, courseId });
        res.status(201).send({ message: 'Enrollment successful', enrollment: newEnrollment });
    } catch (error) {
        console.error('Error enrolling student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

//Endpoint to list students enrolled in a course
app.get('/course-students/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const enrollments = await Enrollment.find({ courseId });
        const studentIds = enrollments.map(enrollment => enrollment.studentId);
        const students = await Student.find({ id: { $in: studentIds } });
        res.send(students);
    } catch (error) {
        console.error('Error listing students for course:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
