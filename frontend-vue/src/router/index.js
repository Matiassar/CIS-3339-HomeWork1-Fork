import { createRouter, createWebHistory } from 'vue-router'
import CoursesView from '../views/CoursesView.vue'
import EnrollmentsView from '../views/EnrollmentsView.vue'
import StudentsView from '../views/StudentsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/courses',
      name: 'Courses',
      component: CoursesView
    },
    {
      path: '/enrollments',
      name: 'Enrollments',
      component: EnrollmentsView
    },
    {
      path: '/students',
      name: 'Students',
      component: StudentsView
    }
  ]
})

export default router
