<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between">
    <AppNavbar />
    <RouterView />
    <AppFooter />
  </div>
</template>
