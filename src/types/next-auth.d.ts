// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: number
    email: string
    name: string
    active: boolean
    token: string
  }

  interface Session {
    accessToken: string
    user: User
  }

  interface JWT {
    accessToken: string
  }
}
