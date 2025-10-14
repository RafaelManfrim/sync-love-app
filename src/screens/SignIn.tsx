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
import { Button } from '@components/Button'
import { AuthNavigationRoutesProps } from '@routes/auth.routes'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { Platform } from 'react-native'

const signInSchema = z.object({
  email: z.string().nonempty('Informe o e-mail').email('E-mail inválido'),
  password: z.string().nonempty('Informe a senha'),
})

type FormDataProps = z.infer<typeof signInSchema>

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

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
      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.'

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
            <Image source={Logo} defaultSource={Logo} alt="Logo Sync Love" />

            <Text color="$trueGray700" fontSize="$sm" textAlign="center">
              Tenha um relacionamento melhor com seu parceiro
            </Text>
          </Center>

          <Center gap="$2">
            <Heading color="$trueGray700">Acesse a conta</Heading>

            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
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
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={formState.errors?.password?.message}
                  onSubmitEditing={handleSubmit(handleSignIn)}
                  returnKeyType="send"
                />
              )}
            />

            <Button
              title="Acessar"
              isLoading={isLoading}
              onPress={handleSubmit(handleSignIn)}
            />
          </Center>

          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Text
              color="$trueGray700"
              fontSize="$sm"
              mb="$3"
              fontFamily="$body"
            >
              Ainda não tem acesso?
            </Text>

            <Button
              title="Criar conta"
              variant="outline"
              onPress={handleNavigateToSignUp}
            />
          </Center>
        </VStack>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}
