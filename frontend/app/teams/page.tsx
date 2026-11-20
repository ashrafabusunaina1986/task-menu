// app/teams/page.tsx

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import TeamClient from './TeamClient'

export default async function TeamsPage() {
  const session = await auth()

  if (!session || !session.user || !session.accessToken) {
    redirect("/login")
  }
  return <TeamClient />
}
