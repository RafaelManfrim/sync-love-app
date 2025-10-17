import { UserDTO } from './UserDTO'

export type CoupleDetailsDTO = {
  id: number
  created_at: string
  User: UserDTO[]
  _count: {
    ShoppingLists: number
  }
}
