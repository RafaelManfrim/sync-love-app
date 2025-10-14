import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'

import { Settings } from '@screens/Settings'
import { Language } from '@screens/Language'
import { Profile } from '@screens/Profile'
import { Theme } from '@screens/Theme'

type SettingsRoutesProps = {
  settings: undefined
  profile: undefined
  language: undefined
  theme: undefined
}

export type SettingsNavigationRoutesProps =
  NativeStackNavigationProp<SettingsRoutesProps>

const { Navigator, Screen } = createNativeStackNavigator<SettingsRoutesProps>()

export function SettingsRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="settings" component={Settings} />
      <Screen name="profile" component={Profile} />
      <Screen name="theme" component={Theme} />
      <Screen name="language" component={Language} />
    </Navigator>
  )
}
