"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from "recharts"

interface WeatherChartProps {
  weatherData: {
    hourlyForecast: Array<{
      time: string
      temp: number
      condition: string
    }>
  }
}

export function WeatherChart({ weatherData }: WeatherChartProps) {
  const chartData = weatherData.hourlyForecast.slice(0, 12).map((item) => ({
    time: item.time,
    temperature: item.temp,
    humidity: Math.round(Math.random() * 40 + 40), // Mock humidity data
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Temperature Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" fontSize={12} />
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
                stroke="#60A5FA"
                strokeWidth={3}
                dot={{ fill: "#60A5FA", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Humidity Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" fontSize={12} />
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
                dataKey="humidity"
                stroke="#34D399"
                fill="rgba(52, 211, 153, 0.3)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
