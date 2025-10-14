import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { ToastMessage } from '@components/ToastMessage'
import { ShoppingListDTO } from '@dtos/ShoppingListDTO'
import { FlatList, useToast, VStack } from '@gluestack-ui/themed'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { HomeNavigationRoutesProps } from '@routes/lists.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useCallback, useState } from 'react'

export function ShoppingLists() {
  const [isLoading, setIsLoading] = useState(true)
  const [shoppingLists, setShoppingLists] = useState<ShoppingListDTO[]>([])

  const navigation = useNavigation<HomeNavigationRoutesProps>()
  const toast = useToast()

  function handleOpenShoppingList(shoppingListId: number) {
    navigation.navigate('shoppingList', { shoppingListId })
  }

  function handleNewShoppingList() {
    navigation.navigate('newShoppingList')
  }

  async function fetchShoppingLists() {
    try {
      setIsLoading(true)
      const { data } = await api.get<{ shoppingLists: ShoppingListDTO[] }>(
        '/shopping-lists',
      )
      setShoppingLists(data.shoppingLists)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar as listas de compras.'

      toast.show({
        render: () => (
          <ToastMessage title={title} action="error" duration={4000} />
        ),
        placement: 'top',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchShoppingLists()
    }, []),
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Listas de Compras" hasGoBackButton />
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={shoppingLists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleOpenShoppingList(item.id)}
              bg="$gray500"
              p="$4"
              rounded="$md"
              mx="$5"
              mb="$3"
            >
              <Text color="$white" fontFamily="$body">
                {item.title}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <Text color="$gray100" textAlign="center" mt="$8">
              Nenhuma lista de compras encontrada. {'\n'}
              Vamos criar a primeira?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </VStack>
  )
}
