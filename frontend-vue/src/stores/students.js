import {ref} from 'vue'
import {defineStore} from 'pinia'

const API_BASE = 'http://localhost:3000'

export const useStudentsStore = defineStore('students', () => {
  const students = ref([])
  const loading = ref(false)
  const error = ref('')

  async function findStudent(name) {
    loading.value = true
    error.value = ''
    try {
        const response = await fetch(`${API_BASE}/find-student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        })
        const data = await response.json()
        if (!response.ok) {
            error.value = data.error || 'Failed to find student'
            return null
        }
        return data
    } catch (err) {
        error.value = err.message || 'unable to reach the server'
        return null
    } finally {
        loading.value = false
    }
    }

    async function addStudent(student) {
        loading.value = true
        error.value = ''
        try {
            const response = await fetch(`${API_BASE}/add-student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            })
            const data = await response.json()
            if (!response.ok) {
                error.value = data.error || 'Unable to add student'
                return null
            }
            return data
        } catch (err) {
            error.value = err.message || 'unable to reach the server'
            return null
        } finally {
            loading.value = false
        }
    }

    async function deleteStudent(name) {
        loading.value = true
        error.value = ''
        try {
            const response = await fetch(`${API_BASE}/delete-student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            })
            const data = await response.json()
            if (!response.ok) {
                error.value = data.error || 'Unable to delete student'
                return false
            }
            students.value = students.value.filter(student => student.name !== name)
            return true
        } catch (err) {
            error.value = err.message || 'unable to reach the server'
            return false
        } finally {
            loading.value = false
        }
    }

    async function fetchStudents() {
        loading.value = true
        error.value = ''
        try {
            const response = await fetch(`${API_BASE}/students`)
            const data = await response.json()
            if (!response.ok) {
                error.value = data.error || 'Unable to load students'
                return
            }
            students.value = data
        } catch (err) {
            error.value = err.message || 'unable to reach the server'
        } finally {
            loading.value = false
        }
    }

  return { students, loading, error, findStudent, addStudent, deleteStudent, fetchStudents }
})