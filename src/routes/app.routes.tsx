import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native'

import { Home } from '@screens/Home'

import HomeSvg from '@assets/home.svg'
// import HistorySvg from '@assets/history.svg'
// import ProfileSvg from '@assets/profile.svg'
import { gluestackUIConfig } from '../../config/gluestack-ui.config'
import { Settings } from '@screens/Settings'
import { Language } from '@screens/Language'
import { Profile } from '@screens/Profile'
import { Theme } from '@screens/Theme'

type AppRoutesProps = {
  home: undefined
  history: undefined
  profile: undefined
  settings: undefined
  language: undefined
  theme: undefined
  importantDates: undefined
  // exercise: {
  //   exerciseId: number
  // }
}

export type AppNavigationRoutesProps = BottomTabNavigationProp<AppRoutesProps>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesProps>()

export function AppRoutes() {
  const { tokens } = gluestackUIConfig
  const iconSize = tokens.space['6']

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tokens.colors.green500,
        tabBarInactiveTintColor: tokens.colors.backgroundDark200,
        tabBarStyle: {
          backgroundColor: tokens.colors.backgroundDark600,
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: tokens.space['20'],
          paddingTop: tokens.space['7'],
        },
      }}
    >
      <Screen
        name="history"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg width={iconSize} height={iconSize} fill={color} />
          ),
        }}
      />

      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg width={iconSize} height={iconSize} fill={color} />
          ),
        }}
      />

      <Screen
        name="settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg width={iconSize} height={iconSize} fill={color} />
          ),
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="theme"
        component={Theme}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="language"
        component={Language}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="importantDates"
        component={Home}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  )
}
