<script setup lang="ts">
import InputText from '@/components/widget/InputText.vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
// import router from '@/router'
// import { onMounted } from 'vue'

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
    })
    .catch((error) => {
      alert('Login failed: ' + error.message)
      console.error('Login error:', error)
    })
})
</script>
<template>
  <div class="flex min-h-full flex-col justify-center shadow-sm px-6 py-12 lg:px-8">
    <div
      class="mx-auto w-full max-w-lg p-12 bg-zinc-900/20 backdrop-blur-sm border border-zinc-800 rounded-4xl shadow-xl"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          class="mx-auto h-50 w-auto"
          src="https://xapqrepwfmjcrtcsmqzh.supabase.co/storage/v1/object/public/sadboy/funny-beluga-meme-cat-hd-transparent-background-735811696675541naaswhla0k__1_-removebg-preview.png"
        />
        <h2 class="mt-1 text-center text-3xl font-bold leading-9 tracking-tight text-white">
          Log in to your account !!
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <div>
            <label for="username" class="block text-sm font-medium leading-6 text-white"
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
              <label for="password" class="block text-sm font-medium leading-6 text-white"
                >Password</label
              >
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

        <p class="mt-10 text-center text-sm text-gray-400">
          Not a member?
          <router-link
            to="/register"
            class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
            >Try to register here</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>
