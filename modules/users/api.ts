import request, { createHeaders } from "@/lib/api/client.js"

export async function getUsers() {
  const url = "/users"
  const headers = createHeaders()
  return request({ url, method: "GET", headers })
}

export async function getUser({ id }: any) {
  const url = `/users/${id}`
  const headers = createHeaders()
  return request({ url, method: "GET", headers })
}

export async function updateUser({ id, body }: any) {
  const url = `/users/${id}`
  const headers = createHeaders()
  return request({ url, method: "PATCH", headers, body })
}

export async function updateUserRoles({ id, body }: any) {
  const url = `/users/${id}/roles`
  const headers = createHeaders()
  return request({ url, method: "PATCH", headers, body })
}

export async function deleteUser({ id }: any) {
  const url = `/users/${id}`
  const headers = createHeaders()
  return request({ url, method: "DELETE", headers })
}
