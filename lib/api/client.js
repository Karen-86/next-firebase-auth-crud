import axios from "axios";
import { getAuth } from "firebase/auth";

export const auth = {
  currentUser: null,
};

const urls = {
  apiApp: "/api/v1", // development & production
};

export function createHeaders({ isFormData = false } = {}) {
  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

const api = axios.create({
  baseURL: urls.apiApp,
  withCredentials: true,
});

api.interceptors.request.use(async(config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    // ALWAYS fresh (Firebase auto-refreshes)
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default async function request(options) {
  const { url, method = "GET", headers = {}, body = null, cb = () => {} } = options;

  try {
    const response = await api({
      url,
      method,
      headers,
      ...(body && { data: body }),
    });

    cb(response.data);
    return response.data;
  } catch (err) {
    // Server responded (4xx / 5xx)
    if (err.response) {
      console.log("server response: ", err.response.data);

      cb(err.response.data);
      return err.response.data;
    }

    // Request sent but no response (network / timeout / CORS)
    if (err.request) {
      console.log("no response: ", err);
      alert(err.message || "Network Error");
      const res = { success: false, message: err.message || "Network Error" };
      cb(res);
      return res;
    }

    // Request setup error
    console.log("request setup error: ", err);
    alert(err.message || "Network Error");
    const res = { success: false, message: err.message || "Network Error" };
    cb(res);
    return res;
  }
}