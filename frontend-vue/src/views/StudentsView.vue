<script setup>
import { ref } from 'vue'
import { useStudentsStore } from '../stores/students'

const store = useStudentsStore()

const name = ref('')
const id = ref('')
const phone = ref('')
const zip = ref('')
const formMessage = ref('')

const searchName = ref('')
const searchResult = ref(null)
const searchMessage = ref('')

async function handleAddStudent() {
  formMessage.value = ''
  if (!name.value || !id.value || !phone.value || !zip.value) {
    formMessage.value = 'All fields are required.'
    return
  }

  const success = await store.addStudent({
    name: name.value,
    id: id.value,
    phone: phone.value,
    zip: zip.value,
  })

  if (success) {
    formMessage.value = 'Student added successfully.'
    name.value = ''
    id.value = ''
    phone.value = ''
    zip.value = ''
  } else {
    formMessage.value = store.error
  }
}

async function handleSearch() {
  searchMessage.value = ''
  searchResult.value = null
  if (!searchName.value) {
    searchMessage.value = 'Enter a name to search.'
    return
  }

  const result = await store.findStudent(searchName.value)
  if (result) {
    searchResult.value = result
  } else {
    searchMessage.value = store.error
  }
}

async function handleDelete(studentName) {
  const success = await store.deleteStudent(studentName)
  if (success && searchResult.value?.name === studentName) {
    searchResult.value = null
  }
}
</script>

<template>
  <div>
    <h1 class="mb-4">Students</h1>

    <div class="row g-4">
      <div class="col-md-5">
        <div class="card">
          <div class="card-body">
            <h2 class="h5 card-title">Add Student</h2>
            <form @submit.prevent="handleAddStudent">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="name" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Student ID</label>
                <input v-model="id" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Phone</label>
                <input v-model="phone" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">ZIP Code</label>
                <input v-model="zip" type="text" class="form-control" />
              </div>
              <button type="submit" class="btn btn-primary" :disabled="store.loading">
                Add Student
              </button>
            </form>
            <div v-if="formMessage" class="alert alert-info mt-3 mb-0">{{ formMessage }}</div>
          </div>
        </div>
      </div>

      <div class="col-md-7">
        <div class="card">
          <div class="card-body">
            <h2 class="h5 card-title">Search Student</h2>
            <form @submit.prevent="handleSearch" class="d-flex gap-2 mb-3">
              <input v-model="searchName" type="text" class="form-control" placeholder="Student name" />
              <button type="submit" class="btn btn-primary" :disabled="store.loading">Search</button>
            </form>

            <div v-if="searchMessage" class="alert alert-warning mb-0">{{ searchMessage }}</div>

            <table v-if="searchResult" class="table table-striped mt-3 mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Phone</th>
                  <th>Zip</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ searchResult.name }}</td>
                  <td>{{ searchResult.id }}</td>
                  <td>{{ searchResult.phone }}</td>
                  <td>{{ searchResult.zip }}</td>
                  <td>
                    <button class="btn btn-sm btn-danger" @click="handleDelete(searchResult.name)">
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
