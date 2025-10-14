import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'

import { Partner } from '@screens/Partner'

type PartnerRoutesProps = {
  partner: undefined
}

export type PartnerNavigationRoutesProps =
  NativeStackNavigationProp<PartnerRoutesProps>

const { Navigator, Screen } = createNativeStackNavigator<PartnerRoutesProps>()

export function PartnerRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="partner" component={Partner} />
    </Navigator>
  )
}
