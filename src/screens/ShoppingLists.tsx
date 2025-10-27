import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { ShoppingListDTO } from '@dtos/ShoppingListDTO'
import { FlatList, Heading, HStack, Text, VStack } from '@gluestack-ui/themed'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ShoppingListNavigationRoutesProps } from '@routes/lists.routes'

import { useCallback } from 'react'

import { AddRoundedButton } from '@components/AddRoundedButton'
import { useShoppingListQueries } from '@hooks/api/useShoppingListQueries'
import { useTheme } from '@hooks/useTheme'
import { ShoppingListCard } from '@components/ShoppingListCard'

export function ShoppingLists() {
  const { useFetchShoppingLists } = useShoppingListQueries()

  const {
    data: shoppingLists,
    isLoading,
    // isRefetching, // Para o RefreshControl
    refetch, // Função para rebuscar os dados
    // error, // [NOVO] Para tratar erros
  } = useFetchShoppingLists()

  const { colors } = useTheme()

  // const [isLoading, setIsLoading] = useState(true)
  // const [shoppingLists, setShoppingLists] = useState<ShoppingListDTO[]>([])

  const navigation = useNavigation<ShoppingListNavigationRoutesProps>()
  // const toast = useToast()

  function handleOpenShoppingList(shoppingListId: number) {
    navigation.navigate('shoppingList', { shoppingListId })
  }

  function handleNewShoppingList() {
    navigation.navigate('newShoppingList')
  }

  // async function fetchShoppingLists() {
  //   try {
  //     setIsLoading(true)
  //     const { data } = await api.get<{ shoppingLists: ShoppingListDTO[] }>(
  //       '/shopping-lists',
  //     )

  //     setShoppingLists(data.shoppingLists)
  //   } catch (error) {
  //     const isAppError = error instanceof AppError
  //     const title = isAppError
  //       ? error.message
  //       : 'Não foi possível carregar as listas de compras.'

  //     toast.show({
  //       render: ({ id }) => (
  //         <ToastMessage
  //           id={id}
  //           title={title}
  //           action="error"
  //           onClose={() => toast.close(id)}
  //         />
  //       ),
  //       placement: 'top',
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchShoppingLists()
  //   }, []),
  // )

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  // if (error) {
  //   return (
  //     <VStack flex={1} bg={colors.background} justifyContent="center" alignItems="center">
  //       <ScreenHeader title="Listas de Compras" />
  //       <Box flex={1} justifyContent="center" alignItems="center">
  //         <Text color={colors.text}>Erro ao carregar as listas.</Text>
  //         <Pressable onPress={() => refetch()} mt="$4">
  //           <Text color={colors.primary}>Tentar Novamente</Text>
  //         </Pressable>
  //       </Box>
  //     </VStack>
  //   )
  // }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Listas de Compras" />
      {!isLoading && shoppingLists ? (
        <>
          <VStack flex={1} p="$6" gap="$3">
            <HStack justifyContent="space-between" alignItems="center">
              <Heading
                color={colors.textInactive}
                fontSize="$md"
                fontFamily="$heading"
              >
                Listas
              </Heading>

              <Text color={colors.title} fontSize="$sm" fontFamily="$body">
                {shoppingLists.length}
              </Text>
            </HStack>
            <FlatList
              data={shoppingLists}
              keyExtractor={(item) => {
                const shoppingList = item as ShoppingListDTO
                return shoppingList.id.toString()
              }}
              renderItem={({ item }) => {
                const shoppingList = item as ShoppingListDTO
                return (
                  <ShoppingListCard
                    shoppingList={shoppingList}
                    handleOpenShoppingList={handleOpenShoppingList}
                  />
                )
              }}
              ListEmptyComponent={() => (
                <Text color={colors.textInactive} textAlign="center" mt="$8">
                  Nenhuma lista de compras encontrada. {'\n'}
                  Vamos criar a primeira?
                </Text>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </VStack>

          <AddRoundedButton onPress={handleNewShoppingList} />
        </>
      ) : (
        <Loading />
      )}
    </VStack>
  )
}
