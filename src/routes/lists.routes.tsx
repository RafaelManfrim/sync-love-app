import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import { CloseShoppingList } from '@screens/CloseShoppingList'

import { NewShoppingList } from '@screens/NewShoppingList'
import { ShoppingList } from '@screens/ShoppingList'
import { ShoppingLists } from '@screens/ShoppingLists'

export type ShoppingListScreenProps = {
  shoppingListId: number
}

export type CloseShoppingListScreenProps = {
  shoppingListId: number
}

type ShoppingListRoutesProps = {
  shoppingLists: undefined
  newShoppingList: undefined
  shoppingList: ShoppingListScreenProps
  closeShoppingList: CloseShoppingListScreenProps
}

export type ShoppingListNavigationRoutesProps =
  NativeStackNavigationProp<ShoppingListRoutesProps>

const { Navigator, Screen } =
  createNativeStackNavigator<ShoppingListRoutesProps>()

export function ListsRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="shoppingLists" component={ShoppingLists} />
      <Screen name="shoppingList" component={ShoppingList} />
      <Screen name="newShoppingList" component={NewShoppingList} />
      <Screen name="closeShoppingList" component={CloseShoppingList} />
    </Navigator>
  )
}
