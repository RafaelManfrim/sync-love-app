import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@services/api'
import { ShoppingListDTO } from '@dtos/ShoppingListDTO'
import { ProductDTO } from '@dtos/ProductDTO'
import { ShoppingItemDTO } from '@dtos/ShoppingItemDTO'

// === Tipos para as Mutations ===
type CreateListPayload = {
  name?: string | null
}

type AddItemPayload = {
  listId: number
  itemName?: string
  quantity?: number
  unitPrice?: number
}

type ToggleItemPayload = {
  itemId: number
  listId: number // Necessário para invalidar a query correta
}

type CloseListPayload = {
  listId: number
  items: Array<{
    shoppingItemId: number
    unitPrice: number
  }>
}

// === Constantes das Query Keys ===
const SHOPPING_QUERY_KEYS = {
  allLists: ['shoppingLists', 'all'],
  listDetails: (listId: number) => ['shoppingLists', 'details', listId],
  products: ['shoppingLists', 'products'],
}

// === HOOKS ===

export function useShoppingListQueries() {
  const queryClient = useQueryClient()

  // --- Funções de Invalidação ---
  const invalidateShoppingLists = () => {
    queryClient.invalidateQueries({ queryKey: SHOPPING_QUERY_KEYS.allLists })
  }
  const invalidateListDetails = (listId: number) => {
    queryClient.invalidateQueries({
      queryKey: SHOPPING_QUERY_KEYS.listDetails(listId),
    })
  }
  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: SHOPPING_QUERY_KEYS.products })
  }

  // --- QUERIES (Busca de dados) ---

  /**
   * (GET /shopping-lists)
   * Busca todas as listas de compras do casal.
   */
  const useFetchShoppingLists = () => {
    return useQuery({
      queryKey: SHOPPING_QUERY_KEYS.allLists,
      queryFn: async () => {
        const response = await api.get<{ shoppingLists: ShoppingListDTO[] }>(
          '/shopping-lists',
        )
        // Ordena com as mais recentes/abertas primeiro
        return response.data.shoppingLists.sort((a, b) => {
          if (!a.closed_at && b.closed_at) return -1
          if (a.closed_at && !b.closed_at) return 1
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        })
      },
      refetchInterval: 15000, // Rebusca os dados a cada 15 segundos
    })
  }

  /**
   * (GET /shopping-lists/:id)
   * Busca os detalhes de uma lista específica, incluindo seus itens.
   */
  const useFetchShoppingListDetails = (
    listId: number,
    enabled: boolean = true,
  ) => {
    return useQuery({
      queryKey: SHOPPING_QUERY_KEYS.listDetails(listId),
      queryFn: async () => {
        const response = await api.get<{ shoppingList: ShoppingListDTO }>(
          `/shopping-lists/${listId}`,
        )
        return response.data.shoppingList
      },
      enabled: !!listId && enabled, // Só executa se listId for válido
      refetchInterval: 15000, // Rebusca os dados a cada 15 segundos
    })
  }

  /**
   * (GET /shopping-lists/products)
   * Busca a lista de produtos cadastrados pelo casal.
   */
  const useFetchProducts = () => {
    return useQuery({
      queryKey: SHOPPING_QUERY_KEYS.products,
      queryFn: async () => {
        const response = await api.get<{ products: ProductDTO[] }>(
          '/shopping-lists/products',
        )
        return response.data.products
      },
      staleTime: 1000 * 60 * 5, // Cache de 5 minutos
    })
  }

  // --- MUTATIONS (Criação, Edição, Deleção) ---

  /**
   * (POST /shopping-lists)
   * Cria uma nova lista de compras.
   */
  const useCreateShoppingList = () => {
    return useMutation({
      mutationFn: async (payload: CreateListPayload) => {
        // A API retorna a lista criada
        const response = await api.post<ShoppingListDTO>(
          '/shopping-lists',
          payload,
        )
        return response.data
      },
      onSuccess: () => {
        invalidateShoppingLists()
      },
    })
  }

  /**
   * (POST /shopping-lists/:id/items)
   * Adiciona um item a uma lista. Pode criar um novo produto.
   */
  const useAddItemToList = () => {
    return useMutation({
      mutationFn: async ({ listId, ...payload }: AddItemPayload) => {
        // A API retorna o item criado
        const response = await api.post<ShoppingItemDTO>(
          `/shopping-lists/${listId}/items`,
          payload,
        )
        return response.data
      },
      onSuccess: (_, variables) => {
        invalidateListDetails(variables.listId)
        // Se um novo produto for criado, invalida a lista de produtos
        invalidateProducts()
      },
    })
  }

  /**
   * (PATCH /shopping-lists/items/:itemId/toggle)
   * Marca ou desmarca um item da lista.
   */
  const useToggleItemCheck = () => {
    return useMutation({
      mutationFn: async ({ listId, itemId }: ToggleItemPayload) => {
        return api.patch(`/shopping-lists/${listId}/items/${itemId}/toggle`)
      },
      // Usamos 'onMutate' para otimismo UI (atualiza a UI antes da resposta da API)
      onMutate: async (payload) => {
        const { listId, itemId } = payload
        const queryKey = SHOPPING_QUERY_KEYS.listDetails(listId)

        // Cancela queries pendentes para evitar conflitos
        await queryClient.cancelQueries({ queryKey })

        // Snapshot do estado anterior
        const previousData = queryClient.getQueryData<ShoppingListDTO>(queryKey)

        // Atualiza o cache localmente
        queryClient.setQueryData<ShoppingListDTO>(queryKey, (oldData) => {
          if (!oldData) return undefined
          return {
            ...oldData,
            ShoppingListItem: oldData.ShoppingListItem.map((item) =>
              item.id === itemId
                ? { ...item, is_checked: !item.is_checked }
                : item,
            ),
          }
        })

        return { previousData } // Retorna o snapshot para rollback em caso de erro
      },
      // Em caso de erro, reverte para o estado anterior
      onError: (_err, payload, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            SHOPPING_QUERY_KEYS.listDetails(payload.listId),
            context.previousData,
          )
        }
      },
      // Após sucesso ou erro, sempre revalida os dados do servidor
      onSettled: (data, error, payload) => {
        invalidateListDetails(payload.listId)
      },
    })
  }

  /**
   * (POST /shopping-lists/:id/close)
   * Fecha uma lista de compras, atualizando os preços finais.
   */
  const useCloseShoppingList = () => {
    return useMutation({
      mutationFn: async ({ listId, items }: CloseListPayload) => {
        return api.post(`/shopping-lists/${listId}/close`, { items })
      },
      onSuccess: (_, variables) => {
        invalidateListDetails(variables.listId)
        invalidateShoppingLists() // A lista fechada muda de status na listagem
      },
    })
  }

  return {
    useFetchShoppingLists,
    useFetchShoppingListDetails,
    useFetchProducts,
    useCreateShoppingList,
    useAddItemToList,
    useToggleItemCheck,
    useCloseShoppingList,
    // Exporta invalidadores para uso customizado
    invalidateShoppingLists,
    invalidateListDetails,
  }
}
