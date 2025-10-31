import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@services/api'
import {
  TaskForDayDTO,
  HouseholdTaskDTO,
  TaskSummaryDTO,
} from '@dtos/HouseholdTaskDTO'

// === Tipos para as Mutations ===
type CreateTaskPayload = {
  title: string
  description?: string | null
  startDate: Date
  recurrenceRule?: string | null
}

type UpdateTaskPayload = {
  taskId: number
  data: Partial<CreateTaskPayload> // Permite atualização parcial
}

type CompleteTaskPayload = {
  taskId: number
  taskDueDate: Date // O dia (YYYY-MM-DD)
}

type CreateExceptionPayload = {
  taskId: number
  exceptionDate: Date // O dia (YYYY-MM-DD)
}

// === Constantes das Query Keys ===
const TASK_QUERY_KEYS = {
  all: ['householdTasks'] as const,
  tasksByDay: (date: string) => ['householdTasks', 'byDay', date] as const,
  taskDetails: (taskId: number) =>
    ['householdTasks', 'details', taskId] as const,
  tasksSummary: (year: number, month: number) =>
    ['householdTasks', 'summary', year, month] as const,
}

// === HOOKS ===

export function useHouseholdTaskQueries() {
  const queryClient = useQueryClient()

  // --- QUERIES (Busca de dados) ---

  /**
   * (GET /tasks)
   * Busca todas as tarefas ativas do casal (para gerenciamento).
   */
  const useFetchAllTasks = () => {
    return useQuery({
      queryKey: TASK_QUERY_KEYS.all,
      queryFn: async () => {
        const response = await api.get<{ tasks: HouseholdTaskDTO[] }>('/tasks')
        return response.data.tasks
      },
    })
  }

  /**
   * (GET /tasks/by-day)
   * Busca as tarefas filtradas por um dia específico.
   * A data DEVE estar no formato "YYYY-MM-DD".
   */
  const useFetchTasksByDay = (dateYYYYMMDD: string) => {
    const enabled = !!dateYYYYMMDD
    return useQuery({
      queryKey: TASK_QUERY_KEYS.tasksByDay(dateYYYYMMDD),
      queryFn: async () => {
        const response = await api.get<{ tasks: TaskForDayDTO[] }>(
          '/tasks/by-day',
          {
            params: {
              date: dateYYYYMMDD, // ex: "2025-10-25"
            },
          },
        )
        return response.data.tasks
      },
      enabled,
      refetchInterval: enabled ? 15000 : false, // Só atualiza se enabled
      refetchIntervalInBackground: false, // Pausa em background
    })
  }

  /**
   * (GET /tasks/:taskId)
   * Busca os detalhes de uma única tarefa (para a tela de edição).
   */
  const useFetchTaskDetails = (taskId: number, enabled: boolean = true) => {
    return useQuery({
      queryKey: TASK_QUERY_KEYS.taskDetails(taskId),
      queryFn: async () => {
        const response = await api.get<{ task: HouseholdTaskDTO }>(
          `/tasks/${taskId}`,
        )
        return response.data.task
      },
      enabled: !!taskId && enabled, // Só executa se taskId for válido
    })
  }

  /**
   * (GET /tasks/summary)
   * Busca o sumário do mês (para o dashboard).
   */
  const useFetchTasksSummary = (year: number, month: number) => {
    return useQuery({
      queryKey: TASK_QUERY_KEYS.tasksSummary(year, month),
      queryFn: async () => {
        const response = await api.get<TaskSummaryDTO>('/tasks/summary', {
          params: { year, month },
        })
        return response.data
      },
      refetchInterval: 15000, // Atualiza a cada 15 segundos
      refetchIntervalInBackground: false, // Pausa em background
    })
  }

  // --- Funções de Invalidação ---
  // Invalida a lista do dia e o sumário
  const invalidateTasksQueries = (dayDate: Date) => {
    const dateStr = dayDate.toISOString().split('T')[0]
    const year = dayDate.getFullYear()
    const month = dayDate.getMonth() + 1

    queryClient.invalidateQueries({
      queryKey: TASK_QUERY_KEYS.tasksByDay(dateStr),
    })
    queryClient.invalidateQueries({
      queryKey: TASK_QUERY_KEYS.tasksSummary(year, month),
    })
  }

  // --- MUTATIONS (Criação, Edição, Deleção) ---

  /**
   * (POST /tasks)
   * Cria uma nova tarefa.
   */
  const useCreateTask = () => {
    return useMutation({
      mutationFn: async (payload: CreateTaskPayload) => {
        return api.post('/tasks', payload)
      },
      onSuccess: (_, variables) => {
        // Invalida as queries do dia de início e do sumário
        invalidateTasksQueries(variables.startDate)
      },
    })
  }

  /**
   * (PUT /tasks/:taskId)
   * Atualiza uma tarefa.
   */
  const useUpdateTask = () => {
    return useMutation({
      mutationFn: async ({ taskId, data }: UpdateTaskPayload) => {
        return api.put(`/tasks/${taskId}`, data)
      },
      onSuccess: (_, variables) => {
        // Invalida o cache dos detalhes
        queryClient.invalidateQueries({
          queryKey: TASK_QUERY_KEYS.taskDetails(variables.taskId),
        })
        // Invalida todas as queries de tarefas
        queryClient.invalidateQueries({ queryKey: ['householdTasks'] })
      },
    })
  }

  /**
   * (DELETE /tasks/:taskId)
   * Deleta (soft delete) uma tarefa.
   */
  const useDeleteTask = () => {
    return useMutation({
      mutationFn: async (taskId: number) => {
        return api.delete(`/tasks/${taskId}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['householdTasks'] })
      },
    })
  }

  /**
   * (POST /tasks/:taskId/complete)
   * Marca uma tarefa como concluída.
   */
  const useCompleteTask = () => {
    return useMutation({
      mutationFn: async ({ taskId, taskDueDate }: CompleteTaskPayload) => {
        return api.post(`/tasks/${taskId}/complete`, { taskDueDate })
      },
      onSuccess: (_, variables) => {
        invalidateTasksQueries(variables.taskDueDate)
      },
    })
  }

  /**
   * (DELETE /tasks/completions/:completionId)
   * "Desfaz" uma conclusão.
   */
  const useUncompleteTask = () => {
    return useMutation({
      mutationFn: async (completionId: number) => {
        return api.delete(`/tasks/completions/${completionId}`)
      },
      // Invalidação é tratada no componente (onSuccess)
      // pois precisamos saber a 'task_due_date'
    })
  }

  /**
   * (POST /tasks/:taskId/exceptions)
   * Cancela uma tarefa para um dia.
   */
  const useCreateTaskException = () => {
    return useMutation({
      mutationFn: async ({ taskId, exceptionDate }: CreateExceptionPayload) => {
        return api.post(`/tasks/${taskId}/exceptions`, { exceptionDate })
      },
      onSuccess: (_, variables) => {
        invalidateTasksQueries(variables.exceptionDate)
      },
    })
  }

  /**
   * (DELETE /tasks/exceptions/:exceptionId)
   * "Desfaz" um cancelamento.
   */
  const useDeleteTaskException = () => {
    return useMutation({
      mutationFn: async (exceptionId: number) => {
        return api.delete(`/tasks/exceptions/${exceptionId}`)
      },
      // Invalidação é tratada no componente (onSuccess)
    })
  }

  return {
    useFetchAllTasks,
    useFetchTasksByDay,
    useFetchTaskDetails,
    useFetchTasksSummary,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useCompleteTask,
    useUncompleteTask,
    useCreateTaskException,
    useDeleteTaskException,
    // Exportamos a função de invalidação para uso customizado
    invalidateTasksQueries,
  }
}
