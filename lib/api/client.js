import axios from "axios"
import { getAuth } from "firebase/auth"

export const auth = {
  currentUser: null,
}

export const urls = {
  apiApp: "/api/v1", // development & production
}

export const createHeaders = ({ isFormData = false } = {}) => {
  const headers = {}
  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }

  return headers
}

export const requestMiddleware = async (config) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    // ALWAYS fresh (Firebase auto-refreshes)
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

const api = axios.create({
  baseURL: urls.apiApp,
  withCredentials: true,
})

api.interceptors.request.use(requestMiddleware)

export default async function request(options) {
  const { customApi = null, url, method = "GET", headers = {}, body = null } = options

  try {
    const response = await (customApi || api)({
      url,
      method,
      headers,
      ...(body && { data: body }),
    })

    return response.data
  } catch (err) {
    // Server responded (4xx / 5xx)
    if (err.response) {
      console.log("server response: ", err.response.data)

      return err.response.data
    }

    // Request sent but no response (network / timeout / CORS)
    if (err.request) {
      console.log("no response: ", err)
      alert(err.message || "Network Error")
      const res = { success: false, message: err.message || "Network Error" }
      return res
    }

    // Request setup error
    console.log("request setup error: ", err)
    alert(err.message || "Network Error")
    const res = { success: false, message: err.message || "Network Error" }
    return res
  }
}
