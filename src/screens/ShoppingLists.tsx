import { Button } from '@components/Button'
import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { ToastMessage } from '@components/ToastMessage'
import { UserPhoto } from '@components/UserPhoto'
import { ShoppingListDTO } from '@dtos/ShoppingListDTO'
import {
  Center,
  FlatList,
  Heading,
  HStack,
  Icon,
  Pressable,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ShoppingListNavigationRoutesProps } from '@routes/lists.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { format } from 'date-fns'
import { ChevronRight } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import DefaultUserPhoto from '@assets/userPhotoDefault.png'

export function ShoppingLists() {
  const [isLoading, setIsLoading] = useState(true)
  const [shoppingLists, setShoppingLists] = useState<ShoppingListDTO[]>([])

  const navigation = useNavigation<ShoppingListNavigationRoutesProps>()
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
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
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
      <ScreenHeader title="Listas de Compras" />
      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px="$8" mt="$6">
          <HStack justifyContent="space-between" alignItems="center" mb="$5">
            <Heading color="$trueGray400" fontSize="$md" fontFamily="$heading">
              Listas
            </Heading>

            <Text color="$trueGray500" fontSize="$sm" fontFamily="$body">
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
                <Pressable
                  onPress={() => handleOpenShoppingList(shoppingList.id)}
                  bg="$trueGray200"
                  p="$4"
                  rounded="$md"
                  mb="$3"
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack>
                      <Heading color="$trueGray600">
                        {shoppingList.name}
                      </Heading>
                      <Text color="$trueGray500" fontFamily="$body">
                        {shoppingList.ShoppingListItem.length} itens -{' '}
                        {format(
                          new Date(shoppingList.created_at),
                          'dd/MM/yyyy HH:mm',
                        )}
                      </Text>
                      <HStack alignItems="center" mt="$1" gap="$1">
                        <Text color="$trueGray500" fontFamily="$body">
                          Criada por:
                        </Text>
                        <UserPhoto
                          source={
                            shoppingList.author.avatar_url
                              ? {
                                  uri: `${api.defaults.baseURL}/avatar/${shoppingList.author.avatar_url}`,
                                }
                              : DefaultUserPhoto
                          }
                          w="$5"
                          h="$5"
                          alt={`Foto de perfil do autor da lista: ${shoppingList.name}`}
                          size="xl"
                          ml="$1"
                        />
                        <Text color="$trueGray500" fontFamily="$body">
                          {shoppingList.author.name}
                        </Text>
                      </HStack>
                    </VStack>
                    <Icon as={ChevronRight} />
                  </HStack>
                </Pressable>
              )
            }}
            ListEmptyComponent={() => (
              <Text color="$gray100" textAlign="center" mt="$8">
                Nenhuma lista de compras encontrada. {'\n'}
                Vamos criar a primeira?
              </Text>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}

      <Center w="$full" gap="$3" p="$6">
        <Button
          title="Nova Lista"
          onPress={handleNewShoppingList}
          isLoading={isLoading}
        />
      </Center>
    </VStack>
  )
}
