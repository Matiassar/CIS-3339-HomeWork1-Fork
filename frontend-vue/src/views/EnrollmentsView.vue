<script setup>
import { ref, onMounted } from 'vue'
import { useStudentsStore } from '../stores/students'
import { useCoursesStore } from '../stores/courses'
import { useEnrollmentsStore } from '../stores/enrollments'

const studentsStore = useStudentsStore()
const coursesStore = useCoursesStore()
const enrollmentsStore = useEnrollmentsStore()

const selectedStudentId = ref('')
const selectedCourseId = ref('')
const enrollMessage = ref('')

const rosterCourseId = ref('')

onMounted(() => {
  studentsStore.fetchStudents()
  coursesStore.fetchCourses()
})

async function handleEnroll() {
  enrollMessage.value = ''
  if (!selectedStudentId.value || !selectedCourseId.value) {
    enrollMessage.value = 'Select both a student and a course.'
    return
  }

  const success = await enrollmentsStore.enroll(selectedStudentId.value, selectedCourseId.value)
  enrollMessage.value = success
    ? 'Student enrolled successfully.'
    : enrollmentsStore.error
}

async function handleViewRoster() {
  if (!rosterCourseId.value) return
  await enrollmentsStore.fetchRoster(rosterCourseId.value)
}
</script>

<template>
  <div>
    <h1>Enrollments</h1>

    <section>
      <h2>Enroll a Student</h2>
      <form @submit.prevent="handleEnroll">
        <label>
          Student
          <select v-model="selectedStudentId">
            <option value="" disabled>Select a student</option>
            <option v-for="student in studentsStore.students" :key="student.id" :value="student.id">
              {{ student.name }} ({{ student.id }})
            </option>
          </select>
        </label>
        <label>
          Course
          <select v-model="selectedCourseId">
            <option value="" disabled>Select a course</option>
            <option v-for="course in coursesStore.courses" :key="course.id" :value="course.id">
              {{ course.name }} ({{ course.id }})
            </option>
          </select>
        </label>
        <button type="submit" :disabled="enrollmentsStore.loading">Enroll</button>
      </form>
      <p v-if="enrollMessage">{{ enrollMessage }}</p>
    </section>

    <section>
      <h2>Course Roster</h2>
      <label>
        Course
        <select v-model="rosterCourseId" @change="handleViewRoster">
          <option value="" disabled>Select a course</option>
          <option v-for="course in coursesStore.courses" :key="course.id" :value="course.id">
            {{ course.name }} ({{ course.id }})
          </option>
        </select>
      </label>

      <p v-if="enrollmentsStore.loading">Loading...</p>
      <p v-else-if="rosterCourseId && enrollmentsStore.roster.length === 0">
        No students enrolled in this course.
      </p>
      <table v-else-if="enrollmentsStore.roster.length > 0" border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
            <th>Phone</th>
            <th>Zip</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in enrollmentsStore.roster" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.id }}</td>
            <td>{{ student.phone }}</td>
            <td>{{ student.zip }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 300px;
}

section > label{
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 300px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
