import { UserDTO } from './UserDTO'

export type CoupleDetailsDTO = {
  partner: UserDTO
  togetherSince: Date
  listsCreated: number
  totalTasksCreated: number
  taskCompletionSummary: {
    me: number
    partner: number
  }
  totalCalendarEventsCreated: number
}
