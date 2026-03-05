"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuthStore } from "@/shared/store/authStore"
import { useAuthInit } from "@/modules/auth/hooks/useAuthInit"

export default function RootPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { isLoading } = useAuthInit()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/dashboard")
      } else {
        router.replace("/login")
      }
    }
  }, [isAuthenticated, isLoading, router])

  return <div>Loading...</div>
}