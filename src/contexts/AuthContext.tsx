import { createContext, useEffect, useState } from 'react'

// import { UserDTO } from "@dtos/UserDTO";
// import { api } from "@services/api";
// import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
// import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken";

// type StorageUserAndTokenProps = {
//   user: UserDTO;
//   token: string;
//   refresh_token: string;
// }

export type AuthContextDataProps = {
  // user: UserDTO;
  // isLoadingUserStorageData: boolean;
  // signIn: (email: string, password: string) => Promise<void>;
  // signOut: () => Promise<void>;
  // updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

type AuthContextProviderProps = {
  children: React.ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  // const [user, setUser] = useState<UserDTO>({} as UserDTO)
  // const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  // async function userAndTokenUpdate({ user, token }: StorageUserAndTokenProps) {
  //   api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  //   setUser(user)
  // }

  // async function storageUserAndTokenSave({ user, token, refresh_token }: StorageUserAndTokenProps) {
  //   try {
  //     setIsLoadingUserStorageData(true)
  //     await storageUserSave(user)
  //     await storageAuthTokenSave({ token, refresh_token })
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoadingUserStorageData(false)
  //   }
  // }

  // async function signIn(email: string, password: string) {
  //   try {
  //     const response = await api.post('/sessions', { email, password })

  //     if (response.data && response.data.user && response.data.token && response.data.refresh_token) {
  //       const { data } = response as { data: StorageUserAndTokenProps }

  //       await storageUserAndTokenSave(data)
  //       await userAndTokenUpdate(data)
  //     }
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoadingUserStorageData(false)
  //   }
  // }

  // async function signOut() {
  //   try {
  //     setIsLoadingUserStorageData(true)
  //     setUser({} as UserDTO)
  //     await storageUserRemove()
  //     await storageAuthTokenRemove()
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoadingUserStorageData(false)
  //   }
  // }

  // async function updateUserProfile(userUpdated: UserDTO) {
  //   try {
  //     setUser(userUpdated)
  //     await storageUserSave(userUpdated)
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // async function loadUserData() {
  //   try{
  //     setIsLoadingUserStorageData(true)
  //     const userLogged = await storageUserGet()
  //     const { token, refresh_token } = await storageAuthTokenGet()

  //     if (token && userLogged) {
  //       await userAndTokenUpdate({ user: userLogged, token, refresh_token })
  //     }
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoadingUserStorageData(false)
  //   }
  // }

  // useEffect(() => {
  //   loadUserData()
  // }, [])

  // useEffect(() => {
  //   const subscribe= api.registerInterceptTokenManager(signOut)

  //   return () => {
  //     subscribe()
  //   }
  // }, [signOut])

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
}
