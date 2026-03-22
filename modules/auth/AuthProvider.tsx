"use client"
import React from "react"
import { ReactNode, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase/config/firebaseClient"
import useAlert from "@/hooks/useAlert"
import { LoadingScreen } from "@/components/loading-screen/LoadingScreen"
import useAutoLogout from "@/hooks/useAutoLogout"
import { useAuthStore } from "@/modules/auth/store"
import { useUserStore } from "@/modules/users/store"

const guestRoutes = ["/sign-in", "/sign-up", "/forgot-password"]
const protectedPrefix = "/dashboard"

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const getProfileAsync = useAuthStore((s) => s.getProfileAsync)
  const getUsersAsync = useUserStore((s) => s.getUsersAsync)

  const setAuthUser = useAuthStore((s) => s.setAuthUser)
  const authUser = useAuthStore((s) => s.authUser)
  const user = useAuthStore((s) => s.user)

  const { successAlert } = useAlert()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setAuthUser(user))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    console.log(authUser, " auth.user")

    if (authUser === undefined) return
    if (authUser) {
      getProfileAsync()
      getUsersAsync()
    }

    if (authUser && guestRoutes.includes(pathname)) {
      router.replace("/dashboard")
      return
    }

    if (!authUser && pathname.startsWith(protectedPrefix)) {
      // successAlert("You’ve signed out successfully!")
      router.replace("/sign-in")
    }
  }, [authUser, pathname])

  useAutoLogout(24 * 60 * 60 * 1000)

  if (authUser === undefined && pathname.startsWith("/dashboard") && !guestRoutes.includes(pathname))
    return <LoadingScreen value="client loading (auth user)..." />

  return <>{children}</>
}
