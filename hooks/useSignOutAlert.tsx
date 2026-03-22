import { useEffect } from "react"
import useAlert from "@/hooks/useAlert"

export const useSignOutAlerts = () => {
  const { successAlert, errorAlert } = useAlert()

  useEffect(() => {
    if (typeof window === "undefined") return
    
    const stored = sessionStorage.getItem("signOutDetails")
    if (!stored) return

    sessionStorage.removeItem("signOutDetails")

    try {
      const details = JSON.parse(stored)

      if (Array.isArray(details) && details.length) {
        setTimeout(() => {
          details.forEach((item: any) => {
            if (item.status === "success") {
              successAlert(item.message)
            } else {
              errorAlert(item.message)
            }
          })
        }, 100)
      }

      // 🔥 prevent repeat alerts
      sessionStorage.removeItem("signOutDetails")
    } catch (err) {
      console.error("Invalid signOutDetails format", err)
    }
  }, [])
}
