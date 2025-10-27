import {
  Heading,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { ChevronRight } from 'lucide-react-native'
import { format } from 'date-fns'

import DefaultUserPhoto from '@assets/userPhotoDefault.png'
import { UserPhoto } from './UserPhoto'
import { api } from '@services/api'
import { ShoppingListDTO } from '@dtos/ShoppingListDTO'
import { useTheme } from '@hooks/useTheme'

interface ShoppingListCardProps {
  handleOpenShoppingList: (shoppingListId: number) => void
  shoppingList: ShoppingListDTO
}

export function ShoppingListCard({
  shoppingList,
  handleOpenShoppingList,
}: ShoppingListCardProps) {
  const { colors } = useTheme()

  return (
    <Pressable
      onPress={() => handleOpenShoppingList(shoppingList.id)}
      bg={colors.card}
      p="$3"
      rounded="$md"
      mb="$3"
    >
      <HStack justifyContent="space-between" alignItems="center">
        <VStack>
          <Heading color={colors.title}>{shoppingList.name}</Heading>
          <Text color={colors.textInactive} fontFamily="$body">
            {shoppingList.ShoppingListItem.length} itens -{' '}
            {format(new Date(shoppingList.created_at), 'dd/MM/yyyy HH:mm')}
          </Text>
          <HStack alignItems="center" mt="$1" gap="$1">
            <Text color={colors.textInactive} fontFamily="$body">
              Criada por:
            </Text>
            <UserPhoto
              source={
                shoppingList.author.avatar_url
                  ? {
                      uri: `${api.defaults.baseURL}/tmp/uploads/avatar/${shoppingList.author.avatar_url}`,
                    }
                  : DefaultUserPhoto
              }
              w="$5"
              h="$5"
              alt={`Foto de perfil do autor da lista: ${shoppingList.name}`}
              size="xl"
              ml="$1"
            />
            <Text color={colors.textInactive} fontFamily="$body">
              {shoppingList.author.name}
            </Text>
          </HStack>
          {shoppingList.closed_at && (
            <HStack alignItems="center" mt="$1" gap="$1">
              <Text color={colors.textInactive} fontFamily="$body">
                Concluída em:
              </Text>

              <Text color={colors.textInactive} fontFamily="$body">
                {format(new Date(shoppingList.closed_at), 'dd/MM/yyyy HH:mm')}
              </Text>
            </HStack>
          )}
        </VStack>
        <Icon as={ChevronRight} color={colors.text} />
      </HStack>
    </Pressable>
  )
}
