import { create } from "zustand"
import type { BannerResponse } from "@/modules/banners/types"
import * as bannersApi from "@/modules/banners/api"

const noop = () => {}

type BannerStore = {
  // banner: BannerResponse
  // banners: BannerResponse[]
  // isBannersLoading: boolean
  isBannerUpdating: boolean
  isBannerCreating: boolean
  // getBannersAsync: (params?: any) => Promise<void>
  // upsertBannerAsync: (params?: any) => Promise<void>
  createBannerAsync: (params?: any) => Promise<void>
  updateBannerAsync: (params?: any) => Promise<void>
  // setBanner: (params?: any) => void
}

export const useBannerStore = create<BannerStore>((set, get) => ({
  // banner: {},
  //   banners: [],
  //   isBannersLoading: false,
  isBannerUpdating: false,
  isBannerCreating: false,

  //   getBannersAsync: async ({ userId = "", successCB = noop, errorCB = noop } = {}) => {
  //     set({ isBannersLoading: true })

  //     try {
  //       const data = await bannersApi.getBanners({ userId })

  //       if (!data.success) return errorCB(data.message)
  //       console.log(data, " =getbannersAsync=")

  //       set({ banners: data.data })
  //       successCB(data.message)
  //     } finally {
  //       set({ isBannersLoading: false })
  //     }
  //   },

  // setBanner: (v) => set({ banner: v }),

  createBannerAsync: async ({
    fields = {},
    successCB = noop,
    errorCB = noop,
  }) => {
    set({ isBannerCreating: true })

    try {
      const data = await bannersApi.createBanner({ body: fields })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =createBannerAsync=")

      successCB(data.message || "Banner has been created successfully.")
    } finally {
      set({ isBannerCreating: false })
    }
  },

  updateBannerAsync: async ({
    bannerId = "",
    fields = {},
    successCB = noop,
    errorCB = noop,
  }) => {
    set({ isBannerUpdating: true })

    try {
      const data = await bannersApi.updateBanner({ id: bannerId, body: fields })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =updatedBannerAsync=")

      successCB(data.message || "Banner has been updated successfully.")
    } finally {
      set({ isBannerUpdating: false })
    }
  },

  // upsertBannerAsync: async ({
  //   fields = {},
  //   successCB = noop,
  //   errorCB = noop,
  // }) => {
  //   set({ isBannerUpdating: true })

  //   try {
  //     const data = await bannersApi.updateBanner({ body: fields })

  //     if (!data.success) return errorCB(data.message)
  //     console.log(data, " =upsertBannerAsync=")

  //     successCB(data.message || "Banner has been updated successfully.")
  //   } finally {
  //     set({ isBannerUpdating: false })
  //   }
  // },
}))
