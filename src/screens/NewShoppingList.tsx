import { ScreenHeader } from '@components/ScreenHeader'
import { ToastMessage } from '@components/ToastMessage'
import { useToast, VStack } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { HomeNavigationRoutesProps } from '@routes/lists.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

export function NewShoppingList() {
  const navigation = useNavigation<HomeNavigationRoutesProps>()
  const toast = useToast()

  async function handleCreate() {
    try {
      setIsLoading(true)
      if (!title.trim()) {
        return toast.show({
          render: () => (
            <ToastMessage
              title="Informe um título para a lista."
              action="error"
            />
          ),
          placement: 'top',
        })
      }
      await api.post('/shopping-lists', { title })

      toast.show({
        render: () => (
          <ToastMessage
            title="Lista de compras criada com sucesso!"
            action="success"
          />
        ),
        placement: 'top',
      })
      navigation.goBack()
    } catch (error) {
      setIsLoading(false)
      const isAppError = error instanceof AppError
      const errorMessage = isAppError
        ? error.message
        : 'Não foi possível criar a lista de compras.'

      toast.show({
        render: () => <ToastMessage title={errorMessage} action="error" />,
        placement: 'top',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Nova Lista de Compras" hasGoBackButton />

      <VStack p="$5" mt="$5">
        {/* <Text color="$gray200" mb="$2">
          Título da lista
        </Text>
        <Input
          placeholder="Ex: Compras do mês"
          onChangeText={setTitle}
          value={title}
        />
        <Button
          title="Criar"
          mt="$5"
          onPress={handleCreate}
          isLoading={isLoading}
        /> */}
      </VStack>
    </VStack>
  )
}
