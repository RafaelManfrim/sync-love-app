import { UserDTO } from './UserDTO'

// O tipo para a categoria (ex: "Aniversário")
export type CalendarEventCategoryDTO = {
  id: number
  name: string
  color: string | null
}

// A definição base do evento (como está no banco)
export type CalendarEventDTO = {
  id: number
  title: string
  description: string | null
  start_time: string // Data ISO (ex: "2025-10-26T14:00:00.000Z")
  end_time: string // Data ISO
  is_all_day: boolean
  recurrence_rule: string | null
  couple_id: number
  author_id: number
  category_id: number | null
  created_at: string
  updated_at: string

  // Dados aninhados que vêm da rota de listagem
  author: UserDTO
  category: CalendarEventCategoryDTO | null
}

// O tipo da rota GET /calendar-events (Ocorrência)
// Este é o tipo mais importante para o frontend
export type CalendarEventOccurrenceDTO = CalendarEventDTO & {
  // As datas específicas desta ocorrência (geradas pelo RRule)
  occurrence_start_time: string // Data ISO
  occurrence_end_time: string // Data ISO
}

// O tipo para uma exceção (ocorrência cancelada)
export type CalendarEventExceptionDTO = {
  id: number
  calendar_event_id: number
  exception_date: string // Data ISO da ocorrência cancelada
  created_at: string
  created_by_user_id: number
}
