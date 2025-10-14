import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'

import { Missions } from '@screens/Missions'

type TasksRoutesProps = {
  missions: undefined
}

export type TasksNavigationRoutesProps =
  NativeStackNavigationProp<TasksRoutesProps>

const { Navigator, Screen } = createNativeStackNavigator<TasksRoutesProps>()

export function TasksRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="missions" component={Missions} />
    </Navigator>
  )
}
