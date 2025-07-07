<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col -mt-14 sm:mt-0">
    <AppNavbar />
    <div class="flex-1">
      <RouterView />
    </div>
    <AppFooter />
  </div>
</template>
