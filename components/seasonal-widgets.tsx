"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Flower,
  Sun,
  Snowflake,
  Wind,
  Cloud,
  Heart,
  Activity,
  Shield,
  AlertTriangle,
  Flame,
  CloudSnow,
} from "lucide-react"

interface SeasonalWidgetProps {
  widget: {
    type: string
    title: string
    location: string
    settings: {
      seasonalMode?: boolean
      theme?: string
    }
  }
}

export function SeasonalWidgetRenderer({ widget }: SeasonalWidgetProps) {
  // Mock seasonal data
  const mockSeasonalData = {
    pollenIndex: Math.round(Math.random() * 10),
    heatIndex: Math.round(Math.random() * 40 + 25),
    windChill: Math.round(Math.random() * 20 - 10),
    snowDepth: Math.round(Math.random() * 50),
    fireRisk: Math.round(Math.random() * 5),
    iceWarning: Math.random() > 0.7,
    stormIntensity: Math.round(Math.random() * 5),
    seasonalHealth: {
      allergyRisk: Math.round(Math.random() * 5),
      heatStress: Math.round(Math.random() * 5),
      coldExposure: Math.round(Math.random() * 5),
    },
    activities: ["Perfect for hiking", "Great beach weather", "Ideal for leaf peeping", "Good skiing conditions"],
  }

  const renderSeasonalWidget = () => {
    switch (widget.type) {
      case "pollen-index":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Flower className="w-4 h-4 mr-2 text-pink-400" />
                Pollen Index
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white mb-2">{mockSeasonalData.pollenIndex}</div>
              <Badge
                className={
                  mockSeasonalData.pollenIndex > 7
                    ? "bg-red-500/20 text-red-300"
                    : mockSeasonalData.pollenIndex > 4
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-green-500/20 text-green-300"
                }
              >
                {mockSeasonalData.pollenIndex > 7 ? "Very High" : mockSeasonalData.pollenIndex > 4 ? "Moderate" : "Low"}
              </Badge>
              <div className="mt-2 text-xs text-white/70 text-center">
                <div>Tree: High</div>
                <div>Grass: Medium</div>
                <div>Weed: Low</div>
              </div>
            </CardContent>
          </Card>
        )

      case "heat-index":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Sun className="w-4 h-4 mr-2 text-orange-400" />
                Heat Index
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white mb-2">{mockSeasonalData.heatIndex}°C</div>
              <Badge
                className={
                  mockSeasonalData.heatIndex > 35
                    ? "bg-red-500/20 text-red-300"
                    : mockSeasonalData.heatIndex > 30
                      ? "bg-orange-500/20 text-orange-300"
                      : "bg-yellow-500/20 text-yellow-300"
                }
              >
                {mockSeasonalData.heatIndex > 35
                  ? "Dangerous"
                  : mockSeasonalData.heatIndex > 30
                    ? "Extreme Caution"
                    : "Caution"}
              </Badge>
              <div className="mt-2 text-xs text-white/70 text-center">
                Feels like {mockSeasonalData.heatIndex + 3}°C
              </div>
            </CardContent>
          </Card>
        )

      case "wind-chill":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Wind className="w-4 h-4 mr-2 text-blue-400" />
                Wind Chill
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white mb-2">{mockSeasonalData.windChill}°C</div>
              <Badge
                className={
                  mockSeasonalData.windChill < -20
                    ? "bg-blue-500/20 text-blue-300"
                    : mockSeasonalData.windChill < -10
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "bg-gray-500/20 text-gray-300"
                }
              >
                {mockSeasonalData.windChill < -20
                  ? "Extreme Cold"
                  : mockSeasonalData.windChill < -10
                    ? "Very Cold"
                    : "Cold"}
              </Badge>
              <div className="mt-2 text-xs text-white/70 text-center">
                Frostbite risk in {Math.abs(mockSeasonalData.windChill) > 20 ? "10" : "30"} minutes
              </div>
            </CardContent>
          </Card>
        )

      case "snow-depth":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Snowflake className="w-4 h-4 mr-2 text-blue-300" />
                Snow Depth
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white mb-2">{mockSeasonalData.snowDepth}cm</div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-400 h-2 rounded-full"
                  style={{ width: `${Math.min((mockSeasonalData.snowDepth / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-white/70 text-center">
                <div>24h: +{Math.round(Math.random() * 10)}cm</div>
                <div>Base: {mockSeasonalData.snowDepth - 5}cm</div>
              </div>
            </CardContent>
          </Card>
        )

      case "fire-risk":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Flame className="w-4 h-4 mr-2 text-red-400" />
                Fire Risk
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white mb-2">{mockSeasonalData.fireRisk}</div>
              <Badge
                className={
                  mockSeasonalData.fireRisk > 3
                    ? "bg-red-500/20 text-red-300"
                    : mockSeasonalData.fireRisk > 2
                      ? "bg-orange-500/20 text-orange-300"
                      : "bg-green-500/20 text-green-300"
                }
              >
                {mockSeasonalData.fireRisk > 3 ? "High Risk" : mockSeasonalData.fireRisk > 2 ? "Moderate" : "Low Risk"}
              </Badge>
              <div className="mt-2 text-xs text-white/70 text-center">
                <div>Humidity: 25%</div>
                <div>Wind: 15 km/h</div>
              </div>
            </CardContent>
          </Card>
        )

      case "ice-warning":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <CloudSnow className="w-4 h-4 mr-2 text-cyan-400" />
                Ice Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-center">
                {mockSeasonalData.iceWarning ? (
                  <>
                    <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <Badge className="bg-yellow-500/20 text-yellow-300">Ice Warning</Badge>
                    <div className="mt-2 text-xs text-white/70">Black ice possible</div>
                  </>
                ) : (
                  <>
                    <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <Badge className="bg-green-500/20 text-green-300">Safe Conditions</Badge>
                    <div className="mt-2 text-xs text-white/70">No ice expected</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case "storm-tracker":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Cloud className="w-4 h-4 mr-2 text-gray-400" />
                Storm Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Intensity</span>
                  <Badge
                    className={
                      mockSeasonalData.stormIntensity > 3
                        ? "bg-red-500/20 text-red-300"
                        : mockSeasonalData.stormIntensity > 1
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-green-500/20 text-green-300"
                    }
                  >
                    Level {mockSeasonalData.stormIntensity}
                  </Badge>
                </div>
                <Progress value={mockSeasonalData.stormIntensity * 20} className="h-2" />
                <div className="text-xs text-white/70">
                  <div>Distance: {Math.round(Math.random() * 50 + 10)} km</div>
                  <div>Speed: {Math.round(Math.random() * 30 + 10)} km/h</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "seasonal-health":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-400" />
                Health Advisory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">Allergy Risk</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < mockSeasonalData.seasonalHealth.allergyRisk ? "bg-red-400" : "bg-white/20"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">Heat Stress</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < mockSeasonalData.seasonalHealth.heatStress ? "bg-orange-400" : "bg-white/20"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-white/60 mt-2">Stay hydrated and avoid peak sun hours</div>
              </div>
            </CardContent>
          </Card>
        )

      case "seasonal-activities":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <Activity className="w-4 h-4 mr-2 text-blue-400" />
                Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockSeasonalData.activities.slice(0, 2).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/80 text-xs">{activity}</span>
                  </div>
                ))}
                <div className="text-xs text-white/60 mt-2">Based on current conditions</div>
              </div>
            </CardContent>
          </Card>
        )

      case "seasonal-alerts":
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                Seasonal Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Active Alerts</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300">3</Badge>
                </div>
                <div className="text-xs text-white/60 space-y-1">
                  <div>• Pollen warning</div>
                  <div>• UV alert</div>
                  <div>• Heat advisory</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card className="h-full bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="flex items-center justify-center h-full">
              <span className="text-white/50">Seasonal widget</span>
            </CardContent>
          </Card>
        )
    }
  }

  return renderSeasonalWidget()
}
