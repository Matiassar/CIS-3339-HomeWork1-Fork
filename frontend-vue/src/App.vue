<script setup>
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <div class="container">
      <span class="navbar-brand">Student Management</span>
      <div class="navbar-nav">
        <RouterLink to="/courses" class="nav-link" active-class="active">Courses</RouterLink>
        <RouterLink to="/enrollments" class="nav-link" active-class="active">Enrollments</RouterLink>
        <RouterLink to="/students" class="nav-link" active-class="active">Students</RouterLink>
      </div>
    </div>
  </nav>

  <main class="container py-4">
    <RouterView />
  </main>
</template>


<style scoped>
  nav {
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }
</style>