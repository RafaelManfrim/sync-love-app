import {
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  Image,
  useToast,
  KeyboardAvoidingView,
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
import { Platform } from 'react-native'
import { useTheme } from '@hooks/useTheme'

const invitePartnerSchema = z.object({
  email: z.string().email('E-mail inválido').nonempty('Informe o e-mail'),
})

type FormDataProps = z.infer<typeof invitePartnerSchema>

export function InvitePartner() {
  const { colors } = useTheme()

  const [isLoading, setIsLoading] = useState(false)

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
            title="Convite enviado com sucesso!"
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
            <Image source={Logo} defaultSource={Logo} alt="Logo Sync Love" />

            <Text color={colors.text} fontSize="$sm" textAlign="center">
              Tenha um relacionamento melhor com seu parceiro
            </Text>
          </Center>

          <Center gap="$2">
            <Heading color={colors.title}>Convide seu parceiro</Heading>

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
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(handleInvite)}
                />
              )}
            />
          </Center>

          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Button
              title="Enviar Convite"
              onPress={handleSubmit(handleInvite)}
              isLoading={isLoading}
            />
          </Center>
        </VStack>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}
