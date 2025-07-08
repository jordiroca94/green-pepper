<template>
  <footer class="bg-green-600 text-white py-4">
    <div class="max-w-320 mx-auto px-4 flex items-center justify-between">
      <span class="text-sm">&copy; 2025 Green Pepper. All rights reserved.</span>

      <a
        href="https://github.com/jordiroca94/green-pepper"
        target="_blank"
        rel="noopener"
        class="hover:text-gray-200 transition-colors duration-200"
        aria-label="GitHub"
      >
        <Github class="w-6 h-6" />
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Github } from 'lucide-vue-next'
</script>
