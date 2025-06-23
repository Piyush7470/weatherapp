"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("weather-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("weather-users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name }
      setUser(userData)
      localStorage.setItem("weather-user", JSON.stringify(userData))
      return true
    }

    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get existing users
    const users = JSON.parse(localStorage.getItem("weather-users") || "[]")

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return false
    }

    // Add new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
    }

    users.push(newUser)
    localStorage.setItem("weather-users", JSON.stringify(users))

    // Auto login after registration
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name }
    setUser(userData)
    localStorage.setItem("weather-user", JSON.stringify(userData))

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("weather-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
