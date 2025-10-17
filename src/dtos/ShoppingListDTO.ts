import { ShoppingItemDTO } from './ShoppingItemDTO'

export type ShoppingListDTO = {
  id: number
  name: string
  created_at: string
  author_id: number
  couple_id: number
  ShoppingListItem: ShoppingItemDTO[]
  author: {
    name: string
    gender: string
    avatar_url: string | null
  }
}
