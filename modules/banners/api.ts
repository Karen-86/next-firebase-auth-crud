import request, { createHeaders } from "@/lib/api/client.js"

export async function getBanners() {
  let url = "/banners"
  const headers = createHeaders()
  return request({ url, method: "GET", headers })
}

export async function getBanner({ id }: any) {
  const url = `/banners/${id}`
  const headers = createHeaders()
  return request({ url, method: "GET", headers })
}

export async function createBanner({ body }: any) {
  const url = `/banners`
  const headers = createHeaders()
  return request({ url, method: "POST", headers, body })
}

export async function updateBanner({ id, body }: any) {
  const url = `/banners/${id}`
  const headers = createHeaders()
  return request({ url, method: "PATCH", headers, body })
}

// export async function upsertBanner({  body }: any) {
//   const url = `/banners`
//   const headers = createHeaders()
//   return request({ url, method: "PATCH", headers, body })
// }
