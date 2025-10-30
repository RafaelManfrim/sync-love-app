import { ScreenHeader } from '@components/ScreenHeader'
import { ToastMessage } from '@components/ToastMessage'
import {
  Center,
  ScrollView,
  VStack,
  useToast,
  Text,
  HStack,
  Icon,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  Heading,
  AlertDialogBody,
  ButtonGroup,
  AlertDialogFooter,
  Pressable,
} from '@gluestack-ui/themed'
import { AppError } from '@utils/AppError'
import * as FileSystem from 'expo-file-system/legacy'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import DefaultUserPhoto from '@assets/userPhotoDefault.png'
import { Button } from '@components/Button'
import { UserPhoto } from '@components/UserPhoto'
import { TouchableOpacity } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { SettingsNavigationRoutesProps } from '@routes/settings.routes'
import { useState } from 'react'
import { useDeleteAccount } from '@hooks/api/useUserQueries'
import { useTheme } from '@hooks/useTheme'

export function Profile() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { colors } = useTheme()
  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const navigation = useNavigation<SettingsNavigationRoutesProps>()

  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount()

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      const photoUri = photoSelected.assets[0].uri

      if (photoUri) {
        const fileInfo = (await FileSystem.getInfoAsync(photoUri)) as {
          size: number
        }

        if (fileInfo.size && fileInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Imagem muito grande"
                description="Escolha uma de até 5MB."
                onClose={() => toast.close(id)}
              />
            ),
          })
        }

        const fileExtension = photoUri.split('.').pop() as string

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoUri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const response = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              action="success"
              title="Foto atualizada com sucesso!"
              onClose={() => toast.close(id)}
            />
          ),
        })

        const userUpdated = user
        userUpdated.avatar_url = response.data.avatarUrl

        await updateUserProfile(userUpdated)
      }
    } catch (error) {
      console.log(error)

      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar a foto'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      })
    }
  }

  function handleNavigateToChangePassword() {
    navigation.navigate('changePassword')
  }

  function handleNavigateToChangeName() {
    navigation.navigate('changeName')
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" hasGoBackButton />
      <VStack flex={1} p="$6" gap="$3">
        <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
          <Center>
            <TouchableOpacity onPress={handleUserPhotoSelect}>
              <UserPhoto
                source={
                  user.avatar_url
                    ? {
                        uri: `${api.defaults.baseURL}/tmp/uploads/avatar/${user.avatar_url}`,
                      }
                    : DefaultUserPhoto
                }
                alt="Foto de perfil do usuário"
                size="xl"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleUserPhotoSelect}>
              <Text
                color={colors.primary500}
                fontFamily="$heading"
                fontSize="$md"
                mt="$2"
                bold
              >
                Alterar Foto
              </Text>
            </TouchableOpacity>

            <Center w="$full" gap="$4" mt="$4">
              <Text color={colors.text} mb="$2">
                {user.name}
              </Text>
              <TouchableOpacity onPress={handleNavigateToChangeName}>
                <HStack
                  w="$full"
                  bgColor={colors.card}
                  alignItems="center"
                  p="$4"
                  borderRadius="$md"
                >
                  <Text mr="auto" color={colors.text}>
                    Alterar Nome
                  </Text>
                  <Icon as={ChevronRight} color={colors.primary500} size="xl" />
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleNavigateToChangePassword}>
                <HStack
                  w="$full"
                  bgColor={colors.card}
                  alignItems="center"
                  p="$4"
                  borderRadius="$md"
                >
                  <Text mr="auto" color={colors.text}>
                    Alterar Senha
                  </Text>
                  <Icon as={ChevronRight} color={colors.primary500} size="xl" />
                </HStack>
              </TouchableOpacity>
            </Center>
          </Center>
        </ScrollView>
      </VStack>

      <Center w="$full" gap="$3" p="$6">
        <Button
          title="Excluir Conta"
          variant="outline"
          onPress={() => setShowDeleteDialog(true)}
          // isLoading={isSubmitting}
        />
      </Center>

      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent bg={colors.card}>
          <AlertDialogHeader>
            <Heading color={colors.title}>Excluir Conta</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text color={colors.text}>
              Você tem certeza? Esta ação é permanente e todos os seus dados,
              incluindo relacionamentos e listas, serão apagados para sempre.
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
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={() => deleteAccount()}
                disabled={isDeleting}
                p="$2"
                borderRadius="$md"
                bg={isDeleting ? '$trueGray200' : '$red50'}
                $hover-bg="$red100"
              >
                <Text
                  color={isDeleting ? '$trueGray500' : '$error500'}
                  fontWeight="$semibold"
                >
                  {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
                </Text>
              </Pressable>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </VStack>
  )
}
