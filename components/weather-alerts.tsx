"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Bell, X, Cloud, Wind, Droplets } from "lucide-react"

interface WeatherAlert {
  id: string
  type: "warning" | "watch" | "advisory"
  severity: "low" | "medium" | "high"
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  icon: "storm" | "wind" | "rain" | "snow"
}

export function WeatherAlerts() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])

  useEffect(() => {
    // Mock weather alerts
    const mockAlerts: WeatherAlert[] = [
      {
        id: "1",
        type: "warning",
        severity: "high",
        title: "Severe Thunderstorm Warning",
        description:
          "Severe thunderstorms with damaging winds, large hail, and heavy rain are expected. Take shelter immediately.",
        location: "New York, NY",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        icon: "storm",
      },
      {
        id: "2",
        type: "watch",
        severity: "medium",
        title: "High Wind Advisory",
        description: "Sustained winds of 25-35 mph with gusts up to 50 mph are expected.",
        location: "Los Angeles, CA",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        icon: "wind",
      },
      {
        id: "3",
        type: "advisory",
        severity: "low",
        title: "Flood Advisory",
        description: "Minor flooding in low-lying areas and poor drainage locations is possible.",
        location: "Miami, FL",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        icon: "rain",
      },
    ]

    setAlerts(mockAlerts)
  }, [])

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-red-500/20 text-red-300"
      case "watch":
        return "bg-yellow-500/20 text-yellow-300"
      case "advisory":
        return "bg-blue-500/20 text-blue-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getAlertIcon = (icon: string) => {
    switch (icon) {
      case "storm":
        return <Cloud className="w-5 h-5" />
      case "wind":
        return <Wind className="w-5 h-5" />
      case "rain":
        return <Droplets className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Weather Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/70">No active weather alerts</p>
              <p className="text-white/50 text-sm">We'll notify you when severe weather is expected</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-current">{getAlertIcon(alert.icon)}</div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-current">{alert.title}</h3>
                          <Badge className={getTypeColor(alert.type)}>{alert.type.toUpperCase()}</Badge>
                        </div>
                        <p className="text-white/70 text-sm">{alert.location}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                      className="text-white/70 hover:text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-white/80 mb-3">{alert.description}</p>

                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>Starts: {new Date(alert.startTime).toLocaleString()}</span>
                    <span>Ends: {new Date(alert.endTime).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Settings */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Severe Weather Alerts</h4>
                <p className="text-white/70 text-sm">Get notified about dangerous weather conditions</p>
              </div>
              <Button className="bg-white/20 hover:bg-white/30">Enabled</Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Daily Weather Summary</h4>
                <p className="text-white/70 text-sm">Receive daily weather updates for your locations</p>
              </div>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Disabled
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Rain Alerts</h4>
                <p className="text-white/70 text-sm">Get notified when rain is expected</p>
              </div>
              <Button className="bg-white/20 hover:bg-white/30">Enabled</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
