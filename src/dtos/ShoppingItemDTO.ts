export type ShoppingItemDTO = {
  author_id: number
  created_at: string
  id: number
  is_checked: boolean
  product_id: number
  quantity: number
  shopping_list_id: number
  unit_price: number | null
  average_price?: number | null
  updated_at: string

  product: {
    couple_id: number
    id: number
    name: string
    unit_of_measure: string
  }
}
