# CIS 3339 Homework 1: Student Management System

A full-stack Student Management System built with Vue 3 (Composition API), Express, and MongoDB. Supports managing students, courses, and enrollments with data stored in MongoDB.

## Features

- Add, search, display, and delete students
- Add, list, and delete courses
- Enroll students in courses and view course rosters
- Duplicate student IDs, duplicate course IDs, and duplicate enrollments are rejected
- Deleting a student or course cascades to remove related enrollments
- Data persisted in MongoDB (no JSON file storage)

## Required Software

- [Node.js](https://nodejs.org/) and npm
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community), running locally
- A modern web browser

## Environment Variables

The backend reads its MongoDB connection string from `backend/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
```

This file is committed to the repository so the app runs out of the box against a local MongoDB instance.

## Setup

### 1. Start MongoDB

Confirm the MongoDB service is running locally. On Windows (PowerShell):

```powershell
Get-Service mongo
```

If it's not running:

```powershell
net start MongoDB
```

### 2. Install Dependencies

```bash
cd backend
npm install
cd ../frontend-vue
npm install
```

### 3. Build the Frontend

```bash
cd frontend-vue
npm run build
```

This generates the production assets in `frontend-vue/dist`.

### 4. Start the Server

```bash
cd backend
node server.js
```

The Express server connects to MongoDB, serves the built Vue app, and exposes the API — all from a single port.

## Running the Application

Open your browser to:

```
http://localhost:3000
```

The database and its collections are created automatically on first use — no manual setup, seeding, or migration is required.

## Project Structure

- `backend/` — Express server, Mongoose models, and REST API
- `frontend-vue/` — Vue 3 application (Composition API, Vue Router, Pinia)
- `frontend-archive/` — original starter HTML/JS frontend, kept for reference only (not used by the running app)
