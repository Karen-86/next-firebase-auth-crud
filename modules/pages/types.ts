import { FirestoreDoc, Status } from "@/types"

export type Page =  {
  status?: Status
  slug?: string
  metaTitle?: string
  metaDescription?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

// api response data
export type PageResponse = FirestoreDoc & Page & { 
  metadata?: { [key: string]: string }
}

// api request/payload data
export type PageDto = Page  