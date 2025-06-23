"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Cloud, Sun, CloudRain } from "lucide-react"
import { useEffect, useState } from "react"

interface WeatherMapProps {
  currentLocation: { lat: number; lon: number } | null
}

const INDIAN_CITIES = [
  { id: 1, name: "Delhi", lat: 28.6139, lon: 77.2090 },
  { id: 2, name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { id: 3, name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { id: 4, name: "Chennai", lat: 13.0827, lon: 80.2707 },
]

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY" // <-- Replace with your real API key

export function WeatherMap({ currentLocation }: WeatherMapProps) {
  const [weatherLocations, setWeatherLocations] = useState<any[]>([])

  useEffect(() => {
    async function fetchWeather() {
      const results = await Promise.all(
        INDIAN_CITIES.map(async (city) => {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
          )
          const data = await res.json()
          return {
            ...city,
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main, // e.g., "Clouds", "Rain", "Clear"
          }
        })
      )
      setWeatherLocations(results)
    }
    fetchWeather()
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="w-4 h-4 text-yellow-500" />
      case "cloudy":
        return <Cloud className="w-4 h-4 text-gray-500" />
      case "rainy":
        return <CloudRain className="w-4 h-4 text-blue-500" />
      default:
        return <Sun className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Interactive Weather Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg h-96 overflow-hidden">
          {/* Simplified map representation */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-200/20 to-blue-300/20">
            {/* Mock continents */}
            <div className="absolute top-16 left-20 w-32 h-24 bg-green-300/30 rounded-lg"></div>
            <div className="absolute top-12 right-16 w-28 h-20 bg-green-300/30 rounded-lg"></div>
            <div className="absolute bottom-20 left-32 w-24 h-16 bg-green-300/30 rounded-lg"></div>
          </div>

          {/* Weather markers */}
          {weatherLocations.map((location) => (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${((location.lon + 180) / 360) * 100}%`,
                top: `${((90 - location.lat) / 180) * 100}%`,
              }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:scale-110 transition-transform">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-red-500" />
                  <div className="text-xs">
                    <div className="font-semibold">{location.name}</div>
                    <div className="flex items-center space-x-1">
                      {getWeatherIcon(location.condition)}
                      <span>{location.temp}°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Current location marker */}
          {currentLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((currentLocation.lon + 180) / 360) * 100}%`,
                top: `${((90 - currentLocation.lat) / 180) * 100}%`,
              }}
            >
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                You
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {weatherLocations.map((location) => (
            <div key={location.id} className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">{location.name}</div>
                  <div className="text-white/70 text-xs">{location.condition}</div>
                </div>
                <div className="text-white font-bold">{location.temp}°C</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
