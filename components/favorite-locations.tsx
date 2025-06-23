"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FavoriteLocation {
  id: string
  name: string
  temperature: number
  condition: string
  addedAt: string
}

interface FavoriteLocationsProps {
  onLocationSelect: (location: string) => void
}

export function FavoriteLocations({ onLocationSelect }: FavoriteLocationsProps) {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([])
  const [newLocation, setNewLocation] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("weather-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    } else {
      // Add some default favorites
      const defaultFavorites: FavoriteLocation[] = [
        {
          id: "1",
          name: "New York",
          temperature: 22,
          condition: "Sunny",
          addedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "London",
          temperature: 18,
          condition: "Cloudy",
          addedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Tokyo",
          temperature: 25,
          condition: "Rainy",
          addedAt: new Date().toISOString(),
        },
      ]
      setFavorites(defaultFavorites)
      localStorage.setItem("weather-favorites", JSON.stringify(defaultFavorites))
    }
  }, [])

  const addFavorite = () => {
    if (!newLocation.trim()) return

    const newFavorite: FavoriteLocation = {
      id: Date.now().toString(),
      name: newLocation,
      temperature: Math.round(Math.random() * 30 + 10),
      condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
      addedAt: new Date().toISOString(),
    }

    const updatedFavorites = [...favorites, newFavorite]
    setFavorites(updatedFavorites)
    localStorage.setItem("weather-favorites", JSON.stringify(updatedFavorites))
    setNewLocation("")

    toast({
      title: "Location added",
      description: `${newLocation} has been added to your favorites.`,
    })
  }

  const removeFavorite = (id: string) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id)
    setFavorites(updatedFavorites)
    localStorage.setItem("weather-favorites", JSON.stringify(updatedFavorites))

    toast({
      title: "Location removed",
      description: "Location has been removed from your favorites.",
    })
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return "bg-yellow-500/20 text-yellow-300"
      case "cloudy":
        return "bg-gray-500/20 text-gray-300"
      case "rainy":
        return "bg-blue-500/20 text-blue-300"
      default:
        return "bg-blue-500/20 text-blue-300"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Add New Favorite Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter city name..."
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              onKeyPress={(e) => e.key === "Enter" && addFavorite()}
            />
            <Button onClick={addFavorite} className="bg-white/20 hover:bg-white/30">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Your Favorite Locations</CardTitle>
        </CardHeader>
        <CardContent>
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/70">No favorite locations yet</p>
              <p className="text-white/50 text-sm">Add some locations to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer group"
                  onClick={() => onLocationSelect(favorite.name)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-white/70 mr-2" />
                      <h3 className="text-white font-semibold">{favorite.name}</h3>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFavorite(favorite.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white/70 hover:text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-white">{favorite.temperature}°C</div>
                    <Badge className={getConditionColor(favorite.condition)}>{favorite.condition}</Badge>
                  </div>

                  <div className="text-white/50 text-xs mt-2">
                    Added {new Date(favorite.addedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
