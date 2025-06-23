"use client"

import type React from "react"
import { Settings } from "lucide-react" // Import Settings icon
import { Globe } from "lucide-react"
import { AdaptiveSeasonalTemplates } from "@/components/adaptive-seasonal-templates"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Snowflake,
  Flower,
  Sun,
  Leaf,
  Calendar,
  Activity,
  Heart,
  AlertTriangle,
  Check,
  Star,
  Sparkles,
  RefreshCw,
} from "lucide-react"

interface Widget {
  id: string
  type:
    | "current-weather"
    | "forecast"
    | "temperature-chart"
    | "humidity-gauge"
    | "wind-compass"
    | "uv-index"
    | "air-quality"
    | "sunrise-sunset"
    | "weather-map-mini"
    | "alerts-summary"
    | "seasonal-health"
    | "seasonal-activities"
    | "seasonal-alerts"
    | "pollen-index"
    | "heat-index"
    | "wind-chill"
    | "snow-depth"
    | "ice-warning"
    | "fire-risk"
    | "storm-tracker"
  title: string
  location: string
  size: "small" | "medium" | "large"
  position: { x: number; y: number }
  settings: {
    showIcon?: boolean
    showDetails?: boolean
    theme?: "light" | "dark" | "auto" | "seasonal"
    refreshInterval?: number
    units?: "metric" | "imperial"
    showBackground?: boolean
    seasonalMode?: boolean
  }
}

interface SeasonalTemplate {
  id: string
  name: string
  season: "spring" | "summer" | "autumn" | "winter"
  description: string
  icon: React.ComponentType<{ className?: string }>
  colorScheme: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  widgets: Omit<Widget, "id">[]
  features: string[]
  healthTips: string[]
  activities: string[]
  alerts: string[]
  autoActivate?: {
    months: number[]
    hemisphere: "northern" | "southern" | "both"
  }
}

const seasonalTemplates: SeasonalTemplate[] = [
  {
    id: "spring-awakening",
    name: "Spring Awakening",
    season: "spring",
    description: "Fresh start with pollen tracking, allergy alerts, and perfect weather for outdoor activities",
    icon: Flower,
    colorScheme: {
      primary: "from-green-400 to-blue-500",
      secondary: "from-pink-300 to-green-400",
      accent: "text-green-400",
      background: "bg-gradient-to-br from-green-100/20 to-blue-200/20",
    },
    autoActivate: {
      months: [3, 4, 5], // March, April, May
      hemisphere: "northern",
    },
    features: [
      "Pollen index tracking",
      "Allergy alerts",
      "Rain probability",
      "UV protection",
      "Outdoor activity suggestions",
      "Daylight hours tracking",
    ],
    healthTips: [
      "Monitor pollen levels for allergies",
      "Stay hydrated during outdoor activities",
      "Use sunscreen as UV levels increase",
      "Watch for sudden weather changes",
    ],
    activities: [
      "Gardening and planting",
      "Hiking and nature walks",
      "Outdoor sports",
      "Photography of blooming flowers",
      "Picnics and outdoor dining",
    ],
    alerts: ["Pollen warnings", "Late frost alerts", "Spring storm watches", "Flood advisories"],
    widgets: [
      {
        type: "current-weather",
        title: "Spring Weather",
        location: "New York",
        size: "large",
        position: { x: 0, y: 0 },
        settings: {
          showIcon: true,
          showDetails: true,
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "pollen-index",
        title: "Pollen Tracker",
        location: "New York",
        size: "medium",
        position: { x: 3, y: 0 },
        settings: {
          theme: "seasonal",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "forecast",
        title: "Spring Forecast",
        location: "New York",
        size: "large",
        position: { x: 0, y: 2 },
        settings: {
          showIcon: true,
          showDetails: false,
          theme: "seasonal",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "uv-index",
        title: "UV Protection",
        location: "New York",
        size: "small",
        position: { x: 5, y: 0 },
        settings: {
          theme: "seasonal",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "sunrise-sunset",
        title: "Daylight Hours",
        location: "New York",
        size: "medium",
        position: { x: 3, y: 2 },
        settings: {
          theme: "seasonal",
          refreshInterval: 1800,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "seasonal-activities",
        title: "Spring Activities",
        location: "New York",
        size: "small",
        position: { x: 5, y: 2 },
        settings: {
          theme: "seasonal",
          refreshInterval: 1800,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "seasonal-alerts",
        title: "Spring Alerts",
        location: "New York",
        size: "medium",
        position: { x: 0, y: 4 },
        settings: {
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
    ],
  },
  {
    id: "summer-heat",
    name: "Summer Heat",
    season: "summer",
    description: "Beat the heat with UV monitoring, heat index tracking, and cooling activity suggestions",
    icon: Sun,
    colorScheme: {
      primary: "from-yellow-400 to-red-500",
      secondary: "from-orange-300 to-yellow-400",
      accent: "text-yellow-400",
      background: "bg-gradient-to-br from-yellow-100/20 to-orange-200/20",
    },
    autoActivate: {
      months: [6, 7, 8], // June, July, August
      hemisphere: "northern",
    },
    features: [
      "Heat index monitoring",
      "UV radiation tracking",
      "Hydration reminders",
      "Cooling center locations",
      "Beach and pool conditions",
      "Fire risk assessment",
    ],
    healthTips: [
      "Stay hydrated - drink water regularly",
      "Avoid outdoor activities during peak heat",
      "Use high SPF sunscreen",
      "Seek shade and air conditioning",
      "Watch for heat exhaustion symptoms",
    ],
    activities: [
      "Beach and swimming",
      "Early morning or evening walks",
      "Indoor activities during peak heat",
      "Water sports and activities",
      "Outdoor dining in shade",
    ],
    alerts: ["Heat warnings", "UV alerts", "Fire weather watches", "Air quality advisories"],
    widgets: [
      {
        type: "current-weather",
        title: "Summer Heat",
        location: "New York",
        size: "large",
        position: { x: 0, y: 0 },
        settings: {
          showIcon: true,
          showDetails: true,
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "heat-index",
        title: "Heat Index",
        location: "New York",
        size: "medium",
        position: { x: 3, y: 0 },
        settings: {
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "uv-index",
        title: "UV Danger Level",
        location: "New York",
        size: "medium",
        position: { x: 5, y: 0 },
        settings: {
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "forecast",
        title: "Heat Forecast",
        location: "New York",
        size: "large",
        position: { x: 0, y: 2 },
        settings: {
          showIcon: true,
          showDetails: false,
          theme: "seasonal",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "air-quality",
        title: "Air Quality",
        location: "New York",
        size: "small",
        position: { x: 3, y: 2 },
        settings: {
          theme: "seasonal",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "fire-risk",
        title: "Fire Risk",
        location: "New York",
        size: "small",
        position: { x: 4, y: 2 },
        settings: {
          theme: "seasonal",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "seasonal-health",
        title: "Heat Safety",
        location: "New York",
        size: "small",
        position: { x: 5, y: 2 },
        settings: {
          theme: "seasonal",
          refreshInterval: 1800,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
    ],
  },
  {
    id: "autumn-harvest",
    name: "Autumn Harvest",
    season: "autumn",
    description: "Embrace fall colors with leaf-peeping forecasts, harvest weather, and cozy activity planning",
    icon: Leaf,
    colorScheme: {
      primary: "from-orange-400 to-red-600",
      secondary: "from-yellow-400 to-orange-500",
      accent: "text-orange-400",
      background: "bg-gradient-to-br from-orange-100/20 to-red-200/20",
    },
    autoActivate: {
      months: [9, 10, 11], // September, October, November
      hemisphere: "northern",
    },
    features: [
      "Leaf color predictions",
      "Harvest weather conditions",
      "Storm tracking",
      "Frost warnings",
      "Comfort index",
      "Seasonal depression awareness",
    ],
    healthTips: [
      "Prepare for seasonal mood changes",
      "Layer clothing for temperature swings",
      "Get flu vaccination",
      "Maintain vitamin D levels",
      "Stay active despite shorter days",
    ],
    activities: [
      "Leaf peeping and foliage tours",
      "Apple picking and harvest festivals",
      "Hiking in crisp weather",
      "Cozy indoor activities",
      "Preparation for winter",
    ],
    alerts: ["First frost warnings", "Storm watches", "Wind advisories", "Seasonal depression alerts"],
    widgets: [
      {
        type: "current-weather",
        title: "Autumn Weather",
        location: "New York",
        size: "large",
        position: { x: 0, y: 0 },
        settings: {
          showIcon: true,
          showDetails: true,
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "forecast",
        title: "Fall Forecast",
        location: "New York",
        size: "large",
        position: { x: 3, y: 0 },
        settings: {
          showIcon: true,
          showDetails: false,
          theme: "seasonal",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "wind-compass",
        title: "Wind Conditions",
        location: "New York",
        size: "medium",
        position: { x: 0, y: 2 },
        settings: {
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "temperature-chart",
        title: "Temperature Swings",
        location: "New York",
        size: "medium",
        position: { x: 2, y: 2 },
        settings: {
          theme: "seasonal",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "storm-tracker",
        title: "Storm Tracker",
        location: "New York",
        size: "medium",
        position: { x: 4, y: 2 },
        settings: {
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "sunrise-sunset",
        title: "Daylight Changes",
        location: "New York",
        size: "small",
        position: { x: 0, y: 4 },
        settings: {
          theme: "seasonal",
          refreshInterval: 1800,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "seasonal-activities",
        title: "Fall Activities",
        location: "New York",
        size: "small",
        position: { x: 1, y: 4 },
        settings: {
          theme: "seasonal",
          refreshInterval: 1800,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
    ],
  },
  {
    id: "winter-wonderland",
    name: "Winter Wonderland",
    season: "winter",
    description: "Navigate winter safely with snow tracking, ice warnings, and winter activity planning",
    icon: Snowflake,
    colorScheme: {
      primary: "from-blue-400 to-indigo-600",
      secondary: "from-cyan-300 to-blue-400",
      accent: "text-blue-400",
      background: "bg-gradient-to-br from-blue-100/20 to-indigo-200/20",
    },
    autoActivate: {
      months: [12, 1, 2], // December, January, February
      hemisphere: "northern",
    },
    features: [
      "Snow depth tracking",
      "Ice warning system",
      "Wind chill calculator",
      "Winter storm alerts",
      "Heating efficiency tips",
      "Seasonal affective disorder support",
    ],
    healthTips: [
      "Dress in layers for warmth",
      "Watch for signs of hypothermia",
      "Use light therapy for SAD",
      "Stay active indoors",
      "Maintain home heating efficiency",
      "Be cautious of icy conditions",
    ],
    activities: [
      "Skiing and snowboarding",
      "Ice skating and hockey",
      "Winter hiking with proper gear",
      "Indoor fitness activities",
      "Cozy indoor hobbies",
      "Holiday celebrations",
    ],
    alerts: ["Blizzard warnings", "Ice storm alerts", "Wind chill advisories", "Heating system checks"],
    widgets: [
      {
        type: "current-weather",
        title: "Winter Conditions",
        location: "New York",
        size: "large",
        position: { x: 0, y: 0 },
        settings: {
          showIcon: true,
          showDetails: true,
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "wind-chill",
        title: "Wind Chill",
        location: "New York",
        size: "medium",
        position: { x: 3, y: 0 },
        settings: {
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "snow-depth",
        title: "Snow Tracker",
        location: "New York",
        size: "medium",
        position: { x: 5, y: 0 },
        settings: {
          theme: "seasonal",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "forecast",
        title: "Winter Forecast",
        location: "New York",
        size: "large",
        position: { x: 0, y: 2 },
        settings: {
          showIcon: true,
          showDetails: false,
          theme: "seasonal",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "ice-warning",
        title: "Ice Conditions",
        location: "New York",
        size: "small",
        position: { x: 3, y: 2 },
        settings: {
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "storm-tracker",
        title: "Winter Storms",
        location: "New York",
        size: "medium",
        position: { x: 4, y: 2 },
        settings: {
          theme: "seasonal",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
      {
        type: "seasonal-health",
        title: "Winter Wellness",
        location: "New York",
        size: "small",
        position: { x: 0, y: 4 },
        settings: {
          theme: "seasonal",
          refreshInterval: 1800,
          units: "metric",
          showBackground: true,
          seasonalMode: true,
        },
      },
    ],
  },
]

interface SeasonalTemplatesProps {
  onApplyTemplate: (widgets: Widget[]) => void
  onClose: () => void
}

export function SeasonalTemplates({ onApplyTemplate, onClose }: SeasonalTemplatesProps) {
  const [selectedSeason, setSelectedSeason] = useState<string>("current")
  const [selectedTemplate, setSelectedTemplate] = useState<SeasonalTemplate | null>(null)
  const [currentSeason, setCurrentSeason] = useState<string>("spring")
  const [autoMode, setAutoMode] = useState(true)
  const { toast } = useToast()
  const [showAdaptiveTemplates, setShowAdaptiveTemplates] = useState(false)

  useEffect(() => {
    // Determine current season based on date
    const now = new Date()
    const month = now.getMonth() + 1 // JavaScript months are 0-indexed

    let season = "spring"
    if (month >= 3 && month <= 5) season = "spring"
    else if (month >= 6 && month <= 8) season = "summer"
    else if (month >= 9 && month <= 11) season = "autumn"
    else season = "winter"

    setCurrentSeason(season)
    setSelectedSeason("current")
  }, [])

  const seasons = [
    { id: "current", name: `Current Season (${currentSeason})`, icon: getSeasonIcon(currentSeason) },
    { id: "spring", name: "Spring", icon: Flower },
    { id: "summer", name: "Summer", icon: Sun },
    { id: "autumn", name: "Autumn", icon: Leaf },
    { id: "winter", name: "Winter", icon: Snowflake },
  ]

  function getSeasonIcon(season: string) {
    switch (season) {
      case "spring":
        return Flower
      case "summer":
        return Sun
      case "autumn":
        return Leaf
      case "winter":
        return Snowflake
      default:
        return Calendar
    }
  }

  const filteredTemplates =
    selectedSeason === "current"
      ? seasonalTemplates.filter((template) => template.season === currentSeason)
      : selectedSeason === "all"
        ? seasonalTemplates
        : seasonalTemplates.filter((template) => template.season === selectedSeason)

  const applyTemplate = (template: SeasonalTemplate) => {
    const widgets: Widget[] = template.widgets.map((widget, index) => ({
      ...widget,
      id: `${Date.now()}-${index}`,
    }))

    onApplyTemplate(widgets)
    onClose()

    toast({
      title: "Seasonal Template Applied!",
      description: `${template.name} has been applied with ${widgets.length} season-specific widgets.`,
    })
  }

  const getSeasonalGradient = (template: SeasonalTemplate) => {
    return `bg-gradient-to-br ${template.colorScheme.primary}`
  }

  const getSeasonDescription = (season: string) => {
    switch (season) {
      case "spring":
        return "Fresh beginnings with allergy tracking and outdoor activity planning"
      case "summer":
        return "Beat the heat with UV monitoring and cooling strategies"
      case "autumn":
        return "Embrace fall colors with harvest weather and storm tracking"
      case "winter":
        return "Navigate winter safely with snow tracking and warming tips"
      default:
        return "Season-specific weather insights and activity suggestions"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg w-full max-w-7xl h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Sparkles className="w-6 h-6 mr-2" />
              Seasonal Weather Templates
            </h2>
            <p className="text-white/70">Weather dashboards that adapt to the seasons</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <RefreshCw className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm">Auto-seasonal mode</span>
              <Button
                size="sm"
                variant={autoMode ? "default" : "outline"}
                className={autoMode ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/70"}
                onClick={() => setAutoMode(!autoMode)}
              >
                {autoMode ? "ON" : "OFF"}
              </Button>
            </div>
            <Button
              onClick={() => setShowAdaptiveTemplates(true)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Globe className="w-4 h-4 mr-2" />
              Climate Adaptive
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Close
            </Button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Season Sidebar */}
          <div className="w-64 border-r border-white/20 p-4">
            <h3 className="text-white font-semibold mb-4">Seasons</h3>
            <div className="space-y-2">
              {seasons.map((season) => {
                const Icon = season.icon
                return (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeason(season.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedSeason === season.id
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{season.name}</span>
                  </button>
                )
              })}
            </div>

            {autoMode && (
              <div className="mt-6 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">Auto Mode Active</span>
                </div>
                <p className="text-green-300/70 text-xs">
                  Templates will automatically switch based on the current season
                </p>
              </div>
            )}
          </div>

          {/* Templates Grid */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="mb-6">
              <h3 className="text-white text-lg font-semibold mb-2">
                {selectedSeason === "current" ? `Current Season: ${currentSeason}` : selectedSeason} Templates
              </h3>
              <p className="text-white/70 text-sm">
                {selectedSeason === "current"
                  ? getSeasonDescription(currentSeason)
                  : "Choose a seasonal template optimized for specific weather patterns and activities"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = template.icon
                return (
                  <Card
                    key={template.id}
                    className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors overflow-hidden"
                  >
                    <div className={`h-2 ${getSeasonalGradient(template)}`}></div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 bg-white/10 rounded-lg ${template.colorScheme.background}`}>
                            <Icon className={`w-6 h-6 ${template.colorScheme.accent}`} />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`${template.colorScheme.accent} bg-white/10`}>
                                {template.season.charAt(0).toUpperCase() + template.season.slice(1)}
                              </Badge>
                              {template.season === currentSeason && (
                                <Badge className="bg-green-500/20 text-green-300">Current</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-white/70 text-sm">{template.description}</p>

                      {/* Key Features */}
                      <div>
                        <h4 className="text-white text-xs font-semibold mb-2">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="bg-white/10 text-white/70 text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 3 && (
                            <Badge variant="secondary" className="bg-white/10 text-white/70 text-xs">
                              +{template.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Health & Activities Preview */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="flex items-center space-x-1 mb-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            <span className="text-white/70 text-xs">Health Tips</span>
                          </div>
                          <p className="text-white/60 text-xs">{template.healthTips[0]}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="flex items-center space-x-1 mb-1">
                            <Activity className="w-3 h-3 text-blue-400" />
                            <span className="text-white/70 text-xs">Activities</span>
                          </div>
                          <p className="text-white/60 text-xs">{template.activities[0]}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                              onClick={() => setSelectedTemplate(template)}
                            >
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-3xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <Icon className="w-5 h-5" />
                                <span>{template.name}</span>
                              </DialogTitle>
                            </DialogHeader>
                            {selectedTemplate && (
                              <SeasonalTemplatePreview
                                template={selectedTemplate}
                                onApply={() => applyTemplate(selectedTemplate)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={() => applyTemplate(template)}
                          size="sm"
                          className={`flex-1 bg-white/10 hover:bg-white/20 ${template.colorScheme.accent} border border-white/20`}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-20">
                <div className="text-white/50 mb-4">
                  <Calendar className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No seasonal templates found</h3>
                  <p>Try selecting a different season</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showAdaptiveTemplates && (
        <AdaptiveSeasonalTemplates
          onApplyTemplate={applyTemplate}
          onClose={() => setShowAdaptiveTemplates(false)}
          currentLocation="New York" // This should be passed from parent component
        />
      )}
    </div>
  )
}

function SeasonalTemplatePreview({
  template,
  onApply,
}: {
  template: SeasonalTemplate
  onApply: () => void
}) {
  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${template.colorScheme.background}`}>
        <p className="text-white/80">{template.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Widgets */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Included Widgets ({template.widgets.length})
          </h4>
          <ScrollArea className="h-40">
            <div className="space-y-2">
              {template.widgets.map((widget, index) => (
                <div key={index} className="flex items-center justify-between bg-white/10 rounded p-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-white">{widget.title}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-white/70 text-xs">
                    {widget.size}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Seasonal Features
          </h4>
          <div className="space-y-2">
            {template.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-white/80 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div>
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Heart className="w-4 h-4 mr-2 text-red-400" />
          Health & Safety Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {template.healthTips.map((tip, index) => (
            <div key={index} className="bg-red-500/10 rounded p-2 border border-red-500/20">
              <span className="text-red-300/80 text-sm">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div>
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-blue-400" />
          Recommended Activities
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {template.activities.map((activity, index) => (
            <div key={index} className="bg-blue-500/10 rounded p-2 border border-blue-500/20">
              <span className="text-blue-300/80 text-sm">{activity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
          Seasonal Alerts
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {template.alerts.map((alert, index) => (
            <div key={index} className="bg-yellow-500/10 rounded p-2 border border-yellow-500/20">
              <span className="text-yellow-300/80 text-sm">{alert}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onApply}
        className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
      >
        <Check className="w-4 h-4 mr-2" />
        Apply {template.name} Template
      </Button>
    </div>
  )
}
