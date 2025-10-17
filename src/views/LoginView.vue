<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import * as yup from 'yup'

import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const authStore = useAuthStore()
const validationSchema = yup.object({
  username: yup.string().required('The username is required'),
  password: yup
    .string()
    .required('The password is required')
    .min(6, 'The password must be at least 6 characters.'),
})

const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    username: '',
    password: '',
  },
})

const { value: username } = useField<string>('username')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit((values) => {
  authStore
    .login(values.username, values.password)
    .then(() => {
      console.log('Login successful')
      router.push({ name: 'home' })
    })
    .catch((error) => {
      alert('Login failed: ' + error.message)
      console.error('Login error:', error)
    })
})
</script>
<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-50 w-auto"
        src="https://videos.openai.com/az/vg-assets/assets%2Ftask_01k7nrg2w8fzrvxkbdxpwxa418%2F1760593299_img_1.webp?se=2025-10-22T07%3A14%3A23Z&sp=r&sv=2024-08-04&sr=b&skoid=1af02b11-169c-463d-b441-d2ccfc9f02c8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-10-16T05%3A08%3A32Z&ske=2025-10-23T05%3A13%3A32Z&sks=b&skv=2024-08-04&sig=/CtCQ7jmMdhE%2B2OAQDquWxVZo8pp958Q7A9XJrbDjR0%3D&ac=oaivgprodscus"
        alt="Your Company"
      />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="onSubmit">
        <div>
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900"
            >Username</label
          >
          <InputText
            type="text"
            v-model="username"
            placeholder="Username"
            :error="errors['username']"
          />
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
              >Password</label
            >
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"
                >Forgot password?</a
              >
            </div>
          </div>
          <div class="mt-2">
            <InputText
              type="password"
              v-model="password"
              placeholder="Password"
              :error="errors['password']"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Not a member?
        <a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Try to register here</a
        >
      </p>
    </div>
  </div>
</template>
