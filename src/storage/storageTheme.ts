import AsyncStorage from '@react-native-async-storage/async-storage'
import { THEME_STORAGE } from './config'
import { ThemeName } from '../theme'

export async function storageThemeSave(themeName: ThemeName) {
  await AsyncStorage.setItem(THEME_STORAGE, themeName)
}

export async function storageThemeGet() {
  const themeName = (await AsyncStorage.getItem(THEME_STORAGE)) as ThemeName
  return themeName
}
