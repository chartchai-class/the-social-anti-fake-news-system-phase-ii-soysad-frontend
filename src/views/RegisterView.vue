<script setup lang="ts">
import { ref } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import ImageUpload from '@/components/ImageUpload.vue'
import InputText from '@/components/InputText.vue'

const authStore = useAuthStore()
const currentStep = ref(1)
const isSubmitting = ref(false)

const defaultImage = 'https://st2.depositphotos.com/.../male-user-icon.jpg'
const profileImageUrl = ref<string>(defaultImage)

const uploadUrl = `${import.meta.env.VITE_BACKEND_URL}/uploadFile`
const publicBase = import.meta.env.VITE_PUBLIC_IMAGE_BASE || ''

const schema = yup.object({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: firstname } = useField<string>('firstname')
const { value: lastname } = useField<string>('lastname')
const { value: username } = useField<string>('username')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const goStep2 = handleSubmit(() => {
  currentStep.value = 2
})

async function submitRegistration() {
  isSubmitting.value = true

  try {
    const payload = {
      firstname: firstname.value,
      lastname: lastname.value,
      username: username.value,
      email: email.value,
      password: password.value,
      profileImageUrl: profileImageUrl.value,
    }

    await authStore.register(payload)
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div
      class="mx-auto w-full max-w-lg p-8 sm:p-12 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl"
    >
      <div v-if="currentStep === 1">
        <h2 class="text-center text-2xl font-bold text-white mb-8">Create Your Account (1/2)</h2>
        <form @submit.prevent="goStep2" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputText
              v-model="firstname"
              placeholder="First Name"
              type="text"
              :error="errors.firstname"
            />
            <InputText
              v-model="lastname"
              placeholder="Last Name"
              type="text"
              :error="errors.lastname"
            />
          </div>

          <InputText
            v-model="username"
            placeholder="Username"
            type="text"
            :error="errors.username"
          />

          <InputText v-model="email" placeholder="Email" type="email" :error="errors.email" />

          <InputText
            v-model="password"
            placeholder="Password"
            type="password"
            :error="errors.password"
          />

          <button
            type="submit"
            class="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Next Step
          </button>
        </form>
      </div>

      <div v-else>
        <h2 class="text-center text-2xl font-bold text-white mb-6">
          Set Your Profile Picture (2/2)
        </h2>
        <div class="flex flex-col items-center gap-6">
          <p class="text-sm text-gray-400">Upload your profile picture (optional)</p>

          <div
            class="w-40 h-40 rounded-full overflow-hidden bg-zinc-800 border-4 border-indigo-600 flex items-center justify-center flex-shrink-0"
          >
            <img :src="profileImageUrl" :alt="'Profile'" class="w-full h-full object-cover" />
          </div>

          <ImageUpload v-model="profileImageUrl" :server="uploadUrl" :publicBase="publicBase" />

          <div class="w-full flex gap-4 justify-between">
            <button
              @click="currentStep = 1"
              :disabled="isSubmitting"
              class="flex-1 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors font-semibold disabled:opacity-50"
            >
              Back
            </button>
            <button
              @click="submitRegistration"
              :disabled="isSubmitting"
              class="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50"
            >
              {{ isSubmitting ? 'Registering...' : 'Finish Registration' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
