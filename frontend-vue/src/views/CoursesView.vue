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
    <h1>Courses</h1>

    <section>
      <h2>Add Course</h2>
      <form @submit.prevent="handleAddCourse">
        <label>
          Course ID
          <input v-model="id" type="text" />
        </label>
        <label>
          Course Name
          <input v-model="name" type="text" />
        </label>
        <button type="submit" :disabled="coursesStore.loading">Add Course</button>
      </form>
      <p v-if="formMessage">{{ formMessage }}</p>
    </section>

    <section>
      <h2>All Courses</h2>
      <p v-if="coursesStore.loading">Loading courses...</p>
      <p v-else-if="coursesStore.courses.length === 0">No courses available.</p>
      <table v-else border="1">
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
            <td><button @click="handleDelete(course.id)">Delete</button></td>
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

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
</style>