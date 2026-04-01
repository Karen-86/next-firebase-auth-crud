import request, { createHeaders, urls, requestMiddleware } from "@/lib/api/client.js"

// for custom api
// import axios from "axios";

// const api = axios.create({
//   baseURL: urls.apiApp,
//   withCredentials: true,
// });

// api.interceptors.request.use(requestMiddleware);

export async function getBlogs({ userId, limit, sort, order }: any = {}) {
  let url = "/blogs"
  const params = []

  if (userId) params.push(`userId=${userId}`)
  if (limit) params.push(`limit=${limit}`)
  if (sort) params.push(`sort=${sort}`)
  if (order) params.push(`order=${order}`)

  if (params.length) {
    url += `?${params.join("&")}`
  }

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
