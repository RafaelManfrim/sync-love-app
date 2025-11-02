import {
  Center,
  Heading,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Logo from '@assets/sync_love_square-no-bg.png'
import { Input } from '@components/Input'
import { PasswordInput } from '@components/PasswordInput'
import { Button } from '@components/Button'
import { AuthNavigationRoutesProps } from '@routes/auth.routes'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { Platform } from 'react-native'
import { useTheme } from '@hooks/useTheme'
import { useTranslation } from 'react-i18next'

type FormDataProps = {
  email: string
  password: string
}

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const { colors } = useTheme()
  const { t } = useTranslation()

  const signInSchema = z.object({
    email: z
      .string()
      .nonempty(t('signIn.emailRequired'))
      .email(t('signIn.emailInvalid')),
    password: z.string().nonempty(t('signIn.passwordRequired')),
  })

  const { control, handleSubmit, formState } = useForm<FormDataProps>({
    resolver: zodResolver(signInSchema),
  })

  const { signIn, user } = useAuth()
  const toast = useToast()

  const navigator = useNavigation<AuthNavigationRoutesProps>()

  function handleNavigateToSignUp() {
    navigator.navigate('signUp')
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true)
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : t('signIn.signInError')

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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id && !user.couple_id) {
      navigator.navigate('waitingPartner')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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
            <Image
              source={Logo}
              defaultSource={Logo}
              alt={t('signIn.logoAlt')}
            />

            <Text color={colors.text} fontSize="$sm" textAlign="center">
              {t('signIn.subtitle')}
            </Text>
          </Center>

          <Center gap="$2">
            <Heading color={colors.title}>{t('signIn.title')}</Heading>

            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={t('signIn.emailPlaceholder')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={formState.errors?.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <PasswordInput
                  placeholder={t('signIn.passwordPlaceholder')}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={formState.errors?.password?.message}
                  onSubmitEditing={handleSubmit(handleSignIn)}
                  returnKeyType="send"
                />
              )}
            />

            <Button
              title={t('signIn.signInButton')}
              isLoading={isLoading}
              onPress={handleSubmit(handleSignIn)}
            />
          </Center>

          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Text color={colors.text} fontSize="$sm" mb="$3" fontFamily="$body">
              {t('signIn.noAccount')}
            </Text>

            <Button
              title={t('signIn.createAccountButton')}
              variant="outline"
              onPress={handleNavigateToSignUp}
            />
          </Center>
        </VStack>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}
