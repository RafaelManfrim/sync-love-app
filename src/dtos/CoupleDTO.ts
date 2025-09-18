export type CoupleDTO = {
  invite_id: number
  created_at: string
  is_active: boolean
  invitee_id: number
  User: [
    {
      name: string
      email: string
      avatar_url: string | null
      gender: string
    },
  ]
}
