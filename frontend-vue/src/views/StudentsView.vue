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
    <h1>Students</h1>

    <section>
      <h2>Search Student</h2>
      <form @submit.prevent="handleSearch">
        <label>
          Name
          <input v-model="searchName" type="text" />
        </label>
        <button type="submit" :disabled="store.loading">Search</button>
      </form>

      <p v-if="searchMessage">{{searchMessage}}</p>

      <table v-if="searchResult" border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Phone</th>
            <th>ZIP Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ searchResult.name }}</td>
            <td>{{ searchResult.id }}</td>
            <td>{{ searchResult.phone }}</td>
            <td>{{ searchResult.zip }}</td>
            <td><button @click="handleDelete(searchResult.name)" :disabled="store.loading">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Add Student</h2>
      <form @submit.prevent="handleAddStudent">
        <label>
          Name
          <input v-model="name" type="text" />
        </label>
        <label>
          Student ID
          <input v-model="id" type="text" />
        </label>
        <label>
          Phone
          <input v-model="phone" type="text" />
        </label>
        <label>
          ZIP Code
          <input v-model="zip" type="text" />
        </label>
        <button type="submit" :disabled="store.loading">Add Student</button>
      </form>
      <p v-if="formMessage">{{ formMessage }}</p>
    </section>

  </div>
</template>

<style scoped>
    form {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        max-width: 300px;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
</style>