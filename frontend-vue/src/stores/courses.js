import {ref} from 'vue';
import {defineStore} from 'pinia'

const API_BASE = 'http://localhost:3000'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchCourses() {
    loading.value = true
    error.value = ''
    try {
        const response = await fetch(`${API_BASE}/courses`)
        const data = await response.json()
        if (!response.ok) {
            error.value = data.error || 'Unable to fetch courses'
            return
        }
        courses.value = data
    } catch (err) {
        error.value = err.message || 'unable to reach the server'
    } finally {
        loading.value = false
    }
  }

  async function addCourse(course) {
    loading.value = true
    error.value = ''
    try {
        const response = await fetch(`${API_BASE}/add-course`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(course)
        })
        const data = await response.json()
        if (!response.ok) {
            error.value = data.error || 'Unable to add course'
            return false
        }
        courses.value.push(data.course)
        return true
    } catch (err) {
        error.value = err.message || 'unable to reach the server'
        return false
    } finally {
        loading.value = false
    }
  }

  async function deleteCourse(id) {
    loading.value = true
    error.value = ''
    try {
        const response = await fetch(`${API_BASE}/delete-course`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        const data = await response.json()
        if (!response.ok) {
            error.value = data.error || 'Unable to delete course'
            return false
        }
        courses.value = courses.value.filter(course => course.id !== id)
        return true
    } catch (err) {
        error.value = err.message || 'unable to reach the server'
        return false
    } finally {
        loading.value = false
    }
  }

  return { courses, loading, error, fetchCourses, addCourse, deleteCourse }
})