import { Center, HStack, Icon, Text, VStack } from '@gluestack-ui/themed'

import { UserPhoto } from '@components/UserPhoto'
import { ScreenHeader } from '@components/ScreenHeader'
import { ChevronRight } from 'lucide-react-native'
import { Button } from '@components/Button'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SettingsNavigationRoutesProps } from '@routes/settings.routes'

export function Settings() {
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
                // user.avatar
                //   ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                //   : DefaultUserPhoto
                { uri: `https://github.com/rafaelmanfrim.png` }
              }
              w="$16"
              h="$16"
              alt="Foto de perfil do usuário"
              size="xl"
            />

            <VStack pl="$3" mr="auto">
              <Text>Rafael Manfrim</Text>
              <Text fontSize="$sm" color="$trueGray500">
                usuario@e-mail.com
              </Text>
            </VStack>
            <Icon as={ChevronRight} color="$green600" size="xl" />
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
            <Icon as={ChevronRight} color="$green600" size="xl" />
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
            <Icon as={ChevronRight} color="$green600" size="xl" />
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
            <Icon as={ChevronRight} color="$green600" size="xl" />
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
