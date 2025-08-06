import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import { CloseShoppingList } from '@screens/CloseShoppingList'

import { Home } from '@screens/Home'
import { NewShoppingList } from '@screens/NewShoppingList'
import { ShoppingList } from '@screens/ShoppingList'
import { ShoppingLists } from '@screens/ShoppingLists'

type HomeRoutesProps = {
  home: undefined
  shoppingLists: undefined
  shoppingList: undefined
  newShoppingList: undefined
  closeShoppingList: undefined
}

export type HomeNavigationRoutesProps =
  NativeStackNavigationProp<HomeRoutesProps>

const { Navigator, Screen } = createNativeStackNavigator<HomeRoutesProps>()

export function HomeRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="shoppingLists" component={ShoppingLists} />
      <Screen name="shoppingList" component={ShoppingList} />
      <Screen name="newShoppingList" component={NewShoppingList} />
      <Screen name="closeShoppingList" component={CloseShoppingList} />
    </Navigator>
  )
}
