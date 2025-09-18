import { CoupleDTO } from './CoupleDTO'

export type UserDTO = {
  id: number
  email: string
  name: string
  gender: string
  avatar_url: string | null
  is_admin: boolean
  is_premium: boolean
  created_at: string
  updated_at: string
  couple_id: number | null
  couple: CoupleDTO | null
}
