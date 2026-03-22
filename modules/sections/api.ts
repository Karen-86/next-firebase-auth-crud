import request, { createHeaders } from "@/lib/api/client.js";

export async function getSection({ id }:any) {
  const url = `/sections/${id}`;
  const headers = createHeaders();
  return request({ url, method: "GET", headers });
}

export async function createSection({ id, body}:any) {
  const url = `/sections/${id}`;
  const headers = createHeaders();
  return request({ url, method: "POST", headers, body });
}

export async function updateSection({ id, body}:any) {
  const url = `/sections/${id}`;
  const headers = createHeaders();
  return request({ url, method: "PATCH", headers, body });
}