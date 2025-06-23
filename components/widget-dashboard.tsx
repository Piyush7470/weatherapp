"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { WidgetTemplates } from "@/components/widget-templates"
import {
  Plus,
  Settings,
  Trash2,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Eye,
  Calendar,
  TrendingUp,
  MapPin,
  Clock,
  Zap,
  Star,
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

interface WidgetDashboardProps {
  onClose: () => void
}

export function WidgetDashboard({ onClose }: WidgetDashboardProps) {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null)
  const [isAddingWidget, setIsAddingWidget] = useState(false)
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const { toast } = useToast()
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => {
    // Load widgets from localStorage
    const savedWidgets = localStorage.getItem("weather-widgets")
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets))
    } else {
      // Add default widgets
      const defaultWidgets: Widget[] = [
        {
          id: "1",
          type: "current-weather",
          title: "Current Weather",
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
          id: "2",
          type: "forecast",
          title: "5-Day Forecast",
          location: "New York",
          size: "large",
          position: { x: 1, y: 0 },
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
          id: "3",
          type: "temperature-chart",
          title: "Temperature Trend",
          location: "New York",
          size: "medium",
          position: { x: 0, y: 1 },
          settings: {
            theme: "auto",
            refreshInterval: 300,
            units: "metric",
            showBackground: true,
          },
        },
      ]
      setWidgets(defaultWidgets)
      localStorage.setItem("weather-widgets", JSON.stringify(defaultWidgets))
    }
  }, [])

  const saveWidgets = (updatedWidgets: Widget[]) => {
    setWidgets(updatedWidgets)
    localStorage.setItem("weather-widgets", JSON.stringify(updatedWidgets))
  }

  const applyTemplate = (templateWidgets: Widget[]) => {
    saveWidgets(templateWidgets)
    toast({
      title: "Template applied",
      description: "Your dashboard has been updated with the new template.",
    })
  }

  const addWidget = (type: Widget["type"]) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: getWidgetTitle(type),
      location: "New York",
      size: "medium",
      position: { x: 0, y: widgets.length },
      settings: {
        showIcon: true,
        showDetails: true,
        theme: "auto",
        refreshInterval: 300,
        units: "metric",
        showBackground: true,
      },
    }

    const updatedWidgets = [...widgets, newWidget]
    saveWidgets(updatedWidgets)
    setIsAddingWidget(false)

    toast({
      title: "Widget added",
      description: `${getWidgetTitle(type)} widget has been added to your dashboard.`,
    })
  }

  const removeWidget = (id: string) => {
    const updatedWidgets = widgets.filter((w) => w.id !== id)
    saveWidgets(updatedWidgets)

    toast({
      title: "Widget removed",
      description: "Widget has been removed from your dashboard.",
    })
  }

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    const updatedWidgets = widgets.map((w) => (w.id === id ? { ...w, ...updates } : w))
    saveWidgets(updatedWidgets)
  }

  const getWidgetTitle = (type: Widget["type"]) => {
    const titles = {
      "current-weather": "Current Weather",
      forecast: "Weather Forecast",
      "temperature-chart": "Temperature Chart",
      "humidity-gauge": "Humidity Gauge",
      "wind-compass": "Wind Compass",
      "uv-index": "UV Index",
      "air-quality": "Air Quality",
      "sunrise-sunset": "Sunrise & Sunset",
      "weather-map-mini": "Weather Map",
      "alerts-summary": "Weather Alerts",
    }
    return titles[type]
  }

  const getWidgetIcon = (type: Widget["type"]) => {
    const icons = {
      "current-weather": Sun,
      forecast: Calendar,
      "temperature-chart": TrendingUp,
      "humidity-gauge": Droplets,
      "wind-compass": Wind,
      "uv-index": Zap,
      "air-quality": Eye,
      "sunrise-sunset": Clock,
      "weather-map-mini": MapPin,
      "alerts-summary": Cloud,
    }
    return icons[type]
  }

  const getSizeClass = (size: Widget["size"]) => {
    switch (size) {
      case "small":
        return "col-span-1 row-span-1"
      case "medium":
        return "col-span-2 row-span-1"
      case "large":
        return "col-span-3 row-span-2"
      default:
        return "col-span-2 row-span-1"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg w-full max-w-7xl h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">Weather Widgets Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Dialog open={isAddingWidget} onOpenChange={setIsAddingWidget}>
              <DialogTrigger asChild>
                <Button className="bg-white/20 hover:bg-white/30 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Widget
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Widget</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  {[
                    "current-weather",
                    "forecast",
                    "temperature-chart",
                    "humidity-gauge",
                    "wind-compass",
                    "uv-index",
                    "air-quality",
                    "sunrise-sunset",
                    "weather-map-mini",
                    "alerts-summary",
                  ].map((type) => {
                    const Icon = getWidgetIcon(type as Widget["type"])
                    return (
                      <Button
                        key={type}
                        onClick={() => addWidget(type as Widget["type"])}
                        className="h-20 flex flex-col items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      >
                        <Icon className="w-6 h-6 mb-2" />
                        <span className="text-xs text-center">{getWidgetTitle(type as Widget["type"])}</span>
                      </Button>
                    )
                  })}
                </div>
              </DialogContent>
            </Dialog>
            <Button
              onClick={() => setShowTemplates(true)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Star className="w-4 h-4 mr-2" />
              Templates
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

        <div className="p-6 h-full overflow-auto">
          <div className="grid grid-cols-6 gap-4 auto-rows-min">
            {widgets.map((widget) => (
              <div key={widget.id} className={`${getSizeClass(widget.size)} relative group`}>
                <WidgetRenderer widget={widget} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white"
                        onClick={() => setSelectedWidget(widget)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-md">
                      <DialogHeader>
                        <DialogTitle>Widget Settings</DialogTitle>
                      </DialogHeader>
                      {selectedWidget && (
                        <WidgetSettings
                          widget={selectedWidget}
                          onUpdate={(updates) => updateWidget(selectedWidget.id, updates)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    onClick={() => removeWidget(widget.id)}
                    className="h-8 w-8 p-0 bg-red-500/20 hover:bg-red-500/30 text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {widgets.length === 0 && (
            <div className="text-center py-20">
              <div className="text-white/50 mb-4">
                <Plus className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No widgets added yet</h3>
                <p>Click "Add Widget" to start customizing your dashboard</p>
              </div>
            </div>
          )}
        </div>
        {showTemplates && <WidgetTemplates onApplyTemplate={applyTemplate} onClose={() => setShowTemplates(false)} />}
      </div>
    </div>
  )
}

function WidgetRenderer({ widget }: { widget: Widget }) {
  const mockWeatherData = {
    temperature: Math.round(Math.random() * 30 + 10),
    condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
    humidity: Math.round(Math.random() * 40 + 40),
    windSpeed: Math.round(Math.random() * 20 + 5),
    uvIndex: Math.round(Math.random() * 10),
    airQuality: Math.round(Math.random() * 100 + 50),
    sunrise: "06:30",
    sunset: "19:45",
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="w-8 h-8 text-yellow-500" />
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-400" />
      case "rainy":
        return <CloudRain className="w-8 h-8 text-blue-500" />
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />
    }
  }

  const renderWidget = () => {
    switch (widget.type) {
      case "current-weather":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {widget.location}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-white">{mockWeatherData.temperature}°C</div>
                  <div className="text-white/70 text-sm">{mockWeatherData.condition}</div>
                </div>
                {widget.settings.showIcon && getWeatherIcon(mockWeatherData.condition)}
              </div>
              {widget.settings.showDetails && (
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/70">
                  <div className="flex items-center">
                    <Droplets className="w-3 h-3 mr-1" />
                    {mockWeatherData.humidity}%
                  </div>
                  <div className="flex items-center">
                    <Wind className="w-3 h-3 mr-1" />
                    {mockWeatherData.windSpeed} km/h
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "forecast":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-white/70 text-xs mb-1">{day}</div>
                    <div className="mb-1">{getWeatherIcon("Sunny")}</div>
                    <div className="text-white text-xs">
                      <div className="font-semibold">{20 + index}°</div>
                      <div className="text-white/70">{10 + index}°</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "temperature-chart":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Temperature Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 flex items-end justify-between">
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-blue-400 w-4 rounded-t"
                    style={{ height: `${Math.random() * 60 + 20}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-white/70 mt-2">
                <span>Mon</span>
                <span>Sun</span>
              </div>
            </CardContent>
          </Card>
        )

      case "humidity-gauge":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Droplets className="w-4 h-4 mr-2" />
                Humidity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent"
                  style={{ transform: `rotate(${(mockWeatherData.humidity / 100) * 360}deg)` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{mockWeatherData.humidity}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "wind-compass":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Wind className="w-4 h-4 mr-2" />
                Wind
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-2">
                <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-white"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
              <div className="text-white text-sm font-semibold">{mockWeatherData.windSpeed} km/h</div>
              <div className="text-white/70 text-xs">NE</div>
            </CardContent>
          </Card>
        )

      case "uv-index":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                UV Index
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white mb-2">{mockWeatherData.uvIndex}</div>
              <Badge
                className={
                  mockWeatherData.uvIndex > 7
                    ? "bg-red-500/20 text-red-300"
                    : mockWeatherData.uvIndex > 4
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-green-500/20 text-green-300"
                }
              >
                {mockWeatherData.uvIndex > 7 ? "High" : mockWeatherData.uvIndex > 4 ? "Moderate" : "Low"}
              </Badge>
            </CardContent>
          </Card>
        )

      case "air-quality":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Air Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-white mb-2">{mockWeatherData.airQuality}</div>
              <Badge className="bg-green-500/20 text-green-300">Good</Badge>
            </CardContent>
          </Card>
        )

      case "sunrise-sunset":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Sun Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white/70">
                    <Sun className="w-4 h-4 mr-2 text-yellow-500" />
                    <span className="text-sm">Sunrise</span>
                  </div>
                  <span className="text-white font-semibold">{mockWeatherData.sunrise}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white/70">
                    <Sun className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="text-sm">Sunset</span>
                  </div>
                  <span className="text-white font-semibold">{mockWeatherData.sunset}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "weather-map-mini":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Weather Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-blue-200/20 to-blue-400/20 rounded h-20">
                <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute bottom-2 right-2 text-xs text-white/70">{widget.location}</div>
              </div>
            </CardContent>
          </Card>
        )

      case "alerts-summary":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Cloud className="w-4 h-4 mr-2" />
                Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Active Alerts</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300">2</Badge>
                </div>
                <div className="text-xs text-white/60">
                  <div>• High Wind Advisory</div>
                  <div>• Rain Expected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="flex items-center justify-center h-full">
              <span className="text-white/50">Unknown widget type</span>
            </CardContent>
          </Card>
        )
    }
  }

  return renderWidget()
}

function WidgetSettings({ widget, onUpdate }: { widget: Widget; onUpdate: (updates: Partial<Widget>) => void }) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-white/10">
        <TabsTrigger value="general" className="data-[state=active]:bg-white/20">
          General
        </TabsTrigger>
        <TabsTrigger value="appearance" className="data-[state=active]:bg-white/20">
          Appearance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">
            Widget Title
          </Label>
          <Input
            id="title"
            value={widget.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-white">
            Location
          </Label>
          <Input
            id="location"
            value={widget.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="size" className="text-white">
            Widget Size
          </Label>
          <Select value={widget.size} onValueChange={(value) => onUpdate({ size: value as Widget["size"] })}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="refresh" className="text-white">
            Refresh Interval (seconds)
          </Label>
          <Select
            value={widget.settings.refreshInterval?.toString()}
            onValueChange={(value) =>
              onUpdate({ settings: { ...widget.settings, refreshInterval: Number.parseInt(value) } })
            }
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">1 minute</SelectItem>
              <SelectItem value="300">5 minutes</SelectItem>
              <SelectItem value="600">10 minutes</SelectItem>
              <SelectItem value="1800">30 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="units" className="text-white">
            Units
          </Label>
          <Select
            value={widget.settings.units}
            onValueChange={(value) =>
              onUpdate({ settings: { ...widget.settings, units: value as "metric" | "imperial" } })
            }
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (°C, km/h)</SelectItem>
              <SelectItem value="imperial">Imperial (°F, mph)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="appearance" className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-icon" className="text-white">
            Show Weather Icon
          </Label>
          <Switch
            id="show-icon"
            checked={widget.settings.showIcon}
            onCheckedChange={(checked) => onUpdate({ settings: { ...widget.settings, showIcon: checked } })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-details" className="text-white">
            Show Details
          </Label>
          <Switch
            id="show-details"
            checked={widget.settings.showDetails}
            onCheckedChange={(checked) => onUpdate({ settings: { ...widget.settings, showDetails: checked } })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-background" className="text-white">
            Show Background
          </Label>
          <Switch
            id="show-background"
            checked={widget.settings.showBackground}
            onCheckedChange={(checked) => onUpdate({ settings: { ...widget.settings, showBackground: checked } })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme" className="text-white">
            Theme
          </Label>
          <Select
            value={widget.settings.theme}
            onValueChange={(value) =>
              onUpdate({ settings: { ...widget.settings, theme: value as "light" | "dark" | "auto" } })
            }
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
    </Tabs>
  )
}
