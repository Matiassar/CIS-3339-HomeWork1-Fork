import {ref} from 'vue';
import {defineStore} from 'pinia'

const API_BASE = 'http://localhost:3000'

export const useEnrollmentsStore = defineStore('enrollments', () => {
    const enrollments = ref([])
    const loading = ref(false)
    const error = ref('')

    async function enrollStudent(studentId, courseId) {
        loading.value = true
        error.value = ''
        try {
            const response = await fetch(`${API_BASE}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ studentId, courseId })
            })
            const data = await response.json()
            if (!response.ok) {
                error.value = data.error || 'Unable to enroll student'
                return false
            }
            return true
        } catch (err) {
            error.value = err.message || 'unable to reach the server'
            return false
        } finally {
            loading.value = false
        }
    }

    async function fetchEnrollments() {
        loading.value = true
        error.value = ''
        roster.value = []
        try {
            const response = await fetch(`${API_BASE}/enrollments/${studentId}`)
            const data = await response.json()
            if (!response.ok) {
                error.value = data.error || 'Unable to load roaster'
                return
            }
            enrollments.value = data
        } catch (err) {
            error.value = err.message || 'unable to reach the server'
        } finally {
            loading.value = false
        }
    }

    return {
        enrollments, loading, error, enrollStudent, fetchEnrollments
    }
})