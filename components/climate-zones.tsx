"use client"

import { useState, useEffect } from "react"

export interface ClimateZone {
  id: string
  name: string
  description: string
  characteristics: string[]
  seasonalPattern: "traditional" | "tropical" | "desert" | "polar" | "mediterranean" | "monsoon"
  seasons: {
    [key: string]: {
      months: number[]
      temperature: { min: number; max: number }
      precipitation: "low" | "moderate" | "high"
      characteristics: string[]
    }
  }
}

export const climateZones: ClimateZone[] = [
  {
    id: "temperate-continental",
    name: "Temperate Continental",
    description: "Four distinct seasons with cold winters and warm summers",
    characteristics: ["Clear seasonal transitions", "Moderate to high precipitation", "Temperature extremes"],
    seasonalPattern: "traditional",
    seasons: {
      spring: {
        months: [3, 4, 5],
        temperature: { min: 5, max: 20 },
        precipitation: "moderate",
        characteristics: ["Rapid warming", "Frequent rain", "High pollen", "Variable weather"],
      },
      summer: {
        months: [6, 7, 8],
        temperature: { min: 15, max: 30 },
        precipitation: "moderate",
        characteristics: ["Hot days", "Thunderstorms", "High humidity", "Long daylight"],
      },
      autumn: {
        months: [9, 10, 11],
        temperature: { min: 0, max: 20 },
        precipitation: "moderate",
        characteristics: ["Cooling temperatures", "Color changes", "Frost risk", "Storm season"],
      },
      winter: {
        months: [12, 1, 2],
        temperature: { min: -15, max: 5 },
        precipitation: "moderate",
        characteristics: ["Snow and ice", "Extreme cold", "Short days", "Heating needs"],
      },
    },
  },
  {
    id: "tropical-wet",
    name: "Tropical Wet",
    description: "Hot and humid year-round with distinct wet and dry seasons",
    characteristics: ["High temperatures", "High humidity", "Monsoon patterns", "Minimal temperature variation"],
    seasonalPattern: "tropical",
    seasons: {
      "wet-season": {
        months: [5, 6, 7, 8, 9, 10],
        temperature: { min: 24, max: 32 },
        precipitation: "high",
        characteristics: ["Heavy rainfall", "High humidity", "Flooding risk", "Lush vegetation"],
      },
      "dry-season": {
        months: [11, 12, 1, 2, 3, 4],
        temperature: { min: 22, max: 35 },
        precipitation: "low",
        characteristics: ["Lower humidity", "Clear skies", "Drought risk", "Fire season"],
      },
    },
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    description: "Mild, wet winters and hot, dry summers",
    characteristics: ["Dry summers", "Mild winters", "Fire risk", "Drought periods"],
    seasonalPattern: "mediterranean",
    seasons: {
      spring: {
        months: [3, 4, 5],
        temperature: { min: 10, max: 22 },
        precipitation: "moderate",
        characteristics: ["Mild temperatures", "Wildflower blooms", "Pleasant weather", "Low humidity"],
      },
      summer: {
        months: [6, 7, 8],
        temperature: { min: 18, max: 35 },
        precipitation: "low",
        characteristics: ["Hot and dry", "Fire risk", "Clear skies", "Water conservation"],
      },
      autumn: {
        months: [9, 10, 11],
        temperature: { min: 12, max: 25 },
        precipitation: "moderate",
        characteristics: ["Cooling temperatures", "Return of rains", "Harvest season", "Pleasant weather"],
      },
      winter: {
        months: [12, 1, 2],
        temperature: { min: 5, max: 15 },
        precipitation: "high",
        characteristics: ["Mild temperatures", "Rainy season", "Green landscapes", "Occasional frost"],
      },
    },
  },
  {
    id: "desert-hot",
    name: "Hot Desert",
    description: "Extremely hot summers and mild winters with very low precipitation",
    characteristics: ["Extreme heat", "Very low rainfall", "Large temperature swings", "Dust storms"],
    seasonalPattern: "desert",
    seasons: {
      "hot-season": {
        months: [4, 5, 6, 7, 8, 9],
        temperature: { min: 25, max: 50 },
        precipitation: "low",
        characteristics: ["Extreme heat", "Dust storms", "Dehydration risk", "Minimal outdoor activity"],
      },
      "mild-season": {
        months: [10, 11, 12, 1, 2, 3],
        temperature: { min: 10, max: 30 },
        precipitation: "low",
        characteristics: ["Pleasant temperatures", "Clear skies", "Outdoor activities", "Cool nights"],
      },
    },
  },
  {
    id: "polar-tundra",
    name: "Polar Tundra",
    description: "Extremely cold with short, cool summers",
    characteristics: ["Permafrost", "Extreme cold", "Midnight sun", "Polar night"],
    seasonalPattern: "polar",
    seasons: {
      "polar-summer": {
        months: [6, 7, 8],
        temperature: { min: 0, max: 15 },
        precipitation: "low",
        characteristics: ["Midnight sun", "Thawing", "Wildlife activity", "Brief growing season"],
      },
      "polar-winter": {
        months: [9, 10, 11, 12, 1, 2, 3, 4, 5],
        temperature: { min: -40, max: -5 },
        precipitation: "low",
        characteristics: ["Polar night", "Extreme cold", "Aurora activity", "Survival conditions"],
      },
    },
  },
  {
    id: "monsoon",
    name: "Monsoon",
    description: "Seasonal wind patterns bringing distinct wet and dry periods",
    characteristics: ["Monsoon winds", "Extreme precipitation", "Flooding", "Agricultural cycles"],
    seasonalPattern: "monsoon",
    seasons: {
      "pre-monsoon": {
        months: [3, 4, 5],
        temperature: { min: 25, max: 40 },
        precipitation: "low",
        characteristics: ["Rising heat", "Dust storms", "Water scarcity", "Heat waves"],
      },
      monsoon: {
        months: [6, 7, 8, 9],
        temperature: { min: 22, max: 32 },
        precipitation: "high",
        characteristics: ["Heavy rainfall", "Flooding", "High humidity", "Cooler temperatures"],
      },
      "post-monsoon": {
        months: [10, 11],
        temperature: { min: 20, max: 30 },
        precipitation: "moderate",
        characteristics: ["Retreating monsoon", "Clear skies", "Pleasant weather", "Festival season"],
      },
      winter: {
        months: [12, 1, 2],
        temperature: { min: 10, max: 25 },
        precipitation: "low",
        characteristics: ["Cool and dry", "Clear skies", "Low humidity", "Comfortable weather"],
      },
    },
  },
]

export interface LocationClimateData {
  location: string
  coordinates: { lat: number; lon: number }
  climateZone: string
  hemisphere: "northern" | "southern"
  timeZone: string
  elevation?: number
  coastalInfluence?: boolean
  urbanHeatIsland?: boolean
}

export const locationClimateDatabase: LocationClimateData[] = [
  // North America
  {
    location: "New York",
    coordinates: { lat: 40.7128, lon: -74.006 },
    climateZone: "temperate-continental",
    hemisphere: "northern",
    timeZone: "America/New_York",
    urbanHeatIsland: true,
  },
  {
    location: "Los Angeles",
    coordinates: { lat: 34.0522, lon: -118.2437 },
    climateZone: "mediterranean",
    hemisphere: "northern",
    timeZone: "America/Los_Angeles",
    coastalInfluence: true,
  },
  {
    location: "Phoenix",
    coordinates: { lat: 33.4484, lon: -112.074 },
    climateZone: "desert-hot",
    hemisphere: "northern",
    timeZone: "America/Phoenix",
    elevation: 331,
  },
  {
    location: "Miami",
    coordinates: { lat: 25.7617, lon: -80.1918 },
    climateZone: "tropical-wet",
    hemisphere: "northern",
    timeZone: "America/New_York",
    coastalInfluence: true,
  },

  // Europe
  {
    location: "London",
    coordinates: { lat: 51.5074, lon: -0.1278 },
    climateZone: "temperate-continental",
    hemisphere: "northern",
    timeZone: "Europe/London",
    urbanHeatIsland: true,
  },
  {
    location: "Rome",
    coordinates: { lat: 41.9028, lon: 12.4964 },
    climateZone: "mediterranean",
    hemisphere: "northern",
    timeZone: "Europe/Rome",
  },
  {
    location: "Reykjavik",
    coordinates: { lat: 64.1466, lon: -21.9426 },
    climateZone: "polar-tundra",
    hemisphere: "northern",
    timeZone: "Atlantic/Reykjavik",
    coastalInfluence: true,
  },

  // Asia
  {
    location: "Tokyo",
    coordinates: { lat: 35.6762, lon: 139.6503 },
    climateZone: "temperate-continental",
    hemisphere: "northern",
    timeZone: "Asia/Tokyo",
    urbanHeatIsland: true,
  },
  {
    location: "Mumbai",
    coordinates: { lat: 19.076, lon: 72.8777 },
    climateZone: "monsoon",
    hemisphere: "northern",
    timeZone: "Asia/Kolkata",
    coastalInfluence: true,
  },
  {
    location: "Singapore",
    coordinates: { lat: 1.3521, lon: 103.8198 },
    climateZone: "tropical-wet",
    hemisphere: "northern",
    timeZone: "Asia/Singapore",
    urbanHeatIsland: true,
  },
  {
    location: "Dubai",
    coordinates: { lat: 25.2048, lon: 55.2708 },
    climateZone: "desert-hot",
    hemisphere: "northern",
    timeZone: "Asia/Dubai",
    coastalInfluence: true,
  },

  // Australia & Oceania
  {
    location: "Sydney",
    coordinates: { lat: -33.8688, lon: 151.2093 },
    climateZone: "temperate-continental",
    hemisphere: "southern",
    timeZone: "Australia/Sydney",
    coastalInfluence: true,
  },
  {
    location: "Perth",
    coordinates: { lat: -31.9505, lon: 115.8605 },
    climateZone: "mediterranean",
    hemisphere: "southern",
    timeZone: "Australia/Perth",
    coastalInfluence: true,
  },
  {
    location: "Darwin",
    coordinates: { lat: -12.4634, lon: 130.8456 },
    climateZone: "tropical-wet",
    hemisphere: "southern",
    timeZone: "Australia/Darwin",
    coastalInfluence: true,
  },

  // South America
  {
    location: "São Paulo",
    coordinates: { lat: -23.5505, lon: -46.6333 },
    climateZone: "temperate-continental",
    hemisphere: "southern",
    timeZone: "America/Sao_Paulo",
    urbanHeatIsland: true,
  },
  {
    location: "Lima",
    coordinates: { lat: -12.0464, lon: -77.0428 },
    climateZone: "desert-hot",
    hemisphere: "southern",
    timeZone: "America/Lima",
    coastalInfluence: true,
  },
  {
    location: "Manaus",
    coordinates: { lat: -3.119, lon: -60.0217 },
    climateZone: "tropical-wet",
    hemisphere: "southern",
    timeZone: "America/Manaus",
  },

  // Africa
  {
    location: "Cairo",
    coordinates: { lat: 30.0444, lon: 31.2357 },
    climateZone: "desert-hot",
    hemisphere: "northern",
    timeZone: "Africa/Cairo",
  },
  {
    location: "Cape Town",
    coordinates: { lat: -33.9249, lon: 18.4241 },
    climateZone: "mediterranean",
    hemisphere: "southern",
    timeZone: "Africa/Johannesburg",
    coastalInfluence: true,
  },
  {
    location: "Lagos",
    coordinates: { lat: 6.5244, lon: 3.3792 },
    climateZone: "tropical-wet",
    hemisphere: "northern",
    timeZone: "Africa/Lagos",
    coastalInfluence: true,
  },
]

export function useClimateZone(location: string) {
  const [climateData, setClimateData] = useState<LocationClimateData | null>(null)
  const [climateZone, setClimateZone] = useState<ClimateZone | null>(null)
  const [currentSeason, setCurrentSeason] = useState<string>("")

  useEffect(() => {
    // Find location in database
    const locationData = locationClimateDatabase.find((loc) => loc.location.toLowerCase() === location.toLowerCase())

    if (locationData) {
      setClimateData(locationData)

      // Find climate zone
      const zone = climateZones.find((zone) => zone.id === locationData.climateZone)
      setClimateZone(zone || null)

      // Determine current season based on climate zone and hemisphere
      if (zone) {
        const currentMonth = new Date().getMonth() + 1
        let adjustedMonth = currentMonth

        // Adjust for southern hemisphere (seasons are opposite)
        if (locationData.hemisphere === "southern") {
          adjustedMonth = currentMonth + 6
          if (adjustedMonth > 12) adjustedMonth -= 12
        }

        // Find current season based on adjusted month
        const season = Object.entries(zone.seasons).find(([_, seasonData]) => seasonData.months.includes(adjustedMonth))

        setCurrentSeason(season ? season[0] : "")
      }
    } else {
      // Default to temperate continental for unknown locations
      const defaultZone = climateZones.find((zone) => zone.id === "temperate-continental")
      setClimateZone(defaultZone || null)
      setClimateData({
        location,
        coordinates: { lat: 0, lon: 0 },
        climateZone: "temperate-continental",
        hemisphere: "northern",
        timeZone: "UTC",
      })

      // Default season logic
      const currentMonth = new Date().getMonth() + 1
      if (currentMonth >= 3 && currentMonth <= 5) setCurrentSeason("spring")
      else if (currentMonth >= 6 && currentMonth <= 8) setCurrentSeason("summer")
      else if (currentMonth >= 9 && currentMonth <= 11) setCurrentSeason("autumn")
      else setCurrentSeason("winter")
    }
  }, [location])

  return {
    climateData,
    climateZone,
    currentSeason,
    isLoading: !climateData || !climateZone,
  }
}

export function getSeasonalRecommendations(
  climateZone: ClimateZone,
  currentSeason: string,
  climateData: LocationClimateData,
) {
  const season = climateZone.seasons[currentSeason]
  if (!season) return null

  const recommendations = {
    widgets: [] as string[],
    healthTips: [] as string[],
    activities: [] as string[],
    alerts: [] as string[],
    clothing: [] as string[],
  }

  // Climate-specific widget recommendations
  switch (climateZone.seasonalPattern) {
    case "tropical":
      recommendations.widgets.push("humidity-gauge", "heat-index", "uv-index", "air-quality")
      if (currentSeason === "wet-season") {
        recommendations.widgets.push("storm-tracker", "flood-alerts")
        recommendations.alerts.push("Flooding risk", "Heavy rainfall warnings")
      } else {
        recommendations.widgets.push("fire-risk", "drought-monitor")
        recommendations.alerts.push("Fire weather warnings", "Drought conditions")
      }
      break

    case "desert":
      recommendations.widgets.push("heat-index", "uv-index", "dust-storm-tracker", "water-conservation")
      if (currentSeason === "hot-season") {
        recommendations.healthTips.push("Drink water every 15 minutes", "Avoid outdoor activities 10am-4pm")
        recommendations.clothing.push("Light-colored, loose clothing", "Wide-brimmed hat", "UV-protective sunglasses")
      }
      break

    case "polar":
      recommendations.widgets.push("wind-chill", "aurora-forecast", "daylight-tracker", "ice-conditions")
      if (currentSeason === "polar-winter") {
        recommendations.healthTips.push(
          "Layer clothing properly",
          "Watch for hypothermia signs",
          "Use vitamin D supplements",
        )
        recommendations.clothing.push("Insulated boots", "Thermal layers", "Wind-resistant outer shell")
      }
      break

    case "monsoon":
      recommendations.widgets.push("monsoon-tracker", "flood-alerts", "humidity-gauge", "air-quality")
      if (currentSeason === "monsoon") {
        recommendations.alerts.push("Flash flood warnings", "Landslide risk", "Vector-borne disease alerts")
        recommendations.healthTips.push(
          "Boil water before drinking",
          "Use mosquito protection",
          "Avoid waterlogged areas",
        )
      }
      break

    case "mediterranean":
      if (currentSeason === "summer") {
        recommendations.widgets.push("fire-risk", "drought-monitor", "heat-index")
        recommendations.alerts.push("Wildfire warnings", "Water restrictions", "Heat advisories")
      } else if (currentSeason === "winter") {
        recommendations.widgets.push("flood-alerts", "wind-warnings")
      }
      break

    default: // traditional
      recommendations.widgets.push("temperature-chart", "forecast", "seasonal-activities")
      if (currentSeason === "winter") {
        recommendations.widgets.push("wind-chill", "snow-depth", "ice-warning")
      } else if (currentSeason === "summer") {
        recommendations.widgets.push("heat-index", "uv-index", "air-quality")
      }
  }

  // Add location-specific modifications
  if (climateData.coastalInfluence) {
    recommendations.widgets.push("tide-tracker", "marine-weather")
    recommendations.activities.push("Beach activities", "Water sports", "Coastal walks")
  }

  if (climateData.urbanHeatIsland) {
    recommendations.widgets.push("urban-heat-map", "air-quality")
    recommendations.healthTips.push("Seek air-conditioned spaces during heat", "Be aware of higher city temperatures")
  }

  if (climateData.elevation && climateData.elevation > 1000) {
    recommendations.widgets.push("altitude-weather", "uv-index")
    recommendations.healthTips.push("Stay hydrated at altitude", "Use extra sun protection")
  }

  return recommendations
}
