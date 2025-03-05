import axios from 'axios'
import { getSession } from 'next-auth/react'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    const token = session?.accessToken
    console.log('session:', session)
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  async (error) => {
    return await Promise.reject(error)
  }
)

export default apiClient
