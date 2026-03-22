import { useAuthStore } from "@/modules/auth/store"
// import { useUserStore } from "@/modules/users/store"

export const resetAllStores = () => {
  useAuthStore.getState().reset?.()
  //   useUserStore.getState().reset?.()
  // call reset() on all your other stores
}
