import { createContext, useCallback, useEffect, useState } from 'react'

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
  getUserDataAPICall: () => Promise<UserDTO>
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

  const signOut = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
      try {
        await api.post('/users/logout')
      } catch (error) {
        // do nothing
      }
      api.defaults.headers.common.Authorization = ''
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  const updateUserProfile = useCallback(async (userToUpdate: UserDTO) => {
    try {
      setUser(userToUpdate)
      await storageUserSave(userToUpdate)
    } catch (error) {
      throw error
    }
  }, [])

  async function getUserDataAPICall() {
    const response = await api.get('/users/data')
    return response.data.user
  }

  async function getUserData() {
    try {
      setIsLoadingUserStorageData(true)

      const fetchedUser = await getUserDataAPICall()

      const { refresh_token } = await storageAuthTokenGet()

      const { data } = await api.post('/users/refresh-token', {
        refresh: refresh_token,
      })

      await storageUserSave(fetchedUser)

      await storageAuthTokenSave({
        access_token: data.access,
        refresh_token: data.refresh,
      })

      await userAndTokenUpdate({
        user: fetchedUser,
        access_token: data.access,
        refresh_token: data.refresh,
      })
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
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

  useEffect(() => {
    if (user && user.id && user.couple_id) {
      const interval = setInterval(async () => {
        const userFetched = await getUserDataAPICall()
        updateUserProfile(userFetched)
      }, 15000) // 15 segundos

      return () => clearInterval(interval)
    }
  }, [user.couple_id])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        updateUserProfile,
        isLoadingUserStorageData,
        getUserData,
        getUserDataAPICall,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
