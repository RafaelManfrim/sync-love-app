import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import { InvitePartner } from '@screens/InvitePartner'

import { SignIn } from '@screens/SignIn'
import { SignUp } from '@screens/SignUp'
import { WaitingPartner } from '@screens/WaitingPartner'

type AuthRoutesProps = {
  signIn: undefined
  signUp: undefined
  invitePartner: undefined
  waitingPartner: undefined
}

export type AuthNavigationRoutesProps =
  NativeStackNavigationProp<AuthRoutesProps>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutesProps>()

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="signIn" component={SignIn} />
      <Screen name="signUp" component={SignUp} />
      <Screen name="invitePartner" component={InvitePartner} />
      <Screen name="waitingPartner" component={WaitingPartner} />
    </Navigator>
  )
}
