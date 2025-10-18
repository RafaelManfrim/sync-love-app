import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'

import { Settings } from '@screens/Settings'
import { Language } from '@screens/Language'
import { Profile } from '@screens/Profile'
import { Theme } from '@screens/Theme'
import { ChangePassword } from '@screens/ChangePassword'
import { ChangeName } from '@screens/ChangeName'

type SettingsRoutesProps = {
  settings: undefined
  profile: undefined
  language: undefined
  theme: undefined
  changePassword: undefined
  changeName: undefined
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
      <Screen name="changePassword" component={ChangePassword} />
      <Screen name="changeName" component={ChangeName} />
    </Navigator>
  )
}
