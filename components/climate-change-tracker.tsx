"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useClimateZone } from "@/components/climate-zones"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Thermometer,
  CloudRain,
  Wind,
  Sun,
  Snowflake,
  AlertTriangle,
  Calendar,
  BarChart3,
  Activity,
  Globe,
  Zap,
  Eye,
} from "lucide-react"

interface ClimateChangeData {
  location: string
  timeRange: string
  temperatureTrends: {
    annual: Array<{ year: number; temperature: number; baseline: number }>
    seasonal: {
      spring: Array<{ year: number; temperature: number; baseline: number }>
      summer: Array<{ year: number; temperature: number; baseline: number }>
      autumn: Array<{ year: number; temperature: number; baseline: number }>
      winter: Array<{ year: number; temperature: number; baseline: number }>
    }
  }
  precipitationTrends: {
    annual: Array<{ year: number; precipitation: number; baseline: number }>
    seasonal: {
      spring: Array<{ year: number; precipitation: number; baseline: number }>
      summer: Array<{ year: number; precipitation: number; baseline: number }>
      autumn: Array<{ year: number; precipitation: number; baseline: number }>
      winter: Array<{ year: number; precipitation: number; baseline: number }>
    }
  }
  extremeEvents: {
    heatWaves: Array<{ year: number; count: number; intensity: number }>
    coldSnaps: Array<{ year: number; count: number; intensity: number }>
    heavyRain: Array<{ year: number; count: number; intensity: number }>
    droughts: Array<{ year: number; count: number; intensity: number }>
    storms: Array<{ year: number; count: number; intensity: number }>
  }
  indicators: {
    growingSeason: Array<{ year: number; days: number; baseline: number }>
    frostFreeDays: Array<{ year: number; days: number; baseline: number }>
    heatingDegreeDays: Array<{ year: number; days: number; baseline: number }>
    coolingDegreeDays: Array<{ year: number; days: number; baseline: number }>
  }
  projections: {
    temperature: {
      scenario: string
      years: number[]
      values: number[]
      uncertainty: number[]
    }[]
    precipitation: {
      scenario: string
      years: number[]
      values: number[]
      uncertainty: number[]
    }[]
  }
  impacts: {
    category: string
    indicator: string
    trend: "increasing" | "decreasing" | "stable"
    confidence: "high" | "medium" | "low"
    description: string
    magnitude: number
  }[]
}

interface ClimateChangeTrackerProps {
  location: string
  onClose: () => void
}

export function ClimateChangeTracker({ location, onClose }: ClimateChangeTrackerProps) {
  const [climateData, setClimateData] = useState<ClimateChangeData | null>(null)
  const [selectedMetric, setSelectedMetric] = useState("temperature")
  const [selectedTimeframe, setSelectedTimeframe] = useState("annual")
  const [selectedScenario, setSelectedScenario] = useState("moderate")
  const [loading, setLoading] = useState(true)
  const { climateZone, climateData: locationData } = useClimateZone(location)

  useEffect(() => {
    generateClimateChangeData()
  }, [location])

  const generateClimateChangeData = () => {
    setLoading(true)

    // Generate realistic climate change data based on location and climate zone
    const baselineYears = Array.from({ length: 30 }, (_, i) => 1991 + i) // 1991-2020 baseline
    const dataYears = Array.from({ length: 54 }, (_, i) => 1970 + i) // 1970-2023 data
    const projectionYears = Array.from({ length: 77 }, (_, i) => 2024 + i) // 2024-2100 projections

    // Climate zone specific trends
    const getTemperatureTrend = (year: number, season?: string) => {
      const baseYear = 1991
      const yearsSinceBase = year - baseYear
      let trendRate = 0.02 // Default 0.2°C per decade

      // Adjust trend rate based on climate zone
      if (climateZone) {
        switch (climateZone.id) {
          case "polar-tundra":
            trendRate = 0.04 // Arctic warming amplification
            break
          case "desert-hot":
            trendRate = 0.025 // Desert regions warming faster
            break
          case "tropical-wet":
            trendRate = 0.015 // Tropical regions warming slower
            break
          case "temperate-continental":
            trendRate = 0.02 // Moderate warming
            break
          case "mediterranean":
            trendRate = 0.022 // Slightly above average
            break
          case "monsoon":
            trendRate = 0.018 // Moderate warming
            break
        }
      }

      // Seasonal variations
      if (season === "winter" && climateZone?.id === "polar-tundra") {
        trendRate *= 1.5 // Winter warming amplification in polar regions
      } else if (season === "summer" && climateZone?.id === "desert-hot") {
        trendRate *= 1.3 // Summer intensification in deserts
      }

      return yearsSinceBase * trendRate + (Math.random() - 0.5) * 0.5 // Add natural variability
    }

    const getPrecipitationTrend = (year: number, season?: string) => {
      const baseYear = 1991
      const yearsSinceBase = year - baseYear
      let trendRate = 0.002 // Default 2% per decade

      // Climate zone specific precipitation trends
      if (climateZone) {
        switch (climateZone.id) {
          case "polar-tundra":
            trendRate = 0.005 // Increasing precipitation in polar regions
            break
          case "desert-hot":
            trendRate = -0.001 // Decreasing in deserts
            break
          case "tropical-wet":
            trendRate = 0.003 // Increasing in tropics
            break
          case "mediterranean":
            trendRate = -0.002 // Decreasing in Mediterranean
            break
          case "monsoon":
            trendRate = 0.004 // Increasing monsoon intensity
            break
        }
      }

      return 1 + yearsSinceBase * trendRate + (Math.random() - 0.5) * 0.1
    }

    const mockData: ClimateChangeData = {
      location,
      timeRange: "1970-2023",
      temperatureTrends: {
        annual: dataYears.map((year) => ({
          year,
          temperature: 15 + getTemperatureTrend(year),
          baseline: 15,
        })),
        seasonal: {
          spring: dataYears.map((year) => ({
            year,
            temperature: 12 + getTemperatureTrend(year, "spring"),
            baseline: 12,
          })),
          summer: dataYears.map((year) => ({
            year,
            temperature: 25 + getTemperatureTrend(year, "summer"),
            baseline: 25,
          })),
          autumn: dataYears.map((year) => ({
            year,
            temperature: 15 + getTemperatureTrend(year, "autumn"),
            baseline: 15,
          })),
          winter: dataYears.map((year) => ({
            year,
            temperature: 2 + getTemperatureTrend(year, "winter"),
            baseline: 2,
          })),
        },
      },
      precipitationTrends: {
        annual: dataYears.map((year) => ({
          year,
          precipitation: 800 * getPrecipitationTrend(year),
          baseline: 800,
        })),
        seasonal: {
          spring: dataYears.map((year) => ({
            year,
            precipitation: 200 * getPrecipitationTrend(year, "spring"),
            baseline: 200,
          })),
          summer: dataYears.map((year) => ({
            year,
            precipitation: 150 * getPrecipitationTrend(year, "summer"),
            baseline: 150,
          })),
          autumn: dataYears.map((year) => ({
            year,
            precipitation: 250 * getPrecipitationTrend(year, "autumn"),
            baseline: 250,
          })),
          winter: dataYears.map((year) => ({
            year,
            precipitation: 200 * getPrecipitationTrend(year, "winter"),
            baseline: 200,
          })),
        },
      },
      extremeEvents: {
        heatWaves: dataYears.map((year) => ({
          year,
          count: Math.max(0, Math.round(2 + (year - 1990) * 0.1 + (Math.random() - 0.5) * 2)),
          intensity: 35 + (year - 1990) * 0.05 + (Math.random() - 0.5) * 2,
        })),
        coldSnaps: dataYears.map((year) => ({
          year,
          count: Math.max(0, Math.round(3 - (year - 1990) * 0.05 + (Math.random() - 0.5) * 1)),
          intensity: -15 - (year - 1990) * 0.02 + (Math.random() - 0.5) * 2,
        })),
        heavyRain: dataYears.map((year) => ({
          year,
          count: Math.max(0, Math.round(4 + (year - 1990) * 0.08 + (Math.random() - 0.5) * 2)),
          intensity: 50 + (year - 1990) * 0.3 + (Math.random() - 0.5) * 5,
        })),
        droughts: dataYears.map((year) => ({
          year,
          count: Math.max(0, Math.round(1 + (year - 1990) * 0.03 + (Math.random() - 0.5) * 1)),
          intensity: 60 + (year - 1990) * 0.2 + (Math.random() - 0.5) * 10,
        })),
        storms: dataYears.map((year) => ({
          year,
          count: Math.max(0, Math.round(6 + (year - 1990) * 0.06 + (Math.random() - 0.5) * 2)),
          intensity: 80 + (year - 1990) * 0.1 + (Math.random() - 0.5) * 5,
        })),
      },
      indicators: {
        growingSeason: dataYears.map((year) => ({
          year,
          days: Math.round(180 + (year - 1990) * 0.8 + (Math.random() - 0.5) * 10),
          baseline: 180,
        })),
        frostFreeDays: dataYears.map((year) => ({
          year,
          days: Math.round(200 + (year - 1990) * 0.6 + (Math.random() - 0.5) * 8),
          baseline: 200,
        })),
        heatingDegreeDays: dataYears.map((year) => ({
          year,
          days: Math.round(2500 - (year - 1990) * 15 + (Math.random() - 0.5) * 100),
          baseline: 2500,
        })),
        coolingDegreeDays: dataYears.map((year) => ({
          year,
          days: Math.round(800 + (year - 1990) * 12 + (Math.random() - 0.5) * 80),
          baseline: 800,
        })),
      },
      projections: {
        temperature: [
          {
            scenario: "low",
            years: projectionYears.filter((y) => y % 10 === 0),
            values: projectionYears.filter((y) => y % 10 === 0).map((year) => 15 + getTemperatureTrend(year) * 0.7),
            uncertainty: projectionYears.filter((y) => y % 10 === 0).map(() => 0.5),
          },
          {
            scenario: "moderate",
            years: projectionYears.filter((y) => y % 10 === 0),
            values: projectionYears.filter((y) => y % 10 === 0).map((year) => 15 + getTemperatureTrend(year)),
            uncertainty: projectionYears.filter((y) => y % 10 === 0).map(() => 0.8),
          },
          {
            scenario: "high",
            years: projectionYears.filter((y) => y % 10 === 0),
            values: projectionYears.filter((y) => y % 10 === 0).map((year) => 15 + getTemperatureTrend(year) * 1.5),
            uncertainty: projectionYears.filter((y) => y % 10 === 0).map(() => 1.2),
          },
        ],
        precipitation: [
          {
            scenario: "low",
            years: projectionYears.filter((y) => y % 10 === 0),
            values: projectionYears.filter((y) => y % 10 === 0).map((year) => 800 * getPrecipitationTrend(year) * 0.95),
            uncertainty: projectionYears.filter((y) => y % 10 === 0).map(() => 50),
          },
          {
            scenario: "moderate",
            years: projectionYears.filter((y) => y % 10 === 0),
            values: projectionYears.filter((y) => y % 10 === 0).map((year) => 800 * getPrecipitationTrend(year)),
            uncertainty: projectionYears.filter((y) => y % 10 === 0).map(() => 80),
          },
          {
            scenario: "high",
            years: projectionYears.filter((y) => y % 10 === 0),
            values: projectionYears.filter((y) => y % 10 === 0).map((year) => 800 * getPrecipitationTrend(year) * 1.1),
            uncertainty: projectionYears.filter((y) => y % 10 === 0).map(() => 120),
          },
        ],
      },
      impacts: [
        {
          category: "Temperature",
          indicator: "Annual Average Temperature",
          trend: "increasing",
          confidence: "high",
          description: "Average temperatures have increased by 1.2°C since 1970",
          magnitude: 1.2,
        },
        {
          category: "Temperature",
          indicator: "Heat Wave Frequency",
          trend: "increasing",
          confidence: "high",
          description: "Heat waves are occurring 3x more frequently than in the 1970s",
          magnitude: 3.0,
        },
        {
          category: "Temperature",
          indicator: "Cold Snap Frequency",
          trend: "decreasing",
          confidence: "medium",
          description: "Extreme cold events have decreased by 40% since 1970",
          magnitude: -0.4,
        },
        {
          category: "Precipitation",
          indicator: "Heavy Rainfall Events",
          trend: "increasing",
          confidence: "medium",
          description: "Intense rainfall events have increased by 25%",
          magnitude: 0.25,
        },
        {
          category: "Seasons",
          indicator: "Growing Season Length",
          trend: "increasing",
          confidence: "high",
          description: "Growing season has extended by 2.5 weeks since 1970",
          magnitude: 17.5,
        },
        {
          category: "Energy",
          indicator: "Cooling Degree Days",
          trend: "increasing",
          confidence: "high",
          description: "Energy demand for cooling has increased by 35%",
          magnitude: 0.35,
        },
        {
          category: "Energy",
          indicator: "Heating Degree Days",
          trend: "decreasing",
          confidence: "high",
          description: "Energy demand for heating has decreased by 20%",
          magnitude: -0.2,
        },
      ],
    }

    setClimateData(mockData)
    setLoading(false)
  }

  const getCurrentTrend = (data: Array<{ year: number; temperature?: number; precipitation?: number }>) => {
    if (data.length < 10) return { trend: 0, direction: "stable" as const }

    const recent = data.slice(-10)
    const older = data.slice(-20, -10)

    const recentAvg =
      recent.reduce((sum, item) => sum + (item.temperature || item.precipitation || 0), 0) / recent.length
    const olderAvg = older.reduce((sum, item) => sum + (item.temperature || item.precipitation || 0), 0) / older.length

    const trend = recentAvg - olderAvg
    const direction = Math.abs(trend) < 0.1 ? "stable" : trend > 0 ? "increasing" : "decreasing"

    return { trend, direction }
  }

  const formatTrendValue = (value: number, unit: string) => {
    const sign = value > 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}${unit}`
  }

  if (loading || !climateData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p>Analyzing climate patterns...</p>
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
              <Globe className="w-6 h-6 mr-3" />
              Climate Change Tracker - {location}
            </h2>
            <p className="text-white/70">Long-term climate trends and projections for your area</p>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Close
          </Button>
        </div>

        <div className="p-6 h-full overflow-auto">
          <Tabs defaultValue="trends" className="space-y-6">
            <TabsList className="bg-white/10 backdrop-blur-md border-white/20">
              <TabsTrigger value="trends" className="data-[state=active]:bg-white/20">
                <TrendingUp className="w-4 h-4 mr-2" />
                Historical Trends
              </TabsTrigger>
              <TabsTrigger value="extremes" className="data-[state=active]:bg-white/20">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Extreme Events
              </TabsTrigger>
              <TabsTrigger value="indicators" className="data-[state=active]:bg-white/20">
                <Activity className="w-4 h-4 mr-2" />
                Climate Indicators
              </TabsTrigger>
              <TabsTrigger value="projections" className="data-[state=active]:bg-white/20">
                <BarChart3 className="w-4 h-4 mr-2" />
                Future Projections
              </TabsTrigger>
              <TabsTrigger value="impacts" className="data-[state=active]:bg-white/20">
                <Eye className="w-4 h-4 mr-2" />
                Local Impacts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Temperature & Precipitation Trends</h3>
                <div className="flex space-x-2">
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="precipitation">Precipitation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="spring">Spring</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="autumn">Autumn</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                {(() => {
                  const data =
                    selectedTimeframe === "annual"
                      ? climateData.temperatureTrends.annual
                      : climateData.temperatureTrends.seasonal[
                          selectedTimeframe as keyof typeof climateData.temperatureTrends.seasonal
                        ]
                  const trend = getCurrentTrend(data)
                  const unit = selectedMetric === "temperature" ? "°C" : "mm"
                  const icon = selectedMetric === "temperature" ? Thermometer : CloudRain

                  return (
                    <>
                      <Card className="bg-white/10 backdrop-blur-md border-white/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {React.createElement(icon, { className: "w-5 h-5 text-white/70 mr-2" })}
                              <span className="text-white/70 text-sm">Current Trend</span>
                            </div>
                            {trend.direction === "increasing" ? (
                              <TrendingUp className="w-5 h-5 text-red-400" />
                            ) : trend.direction === "decreasing" ? (
                              <TrendingDown className="w-5 h-5 text-blue-400" />
                            ) : (
                              <Activity className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="text-2xl font-bold text-white">{formatTrendValue(trend.trend, unit)}</div>
                          <div className="text-white/70 text-sm">per decade</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 backdrop-blur-md border-white/20">
                        <CardContent className="p-4">
                          <div className="text-white/70 text-sm mb-2">1970s Average</div>
                          <div className="text-2xl font-bold text-white">
                            {selectedMetric === "temperature"
                              ? `${data[0]?.temperature?.toFixed(1) || "N/A"}°C`
                              : `${data[0]?.precipitation?.toFixed(0) || "N/A"}mm`}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 backdrop-blur-md border-white/20">
                        <CardContent className="p-4">
                          <div className="text-white/70 text-sm mb-2">2020s Average</div>
                          <div className="text-2xl font-bold text-white">
                            {selectedMetric === "temperature"
                              ? `${data[data.length - 1]?.temperature?.toFixed(1) || "N/A"}°C`
                              : `${data[data.length - 1]?.precipitation?.toFixed(0) || "N/A"}mm`}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 backdrop-blur-md border-white/20">
                        <CardContent className="p-4">
                          <div className="text-white/70 text-sm mb-2">Total Change</div>
                          <div
                            className={`text-2xl font-bold ${
                              trend.direction === "increasing"
                                ? "text-red-400"
                                : trend.direction === "decreasing"
                                  ? "text-blue-400"
                                  : "text-gray-400"
                            }`}
                          >
                            {selectedMetric === "temperature"
                              ? formatTrendValue(
                                  (data[data.length - 1]?.temperature || 0) - (data[0]?.temperature || 0),
                                  "°C",
                                )
                              : formatTrendValue(
                                  ((data[data.length - 1]?.precipitation || 0) - (data[0]?.precipitation || 0)) /
                                    (data[0]?.precipitation || 1),
                                  "%",
                                )}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )
                })()}
              </div>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    {selectedMetric === "temperature" ? "Temperature" : "Precipitation"} Trends (
                    {selectedTimeframe === "annual" ? "Annual" : selectedTimeframe})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={
                        selectedMetric === "temperature"
                          ? selectedTimeframe === "annual"
                            ? climateData.temperatureTrends.annual
                            : climateData.temperatureTrends.seasonal[
                                selectedTimeframe as keyof typeof climateData.temperatureTrends.seasonal
                              ]
                          : selectedTimeframe === "annual"
                            ? climateData.precipitationTrends.annual
                            : climateData.precipitationTrends.seasonal[
                                selectedTimeframe as keyof typeof climateData.precipitationTrends.seasonal
                              ]
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                      <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Legend />
                      <ReferenceLine
                        y={
                          selectedMetric === "temperature"
                            ? selectedTimeframe === "annual"
                              ? climateData.temperatureTrends.annual[0]?.baseline
                              : climateData.temperatureTrends.seasonal[
                                  selectedTimeframe as keyof typeof climateData.temperatureTrends.seasonal
                                ][0]?.baseline
                            : selectedTimeframe === "annual"
                              ? climateData.precipitationTrends.annual[0]?.baseline
                              : climateData.precipitationTrends.seasonal[
                                  selectedTimeframe as keyof typeof climateData.precipitationTrends.seasonal
                                ][0]?.baseline
                        }
                        stroke="rgba(255,255,255,0.5)"
                        strokeDasharray="5 5"
                        label={{ value: "1991-2020 Average", position: "topRight", fill: "white" }}
                      />
                      <Line
                        type="monotone"
                        dataKey={selectedMetric}
                        stroke="#60A5FA"
                        strokeWidth={2}
                        dot={{ fill: "#60A5FA", strokeWidth: 2, r: 3 }}
                        name={selectedMetric === "temperature" ? "Temperature (°C)" : "Precipitation (mm)"}
                      />
                      <Line
                        type="monotone"
                        dataKey="baseline"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Historical Average"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="extremes" className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Extreme Weather Events</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sun className="w-5 h-5 mr-2 text-red-400" />
                      Heat Wave Frequency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={climateData.extremeEvents.heatWaves.slice(-20)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Snowflake className="w-5 h-5 mr-2 text-blue-400" />
                      Cold Snap Frequency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={climateData.extremeEvents.coldSnaps.slice(-20)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <CloudRain className="w-5 h-5 mr-2 text-blue-400" />
                      Heavy Rainfall Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={climateData.extremeEvents.heavyRain.slice(-20)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Wind className="w-5 h-5 mr-2 text-gray-400" />
                      Storm Frequency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={climateData.extremeEvents.storms.slice(-20)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="indicators" className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Climate Indicators</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-green-400" />
                      Growing Season Length
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={climateData.indicators.growingSeason}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <ReferenceLine
                          y={climateData.indicators.growingSeason[0]?.baseline}
                          stroke="rgba(255,255,255,0.5)"
                          strokeDasharray="5 5"
                        />
                        <Line
                          type="monotone"
                          dataKey="days"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Snowflake className="w-5 h-5 mr-2 text-blue-400" />
                      Frost-Free Days
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={climateData.indicators.frostFreeDays}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <ReferenceLine
                          y={climateData.indicators.frostFreeDays[0]?.baseline}
                          stroke="rgba(255,255,255,0.5)"
                          strokeDasharray="5 5"
                        />
                        <Line
                          type="monotone"
                          dataKey="days"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-red-400" />
                      Cooling Degree Days
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={climateData.indicators.coolingDegreeDays}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="days"
                          stroke="#EF4444"
                          fill="rgba(239, 68, 68, 0.3)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Thermometer className="w-5 h-5 mr-2 text-blue-400" />
                      Heating Degree Days
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={climateData.indicators.heatingDegreeDays}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="days"
                          stroke="#3B82F6"
                          fill="rgba(59, 130, 246, 0.3)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projections" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Future Climate Projections</h3>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Emissions</SelectItem>
                    <SelectItem value="moderate">Moderate Emissions</SelectItem>
                    <SelectItem value="high">High Emissions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Temperature Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={climateData.projections.temperature
                          .find((p) => p.scenario === selectedScenario)
                          ?.years.map((year, index) => ({
                            year,
                            temperature: climateData.projections.temperature.find(
                              (p) => p.scenario === selectedScenario,
                            )?.values[index],
                            uncertainty: climateData.projections.temperature.find(
                              (p) => p.scenario === selectedScenario,
                            )?.uncertainty[index],
                          }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="#EF4444"
                          strokeWidth={3}
                          dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Precipitation Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={climateData.projections.precipitation
                          .find((p) => p.scenario === selectedScenario)
                          ?.years.map((year, index) => ({
                            year,
                            precipitation: climateData.projections.precipitation.find(
                              (p) => p.scenario === selectedScenario,
                            )?.values[index],
                            uncertainty: climateData.projections.precipitation.find(
                              (p) => p.scenario === selectedScenario,
                            )?.uncertainty[index],
                          }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="precipitation"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Projection Scenarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        Low Emissions
                      </h4>
                      <p className="text-white/70 text-sm">
                        Aggressive climate action, rapid transition to renewable energy, strong international
                        cooperation.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        Moderate Emissions
                      </h4>
                      <p className="text-white/70 text-sm">
                        Gradual reduction in emissions, mixed energy sources, moderate policy implementation.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        High Emissions
                      </h4>
                      <p className="text-white/70 text-sm">
                        Business as usual, continued fossil fuel dependence, limited climate action.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impacts" className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Local Climate Impacts</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {climateData.impacts.map((impact, index) => (
                  <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          className={
                            impact.trend === "increasing"
                              ? "bg-red-500/20 text-red-300"
                              : impact.trend === "decreasing"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-gray-500/20 text-gray-300"
                          }
                        >
                          {impact.trend === "increasing" ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : impact.trend === "decreasing" ? (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          ) : (
                            <Activity className="w-3 h-3 mr-1" />
                          )}
                          {impact.trend}
                        </Badge>
                        <Badge
                          className={
                            impact.confidence === "high"
                              ? "bg-green-500/20 text-green-300"
                              : impact.confidence === "medium"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-red-500/20 text-red-300"
                          }
                        >
                          {impact.confidence} confidence
                        </Badge>
                      </div>
                      <h4 className="text-white font-semibold mb-2">{impact.indicator}</h4>
                      <p className="text-white/70 text-sm mb-3">{impact.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 text-xs">{impact.category}</span>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              impact.trend === "increasing" ? "text-red-400" : "text-blue-400"
                            }`}
                          >
                            {impact.trend === "increasing" ? "+" : ""}
                            {impact.magnitude > 1
                              ? `${impact.magnitude.toFixed(1)}x`
                              : `${(impact.magnitude * 100).toFixed(0)}%`}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Climate Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Heat-related Health Risks</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-32" />
                        <Badge className="bg-red-500/20 text-red-300">High</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Flood Risk</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={45} className="w-32" />
                        <Badge className="bg-yellow-500/20 text-yellow-300">Medium</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Drought Risk</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={60} className="w-32" />
                        <Badge className="bg-orange-500/20 text-orange-300">Medium-High</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Infrastructure Stress</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={55} className="w-32" />
                        <Badge className="bg-yellow-500/20 text-yellow-300">Medium</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Agricultural Impact</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={40} className="w-32" />
                        <Badge className="bg-yellow-500/20 text-yellow-300">Medium</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
