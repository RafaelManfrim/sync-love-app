import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native'

// import { Home } from '@screens/Home'
// import { Exercise } from '@screens/Exercise'
// import { History } from '@screens/History'
// import { Profile } from '@screens/Profile'

import HomeSvg from '@assets/home.svg'
import HistorySvg from '@assets/history.svg'
import ProfileSvg from '@assets/profile.svg'
import { gluestackUIConfig } from '../../config/gluestack-ui.config'

type AppRoutesProps = {
  // home: undefined
  // history: undefined
  // profile: undefined
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
        tabBarInactiveTintColor: tokens.colors.gray200,
        tabBarStyle: {
          backgroundColor: tokens.colors.gray600,
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: tokens.space['7'],
          paddingTop: tokens.space['7'],
        },
      }}
    >
      {/* <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg width={iconSize} height={iconSize} fill={color} />
          ),
        }}
      />

      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg width={iconSize} height={iconSize} fill={color} />
          ),
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg width={iconSize} height={iconSize} fill={color} />
          ),
        }}
      />

      <Screen
        name="exercise"
        component={Exercise}
        options={{ tabBarButton: () => null }}
      /> */}
    </Navigator>
  )
}
