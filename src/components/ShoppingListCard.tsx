import {
  Heading,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  ButtonGroup,
  useToast,
} from '@gluestack-ui/themed'
import { ChevronRight, Pencil, Trash2 } from 'lucide-react-native'
import { format } from 'date-fns'
import { useState, useRef } from 'react'

import DefaultUserPhoto from '@assets/userPhotoDefault.png'
import { UserPhoto } from './UserPhoto'
import { api } from '@services/api'
import { ShoppingListDTO } from '@dtos/ShoppingListDTO'
import { useTheme } from '@hooks/useTheme'
import { useTranslation } from 'react-i18next'
import { useShoppingListQueries } from '@hooks/api/useShoppingListQueries'
import { ToastMessage } from './ToastMessage'
import { translateApiError } from '@utils/translateApiError'

interface ShoppingListCardProps {
  handleOpenShoppingList: (shoppingListId: number) => void
  handleEditShoppingList: (shoppingListId: number) => void
  shoppingList: ShoppingListDTO
}

export function ShoppingListCard({
  shoppingList,
  handleOpenShoppingList,
  handleEditShoppingList,
}: ShoppingListCardProps) {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const toast = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const cancelRef = useRef(null)

  const { useDeleteShoppingList } = useShoppingListQueries()
  const { mutate: deleteList, isPending } = useDeleteShoppingList()

  const isOpen = !shoppingList.closed_at

  const handleDelete = () => {
    deleteList(shoppingList.id, {
      onSuccess: () => {
        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title={t('components.shoppingListCard.deleteSuccess')}
              action="success"
              onClose={() => toast.close(id)}
            />
          ),
        })
        setShowDeleteDialog(false)
      },
      onError: (error) => {
        const description = translateApiError(error)

        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title={t('components.shoppingListCard.deleteError')}
              description={description}
              action="error"
              onClose={() => toast.close(id)}
            />
          ),
        })
      },
    })
  }

  return (
    <>
      <Pressable
        onPress={() => handleOpenShoppingList(shoppingList.id)}
        bg={colors.card}
        p="$3"
        rounded="$md"
        mb="$3"
      >
        <HStack justifyContent="space-between" alignItems="center">
          <VStack flex={1}>
            <Heading color={colors.title}>{shoppingList.name}</Heading>
            <Text color={colors.textInactive} fontFamily="$body">
              {t('components.shoppingListCard.items', {
                count: shoppingList.ShoppingListItem.length,
              })}{' '}
              - {format(new Date(shoppingList.created_at), 'dd/MM/yyyy HH:mm')}
            </Text>
            <HStack alignItems="center" mt="$1" gap="$1">
              <Text color={colors.textInactive} fontFamily="$body">
                {t('components.shoppingListCard.createdBy')}
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
                alt={t('components.shoppingListCard.createdByPhotoAlt', {
                  name: shoppingList.name,
                })}
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
                  {t('components.shoppingListCard.closedAt')}
                </Text>

                <Text color={colors.textInactive} fontFamily="$body">
                  {format(new Date(shoppingList.closed_at), 'dd/MM/yyyy HH:mm')}
                </Text>
              </HStack>
            )}
          </VStack>

          <HStack gap="$2" alignItems="center">
            {isOpen && (
              <>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation()
                    handleEditShoppingList(shoppingList.id)
                  }}
                  p="$2"
                  borderRadius="$md"
                  bg={colors.primary500}
                  opacity={0.8}
                >
                  <Pencil size={20} color="white" />
                </Pressable>

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation()
                    setShowDeleteDialog(true)
                  }}
                  p="$2"
                  borderRadius="$md"
                  bg="$error500"
                  opacity={0.8}
                >
                  <Trash2 size={20} color="white" />
                </Pressable>
              </>
            )}
            <Icon as={ChevronRight} color={colors.text} />
          </HStack>
        </HStack>
      </Pressable>

      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent bg={colors.card}>
          <AlertDialogHeader>
            <Heading size="lg" color={colors.title}>
              {t('components.shoppingListCard.deleteDialogTitle')}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text color={colors.text}>
              {t('components.shoppingListCard.deleteDialogMessage')}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup space="lg">
              <Pressable
                onPress={() => setShowDeleteDialog(false)}
                p="$2"
                borderRadius="$md"
              >
                <Text color={colors.textInactive} fontWeight="$medium">
                  {t('components.shoppingListCard.deleteDialogCancel')}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleDelete}
                disabled={isPending}
                p="$2"
                borderRadius="$md"
                bg={isPending ? '$trueGray200' : '$red50'}
                $hover-bg="$red100"
              >
                <Text
                  color={isPending ? '$trueGray500' : '$error500'}
                  fontWeight="$semibold"
                >
                  {isPending
                    ? t('components.shoppingListCard.deleteDialogDeleting')
                    : t('components.shoppingListCard.deleteDialogConfirm')}
                </Text>
              </Pressable>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
