import request, { createHeaders } from "@/lib/api/client.js"

export async function getBlogs() {
  const url = "/blogs"
  const headers = createHeaders()
  return request({ url, method: "GET", headers })
}

export async function getBlog({ id }: any) {
  const url = `/blogs/${id}`
  const headers = createHeaders()
  return request({ url, method: "GET", headers })
}

export async function createBlog({ id, body }: any) {
  const url = `/blogs/${id}`
  const headers = createHeaders()
  return request({ url, method: "POST", headers, body })
}

export async function updateBlog({ id, body }: any) {
  const url = `/blogs/${id}`
  const headers = createHeaders()
  return request({ url, method: "PATCH", headers, body })
}

export async function deleteBlog({ id }: any) {
  const url = `/blogs/${id}`
  const headers = createHeaders()
  return request({ url, method: "DELETE", headers })
}
