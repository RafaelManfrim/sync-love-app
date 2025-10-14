import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'

import ShoppingCartSvg from '@assets/shopping-cart.svg'
import ClipboardListSvg from '@assets/clipboard-list.svg'
import CalendarSvg from '@assets/calendar.svg'
import GearSvg from '@assets/gear.svg'

import { ListsRoutes } from './lists.routes'
import { TasksRoutes } from './tasks.routes'
import { DatesRoutes } from './dates.routes'
import { SettingsRoutes } from './settings.routes'

import { gluestackUIConfig } from '../../config/gluestack-ui.config'
import { TouchableOpacity } from 'react-native'
import { View } from '@gluestack-ui/themed'

type AppRoutesProps = {
  listsStack: undefined
  tasksStack: undefined
  datesStack: undefined
  settingsStack: undefined
}

export type AppNavigationRoutesProps = BottomTabNavigationProp<AppRoutesProps>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesProps>()

const CustomTabBarButton = (props) => {
  const { children, onPress, tokens } = props
  const isFocused = props['aria-selected']

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isFocused ? 1 : 0.7}
      style={{ flex: 1 }}
    >
      <View
        flex={1}
        justifyContent="center"
        alignItems="center"
        borderBottomWidth={isFocused ? 2 : 0}
        borderBottomColor={tokens.colors.red500}
      >
        {children}
      </View>
    </TouchableOpacity>
  )
}

export function AppRoutes() {
  const { tokens } = gluestackUIConfig
  const iconSize = tokens.space['6']

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: tokens.colors.red500,
        tabBarInactiveTintColor: tokens.colors.backgroundDark500,
      }}
    >
      <Screen
        name="listsStack"
        component={ListsRoutes}
        options={{
          tabBarLabel: 'Listas',
          tabBarIcon: ({ color }) => (
            <ShoppingCartSvg width={iconSize} height={iconSize} fill={color} />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} tokens={tokens} />
          ),
        }}
      />

      <Screen
        name="tasksStack"
        component={TasksRoutes}
        options={{
          tabBarLabel: 'Tarefas',
          tabBarIcon: ({ color }) => (
            <ClipboardListSvg width={iconSize} height={iconSize} fill={color} />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} tokens={tokens} />
          ),
        }}
      />

      <Screen
        name="datesStack"
        component={DatesRoutes}
        options={{
          tabBarLabel: 'Datas',
          tabBarIcon: ({ color }) => (
            <CalendarSvg width={iconSize} height={iconSize} fill={color} />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} tokens={tokens} />
          ),
        }}
      />

      <Screen
        name="settingsStack"
        component={SettingsRoutes}
        options={{
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <GearSvg width={iconSize} height={iconSize} fill={color} />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} tokens={tokens} />
          ),
        }}
      />
    </Navigator>
  )
}
