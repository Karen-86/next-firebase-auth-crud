import { FirestoreDoc, Status } from "@/types"

export type Banner = {
  base64URL?: string
}

// api response data
export type BannerResponse = FirestoreDoc & Banner & { author?: string; userId?: string }

// api request/payload data
export type BannerDto = Banner
