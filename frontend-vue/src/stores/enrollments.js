import { ref } from 'vue'
import { defineStore } from 'pinia'

const API_BASE = 'http://localhost:3000'

export const useEnrollmentsStore = defineStore('enrollments', () => {
  const roster = ref([])
  const loading = ref(false)
  const error = ref('')

  async function enroll(studentId, courseId) {
    loading.value = true
    error.value = ''
    try {
      const response = await fetch(`${API_BASE}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, courseId }),
      })
      const data = await response.json()
      if (!response.ok) {
        error.value = data.error || 'Unable to create enrollment'
        return false
      }
      return true
    } catch (err) {
      error.value = err.message || 'Unable to reach the server'
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchRoster(courseId) {
    loading.value = true
    error.value = ''
    roster.value = []
    try {
      const response = await fetch(`${API_BASE}/enrollments/${courseId}`)
      const data = await response.json()
      if (!response.ok) {
        error.value = data.error || 'Unable to load roster'
        return
      }
      roster.value = data
    } catch (err) {
      error.value = err.message || 'Unable to reach the server'
    } finally {
      loading.value = false
    }
  }

  return { roster, loading, error, enroll, fetchRoster }
})
