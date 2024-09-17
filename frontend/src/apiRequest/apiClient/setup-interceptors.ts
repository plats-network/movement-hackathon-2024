// import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// import {
//   handleAuthExpired,
//   refreshToken,
//   refreshTokenMutex
// } from '@/api/utils/helpers'
// import { SESSION_STORAGE_KEYS } from '@/globals/auth/constants'
// import { isTokenValid } from '@/globals/auth/session'
// import { store } from '@/store'
// import { unreachable } from '@/utils'

// import apiClient from './index'

// const logOnDev = (
//   message: string,
//   log?: AxiosResponse | InternalAxiosRequestConfig | AxiosError
// ) => {
//   if (process.env.NEXT_PUBLIC_ENV === 'development') {
//     console.log(message, log)
//   }
// }

// apiClient.interceptors.request.use(async (request) => {
//   // Store should be initialized before any requests
//   if (!store) return unreachable()

//   // Wait while the token is being refreshed
//   await refreshTokenMutex.waitForUnlock()

//   const isAuthenticated = store.getState().session.isAuthenticated

//   if (isAuthenticated) {
//     let accessToken = localStorage.getItem(SESSION_STORAGE_KEYS.TOKEN)

//     if (!accessToken || !isTokenValid(accessToken)) {
//       accessToken = await refreshToken()
//     }

//     if (accessToken) {
//       request.headers['Authorization'] = `Bearer ${accessToken}`
//     }
//   }

//   const { method, url } = request
//   logOnDev(`🚀 [${method?.toUpperCase()}] ${url} | Request`, request)

//   return request
// })

// apiClient.interceptors.response.use(
//   (response) => {
//     const { method, url } = response.config
//     const { status } = response

//     logOnDev(
//       `✨ [${method?.toUpperCase()}] ${url} | Response ${status}`,
//       response
//     )

//     return response
//   },
//   async (error) => {
//     const { message } = error
//     const { status, data } = error.response
//     const { method, url } = error.config

//     logOnDev(
//       `🚨 [${method?.toUpperCase()}] ${url} | Error ${status} ${data?.message || ''} | ${message}`,
//       error
//     )

//     if (status === 400 && data.message === 'Authentication error') {
//       delete error.config.headers['Authorization']
//       return refreshToken().then(() => apiClient.request(error.config))
//     }

//     if (status === 404 && data.message === 'You login in another device') {
//       delete error.config.headers['Authorization']
//       return handleAuthExpired()
//     }

//     return Promise.reject(error)
//   }
// )
