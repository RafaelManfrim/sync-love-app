export interface InviteDTO {
  id: number
  inviter_id: number
  invitee_email: string
  invited_at: string
  accepted_at: string | null
  rejected_at: string | null
  inviter: {
    email: string
    name: string
    gender: string
    avatar_url: string | null
  }
}
