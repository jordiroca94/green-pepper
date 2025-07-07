<template>
  <div
    class="min-h-screen bg-gradient-to-tr from-gray-100 to-white flex items-center justify-center -mt-[61px]"
  >
    <div
      class="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md transform hover:scale-[1.02] transition-transform duration-300"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <h2 class="text-2xl font-bold text-center text-green-700">Create your account</h2>
        <div>
          <label for="name" class="block text-sm font-medium text-green-600 mb-1">Full Name</label>
          <input
            v-model="name"
            id="name"
            type="text"
            required
            class="w-full px-4 py-2 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none transition duration-200"
          />
        </div>
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
            :type="showPassword ? 'text' : 'password'"
            id="password"
            required
            class="w-full px-4 py-2 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none transition duration-200"
          />
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-green-600 mb-1"
            >Confirm Password</label
          >
          <input
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            id="confirmPassword"
            required
            class="w-full px-4 py-2 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none transition duration-200"
          />
        </div>
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showPassword"
            v-model="showPassword"
            class="accent-green-600"
          />
          <label for="showPassword" class="text-sm text-gray-600">Show Passwords</label>
        </div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" id="newsletter" v-model="subscribe" class="accent-green-600" />
          <label for="newsletter" class="text-sm text-gray-600">Subscribe to our newsletter</label>
        </div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" id="terms" v-model="agreed" class="accent-green-600" required />
          <label for="terms" class="text-sm text-gray-600"
            >I agree to the
            <a href="#" class="text-green-600 underline">Terms & Conditions</a></label
          >
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50"
          :disabled="!agreed"
        >
          Register
        </button>
        <p class="text-center text-sm text-gray-600">
          Already have an account?
          <a href="#" class="text-green-600 hover:underline">Log in</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const agreed = ref(false)
const subscribe = ref(false)

const handleSubmit = () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords don't match")
    return
  }

  console.log('Registering:', {
    name: name.value,
    email: email.value,
    password: password.value,
    subscribe: subscribe.value,
  })

  // Add registration logic here (API call, validation, etc.)
}
</script>
