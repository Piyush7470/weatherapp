"use client"

import { Sun } from "lucide-react"

export function Preloader() {
  return (
    <div className="preloader">
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-white/20 pulse-ring"></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-8">
            <div className="weather-icon">
              <Sun className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Weather Dashboard</h1>
          <p className="text-white/80 text-lg">Loading your weather experience...</p>

          <div className="flex items-center space-x-2 justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
