import {
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  Image,
} from '@gluestack-ui/themed'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import Logo from '@assets/sync_love_square-no-bg.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'

const invitePartnerSchema = z.object({
  email: z.string().email('E-mail inválido').nonempty('Informe o e-mail'),
})

type FormDataProps = z.infer<typeof invitePartnerSchema>

export function InvitePartner() {
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, formState } = useForm<FormDataProps>({
    resolver: zodResolver(invitePartnerSchema),
  })

  async function handleInvite({ email }: FormDataProps) {}

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px="$10" pb="$16">
        <Center my="$24">
          <Image source={Logo} defaultSource={Logo} alt="Logo Sync Love" />

          <Text color="$gray100" fontSize="$sm">
            Treine sua mente e seu corpo
          </Text>
        </Center>

        <Center gap="$2">
          <Heading color="$gray100">Convide seu parceiro</Heading>

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
        </Center>

        <Center flex={1} justifyContent="flex-end" mt="$4">
          <Button
            title="Convidar"
            onPress={handleSubmit(handleInvite)}
            isLoading={isLoading}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
