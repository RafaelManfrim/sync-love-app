import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native'

import { Home } from '@screens/Home'

import HomeSvg from '@assets/home.svg'
import HistorySvg from '@assets/history.svg'
import GearSvg from '@assets/gear.svg'
import { gluestackUIConfig } from '../../config/gluestack-ui.config'
import { SettingsRoutes } from './settings.routes'
import { HomeRoutes } from './home.routes'

type AppRoutesProps = {
  homeStack: undefined
  history: undefined
  settingsStack: undefined
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
        tabBarActiveTintColor: tokens.colors.red500,
        tabBarInactiveTintColor: tokens.colors.backgroundDark500,
        tabBarStyle: {
          backgroundColor: tokens.colors.backgroundDark200,
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: tokens.space['6'],
          paddingTop: tokens.space['6'],
        },
      }}
    >
      <Screen
        name="history"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg width={iconSize} height={iconSize} fill={color} />
          ),
        }}
      />

      <Screen
        name="homeStack"
        component={HomeRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg width={iconSize} height={iconSize} fill={color} />
          ),
        }}
      />

      <Screen
        name="settingsStack"
        component={SettingsRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <GearSvg width={iconSize} height={iconSize} fill={color} />
          ),
        }}
      />
    </Navigator>
  )
}
