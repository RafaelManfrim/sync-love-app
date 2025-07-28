import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import BackgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { AuthNavigationRoutesProps } from '@routes/auth.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'
import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'

type FormDataProps = {
  name: string
  email: string
  password: string
  password_confirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().email('E-mail inválido').required('Informe o e-mail'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos')
    .required('Informe a senha'),
  password_confirm: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'As senhas não conferem')
    .required('Confirme a senha'),
})
export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, formState } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  })

  const toast = useToast()

  const navigator = useNavigation<AuthNavigationRoutesProps>()

  const { signIn } = useAuth()

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

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          w="$full"
          h={624}
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          position="absolute"
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />

            <Text color="$gray100" fontSize="$sm">
              Treine sua mente e seu corpo
            </Text>
          </Center>

          <Center gap="$2">
            <Heading color="$gray100">Crie sua conta</Heading>

            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={formState.errors?.name?.message}
                />
              )}
            />

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
                />
              )}
            />

            <Controller
              name="password_confirm"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Confirme a Senha"
                  secureTextEntry
                  errorMessage={formState.errors?.password_confirm?.message}
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
      </VStack>
    </ScrollView>
  )
}
