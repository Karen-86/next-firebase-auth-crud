import { create } from "zustand"
import type { BannerResponse } from "@/modules/banners/types"
import * as bannersApi from "@/modules/banners/api"

const noop = () => {}

type BannerStore = {
//   banners: BannerResponse[]
//   isBannersLoading: boolean
  isBannerUpdating: boolean
//   getBannersAsync: (params?: any) => Promise<void>
  upsertBannerAsync: (params?: any) => Promise<void>
}

export const useBannerStore = create<BannerStore>((set, get) => ({
//   banners: [],
//   isBannersLoading: false,
  isBannerUpdating: false,

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

  upsertBannerAsync: async ({ bannerId = "", fields = {}, successCB = noop, errorCB = noop }) => {
    set({ isBannerUpdating: true })

    try {
      const data = await bannersApi.updateBanner({ id: bannerId, body: fields })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =upsertBannerAsync=")

      successCB(data.message || "Banner has been updated successfully.")
    } finally {
      set({ isBannerUpdating: false })
    }
  },
}))
