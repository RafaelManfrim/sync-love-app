import { createContext, useEffect, useState } from 'react'

import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'

type StorageUserAndTokenProps = {
  user: UserDTO
  access_token: string
  refresh_token: string
}

export type AuthContextDataProps = {
  user: UserDTO
  isLoadingUserStorageData: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
  getUserData: () => Promise<void>
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

type AuthContextProviderProps = {
  children: React.ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  async function userAndTokenUpdate({
    user,
    access_token,
  }: StorageUserAndTokenProps) {
    api.defaults.headers.common.Authorization = `Bearer ${access_token}`
    setUser(user)
  }

  async function storageUserAndTokenSave({
    user,
    access_token,
    refresh_token,
  }: StorageUserAndTokenProps) {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(user)
      await storageAuthTokenSave({ access_token, refresh_token })
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/users/login', { email, password })

      if (
        response.data &&
        response.data.user &&
        response.data.access_token &&
        response.data.refresh_token
      ) {
        const { data } = response as { data: StorageUserAndTokenProps }

        await storageUserAndTokenSave(data)
        await userAndTokenUpdate(data)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function signOut() {
    try {
      await api.post('/users/logout')
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function getUserData() {
    try {
      setIsLoadingUserStorageData(true)
      const response = await api.get('/users/data')
      setUser(response.data.user)
      await storageUserSave(response.data.user)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoadingUserStorageData(true)
        const userLogged = await storageUserGet()
        const { access_token, refresh_token } = await storageAuthTokenGet()

        if (access_token && userLogged) {
          await userAndTokenUpdate({
            user: userLogged,
            access_token,
            refresh_token,
          })
        }
      } catch (error) {
        throw error
      } finally {
        setIsLoadingUserStorageData(false)
      }
    }

    loadUserData()
  }, [])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe()
    }
  }, [signOut])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        updateUserProfile,
        isLoadingUserStorageData,
        getUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
