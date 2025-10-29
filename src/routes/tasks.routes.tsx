import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import { TaskCreate } from '@screens/TaskCreate'
import { TaskEdit } from '@screens/TaskEdit'
import { TaskManagement } from '@screens/TaskManagement'
import { Tasks } from '@screens/Tasks'

export type TaskDetailsRouteParams = {
  taskId: number
}

type TasksRoutesProps = {
  tasks: undefined
  taskCreate: undefined
  taskManagement: undefined
  taskEdit: TaskDetailsRouteParams
  taskDetails: TaskDetailsRouteParams
}

export type TasksNavigationRoutesProps =
  NativeStackNavigationProp<TasksRoutesProps>

const { Navigator, Screen } = createNativeStackNavigator<TasksRoutesProps>()

export function TasksRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="tasks" component={Tasks} />
      <Screen name="taskCreate" component={TaskCreate} />
      <Screen name="taskManagement" component={TaskManagement} />
      <Screen name="taskEdit" component={TaskEdit} />
      {/* <Screen name="taskDetails" component={TaskDetails} /> */}
    </Navigator>
  )
}
