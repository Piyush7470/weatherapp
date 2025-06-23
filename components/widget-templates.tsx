"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Briefcase,
  Plane,
  Home,
  Activity,
  Camera,
  Gamepad2,
  Palette,
  Check,
  Star,
  Sparkles,
  Globe,
} from "lucide-react"
import { SeasonalTemplates } from "@/components/seasonal-templates"
import { AdaptiveSeasonalTemplates } from "@/components/adaptive-seasonal-templates"

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
  title: string
  location: string
  size: "small" | "medium" | "large"
  position: { x: number; y: number }
  settings: {
    showIcon?: boolean
    showDetails?: boolean
    theme?: "light" | "dark" | "auto"
    refreshInterval?: number
    units?: "metric" | "imperial"
    showBackground?: boolean
  }
}

interface WidgetTemplate {
  id: string
  name: string
  description: string
  category: "personal" | "professional" | "travel" | "sports" | "photography" | "minimal"
  icon: React.ComponentType<{ className?: string }>
  widgets: Omit<Widget, "id">[]
  preview: string[]
  features: string[]
  popularity: number
}

const widgetTemplates: WidgetTemplate[] = [
  {
    id: "essential-dashboard",
    name: "Essential Dashboard",
    description: "Perfect balance of current conditions, forecast, and key metrics for daily use",
    category: "personal",
    icon: Home,
    popularity: 95,
    features: ["Current weather", "7-day forecast", "Temperature trends", "UV index", "Wind & humidity"],
    preview: ["Current Weather (Large)", "Forecast (Large)", "Temperature Chart (Medium)", "UV Index (Small)"],
    widgets: [
      {
        type: "current-weather",
        title: "Current Weather",
        location: "New York",
        size: "large",
        position: { x: 0, y: 0 },
        settings: {
          showIcon: true,
          showDetails: true,
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "forecast",
        title: "7-Day Forecast",
        location: "New York",
        size: "large",
        position: { x: 3, y: 0 },
        settings: {
          showIcon: true,
          showDetails: false,
          theme: "auto",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "temperature-chart",
        title: "Temperature Trend",
        location: "New York",
        size: "medium",
        position: { x: 0, y: 2 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "uv-index",
        title: "UV Index",
        location: "New York",
        size: "small",
        position: { x: 2, y: 2 },
        settings: {
          theme: "auto",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "wind-compass",
        title: "Wind Info",
        location: "New York",
        size: "small",
        position: { x: 3, y: 2 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "humidity-gauge",
        title: "Humidity",
        location: "New York",
        size: "small",
        position: { x: 4, y: 2 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
    ],
  },
  {
    id: "professional-overview",
    name: "Professional Overview",
    description: "Clean, business-focused layout with essential weather data and alerts",
    category: "professional",
    icon: Briefcase,
    popularity: 87,
    features: ["Current conditions", "Business hours forecast", "Weather alerts", "Air quality", "Minimal design"],
    preview: ["Current Weather (Medium)", "Forecast (Medium)", "Alerts (Medium)", "Air Quality (Small)"],
    widgets: [
      {
        type: "current-weather",
        title: "Current Conditions",
        location: "New York",
        size: "medium",
        position: { x: 0, y: 0 },
        settings: {
          showIcon: true,
          showDetails: true,
          theme: "light",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "forecast",
        title: "Business Week Forecast",
        location: "New York",
        size: "medium",
        position: { x: 2, y: 0 },
        settings: {
          showIcon: true,
          showDetails: false,
          theme: "light",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "alerts-summary",
        title: "Weather Alerts",
        location: "New York",
        size: "medium",
        position: { x: 4, y: 0 },
        settings: {
          theme: "light",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "air-quality",
        title: "Air Quality",
        location: "New York",
        size: "small",
        position: { x: 0, y: 1 },
        settings: {
          theme: "light",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "uv-index",
        title: "UV Index",
        location: "New York",
        size: "small",
        position: { x: 1, y: 1 },
        settings: {
          theme: "light",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "sunrise-sunset",
        title: "Daylight Hours",
        location: "New York",
        size: "small",
        position: { x: 2, y: 1 },
        settings: {
          theme: "light",
          refreshInterval: 1800,
          units: "metric",
          showBackground: true,
        },
      },
    ],
  },
  {
    id: "travel-companion",
    name: "Travel Companion",
    description: "Multi-location weather tracking perfect for travelers and trip planning",
    category: "travel",
    icon: Plane,
    popularity: 78,
    features: ["Multiple locations", "Weather maps", "Travel alerts", "Sunrise/sunset times", "Comprehensive forecast"],
    preview: ["Weather Map (Large)", "Multi-location Forecast", "Travel Alerts", "Sun Times"],
    widgets: [
      {
        type: "weather-map-mini",
        title: "Travel Weather Map",
        location: "Global",
        size: "large",
        position: { x: 0, y: 0 },
        settings: {
          theme: "auto",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "current-weather",
        title: "Destination Weather",
        location: "Paris",
        size: "medium",
        position: { x: 3, y: 0 },
        settings: {
          showIcon: true,
          showDetails: true,
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "current-weather",
        title: "Home Weather",
        location: "New York",
        size: "medium",
        position: { x: 5, y: 0 },
        settings: {
          showIcon: true,
          showDetails: true,
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "forecast",
        title: "Travel Forecast",
        location: "Paris",
        size: "large",
        position: { x: 0, y: 2 },
        settings: {
          showIcon: true,
          showDetails: false,
          theme: "auto",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "alerts-summary",
        title: "Travel Alerts",
        location: "Paris",
        size: "medium",
        position: { x: 3, y: 2 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "sunrise-sunset",
        title: "Local Sun Times",
        location: "Paris",
        size: "small",
        position: { x: 5, y: 2 },
        settings: {
          theme: "auto",
          refreshInterval: 1800,
          units: "metric",
          showBackground: true,
        },
      },
    ],
  },
  {
    id: "sports-outdoor",
    name: "Sports & Outdoor",
    description: "Comprehensive weather data for outdoor activities and sports enthusiasts",
    category: "sports",
    icon: Activity,
    popularity: 82,
    features: ["Wind conditions", "UV protection", "Humidity levels", "Temperature trends", "Weather alerts"],
    preview: ["Wind Compass (Large)", "UV Index (Medium)", "Temperature Chart", "Humidity Gauge"],
    widgets: [
      {
        type: "current-weather",
        title: "Outdoor Conditions",
        location: "New York",
        size: "medium",
        position: { x: 0, y: 0 },
        settings: {
          showIcon: true,
          showDetails: true,
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "wind-compass",
        title: "Wind Conditions",
        location: "New York",
        size: "medium",
        position: { x: 2, y: 0 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "uv-index",
        title: "UV Protection",
        location: "New York",
        size: "medium",
        position: { x: 4, y: 0 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "temperature-chart",
        title: "Temperature Trends",
        location: "New York",
        size: "large",
        position: { x: 0, y: 1 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "humidity-gauge",
        title: "Humidity Levels",
        location: "New York",
        size: "small",
        position: { x: 3, y: 1 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "air-quality",
        title: "Air Quality",
        location: "New York",
        size: "small",
        position: { x: 4, y: 1 },
        settings: {
          theme: "auto",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "alerts-summary",
        title: "Weather Warnings",
        location: "New York",
        size: "small",
        position: { x: 5, y: 1 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
    ],
  },
  {
    id: "photography-light",
    name: "Photography & Light",
    description: "Specialized layout for photographers tracking lighting conditions and weather",
    category: "photography",
    icon: Camera,
    popularity: 65,
    features: ["Golden hour times", "UV index", "Cloud coverage", "Visibility", "Light quality metrics"],
    preview: ["Sunrise/Sunset (Large)", "UV Index", "Current Weather", "Visibility"],
    widgets: [
      {
        type: "sunrise-sunset",
        title: "Golden Hour Times",
        location: "New York",
        size: "large",
        position: { x: 0, y: 0 },
        settings: {
          theme: "auto",
          refreshInterval: 1800,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "current-weather",
        title: "Lighting Conditions",
        location: "New York",
        size: "medium",
        position: { x: 3, y: 0 },
        settings: {
          showIcon: true,
          showDetails: true,
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "uv-index",
        title: "Light Intensity",
        location: "New York",
        size: "small",
        position: { x: 5, y: 0 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "forecast",
        title: "Shooting Forecast",
        location: "New York",
        size: "large",
        position: { x: 0, y: 2 },
        settings: {
          showIcon: true,
          showDetails: false,
          theme: "auto",
          refreshInterval: 600,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "wind-compass",
        title: "Wind Conditions",
        location: "New York",
        size: "small",
        position: { x: 3, y: 2 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
      {
        type: "humidity-gauge",
        title: "Humidity",
        location: "New York",
        size: "small",
        position: { x: 4, y: 2 },
        settings: {
          theme: "auto",
          refreshInterval: 300,
          units: "metric",
          showBackground: true,
        },
      },
    ],
  },
  {
    id: "minimal-clean",
    name: "Minimal & Clean",
    description: "Simple, elegant layout focusing on essential weather information only",
    category: "minimal",
    icon: Palette,
    popularity: 91,
    features: ["Clean design", "Essential data only", "Large readable text", "Minimal distractions"],
    preview: ["Current Weather (Large)", "Simple Forecast", "Key Metrics"],
    widgets: [
      {
        type: "current-weather",
        title: "Today's Weather",
        location: "New York",
        size: "large",
        position: { x: 0, y: 0 },
        settings: {
          showIcon: true,
          showDetails: false,
          theme: "light",
          refreshInterval: 300,
          units: "metric",
          showBackground: false,
        },
      },
      {
        type: "forecast",
        title: "This Week",
        location: "New York",
        size: "large",
        position: { x: 3, y: 0 },
        settings: {
          showIcon: true,
          showDetails: false,
          theme: "light",
          refreshInterval: 600,
          units: "metric",
          showBackground: false,
        },
      },
      {
        type: "temperature-chart",
        title: "Temperature",
        location: "New York",
        size: "medium",
        position: { x: 0, y: 2 },
        settings: {
          theme: "light",
          refreshInterval: 600,
          units: "metric",
          showBackground: false,
        },
      },
      {
        type: "uv-index",
        title: "UV",
        location: "New York",
        size: "small",
        position: { x: 2, y: 2 },
        settings: {
          theme: "light",
          refreshInterval: 600,
          units: "metric",
          showBackground: false,
        },
      },
    ],
  },
]

interface WidgetTemplatesProps {
  onApplyTemplate: (widgets: Widget[]) => void
  onClose: () => void
}

export function WidgetTemplates({ onApplyTemplate, onClose }: WidgetTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<WidgetTemplate | null>(null)
  const { toast } = useToast()
  const [showSeasonalTemplates, setShowSeasonalTemplates] = useState(false)
  const [showAdaptiveTemplates, setShowAdaptiveTemplates] = useState(false)

  const categories = [
    { id: "all", name: "All Templates", icon: Star },
    { id: "personal", name: "Personal", icon: User },
    { id: "professional", name: "Professional", icon: Briefcase },
    { id: "travel", name: "Travel", icon: Plane },
    { id: "sports", name: "Sports & Outdoor", icon: Activity },
    { id: "photography", name: "Photography", icon: Camera },
    { id: "minimal", name: "Minimal", icon: Palette },
  ]

  const filteredTemplates =
    selectedCategory === "all"
      ? widgetTemplates
      : widgetTemplates.filter((template) => template.category === selectedCategory)

  const applyTemplate = (template: WidgetTemplate) => {
    const widgets: Widget[] = template.widgets.map((widget, index) => ({
      ...widget,
      id: `${Date.now()}-${index}`,
    }))

    onApplyTemplate(widgets)
    onClose()

    toast({
      title: "Template Applied!",
      description: `${template.name} has been applied to your dashboard with ${widgets.length} widgets.`,
    })
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.icon || Star
  }

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return "bg-green-500/20 text-green-300"
    if (popularity >= 80) return "bg-blue-500/20 text-blue-300"
    if (popularity >= 70) return "bg-yellow-500/20 text-yellow-300"
    return "bg-gray-500/20 text-gray-300"
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg w-full max-w-7xl h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Widget Layout Templates</h2>
            <p className="text-white/70">Choose from professionally designed layouts for quick setup</p>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Close
          </Button>
          <Button
            onClick={() => setShowAdaptiveTemplates(true)}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Globe className="w-4 h-4 mr-2" />
            Climate Adaptive
          </Button>
          <Button
            onClick={() => setShowSeasonalTemplates(true)}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Seasonal
          </Button>
        </div>

        <div className="flex h-full">
          {/* Category Sidebar */}
          <div className="w-64 border-r border-white/20 p-4">
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = template.icon
                const CategoryIcon = getCategoryIcon(template.category)
                return (
                  <Card
                    key={template.id}
                    className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <CategoryIcon className="w-3 h-3 text-white/50" />
                              <span className="text-white/50 text-xs capitalize">{template.category}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getPopularityColor(template.popularity)}>{template.popularity}% ★</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-white/70 text-sm">{template.description}</p>

                      {/* Preview */}
                      <div className="bg-white/5 rounded-lg p-3">
                        <h4 className="text-white text-xs font-semibold mb-2">Layout Preview:</h4>
                        <div className="grid grid-cols-3 gap-1">
                          {template.preview.slice(0, 6).map((widget, index) => (
                            <div
                              key={index}
                              className="bg-white/10 rounded text-white/60 text-xs p-1 text-center"
                              style={{ fontSize: "10px" }}
                            >
                              {widget}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="text-white text-xs font-semibold mb-2">Features:</h4>
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
                          <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <Icon className="w-5 h-5" />
                                <span>{template.name}</span>
                              </DialogTitle>
                            </DialogHeader>
                            {selectedTemplate && (
                              <div className="space-y-4">
                                <p className="text-white/70">{selectedTemplate.description}</p>

                                <div>
                                  <h4 className="text-white font-semibold mb-2">
                                    Included Widgets ({selectedTemplate.widgets.length}):
                                  </h4>
                                  <ScrollArea className="h-40">
                                    <div className="space-y-2">
                                      {selectedTemplate.widgets.map((widget, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between bg-white/10 rounded p-2"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            <span className="text-sm text-white">{widget.title}</span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Badge variant="secondary" className="bg-white/10 text-white/70 text-xs">
                                              {widget.size}
                                            </Badge>
                                            <span className="text-white/50 text-xs">{widget.location}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                </div>

                                <div>
                                  <h4 className="text-white font-semibold mb-2">All Features:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedTemplate.features.map((feature, index) => (
                                      <Badge key={index} variant="secondary" className="bg-white/10 text-white/70">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <Button
                                  onClick={() => applyTemplate(selectedTemplate)}
                                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Apply This Template
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={() => applyTemplate(template)}
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

            {filteredTemplates.length === 0 && (
              <div className="text-center py-20">
                <div className="text-white/50 mb-4">
                  <Gamepad2 className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No templates found</h3>
                  <p>Try selecting a different category</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showSeasonalTemplates && (
        <SeasonalTemplates onApplyTemplate={applyTemplate} onClose={() => setShowSeasonalTemplates(false)} />
      )}
      {showAdaptiveTemplates && (
        <AdaptiveSeasonalTemplates
          onApplyTemplate={applyTemplate}
          onClose={() => setShowAdaptiveTemplates(false)}
          currentLocation="New York" // This should be passed from parent
        />
      )}
    </div>
  )
}
