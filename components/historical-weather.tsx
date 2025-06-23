"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Bar, BarChart } from "recharts"
import { Calendar, TrendingUp, TrendingDown } from "lucide-react"

interface HistoricalWeatherProps {
  location: string
}

interface HistoricalData {
  date: string
  temperature: number
  humidity: number
  precipitation: number
  windSpeed: number
}

export function HistoricalWeather({ location }: HistoricalWeatherProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("7days")
  const [selectedMetric, setSelectedMetric] = useState("temperature")

  useEffect(() => {
    generateHistoricalData()
  }, [selectedPeriod, location])

  const generateHistoricalData = () => {
    const days = selectedPeriod === "7days" ? 7 : selectedPeriod === "30days" ? 30 : 365
    const data: HistoricalData[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      data.push({
        date: date.toISOString().split("T")[0],
        temperature: Math.round(Math.random() * 20 + 10),
        humidity: Math.round(Math.random() * 40 + 40),
        precipitation: Math.round(Math.random() * 10),
        windSpeed: Math.round(Math.random() * 15 + 5),
      })
    }

    setHistoricalData(data)
  }

  const getMetricData = () => {
    return historicalData.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: item[selectedMetric as keyof HistoricalData] as number,
    }))
  }

  const getCurrentAverage = () => {
    if (historicalData.length === 0) return 0
    const sum = historicalData.reduce((acc, item) => acc + (item[selectedMetric as keyof HistoricalData] as number), 0)
    return Math.round(sum / historicalData.length)
  }

  const getComparisonData = () => {
    const currentPeriodAvg = getCurrentAverage()
    const previousPeriodAvg = Math.round(Math.random() * 20 + 10) // Mock previous period data
    const change = currentPeriodAvg - previousPeriodAvg
    const percentChange = previousPeriodAvg > 0 ? Math.round((change / previousPeriodAvg) * 100) : 0

    return {
      current: currentPeriodAvg,
      previous: previousPeriodAvg,
      change,
      percentChange,
      isIncrease: change > 0,
    }
  }

  const comparison = getComparisonData()

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case "temperature":
        return "°C"
      case "humidity":
        return "%"
      case "precipitation":
        return "mm"
      case "windSpeed":
        return "km/h"
      default:
        return ""
    }
  }

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case "temperature":
        return "Temperature"
      case "humidity":
        return "Humidity"
      case "precipitation":
        return "Precipitation"
      case "windSpeed":
        return "Wind Speed"
      default:
        return metric
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Historical Weather Data - {location}
            </CardTitle>
            <div className="flex space-x-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="humidity">Humidity</SelectItem>
                  <SelectItem value="precipitation">Precipitation</SelectItem>
                  <SelectItem value="windSpeed">Wind Speed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white/70 text-sm">Current Average</div>
              <div className="text-2xl font-bold text-white">
                {comparison.current}
                {getMetricUnit(selectedMetric)}
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white/70 text-sm">Previous Period</div>
              <div className="text-2xl font-bold text-white">
                {comparison.previous}
                {getMetricUnit(selectedMetric)}
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white/70 text-sm">Change</div>
              <div
                className={`text-2xl font-bold flex items-center ${
                  comparison.isIncrease ? "text-green-400" : "text-red-400"
                }`}
              >
                {comparison.isIncrease ? (
                  <TrendingUp className="w-5 h-5 mr-1" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-1" />
                )}
                {Math.abs(comparison.change)}
                {getMetricUnit(selectedMetric)}
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white/70 text-sm">Percent Change</div>
              <div className={`text-2xl font-bold ${comparison.isIncrease ? "text-green-400" : "text-red-400"}`}>
                {comparison.isIncrease ? "+" : ""}
                {comparison.percentChange}%
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            {selectedMetric === "precipitation" ? (
              <BarChart data={getMetricData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value) => [`${value}${getMetricUnit(selectedMetric)}`, getMetricLabel(selectedMetric)]}
                />
                <Bar dataKey="value" fill="#60A5FA" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={getMetricData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value) => [`${value}${getMetricUnit(selectedMetric)}`, getMetricLabel(selectedMetric)]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#60A5FA"
                  strokeWidth={3}
                  dot={{ fill: "#60A5FA", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weather Patterns Analysis */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Weather Patterns & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Key Observations</h3>
              <div className="space-y-2">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-sm">Highest Temperature</div>
                  <div className="text-white font-semibold">
                    {Math.max(...historicalData.map((d) => d.temperature))}°C
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-sm">Lowest Temperature</div>
                  <div className="text-white font-semibold">
                    {Math.min(...historicalData.map((d) => d.temperature))}°C
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-sm">Total Precipitation</div>
                  <div className="text-white font-semibold">
                    {historicalData.reduce((sum, d) => sum + d.precipitation, 0)}mm
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Trends</h3>
              <div className="space-y-2">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-sm">Temperature Trend</div>
                  <div className="flex items-center text-white">
                    {comparison.isIncrease ? (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                        <span>Increasing</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4 mr-2 text-red-400" />
                        <span>Decreasing</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-sm">Weather Stability</div>
                  <div className="text-white font-semibold">{Math.random() > 0.5 ? "Stable" : "Variable"}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-sm">Seasonal Pattern</div>
                  <div className="text-white font-semibold">Normal</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
