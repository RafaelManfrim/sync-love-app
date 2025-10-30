// import { storageAuthTokenGet, storageAuthTokenSave } from "@storage/storageAuthToken";
import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import { AppError } from '@utils/AppError'
import axios, { AxiosError, AxiosInstance } from 'axios'

type SignOut = () => void

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 1000 * 5,
}) as APIInstanceProps

type PromiseType = {
  onSuccess: (token: string) => void
  onFailure: (error: AxiosError) => void
}

let failedQueue: PromiseType[] = []
let isRefreshing = false

api.registerInterceptTokenManager = (signOut) => {
  const iterceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      console.log(requestError.response.data)
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === 'token.expired' ||
          requestError.response.data?.message === 'token.invalid' ||
          requestError.response.data?.message === 'Não autorizado'
        ) {
          const { refresh_token } = await storageAuthTokenGet()

          if (!refresh_token) {
            signOut()
            return Promise.reject(requestError)
          }

          const originalRequestConfig = requestError.config

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequestConfig.headers.Authorization = `Bearer ${token}`
                  resolve(api(originalRequestConfig))
                },
                onFailure: (error: AxiosError) => {
                  reject(error)
                },
              })
            })
          }

          isRefreshing = true

          // eslint-disable-next-line no-async-promise-executor
          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post('/users/refresh-token', {
                refresh: refresh_token,
              })
              await storageAuthTokenSave({
                access_token: data.access,
                refresh_token: data.refresh,
              })

              if (
                originalRequestConfig.data &&
                !(originalRequestConfig.data instanceof FormData)
              ) {
                originalRequestConfig.data = JSON.parse(
                  originalRequestConfig.data,
                )
              }

              originalRequestConfig.headers.Authorization = `Bearer ${data.access}`
              api.defaults.headers.common.Authorization = `Bearer ${data.access}`

              failedQueue.forEach((request) => request.onSuccess(data.access))
              resolve(api(originalRequestConfig))
            } catch (error) {
              failedQueue.forEach((request) =>
                request.onFailure(error as AxiosError),
              )
              signOut()
              reject(error)
            } finally {
              isRefreshing = false
              failedQueue = []
            }
          })
        }

        signOut()
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message))
      }

      return Promise.reject(requestError)
    },
  )

  return () => {
    api.interceptors.response.eject(iterceptTokenManager)
  }
}

export { api }
