import { Center, HStack, Icon, Text, VStack } from '@gluestack-ui/themed'

import { UserPhoto } from '@components/UserPhoto'
import { ScreenHeader } from '@components/ScreenHeader'
import { ChevronRight } from 'lucide-react-native'
import { Button } from '@components/Button'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SettingsNavigationRoutesProps } from '@routes/settings.routes'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import DefaultUserPhoto from '@assets/userPhotoDefault.png'

export function Settings() {
  const { user } = useAuth()

  const navigation = useNavigation<SettingsNavigationRoutesProps>()

  function handleNavigateToProfile() {
    navigation.navigate('profile')
  }

  function handleNavigateToTheme() {
    navigation.navigate('theme')
  }

  function handleNavigateToLanguage() {
    navigation.navigate('language')
  }

  function handleNavigateToImportantDates() {
    navigation.navigate('importantDates')
  }

  function handleEndRelationship() {
    console.log('Função terminar relacionamento')
  }

  function handleDeleteAccount() {
    console.log('Função excluir conta')
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Configurações" />

      <VStack flex={1} p="$6" gap="$3">
        <TouchableOpacity onPress={handleNavigateToProfile}>
          <HStack
            w="$full"
            bgColor="$trueGray200"
            alignItems="center"
            p="$3"
            borderRadius="$md"
          >
            <UserPhoto
              source={
                user.avatar_url
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar_url}` }
                  : DefaultUserPhoto
              }
              w="$16"
              h="$16"
              alt="Foto de perfil do usuário"
              size="xl"
            />

            <VStack pl="$3" mr="auto">
              <Text>{user.name}</Text>
              <Text fontSize="$sm" color="$trueGray500">
                {user.email}
              </Text>
            </VStack>
            <Icon as={ChevronRight} color="$red500" size="xl" />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigateToTheme}>
          <HStack
            w="$full"
            bgColor="$trueGray200"
            alignItems="center"
            p="$3"
            borderRadius="$md"
          >
            <Text mr="auto">Temas</Text>
            <Icon as={ChevronRight} color="$red500" size="xl" />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigateToLanguage}>
          <HStack
            w="$full"
            bgColor="$trueGray200"
            alignItems="center"
            p="$3"
            borderRadius="$md"
          >
            <Text mr="auto">Idioma</Text>
            <Icon as={ChevronRight} color="$red500" size="xl" />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigateToImportantDates}>
          <HStack
            w="$full"
            bgColor="$trueGray200"
            alignItems="center"
            p="$3"
            borderRadius="$md"
          >
            <Text mr="auto">Datas Importantes</Text>
            <Icon as={ChevronRight} color="$red500" size="xl" />
          </HStack>
        </TouchableOpacity>
      </VStack>

      <Center w="$full" gap="$3" p="$6">
        <Button
          title="Terminar Relacionamento"
          variant="outline"
          onPress={handleEndRelationship}
          // isLoading={isSubmitting}
        />

        <Button
          title="Excluir Conta"
          onPress={handleDeleteAccount}
          // isLoading={isSubmitting}
        />
      </Center>
    </VStack>
  )
}
