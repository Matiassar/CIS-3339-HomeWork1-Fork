<script setup>
import { ref, onMounted } from 'vue'
import { useCoursesStore } from '../stores/courses'

const coursesStore = useCoursesStore()

const id = ref('')
const name = ref('')
const formMessage = ref('')

onMounted(() => {
  coursesStore.fetchCourses()
})

async function handleAddCourse() {
  formMessage.value = ''
  if (!id.value || !name.value) {
    formMessage.value = 'All fields are required.'
    return
  }

  const success = await coursesStore.addCourse({
    id: id.value,
    name: name.value,
  })

  if (success) {
    formMessage.value = 'Course added successfully.'
    id.value = ''
    name.value = ''
  } else {
    formMessage.value = coursesStore.error
  }
}

async function handleDelete(courseId) {
  await coursesStore.deleteCourse(courseId)
}
</script>

<template>
  <div>
    <h1 class="mb-4">Courses</h1>

    <div class="row g-4">
      <div class="col-md-5">
        <div class="card">
          <div class="card-body">
            <h2 class="h5 card-title">Add Course</h2>
            <form @submit.prevent="handleAddCourse">
              <div class="mb-3">
                <label class="form-label">Course ID</label>
                <input v-model="id" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Course Name</label>
                <input v-model="name" type="text" class="form-control" />
              </div>
              <button type="submit" class="btn btn-primary" :disabled="coursesStore.loading">
                Add Course
              </button>
            </form>
            <div v-if="formMessage" class="alert alert-info mt-3 mb-0">{{ formMessage }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-7">
        <div class="card">
          <div class="card-body">
            <h2 class="h5 card-title">All Courses</h2>

            <p v-if="coursesStore.loading" class="text-muted mb-0">Loading courses...</p>
            <p v-else-if="coursesStore.courses.length === 0" class="text-muted mb-0">No courses available.</p>
            <table v-else class="table table-striped mb-0">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="course in coursesStore.courses" :key="course.id">
                  <td>{{ course.id }}</td>
                  <td>{{ course.name }}</td>
                  <td>
                    <button class="btn btn-sm btn-danger" @click="handleDelete(course.id)">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
