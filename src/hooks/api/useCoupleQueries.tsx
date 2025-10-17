import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@services/api'
import { CoupleDetailsDTO } from '@dtos/CoupleDetailsDTO'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@gluestack-ui/themed'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'

async function getCoupleDetails() {
  const { data } = await api.get<{ coupleDetails: CoupleDetailsDTO }>(
    '/couples/details',
  )
  return data.coupleDetails
}

async function endRelationship() {
  await api.delete('/couples/end')
}

export function useCoupleDetails() {
  return useQuery({
    queryKey: ['coupleDetails'],
    queryFn: getCoupleDetails,
    refetchInterval: 15000, // Polling a cada 15 segundos
  })
}

export function useEndRelationship() {
  const { signOut } = useAuth()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: endRelationship,
    onSuccess: async () => {
      // Após o sucesso, fazemos o signOut
      await signOut()
      // Opcional: invalidar todas as queries para limpar o cache
      queryClient.invalidateQueries()
      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            onClose={() => toast.close(id)}
            title="Relacionamento encerrado."
            action="success"
          />
        ),
        placement: 'top',
      })
    },
    onError: (error) => {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível encerrar o relacionamento.'
      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            onClose={() => toast.close(id)}
            title={title}
            action="error"
          />
        ),
        placement: 'top',
      })
    },
  })
}
