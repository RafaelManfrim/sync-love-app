// import AsyncStorage from "@react-native-async-storage/async-storage"

// import { UserDTO } from "@dtos/UserDTO"

// import { USER_STORAGE } from "@storage/config"

// export async function storageUserSave(user: UserDTO) {
//   const userStorage = JSON.stringify(user)

//   await AsyncStorage.setItem(USER_STORAGE, userStorage)
// }

// export async function storageUserGet() {
//   const userStorage = await AsyncStorage.getItem(USER_STORAGE)

//   const user: UserDTO = userStorage ? JSON.parse(userStorage) : {}

//   return user
// }

// export async function storageUserRemove() {
//   await AsyncStorage.removeItem(USER_STORAGE)
// }
