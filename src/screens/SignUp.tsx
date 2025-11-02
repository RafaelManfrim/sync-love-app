import {
  Center,
  Heading,
  Image,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Logo from '@assets/sync_love_square-no-bg.png'
import { Input } from '@components/Input'
import { PasswordInput } from '@components/PasswordInput'
import { Button } from '@components/Button'
import { AuthNavigationRoutesProps } from '@routes/auth.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import { Select } from '@components/Select'
import { TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTheme } from '@hooks/useTheme'
import { useTranslation } from 'react-i18next'

type FormDataProps = {
  name: string
  email: string
  password: string
  password_confirm: string
  gender: 'MALE' | 'FEMALE'
}

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)

  const { colors } = useTheme()
  const { t } = useTranslation()

  const signUpSchema = z
    .object({
      name: z.string().nonempty(t('signUp.nameRequired')),
      email: z
        .string()
        .email(t('signUp.emailInvalid'))
        .nonempty(t('signUp.emailRequired')),
      password: z
        .string()
        .min(6, t('signUp.passwordMin'))
        .nonempty(t('signUp.passwordRequired')),
      password_confirm: z
        .string()
        .nonempty(t('signUp.passwordConfirmRequired')),
      gender: z.enum(['MALE', 'FEMALE'], {
        required_error: t('signUp.genderRequired'),
      }),
    })
    .refine((data) => data.password === data.password_confirm, {
      path: ['password_confirm'],
      message: t('signUp.passwordsMatch'),
    })

  const genderOptions = [
    { label: t('signUp.genderMale'), value: 'MALE' },
    { label: t('signUp.genderFemale'), value: 'FEMALE' },
  ]

  const { control, handleSubmit, formState } = useForm<FormDataProps>({
    resolver: zodResolver(signUpSchema),
  })

  const emailInputRef = useRef<TextInput>(null)
  const passwordConfirmInputRef = useRef<TextInput>(null)

  const toast = useToast()

  const navigator = useNavigation<AuthNavigationRoutesProps>()

  const { signIn, user } = useAuth()

  function handleNavigateToSignIn() {
    navigator.navigate('signIn')
  }

  async function handleSignUp({
    name,
    email,
    password,
    gender,
  }: FormDataProps) {
    try {
      setIsLoading(true)
      await api.post('/users', { name, email, password, gender })
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : t('signUp.signUpError')

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
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      extraHeight={400}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <VStack flex={1} px="$8" pb="$16">
        <Center my="$16">
          <Image source={Logo} defaultSource={Logo} alt={t('signUp.logoAlt')} />

          <Text color={colors.text} fontSize="$sm" textAlign="center">
            {t('signUp.subtitle')}
          </Text>
        </Center>

        <Center gap="$2">
          <Heading color={colors.title}>{t('signUp.title')}</Heading>

          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder={t('signUp.namePlaceholder')}
                onChangeText={onChange}
                value={value}
                errorMessage={formState.errors?.name?.message}
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                ref={emailInputRef}
                placeholder={t('signUp.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={formState.errors?.email?.message}
              />
            )}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label={t('signUp.genderLabel')}
                items={genderOptions}
                placeholder={t('signUp.genderPlaceholder')}
                onValueChange={onChange}
                selectedValue={value}
                errorMessage={formState.errors?.gender?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PasswordInput
                placeholder={t('signUp.passwordPlaceholder')}
                onChangeText={onChange}
                value={value}
                errorMessage={formState.errors?.password?.message}
                returnKeyType="next"
                onSubmitEditing={() => passwordConfirmInputRef.current?.focus()}
              />
            )}
          />

          <Controller
            name="password_confirm"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PasswordInput
                ref={passwordConfirmInputRef}
                placeholder={t('signUp.passwordConfirmPlaceholder')}
                errorMessage={
                  formState.errors?.password_confirm?.message as string
                }
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
              />
            )}
          />

          <Button
            title={t('signUp.signUpButton')}
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Center flex={1} justifyContent="flex-end" mt="$4">
          <Button
            title={t('signUp.backToLoginButton')}
            variant="outline"
            onPress={handleNavigateToSignIn}
          />
        </Center>
      </VStack>
    </KeyboardAwareScrollView>
  )
}
