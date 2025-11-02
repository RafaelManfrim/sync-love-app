import {
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  Image,
  useToast,
  KeyboardAvoidingView,
  Icon,
} from '@gluestack-ui/themed'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import Logo from '@assets/sync_love_square-no-bg.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { api } from '@services/api'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigationRoutesProps } from '@routes/auth.routes'
import { ToastMessage } from '@components/ToastMessage'
import { Platform, TouchableOpacity } from 'react-native'
import { useTheme } from '@hooks/useTheme'
import { ChevronLeft } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

type FormDataProps = {
  email: string
}

export function InvitePartner() {
  const { colors } = useTheme()
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false)

  const invitePartnerSchema = z.object({
    email: z
      .string()
      .email(t('invitePartner.emailInvalid'))
      .nonempty(t('invitePartner.emailRequired')),
  })

  const { control, handleSubmit, formState } = useForm<FormDataProps>({
    resolver: zodResolver(invitePartnerSchema),
  })

  const toast = useToast()

  const navigation = useNavigation<AuthNavigationRoutesProps>()

  async function handleInvite({ email }: FormDataProps) {
    try {
      setIsLoading(true)
      await api.post('/couple-invitations/invite', { email })

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="success"
            title={t('invitePartner.inviteSuccess')}
            onClose={() => toast.close(id)}
          />
        ),
      })

      navigation.navigate('waitingPartner')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <VStack flex={1} px="$8" pb="$16">
          <Center my="$16">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ position: 'absolute', left: 0, top: 24 }}
            >
              <Icon as={ChevronLeft} color={colors.textInactive} size="xl" />
            </TouchableOpacity>

            <Image
              source={Logo}
              defaultSource={Logo}
              alt={t('invitePartner.logoAlt')}
            />

            <Text color={colors.text} fontSize="$sm" textAlign="center">
              {t('invitePartner.subtitle')}
            </Text>
          </Center>

          <Center gap="$2">
            <Heading color={colors.title}>{t('invitePartner.title')}</Heading>

            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={t('invitePartner.emailPlaceholder')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={formState.errors?.email?.message}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(handleInvite)}
                />
              )}
            />
          </Center>
          <Center flex={1} justifyContent="flex-end" mt="$4" gap="$3">
            <Button
              title={t('invitePartner.sendButton')}
              onPress={handleSubmit(handleInvite)}
              isLoading={isLoading}
            />
            <Button
              title={t('invitePartner.backButton')}
              variant="outline"
              onPress={() => navigation.goBack()}
            />
          </Center>
        </VStack>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}
