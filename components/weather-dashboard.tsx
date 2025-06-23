"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { WeatherChart } from "@/components/weather-chart"
import { WeatherMap } from "@/components/weather-map"
import { FavoriteLocations } from "@/components/favorite-locations"
import { WeatherAlerts } from "@/components/weather-alerts"
import { HistoricalWeather } from "@/components/historical-weather"
import { WidgetDashboard } from "@/components/widget-dashboard"
import { ClimateChangeTracker } from "@/components/climate-change-tracker"
import { ClimateAdaptationAdvisor } from "@/components/climate-adaptation-advisor"
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  MapPin,
  Search,
  LogOut,
  Star,
  Bell,
  History,
  Map,
  Settings,
  Plus,
  Move,
  Calendar,
  TrendingUp,
  Zap,
  Clock,
  Globe,
  AlertTriangle,
  BarChart3,
  Target,
} from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  pressure: number
  uvIndex: number
  hourlyForecast: Array<{
    time: string
    temp: number
    condition: string
  }>
  weeklyForecast: Array<{
    day: string
    high: number
    low: number
    condition: string
  }>
}

export function WeatherDashboard() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [showWidgetDashboard, setShowWidgetDashboard] = useState(false)
  const [showClimateTracker, setShowClimateTracker] = useState(false)
  const [showAdaptationAdvisor, setShowAdaptationAdvisor] = useState(false)

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
          fetchWeatherData("Current Location")
        },
        () => {
          // Fallback to default location
          fetchWeatherData("New York")
        },
      )
    } else {
      fetchWeatherData("New York")
    }
  }, [])

  const fetchWeatherData = async (location: string) => {
    setLoading(true)
    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockData: WeatherData = {
        location,
        temperature: Math.round(Math.random() * 30 + 10),
        condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
        humidity: Math.round(Math.random() * 40 + 40),
        windSpeed: Math.round(Math.random() * 20 + 5),
        visibility: Math.round(Math.random() * 5 + 5),
        pressure: Math.round(Math.random() * 50 + 1000),
        uvIndex: Math.round(Math.random() * 10),
        hourlyForecast: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          temp: Math.round(Math.random() * 10 + 15),
          condition: ["Sunny", "Cloudy", "Rainy"][Math.floor(Math.random() * 3)],
        })),
        weeklyForecast: Array.from({ length: 7 }, (_, i) => ({
          day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
          high: Math.round(Math.random() * 15 + 20),
          low: Math.round(Math.random() * 10 + 5),
          condition: ["Sunny", "Cloudy", "Rainy"][Math.floor(Math.random() * 3)],
        })),
      }

      setWeatherData(mockData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch weather data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchWeatherData(searchQuery)
      setSearchQuery("")
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="w-8 h-8 text-yellow-500" />
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-500" />
      case "rainy":
        return <CloudRain className="w-8 h-8 text-blue-500" />
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />
    }
  }

  if (loading && !weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    )
  }

  const climateData = {
    temperatureChange: "+1.5°C",
    seaLevelRise: "10 cm",
    extremeWeatherEvents: "Increased by 20%",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Cloud className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Weather Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70 w-64"
                />
                <Button type="submit" size="sm" className="bg-white/20 hover:bg-white/30">
                  <Search className="w-4 h-4" />
                </Button>
              </form>

              <div className="flex items-center space-x-2 text-white">
                <span>Welcome, {user?.name}</span>
                <Button onClick={logout} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {weatherData && (
          <>
            {/* Current Weather */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        {weatherData.location}
                      </CardTitle>
                      <p className="text-white/70">Current Weather</p>
                    </div>
                    <Button size="sm" className="bg-white/20 hover:bg-white/30">
                      <Star className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getWeatherIcon(weatherData.condition)}
                      <div>
                        <div className="text-4xl font-bold text-white">{weatherData.temperature}°C</div>
                        <div className="text-white/70">{weatherData.condition}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-white/70">
                        <Droplets className="w-4 h-4 mr-2" />
                        {weatherData.humidity}%
                      </div>
                      <div className="flex items-center text-white/70">
                        <Wind className="w-4 h-4 mr-2" />
                        {weatherData.windSpeed} km/h
                      </div>
                      <div className="flex items-center text-white/70">
                        <Eye className="w-4 h-4 mr-2" />
                        {weatherData.visibility} km
                      </div>
                      <div className="flex items-center text-white/70">
                        <Thermometer className="w-4 h-4 mr-2" />
                        {weatherData.pressure} hPa
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">UV Index</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{weatherData.uvIndex}</div>
                    <Badge
                      variant={
                        weatherData.uvIndex > 7 ? "destructive" : weatherData.uvIndex > 4 ? "default" : "secondary"
                      }
                      className="bg-white/20"
                    >
                      {weatherData.uvIndex > 7 ? "High" : weatherData.uvIndex > 4 ? "Moderate" : "Low"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="forecast" className="space-y-6">
              <TabsList className="bg-white/10 backdrop-blur-md border-white/20">
                <TabsTrigger value="forecast" className="data-[state=active]:bg-white/20">
                  Forecast
                </TabsTrigger>
                <TabsTrigger value="map" className="data-[state=active]:bg-white/20">
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </TabsTrigger>
                <TabsTrigger value="favorites" className="data-[state=active]:bg-white/20">
                  <Star className="w-4 h-4 mr-2" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="alerts" className="data-[state=active]:bg-white/20">
                  <Bell className="w-4 h-4 mr-2" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="historical" className="data-[state=active]:bg-white/20">
                  <History className="w-4 h-4 mr-2" />
                  Historical
                </TabsTrigger>
                <TabsTrigger value="widgets" className="data-[state=active]:bg-white/20">
                  <Settings className="w-4 h-4 mr-2" />
                  Widgets
                </TabsTrigger>
                <TabsTrigger value="climate-change" className="data-[state=active]:bg-white/20">
                  <Globe className="w-4 h-4 mr-2" />
                  Climate Change
                </TabsTrigger>
              </TabsList>

              <TabsContent value="forecast" className="space-y-6">
                <WeatherChart weatherData={weatherData} />

                {/* Weekly Forecast */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">7-Day Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-4">
                      {weatherData.weeklyForecast.map((day, index) => (
                        <div key={index} className="text-center">
                          <div className="text-white/70 text-sm mb-2">{day.day}</div>
                          <div className="mb-2">{getWeatherIcon(day.condition)}</div>
                          <div className="text-white text-sm">
                            <div className="font-semibold">{day.high}°</div>
                            <div className="text-white/70">{day.low}°</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="map">
                <WeatherMap currentLocation={currentLocation} />
              </TabsContent>

              <TabsContent value="favorites">
                <FavoriteLocations onLocationSelect={fetchWeatherData} />
              </TabsContent>

              <TabsContent value="alerts">
                <WeatherAlerts />
              </TabsContent>

              <TabsContent value="historical">
                <HistoricalWeather location={weatherData.location} />
              </TabsContent>
              <TabsContent value="widgets">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Customize Your Dashboard</CardTitle>
                    <p className="text-white/70">Create and arrange personalized weather widgets</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white/10 rounded-lg p-6 text-center">
                        <Settings className="w-12 h-12 text-white/70 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Widget Dashboard</h3>
                        <p className="text-white/70 text-sm mb-4">
                          Create, customize, and arrange weather widgets to build your perfect dashboard
                        </p>
                        <Button
                          onClick={() => setShowWidgetDashboard(true)}
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          Open Widget Dashboard
                        </Button>
                      </div>

                      <div className="bg-white/10 rounded-lg p-6 text-center">
                        <Plus className="w-12 h-12 text-white/70 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">10+ Widget Types</h3>
                        <p className="text-white/70 text-sm">
                          Choose from current weather, forecasts, charts, gauges, maps, and more
                        </p>
                      </div>

                      <div className="bg-white/10 rounded-lg p-6 text-center">
                        <Move className="w-12 h-12 text-white/70 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Drag & Drop</h3>
                        <p className="text-white/70 text-sm">
                          Easily rearrange widgets with intuitive drag and drop functionality
                        </p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="text-white font-semibold mb-4">Available Widget Types:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { name: "Current Weather", icon: Sun },
                          { name: "Forecast", icon: Calendar },
                          { name: "Temperature Chart", icon: TrendingUp },
                          { name: "Humidity Gauge", icon: Droplets },
                          { name: "Wind Compass", icon: Wind },
                          { name: "UV Index", icon: Zap },
                          { name: "Air Quality", icon: Eye },
                          { name: "Sun Times", icon: Clock },
                          { name: "Weather Map", icon: MapPin },
                          { name: "Alerts", icon: Bell },
                        ].map((widget, index) => (
                          <div key={index} className="bg-white/10 rounded-lg p-3 text-center">
                            <widget.icon className="w-6 h-6 text-white/70 mx-auto mb-2" />
                            <span className="text-white/70 text-xs">{widget.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="climate-change">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Climate Change Analysis</CardTitle>
                    <p className="text-white/70">Understand how your local climate is changing over time</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white/10 rounded-lg p-6 text-center">
                        <TrendingUp className="w-12 h-12 text-white/70 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Historical Trends</h3>
                        <p className="text-white/70 text-sm mb-4">
                          Analyze temperature and precipitation changes since 1970
                        </p>
                        <Button
                          onClick={() => setShowClimateTracker(true)}
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          View Climate Trends
                        </Button>
                      </div>

                      <div className="bg-white/10 rounded-lg p-6 text-center">
                        <AlertTriangle className="w-12 h-12 text-white/70 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Extreme Events</h3>
                        <p className="text-white/70 text-sm">
                          Track changes in heat waves, storms, and other extreme weather
                        </p>
                      </div>

                      <div className="bg-white/10 rounded-lg p-6 text-center">
                        <BarChart3 className="w-12 h-12 text-white/70 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Future Projections</h3>
                        <p className="text-white/70 text-sm">
                          See how climate may change under different emission scenarios
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-6 text-center">
                        <Target className="w-12 h-12 text-white/70 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Adaptation Recommendations</h3>
                        <p className="text-white/70 text-sm mb-4">
                          Get personalized suggestions for adapting to climate change in your area
                        </p>
                        <Button
                          onClick={() => setShowAdaptationAdvisor(true)}
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          Get Recommendations
                        </Button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="text-white font-semibold mb-4">Key Climate Indicators:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { name: "Temperature Trends", icon: Thermometer },
                          { name: "Precipitation Changes", icon: CloudRain },
                          { name: "Extreme Heat", icon: Sun },
                          { name: "Growing Season", icon: Calendar },
                          { name: "Energy Demand", icon: Zap },
                          { name: "Storm Frequency", icon: Wind },
                          { name: "Drought Risk", icon: Droplets },
                          { name: "Flood Risk", icon: Eye },
                          { name: "Seasonal Shifts", icon: Clock },
                          { name: "Local Impacts", icon: Globe },
                        ].map((indicator, index) => (
                          <div key={index} className="bg-white/10 rounded-lg p-3 text-center">
                            <indicator.icon className="w-6 h-6 text-white/70 mx-auto mb-2" />
                            <span className="text-white/70 text-xs">{indicator.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            {showWidgetDashboard && <WidgetDashboard onClose={() => setShowWidgetDashboard(false)} />}
            {showClimateTracker && (
              <ClimateChangeTracker location={weatherData.location} onClose={() => setShowClimateTracker(false)} />
            )}
            {showAdaptationAdvisor && (
              <ClimateAdaptationAdvisor
                location={weatherData.location}
                climateData={climateData}
                onClose={() => setShowAdaptationAdvisor(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
