import { create } from "zustand"
import type { PageResponse } from "@/modules/pages/types"
import * as pagesApi from "@/modules/pages/api"

const noop = () => {}

type PageStore = {
  page: PageResponse
  isPageLoading: boolean
  isPageCreating: boolean
  isPageUpdating: boolean
  getPageAsync: (params?: any) => Promise<void>
  createPageAsync: (params?: any) => Promise<void>
  updatePageAsync: (params?: any) => Promise<void>
}

export const usePageStore = create<PageStore>((set, get) => ({
  page: {},
  isPageLoading: false,
  isPageCreating: false,
  isPageUpdating: false,

  getPageAsync: async ({ pageId = "", successCB = noop, errorCB = noop } = {}) => {
    set({ isPageLoading: true })

    try {
      const data = await pagesApi.getPage({ id: pageId })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =getPageAsync=")

      set({ page: data.data })
      successCB(data.message)
    } finally {
      set({ isPageLoading: false })
    }
  },

  createPageAsync: async ({ pageId = "", fields = {}, successCB = noop, errorCB = noop } = {}) => {
    set({ isPageCreating: true })

    try {
      const data = await pagesApi.createPage({
        id: pageId,
        body: fields,
      })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =createPageAsync=")

      await get().getPageAsync({ pageId })
      successCB(data.message || "Page has been created successfully.")
    } finally {
      set({ isPageCreating: false })
    }
  },

  updatePageAsync: async ({ pageId = "", fields = {}, successCB = noop, errorCB = noop } = {}) => {
    set({ isPageUpdating: true })

    try {
      const data = await pagesApi.updatePage({
        id: pageId,
        body: fields,
      })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =updatePageAsync=")

      await get().getPageAsync({ pageId })
      successCB(data.message || "Page has been updated successfully.")
    } finally {
      set({ isPageUpdating: false })
    }
  },
}))
