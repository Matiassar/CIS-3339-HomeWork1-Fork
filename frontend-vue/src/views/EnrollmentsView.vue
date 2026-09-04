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
    <h1 class="mb-4">Enrollments</h1>

    <div class="row g-4">
      <div class="col-md-5">
        <div class="card">
          <div class="card-body">
            <h2 class="h5 card-title">Enroll a Student</h2>
            <form @submit.prevent="handleEnroll">
              <div class="mb-3">
                <label class="form-label">Student</label>
                <select v-model="selectedStudentId" class="form-select">
                  <option value="" disabled>Select a student</option>
                  <option
                    v-for="student in studentsStore.students"
                    :key="student.id"
                    :value="student.id"
                  >
                    {{ student.name }} ({{ student.id }})
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Course</label>
                <select v-model="selectedCourseId" class="form-select">
                  <option value="" disabled>Select a course</option>
                  <option
                    v-for="course in coursesStore.courses"
                    :key="course.id"
                    :value="course.id"
                  >
                    {{ course.name }} ({{ course.id }})
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="enrollmentsStore.loading">
                Enroll
              </button>
            </form>
            <div v-if="enrollMessage" class="alert alert-info mt-3 mb-0">{{ enrollMessage }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-7">
        <div class="card">
          <div class="card-body">
            <h2 class="h5 card-title">Course Roster</h2>
            <div class="mb-3">
              <label class="form-label">Course</label>
              <select v-model="rosterCourseId" class="form-select" @change="handleViewRoster">
                <option value="" disabled>Select a course</option>
                <option
                  v-for="course in coursesStore.courses"
                  :key="course.id"
                  :value="course.id"
                >
                  {{ course.name }} ({{ course.id }})
                </option>
              </select>
            </div>

            <p v-if="enrollmentsStore.loading" class="text-muted mb-0">Loading...</p>
            <p
              v-else-if="rosterCourseId && enrollmentsStore.roster.length === 0"
              class="text-muted mb-0"
            >
              No students enrolled in this course.
            </p>
            <table v-else-if="enrollmentsStore.roster.length > 0" class="table table-striped mb-0">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
