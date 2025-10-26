import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@services/api'
import {
  CalendarEventCategoryDTO,
  CalendarEventOccurrenceDTO,
} from '@dtos/CalendarEventDTO'

// === Tipos para as Mutations ===
type CreateEventPayload = {
  title: string
  description?: string | null
  start_time: Date
  end_time: Date
  is_all_day?: boolean
  recurrence_rule?: string | null
  category_id?: number | null
}

type UpdateEventPayload = {
  eventId: number
  data: Partial<CreateEventPayload> // Permite atualização parcial
}

type CreateExceptionPayload = {
  eventId: number
  exception_date: Date // A data/hora UTC da ocorrência a cancelar
}

// === Constantes das Query Keys ===
const CALENDAR_QUERY_KEYS = {
  // Chave principal para o range de datas
  eventsInRange: (startDate: string, endDate: string) => [
    'calendarEvents',
    'range',
    startDate,
    endDate,
  ],
  // Chave para todas as queries de calendário
  all: ['calendarEvents'],
  categories: ['calendarCategories'],
}

// === HOOKS ===

export function useCalendarQueries() {
  const queryClient = useQueryClient()

  // --- Funções de Invalidação ---
  // Invalida todas as buscas de calendário (usado após qualquer mutação)
  const invalidateCalendarQueries = () => {
    queryClient.invalidateQueries({
      queryKey: CALENDAR_QUERY_KEYS.all,
    })
  }

  // --- QUERIES (Busca de dados) ---

  /**
   * (GET /calendar-events)
   * Busca as ocorrências de eventos em um intervalo de datas.
   */
  const useFetchCalendarEvents = (
    startDate: string, // "YYYY-MM-DD"
    endDate: string, // "YYYY-MM-DD"
    enabled: boolean = true,
  ) => {
    return useQuery({
      queryKey: CALENDAR_QUERY_KEYS.eventsInRange(startDate, endDate),
      queryFn: async () => {
        const response = await api.get<{
          events: CalendarEventOccurrenceDTO[]
        }>('/calendar-events', {
          params: { startDate, endDate },
        })
        return response.data.events
      },
      enabled: enabled && !!startDate && !!endDate,
    })
  }

  // (GET /calendar-categories)
  /**
   * Busca a lista de categorias de eventos (Aniversário, Lazer, etc.)
   */
  const useFetchCalendarCategories = () => {
    return useQuery({
      queryKey: CALENDAR_QUERY_KEYS.categories,
      queryFn: async () => {
        const response = await api.get<{
          categories: CalendarEventCategoryDTO[]
        }>('/calendar-categories')
        return response.data.categories
      },
      staleTime: 1000 * 60 * 60, // Cache de 1 hora
    })
  }

  // --- MUTATIONS (Criação, Edição, Deleção) ---

  /**
   * (POST /calendar-events)
   * Cria um novo evento.
   */
  const useCreateCalendarEvent = () => {
    return useMutation({
      mutationFn: async (payload: CreateEventPayload) => {
        return api.post('/calendar-events', payload)
      },
      onSuccess: () => {
        invalidateCalendarQueries()
      },
    })
  }

  /**
   * (PUT /calendar-events/:eventId)
   * Atualiza a definição inteira de um evento.
   */
  const useUpdateCalendarEvent = () => {
    return useMutation({
      mutationFn: async ({ eventId, data }: UpdateEventPayload) => {
        return api.put(`/calendar-events/${eventId}`, data)
      },
      onSuccess: () => {
        invalidateCalendarQueries()
      },
    })
  }

  /**
   * (DELETE /calendar-events/:eventId)
   * Deleta um evento e todas as suas ocorrências.
   */
  const useDeleteCalendarEvent = () => {
    return useMutation({
      mutationFn: async (eventId: number) => {
        return api.delete(`/calendar-events/${eventId}`)
      },
      onSuccess: () => {
        invalidateCalendarQueries()
      },
    })
  }

  /**
   * (POST /calendar-events/:eventId/exceptions)
   * Cancela uma ocorrência única de um evento recorrente.
   */
  const useCreateCalendarException = () => {
    return useMutation({
      mutationFn: async ({
        eventId,
        exception_date,
      }: CreateExceptionPayload) => {
        return api.post(`/calendar-events/${eventId}/exceptions`, {
          exception_date,
        })
      },
      onSuccess: () => {
        invalidateCalendarQueries()
      },
    })
  }

  /**
   * (DELETE /calendar-events/exceptions/:exceptionId)
   * "Desfaz" o cancelamento de uma ocorrência.
   */
  const useDeleteCalendarException = () => {
    return useMutation({
      mutationFn: async (exceptionId: number) => {
        return api.delete(`/calendar-events/exceptions/${exceptionId}`)
      },
      onSuccess: () => {
        invalidateCalendarQueries()
      },
    })
  }

  return {
    useFetchCalendarEvents,
    useFetchCalendarCategories,
    useCreateCalendarEvent,
    useUpdateCalendarEvent,
    useDeleteCalendarEvent,
    useCreateCalendarException,
    useDeleteCalendarException,
    invalidateCalendarQueries,
  }
}
