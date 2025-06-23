"use client"
import { Settings } from "lucide-react" // Import Settings icon

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useClimateZone, getSeasonalRecommendations } from "@/components/climate-zones"
import {
  Globe,
  MapPin,
  Thermometer,
  Droplets,
  Sun,
  Snowflake,
  Flower,
  Leaf,
  Calendar,
  AlertTriangle,
  Check,
  Star,
  Sparkles,
  RefreshCw,
  Info,
  Zap,
  Cloud,
} from "lucide-react"

interface Widget {
  id: string
  type: string
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
    climateAdapted?: boolean
  }
}

interface AdaptiveSeasonalTemplate {
  id: string
  name: string
  description: string
  climateZones: string[]
  seasons: string[]
  widgets: Omit<Widget, "id">[]
  adaptations: {
    [climateZone: string]: {
      modifications: string[]
      additionalWidgets: Omit<Widget, "id">[]
      removedWidgets: string[]
      colorScheme?: {
        primary: string
        secondary: string
        accent: string
      }
    }
  }
}

const adaptiveTemplates: AdaptiveSeasonalTemplate[] = [
  {
    id: "universal-seasonal",
    name: "Universal Seasonal Dashboard",
    description: "Automatically adapts to your local climate and seasonal patterns",
    climateZones: ["all"],
    seasons: ["all"],
    widgets: [
      {
        type: "current-weather",
        title: "Current Conditions",
        location: "Auto",
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
          climateAdapted: true,
        },
      },
      {
        type: "forecast",
        title: "Seasonal Forecast",
        location: "Auto",
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
          climateAdapted: true,
        },
      },
    ],
    adaptations: {
      "tropical-wet": {
        modifications: ["Focus on humidity and rainfall", "Emphasize wet/dry seasons", "Add flood monitoring"],
        additionalWidgets: [
          {
            type: "humidity-gauge",
            title: "Humidity Monitor",
            location: "Auto",
            size: "medium",
            position: { x: 0, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
          {
            type: "flood-alerts",
            title: "Flood Monitoring",
            location: "Auto",
            size: "medium",
            position: { x: 2, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
        ],
        removedWidgets: ["snow-depth", "wind-chill"],
        colorScheme: {
          primary: "from-green-400 to-blue-600",
          secondary: "from-teal-300 to-green-500",
          accent: "text-teal-400",
        },
      },
      "desert-hot": {
        modifications: ["Extreme heat focus", "UV protection priority", "Water conservation alerts"],
        additionalWidgets: [
          {
            type: "heat-index",
            title: "Heat Danger",
            location: "Auto",
            size: "medium",
            position: { x: 0, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
          {
            type: "uv-index",
            title: "UV Protection",
            location: "Auto",
            size: "small",
            position: { x: 2, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
          {
            type: "dust-storm-tracker",
            title: "Dust Storms",
            location: "Auto",
            size: "small",
            position: { x: 3, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
        ],
        removedWidgets: ["humidity-gauge", "snow-depth", "ice-warning"],
        colorScheme: {
          primary: "from-yellow-400 to-red-600",
          secondary: "from-orange-300 to-yellow-500",
          accent: "text-orange-400",
        },
      },
      "polar-tundra": {
        modifications: ["Extreme cold focus", "Daylight tracking", "Aurora monitoring"],
        additionalWidgets: [
          {
            type: "wind-chill",
            title: "Wind Chill",
            location: "Auto",
            size: "medium",
            position: { x: 0, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
          {
            type: "daylight-tracker",
            title: "Daylight Hours",
            location: "Auto",
            size: "medium",
            position: { x: 2, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
          {
            type: "aurora-forecast",
            title: "Aurora Activity",
            location: "Auto",
            size: "small",
            position: { x: 4, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
        ],
        removedWidgets: ["heat-index", "uv-index"],
        colorScheme: {
          primary: "from-blue-300 to-indigo-700",
          secondary: "from-cyan-200 to-blue-400",
          accent: "text-cyan-300",
        },
      },
      monsoon: {
        modifications: ["Monsoon tracking", "Flood alerts", "Agricultural weather"],
        additionalWidgets: [
          {
            type: "monsoon-tracker",
            title: "Monsoon Progress",
            location: "Auto",
            size: "large",
            position: { x: 0, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
          {
            type: "agricultural-weather",
            title: "Crop Conditions",
            location: "Auto",
            size: "medium",
            position: { x: 3, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
        ],
        removedWidgets: ["snow-depth", "ice-warning"],
        colorScheme: {
          primary: "from-blue-400 to-green-600",
          secondary: "from-teal-300 to-blue-500",
          accent: "text-blue-400",
        },
      },
      mediterranean: {
        modifications: ["Fire risk monitoring", "Drought tracking", "Mild winter focus"],
        additionalWidgets: [
          {
            type: "fire-risk",
            title: "Fire Danger",
            location: "Auto",
            size: "medium",
            position: { x: 0, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
          {
            type: "drought-monitor",
            title: "Drought Status",
            location: "Auto",
            size: "medium",
            position: { x: 2, y: 2 },
            settings: { theme: "seasonal", climateAdapted: true, seasonalMode: true },
          },
        ],
        removedWidgets: ["snow-depth", "wind-chill"],
        colorScheme: {
          primary: "from-yellow-300 to-red-500",
          secondary: "from-orange-200 to-yellow-400",
          accent: "text-yellow-500",
        },
      },
    },
  },
]

interface AdaptiveSeasonalTemplatesProps {
  onApplyTemplate: (widgets: Widget[]) => void
  onClose: () => void
  currentLocation: string
}

export function AdaptiveSeasonalTemplates({
  onApplyTemplate,
  onClose,
  currentLocation,
}: AdaptiveSeasonalTemplatesProps) {
  const { climateData, climateZone, currentSeason, isLoading } = useClimateZone(currentLocation)
  const [selectedTemplate, setSelectedTemplate] = useState<AdaptiveSeasonalTemplate | null>(null)
  const [recommendations, setRecommendations] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (climateZone && climateData && currentSeason) {
      const recs = getSeasonalRecommendations(climateZone, currentSeason, climateData)
      setRecommendations(recs)
    }
  }, [climateZone, climateData, currentSeason])

  const applyAdaptiveTemplate = (template: AdaptiveSeasonalTemplate) => {
    if (!climateData || !climateZone) return

    let widgets = [...template.widgets]
    const adaptation = template.adaptations[climateData.climateZone]

    if (adaptation) {
      // Remove widgets not suitable for this climate
      widgets = widgets.filter((widget) => !adaptation.removedWidgets.includes(widget.type))

      // Add climate-specific widgets
      widgets = [...widgets, ...adaptation.additionalWidgets]
    }

    // Apply location and climate-specific settings
    const finalWidgets: Widget[] = widgets.map((widget, index) => ({
      ...widget,
      id: `${Date.now()}-${index}`,
      location: widget.location === "Auto" ? currentLocation : widget.location,
      settings: {
        ...widget.settings,
        climateAdapted: true,
        seasonalMode: true,
      },
    }))

    onApplyTemplate(finalWidgets)
    onClose()

    toast({
      title: "Climate-Adapted Template Applied!",
      description: `Dashboard optimized for ${climateZone.name} climate in ${currentLocation}`,
    })
  }

  const getClimateIcon = (climatePattern: string) => {
    switch (climatePattern) {
      case "tropical":
        return <Droplets className="w-5 h-5 text-green-400" />
      case "desert":
        return <Sun className="w-5 h-5 text-yellow-400" />
      case "polar":
        return <Snowflake className="w-5 h-5 text-blue-400" />
      case "monsoon":
        return <Cloud className="w-5 h-5 text-blue-500" />
      case "mediterranean":
        return <Flower className="w-5 h-5 text-purple-400" />
      default:
        return <Thermometer className="w-5 h-5 text-gray-400" />
    }
  }

  const getSeasonIcon = (season: string) => {
    if (season.includes("spring")) return <Flower className="w-4 h-4" />
    if (season.includes("summer") || season.includes("hot")) return <Sun className="w-4 h-4" />
    if (season.includes("autumn") || season.includes("fall")) return <Leaf className="w-4 h-4" />
    if (season.includes("winter") || season.includes("cold")) return <Snowflake className="w-4 h-4" />
    if (season.includes("wet") || season.includes("monsoon")) return <Droplets className="w-4 h-4" />
    if (season.includes("dry")) return <Sun className="w-4 h-4" />
    return <Calendar className="w-4 h-4" />
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 text-white animate-spin" />
            <span className="text-white">Analyzing climate for {currentLocation}...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg w-full max-w-7xl h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Globe className="w-6 h-6 mr-2" />
              Climate-Adaptive Templates
            </h2>
            <p className="text-white/70">Templates that automatically adapt to your local climate and geography</p>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Close
          </Button>
        </div>

        <div className="flex h-full">
          {/* Climate Info Sidebar */}
          <div className="w-80 border-r border-white/20 p-4 overflow-auto">
            <div className="space-y-6">
              {/* Current Location Climate */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {currentLocation}
                </h3>

                {climateZone && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Climate Zone</span>
                      <div className="flex items-center space-x-2">
                        {getClimateIcon(climateZone.seasonalPattern)}
                        <span className="text-white text-sm">{climateZone.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Current Season</span>
                      <div className="flex items-center space-x-2">
                        {getSeasonIcon(currentSeason)}
                        <span className="text-white text-sm capitalize">{currentSeason.replace("-", " ")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Hemisphere</span>
                      <span className="text-white text-sm capitalize">{climateData?.hemisphere}</span>
                    </div>

                    {climateData?.coastalInfluence && (
                      <Badge className="bg-blue-500/20 text-blue-300">Coastal Influence</Badge>
                    )}

                    {climateData?.urbanHeatIsland && (
                      <Badge className="bg-red-500/20 text-red-300">Urban Heat Island</Badge>
                    )}

                    {climateData?.elevation && climateData.elevation > 1000 && (
                      <Badge className="bg-purple-500/20 text-purple-300">High Elevation</Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Climate Characteristics */}
              {climateZone && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Climate Characteristics</h4>
                  <div className="space-y-2">
                    {climateZone.characteristics.map((char, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-white/80 text-sm">{char}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Season Info */}
              {climateZone && currentSeason && climateZone.seasons[currentSeason] && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Current Season Details</h4>
                  <div className="space-y-2">
                    {climateZone.seasons[currentSeason].characteristics.map((char, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white/80 text-sm">{char}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Smart Recommendations
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-white/70 text-xs">Recommended Widgets</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {recommendations.widgets.slice(0, 4).map((widget: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                            {widget.replace("-", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {recommendations.alerts.length > 0 && (
                      <div>
                        <span className="text-white/70 text-xs">Priority Alerts</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recommendations.alerts.slice(0, 2).map((alert: string, index: number) => (
                            <Badge key={index} variant="secondary" className="bg-yellow-500/20 text-yellow-300 text-xs">
                              {alert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Templates */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="mb-6">
              <h3 className="text-white text-lg font-semibold mb-2">
                Climate-Adaptive Templates for {climateZone?.name}
              </h3>
              <p className="text-white/70 text-sm">
                These templates automatically adapt to your local climate patterns and seasonal characteristics
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {adaptiveTemplates.map((template) => {
                const adaptation = climateData ? template.adaptations[climateData.climateZone] : null
                return (
                  <Card
                    key={template.id}
                    className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-white/10 rounded-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              {climateZone && getClimateIcon(climateZone.seasonalPattern)}
                              <span className="text-white/50 text-xs">Optimized for {climateZone?.name}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-300">Adaptive</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-white/70 text-sm">{template.description}</p>

                      {/* Climate Adaptations */}
                      {adaptation && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <h4 className="text-white text-xs font-semibold mb-2 flex items-center">
                            <Settings className="w-3 h-3 mr-1" />
                            Climate Adaptations:
                          </h4>
                          <div className="space-y-1">
                            {adaptation.modifications.slice(0, 3).map((mod, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Check className="w-3 h-3 text-green-400" />
                                <span className="text-white/70 text-xs">{mod}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Widget Count */}
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">Widgets</span>
                        <Badge variant="secondary" className="bg-white/10 text-white/70">
                          {template.widgets.length + (adaptation?.additionalWidgets.length || 0)} total
                        </Badge>
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
                              <Info className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-4xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <Sparkles className="w-5 h-5" />
                                <span>{template.name}</span>
                              </DialogTitle>
                            </DialogHeader>
                            {selectedTemplate && (
                              <AdaptiveTemplatePreview
                                template={selectedTemplate}
                                climateData={climateData}
                                climateZone={climateZone}
                                currentSeason={currentSeason}
                                onApply={() => applyAdaptiveTemplate(selectedTemplate)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={() => applyAdaptiveTemplate(template)}
                          size="sm"
                          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
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
          </div>
        </div>
      </div>
    </div>
  )
}

function AdaptiveTemplatePreview({
  template,
  climateData,
  climateZone,
  currentSeason,
  onApply,
}: {
  template: AdaptiveSeasonalTemplate
  climateData: any
  climateZone: any
  currentSeason: string
  onApply: () => void
}) {
  const adaptation = climateData ? template.adaptations[climateData.climateZone] : null

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-lg p-4">
        <p className="text-white/80">{template.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Base Widgets */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Base Widgets ({template.widgets.length})
          </h4>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {template.widgets.map((widget, index) => (
                <div key={index} className="flex items-center justify-between bg-white/10 rounded p-2">
                  <span className="text-sm text-white">{widget.title}</span>
                  <Badge variant="secondary" className="bg-white/10 text-white/70 text-xs">
                    {widget.size}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Climate Adaptations */}
        {adaptation && (
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Climate Adaptations
            </h4>
            <div className="space-y-3">
              {adaptation.additionalWidgets.length > 0 && (
                <div>
                  <span className="text-green-400 text-sm font-medium">Added Widgets:</span>
                  <div className="space-y-1 mt-1">
                    {adaptation.additionalWidgets.map((widget, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-3 h-3 text-green-400" />
                        <span className="text-white/80 text-sm">{widget.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adaptation.removedWidgets.length > 0 && (
                <div>
                  <span className="text-red-400 text-sm font-medium">Removed Widgets:</span>
                  <div className="space-y-1 mt-1">
                    {adaptation.removedWidgets.map((widget, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span className="text-white/80 text-sm">{widget.replace("-", " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-blue-400 text-sm font-medium">Modifications:</span>
                <div className="space-y-1 mt-1">
                  {adaptation.modifications.map((mod, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Info className="w-3 h-3 text-blue-400" />
                      <span className="text-white/80 text-sm">{mod}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Climate Zone Info */}
      {climateZone && (
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Optimized for {climateZone.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-white/70 text-sm">Current Season:</span>
              <p className="text-white font-medium capitalize">{currentSeason.replace("-", " ")}</p>
            </div>
            <div>
              <span className="text-white/70 text-sm">Climate Pattern:</span>
              <p className="text-white font-medium capitalize">{climateZone.seasonalPattern}</p>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={onApply}
        className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
      >
        <Check className="w-4 h-4 mr-2" />
        Apply Climate-Adaptive Template
      </Button>
    </div>
  )
}
