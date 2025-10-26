// O usuário que completou a tarefa (vem aninhado)
type TaskCompletionUser = {
  id: number
  name: string
  avatar_url: string | null
}

// A definição da tarefa (base)
export type HouseholdTaskDTO = {
  id: number
  title: string
  description: string | null
  author_id: number
  couple_id: number
  start_date: string // API envia como string ISO (ex: "2025-10-25T00:00:00.000Z")
  recurrence_rule: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// A conclusão (quem fez e quando)
export type HouseholdTaskCompletionDTO = {
  id: number
  household_task_id: number
  completed_by_user_id: number
  completed_at: string
  task_due_date: string // Formato "YYYY-MM-DD"
  completed_by: TaskCompletionUser // Dados do usuário
}

// A exceção (dia cancelado)
export type HouseholdTaskExceptionDTO = {
  id: number
  household_task_id: number
  exception_date: string // Formato "YYYY-MM-DD"
  created_at: string
  created_by_user_id: number
}

// O tipo principal da rota GET /tasks/by-day
export type TaskForDayDTO = HouseholdTaskDTO & {
  completion: HouseholdTaskCompletionDTO | null
  exception: HouseholdTaskExceptionDTO | null
}

// O tipo da rota GET /tasks/summary
export type MemberSummaryDTO = {
  id: number
  name: string
  avatar_url: string | null
  completedCount: number
}

export type TaskSummaryDTO = {
  totalPlanned: number
  totalCompleted: number
  members: MemberSummaryDTO[]
}
