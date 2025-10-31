import { HStack, Icon, Text, VStack, Center } from '@gluestack-ui/themed'

import { UserPhoto } from '@components/UserPhoto'
import { ScreenHeader } from '@components/ScreenHeader'
import { BookType, ChevronRight, Palette } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SettingsNavigationRoutesProps } from '@routes/settings.routes'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import DefaultUserPhoto from '@assets/userPhotoDefault.png'
import { Button } from '@components/Button'
import { useTheme } from '@hooks/useTheme'
import { useTranslation } from 'react-i18next'

export function Settings() {
  const { user, signOut } = useAuth()
  const { colors } = useTheme()
  const { t } = useTranslation()

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

  return (
    <VStack flex={1}>
      <ScreenHeader title={t('settings.title')} />

      <VStack flex={1} p="$6" gap="$3">
        <TouchableOpacity onPress={handleNavigateToProfile}>
          <HStack
            w="$full"
            bgColor={colors.card}
            alignItems="center"
            p="$3"
            borderRadius="$md"
          >
            <UserPhoto
              source={
                user.avatar_url
                  ? {
                      uri: `${api.defaults.baseURL}/tmp/uploads/avatar/${user.avatar_url}`,
                    }
                  : DefaultUserPhoto
              }
              w="$12"
              h="$12"
              alt={t('settings.userPhotoAlt')}
              size="xl"
            />

            <VStack pl="$3" mr="auto">
              <Text color={colors.title}>{user.name}</Text>
              <Text fontSize="$sm" color={colors.text}>
                {user.email}
              </Text>
            </VStack>
            <Icon as={ChevronRight} color={colors.primary500} size="xl" />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigateToTheme}>
          <HStack
            w="$full"
            bgColor={colors.card}
            alignItems="center"
            p="$4"
            borderRadius="$md"
          >
            <Icon as={Palette} color={colors.text} size="md" mr="$2" />
            <Text mr="auto" color={colors.text}>
              {t('settings.themes')}
            </Text>
            <Icon as={ChevronRight} color={colors.primary500} size="xl" />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigateToLanguage}>
          <HStack
            w="$full"
            bgColor={colors.card}
            alignItems="center"
            p="$4"
            borderRadius="$md"
          >
            <Icon as={BookType} color={colors.text} size="md" mr="$2" />
            <Text mr="auto" color={colors.text}>
              {t('settings.language')}
            </Text>
            <Icon as={ChevronRight} color={colors.primary500} size="xl" />
          </HStack>
        </TouchableOpacity>
      </VStack>
      <Center w="$full" gap="$3" p="$6">
        <Button
          title={t('settings.signOut')}
          onPress={signOut}
          variant="outline"
        />
      </Center>
    </VStack>
  )
}
