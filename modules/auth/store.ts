import { create } from "zustand"
import type { User } from "firebase/auth"
import type { UserResponse } from "@/modules/users/types"
import * as authApi from "@/modules/auth/api"
import * as bannersApi from "@/modules/banners/api"
import { useBannerStore } from "@/modules/banners/store"

const noop = () => {}

type AuthStore = {
  authUser: User | null | undefined
  user: UserResponse
  isUserLoading: boolean
  isAuthUserLoading: boolean
  setIsAuthUserLoading: (_: boolean) => void
  setIsUserLoading: (_: boolean) => void
  setAuthUser: (_: any) => void
  getProfileAsync: (params?: any) => Promise<void>
  reset: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: undefined, // firebase returns null or User. undefined means loading
  user: {},
  isUserLoading: false,
  isAuthUserLoading: false,

  setIsAuthUserLoading: (v: boolean) => set({ isAuthUserLoading: v }),
  setIsUserLoading: (v: boolean) => set({ isUserLoading: v }),
  setAuthUser: (v: any) => set({ authUser: v }),

  getProfileAsync: async ({ successCB = noop, errorCB = noop } = {}) => {
    set({ isUserLoading: true })

    try {
      const { authUser } = get()

      const [userData, mediaData] = await Promise.all([
        authApi.getProfile(),
        bannersApi.getBanner({ id: authUser?.uid }),
      ])

      if (!userData.success) return errorCB(userData.message)
      console.log(userData.data, " =getProfileAsync=")
      set({ user: {...userData.data, banner: mediaData.data} })

      // mediaData.data && useBannerStore.getState().setBanner(mediaData.data)

      successCB(userData.message)
    } finally {
      set({ isUserLoading: false })
    }
  },

  reset: () => {
    set({
      authUser: undefined,
      user: {},
      isUserLoading: false,
      isAuthUserLoading: false,
    })
  },
}))
