import { FirestoreDoc } from "@/types"

export type User = {
  bio?: string
  displayName?: string
  email?: string
  photoURL?: string
  base64PhotoURL?: string
  roles?: [string]
  uid?: string
}

// api response data
export type UserResponse = FirestoreDoc & User & { id?: string; banner?: { base64URL: string } }

// api request/payload data
export type UserDto = User
