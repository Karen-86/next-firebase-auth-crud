import { create } from "zustand"
import type { UserResponse } from "@/modules/users/types"
import { useAuthStore } from "@/modules/auth/store"
import * as usersApi from "@/modules/users/api"
import * as bannersApi from "@/modules/banners/api"

const noop = () => {}

type UserStore = {
  users: UserResponse[]
  targetUser: UserResponse
  isTargetUserLoading: boolean
  isUsersLoading: boolean
  isTargetUserUpdating: boolean
  isTargetUserRolesUpdating: boolean
  isTargetUserDeleting: boolean
  getUsersAsync: (params?: any) => Promise<void>
  getTargetUserAsync: (params?: any) => Promise<void>
  updateTargetUserAsync: (params?: any) => Promise<void>
  updateTargetUserRolesAsync: (params?: any) => Promise<void>
  deleteTargetUserAsync: (params?: any) => Promise<void>
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  targetUser: {},
  isTargetUserLoading: false,
  isUsersLoading: false,
  isTargetUserUpdating: false,
  isTargetUserRolesUpdating: false,
  isTargetUserDeleting: false,

  getUsersAsync: async ({ successCB = noop, errorCB = noop } = {}) => {
    set({ isUsersLoading: true })

    try {
      const data = await usersApi.getUsers()

      if (!data.success) return errorCB(data.message)
      console.log(data, " =getUsersAsync=")

      set({ users: data.data })
      successCB(data.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getTargetUserAsync: async ({ userId = "", successCB = noop, errorCB = noop }) => {
    set({ isTargetUserLoading: true })

    try {
      const [userData, mediaData] = await Promise.all([
        usersApi.getUser({ id: userId }),
        bannersApi.getBanner({ id: userId }),
      ])

      if (!userData.success) return errorCB(userData.message)
      console.log(userData, " =getTargetUserAsync=")

      set({ targetUser: { ...userData.data, banner: mediaData.data} })
      successCB(userData.message)
    } finally {
      set({ isTargetUserLoading: false })
    }
  },

  updateTargetUserAsync: async ({ userId = "", fields = {}, successCB = noop, errorCB = noop }) => {
    set({ isTargetUserUpdating: true })

    try {
      const data = await usersApi.updateUser({ id: userId, body: fields })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =updateTargetUserAsync=")

      await get().getUsersAsync()
      successCB(data.message || "User has been updated successfully.")
    } finally {
      set({ isTargetUserUpdating: false })
    }
  },

  updateTargetUserRolesAsync: async ({
    userId = "",
    fields = {},
    successCB = noop,
    errorCB = noop,
    warningCB = noop,
  }) => {
    set({ isTargetUserRolesUpdating: true })

    try {
      const data = await usersApi.updateUserRoles({ id: userId, body: fields })

      if (!data.success && data.message === "Field roles is required") return warningCB("No changes was made.")
      if (!data.success) return errorCB(data.message)
      console.log(data, " =updateTargetUserRolesAsync=")

      await get().getUsersAsync()
      successCB(data.message || "User roles has been updated successfully.")
    } finally {
      set({ isTargetUserRolesUpdating: false })
    }
  },

  deleteTargetUserAsync: async ({ userId = "", successCB = noop, errorCB = noop }) => {
    set({ isTargetUserDeleting: true })
    try {
      const user = useAuthStore.getState().user

      const data = await usersApi.deleteUser({ id: userId })

      if (!data.success) return errorCB(data.message)
      console.log(data, " =deleteTargetUserAsync=")

      if (userId === user.id) {
        successCB("Account deleted successfully")
        // setTimeout(() => handleSignOut(), 3000)
      } else {
        await get().getUsersAsync()
        successCB(data.message || "User has been deleted successfully.")
      }
    } finally {
      set({ isTargetUserDeleting: false })
    }
  },
}))
