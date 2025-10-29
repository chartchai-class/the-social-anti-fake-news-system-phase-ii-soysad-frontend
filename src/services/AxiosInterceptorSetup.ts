import apiClient from '@/services/AxiosClient'

apiClient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      request.headers = request.headers ?? {}
      request.headers['Authorization'] = `Bearer ${token}`
    }
    return request
  },
  (error) => Promise.reject(error),
)
