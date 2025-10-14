import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'

import { ImportantDates } from '@screens/ImportantDates'

type DatesRoutesProps = {
  importantDates: undefined
}

export type DatesNavigationRoutesProps =
  NativeStackNavigationProp<DatesRoutesProps>

const { Navigator, Screen } = createNativeStackNavigator<DatesRoutesProps>()

export function DatesRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="importantDates" component={ImportantDates} />
    </Navigator>
  )
}
