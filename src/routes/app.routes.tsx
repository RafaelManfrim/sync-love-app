import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'

import ShoppingCartSvg from '@assets/shopping-cart.svg'
import ClipboardListSvg from '@assets/clipboard-list.svg'
import CalendarSvg from '@assets/calendar.svg'
import GearSvg from '@assets/gear.svg'

import HeartSvg from '@assets/heart.svg'
import { ListsRoutes } from './lists.routes'
import { TasksRoutes } from './tasks.routes'
import { DatesRoutes } from './dates.routes'
import { SettingsRoutes } from './settings.routes'

import { TouchableOpacity } from 'react-native'
import { View } from '@gluestack-ui/themed'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PartnerRoutes } from './partner.routes'
import { useTheme } from '@hooks/useTheme'

type AppRoutesProps = {
  listsStack: undefined
  tasksStack: undefined
  datesStack: undefined
  relationshipStack: undefined
  settingsStack: undefined
}

export type AppNavigationRoutesProps = BottomTabNavigationProp<AppRoutesProps>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesProps>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTabBarButton = (props: any) => {
  const { children, onPress, colors } = props
  const isFocused = props['aria-selected']

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isFocused ? 1 : 0.7}
      style={{ flex: 1 }}
    >
      <View flex={1} alignItems="center" justifyContent="center">
        <View flex={1} justifyContent="center" alignItems="center">
          {children}
        </View>
        <View
          height={6}
          width="100%"
          maxWidth="$16"
          borderTopLeftRadius={8}
          borderTopRightRadius={8}
          backgroundColor={colors.primary500}
          opacity={isFocused ? 1 : 0}
        ></View>
      </View>
    </TouchableOpacity>
  )
}

export function AppRoutes() {
  const { colors, customTheme } = useTheme()
  const iconSize = customTheme.config.tokens.space['6']

  const { bottom } = useSafeAreaInsets()

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary500,
        tabBarInactiveTintColor: colors.textInactive,

        tabBarStyle: {
          height: 70 + bottom,
          paddingBottom: bottom,
          backgroundColor: colors.background,
        },
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
            <CustomTabBarButton {...props} colors={colors} />
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
            <CustomTabBarButton {...props} colors={colors} />
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
            <CustomTabBarButton {...props} colors={colors} />
          ),
        }}
      />

      <Screen
        name="relationshipStack"
        component={PartnerRoutes}
        options={{
          tabBarLabel: 'Parceiro',
          tabBarIcon: ({ color }) => (
            <HeartSvg width={iconSize} height={iconSize} fill={color} />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} colors={colors} />
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
            <CustomTabBarButton {...props} colors={colors} />
          ),
        }}
      />
    </Navigator>
  )
}
