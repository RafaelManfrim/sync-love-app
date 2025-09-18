import {
  Center,
  Heading,
  Image,
  ScrollView,
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
import { Button } from '@components/Button'
import { AuthNavigationRoutesProps } from '@routes/auth.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import { Select } from '@components/Select'
import { TextInput } from 'react-native'

const signUpSchema = z.object({
  name: z.string().nonempty('Informe o nome'),
  email: z.string().email('E-mail inválido').nonempty('Informe o e-mail'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos')
    .nonempty('Informe a senha'),
  password_confirm: z
    .string()
    .nonempty('Confirme a senha')
    .refine((value, ctx) => {
      if (value !== ctx.parent.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'As senhas não conferem',
          path: ['password_confirm'],
        })
        return false
      }
      return true
    }),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Selecione o gênero' }),
})

type FormDataProps = z.infer<typeof signUpSchema>

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)

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

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true)
      await api.post('/users', { name, email, password })
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível criar a conta. Tente novamente mais tarde.'

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
      <VStack flex={1} px="$10" pb="$16">
        <Center my="$16">
          <Image source={Logo} defaultSource={Logo} alt="Logo Sync Love" />

          <Text color="$true100" fontSize="$sm" textAlign="center">
            Tenha um relacionamento melhor com seu parceiro
          </Text>
        </Center>

        <Center gap="$2">
          <Heading color="$true100">Crie sua conta</Heading>

          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
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
            name="gender"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} selectedValue={value} />
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
                returnKeyType="next"
                onSubmitEditing={() => passwordConfirmInputRef.current?.focus()}
              />
            )}
          />

          <Controller
            name="password_confirm"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                ref={passwordConfirmInputRef}
                placeholder="Confirme a Senha"
                secureTextEntry
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
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Center flex={1} justifyContent="flex-end" mt="$4">
          <Button
            title="Voltar para o login"
            variant="outline"
            onPress={handleNavigateToSignIn}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
