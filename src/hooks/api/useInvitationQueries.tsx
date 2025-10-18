import { InvitationsDTO } from '@dtos/InvitationsDTO'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

async function fetchInvitations(): Promise<InvitationsDTO> {
  const { data } = await api.get('/couple-invitations')
  return data
}

async function acceptInvite(id: number) {
  await api.post(`/couple-invitations/${id}/accept`)
}

async function rejectInvite(id: number) {
  await api.post(`/couple-invitations/${id}/reject`)
}

async function deleteInvite(id: number) {
  await api.delete(`/couple-invitations/${id}`)
}

export function useInvitations() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['invitations'],
    queryFn: fetchInvitations,
    refetchInterval: 10000, // Polling a cada 10 segundos
    enabled: !user.couple_id, // Só executa a query se o utilizador não estiver num casal
  })
}

/**
 * Hook de mutação para aceitar um convite.
 */
export function useAcceptInvite() {
  const { getUserData } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptInvite,
    onSuccess: async () => {
      // Após aceitar, busca os dados atualizados do utilizador (que agora terá um couple_id)
      await getUserData()
      // Invalida a query de convites para parar o polling
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
    },
    // Adicionar onError para feedback ao utilizador se desejar
  })
}

/**
 * Hook de mutação para recusar um convite.
 */
export function useRejectInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rejectInvite,
    onSuccess: () => {
      // Após recusar, atualiza a lista de convites
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
    },
  })
}

/**
 * Hook de mutação para apagar um convite enviado.
 */
export function useDeleteInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteInvite,
    onSuccess: () => {
      // Após apagar, atualiza a lista de convites
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
    },
  })
}
