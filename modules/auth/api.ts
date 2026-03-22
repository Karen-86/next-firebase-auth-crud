import request, { createHeaders } from "@/lib/api/client.js"

export async function getProfile() {
  const url = `/auth/me`
  const headers = createHeaders()
  return await request({ url, method: "GET", headers })
}

export async function createUser({ body }: any) {
  const url = `/auth`
  const headers = createHeaders()
  return await request({ url, method: "POST", headers, body })
}

export async function updateUserEmail() {
  const url = `/auth/email`
  const headers = createHeaders()
  return await request({ url, method: "PATCH", headers })
}
