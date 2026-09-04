require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./models/Student');

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

        res.send({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
