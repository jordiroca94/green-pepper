<!-- CURRENTLY UNUSED, KEEPING IT HERE IN CASE THAT I WANT TO USE A NON LOCAL DB -->
<template>
  <div
    class="min-h-screen bg-gradient-to-tr from-gray-100 to-white flex items-center justify-center -mt-[61px]"
  >
    <div
      class="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-sm transform hover:scale-[1.02] transition-transform duration-300"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-green-600 mb-1">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none transition duration-200"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-green-600 mb-1"
            >Password</label
          >
          <input
            v-model="password"
            id="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none transition duration-200"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
        >
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleSubmit = () => {
  console.log('Registering:', { email: email.value, password: password.value })
  // Add registration logic here
}
</script>
