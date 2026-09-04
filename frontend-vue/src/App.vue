<script setup>
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <router-link to="/courses">Courses</router-link>
      <router-link to="/enrollments">Enrollments</router-link>
      <router-link to="/students">Students</router-link>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
  nav {
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }
</style>