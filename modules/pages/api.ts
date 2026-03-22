import request, { createHeaders } from "@/lib/api/client.js"

export async function getPage({ id }: any) {
  const url = `/pages/${id}`
  const headers = createHeaders()
  return request({ url, method: "GET", headers })
}

export async function createPage({ id, body }: any) {
  const url = `/pages/${id}`
  const headers = createHeaders()
  return request({ url, method: "POST", headers, body })
}

export async function updatePage({ id, body }: any) {
  const url = `/pages/${id}`
  const headers = createHeaders()
  return request({ url, method: "PATCH", headers, body })
}
