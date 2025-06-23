"use client"

import { useAuth } from "@/components/auth-provider"
import { AuthForm } from "@/components/auth-form"
import { WeatherDashboard } from "@/components/weather-dashboard"
import { Preloader } from "@/components/preloader"
import { useEffect, useState } from "react"

export default function Home() {
  const { user, loading } = useAuth()
  const [showPreloader, setShowPreloader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (showPreloader) {
    return <Preloader />
  }

  if (loading) {
    return <Preloader />
  }

  if (!user) {
    return <AuthForm />
  }

  return <WeatherDashboard />
}
