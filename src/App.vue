<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 py-3">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <RouterLink to="/" class="flex items-center space-x-2">
          <img src="./assets/images/green-pepper.png" alt="Green Pepper Logo" class="w-10 h-10" />
          <span class="text-xl font-bold text-green-600">Green Pepper</span>
        </RouterLink>
        <div class="hidden sm:flex space-x-6">
          <RouterLink to="/register" class="text-green-600 hover:underline transition"
            >Register</RouterLink
          >
        </div>
      </div>
    </nav>
  </header>

  <RouterView />
</template>
