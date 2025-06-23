"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useClimateZone } from "@/components/climate-zones"
import {
  CheckCircle,
  Circle,
  Home,
  Heart,
  Car,
  Briefcase,
  Users,
  AlertTriangle,
  Shield,
  Lightbulb,
  Target,
  Star,
  BookOpen,
  Settings,
} from "lucide-react"

interface UserProfile {
  homeType: "apartment" | "house" | "condo" | "mobile"
  homeOwnership: "own" | "rent"
  householdSize: number
  hasChildren: boolean
  hasElderly: boolean
  hasPets: boolean
  occupation: "office" | "outdoor" | "healthcare" | "education" | "retail" | "other"
  commute: "car" | "public" | "bike" | "walk" | "remote"
  budget: "low" | "medium" | "high"
  priorities: string[]
  healthConditions: string[]
  currentAdaptations: string[]
}

interface AdaptationRecommendation {
  id: string
  category: "home" | "health" | "transportation" | "work" | "community" | "emergency"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  urgency: "immediate" | "short-term" | "long-term"
  cost: "free" | "low" | "medium" | "high"
  difficulty: "easy" | "moderate" | "difficult"
  timeframe: string
  climateRisks: string[]
  benefits: string[]
  steps: string[]
  resources: Array<{ title: string; url: string; type: "guide" | "product" | "service" }>
  seasonality?: string
  effectiveness: number // 1-100
  cobenefits: string[]
  prerequisites?: string[]
}

interface ClimateAdaptationAdvisorProps {
  location: string
  climateData: any
  onClose: () => void
}

export function ClimateAdaptationAdvisor({ location, climateData, onClose }: ClimateAdaptationAdvisorProps) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    homeType: "house",
    homeOwnership: "own",
    householdSize: 2,
    hasChildren: false,
    hasElderly: false,
    hasPets: false,
    occupation: "office",
    commute: "car",
    budget: "medium",
    priorities: [],
    healthConditions: [],
    currentAdaptations: [],
  })
  const [recommendations, setRecommendations] = useState<AdaptationRecommendation[]>([])
  const [completedAdaptations, setCompletedAdaptations] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [showProfileSetup, setShowProfileSetup] = useState(true)
  const [adaptationProgress, setAdaptationProgress] = useState(0)
  const { climateZone, currentSeason } = useClimateZone(location)

  useEffect(() => {
    if (!showProfileSetup) {
      generateRecommendations()
    }
  }, [userProfile, showProfileSetup, climateData])

  useEffect(() => {
    const completed = recommendations.filter((rec) => completedAdaptations.includes(rec.id))
    const progress = recommendations.length > 0 ? (completed.length / recommendations.length) * 100 : 0
    setAdaptationProgress(progress)
  }, [completedAdaptations, recommendations])

  const generateRecommendations = () => {
    const recs: AdaptationRecommendation[] = []

    // Analyze climate risks from the climate data
    const temperatureIncrease = climateData?.impacts?.find((i: any) => i.indicator === "Annual Average Temperature")
    const heatWaveIncrease = climateData?.impacts?.find((i: any) => i.indicator === "Heat Wave Frequency")
    const precipitationChange = climateData?.impacts?.find((i: any) => i.indicator === "Heavy Rainfall Events")

    // HOME ADAPTATIONS
    if (temperatureIncrease?.trend === "increasing") {
      // Cooling adaptations
      recs.push({
        id: "home-cooling-upgrade",
        category: "home",
        title: "Upgrade Home Cooling System",
        description: "Install or upgrade air conditioning with energy-efficient models to handle increasing heat",
        priority: heatWaveIncrease?.magnitude > 2 ? "high" : "medium",
        urgency: "short-term",
        cost: userProfile.homeOwnership === "own" ? "high" : "medium",
        difficulty: userProfile.homeOwnership === "own" ? "moderate" : "easy",
        timeframe: "1-3 months",
        climateRisks: ["extreme heat", "heat waves", "higher temperatures"],
        benefits: ["Improved comfort", "Health protection", "Better sleep quality", "Increased home value"],
        steps: [
          "Assess current cooling capacity",
          "Get quotes from HVAC contractors",
          "Choose energy-efficient models (SEER 16+)",
          "Schedule professional installation",
          "Set up maintenance schedule",
        ],
        resources: [
          { title: "Energy Star AC Guide", url: "#", type: "guide" },
          { title: "Local HVAC Contractors", url: "#", type: "service" },
          { title: "Cooling Cost Calculator", url: "#", type: "guide" },
        ],
        effectiveness: 90,
        cobenefits: ["Lower humidity", "Better air filtration", "Reduced energy costs with efficient models"],
        prerequisites: userProfile.homeOwnership === "rent" ? ["Landlord approval"] : undefined,
      })

      recs.push({
        id: "home-insulation-upgrade",
        category: "home",
        title: "Improve Home Insulation",
        description: "Add or upgrade insulation to keep cool air in and hot air out",
        priority: "medium",
        urgency: "short-term",
        cost: "medium",
        difficulty: "moderate",
        timeframe: "2-4 weeks",
        climateRisks: ["extreme heat", "higher energy costs"],
        benefits: ["Reduced cooling costs", "More consistent temperatures", "Improved comfort"],
        steps: [
          "Conduct home energy audit",
          "Identify insulation gaps",
          "Choose appropriate insulation type",
          "Install or hire professionals",
          "Seal air leaks",
        ],
        resources: [
          { title: "Home Insulation Guide", url: "#", type: "guide" },
          { title: "Energy Audit Services", url: "#", type: "service" },
        ],
        effectiveness: 75,
        cobenefits: ["Lower heating costs in winter", "Reduced noise", "Better indoor air quality"],
      })

      recs.push({
        id: "window-treatments",
        category: "home",
        title: "Install Heat-Blocking Window Treatments",
        description: "Add reflective blinds, thermal curtains, or window film to reduce solar heat gain",
        priority: "medium",
        urgency: "immediate",
        cost: "low",
        difficulty: "easy",
        timeframe: "1-2 days",
        climateRisks: ["extreme heat", "UV exposure"],
        benefits: ["Immediate cooling", "UV protection", "Privacy", "Reduced glare"],
        steps: [
          "Measure windows",
          "Choose appropriate treatments",
          "Install blinds or curtains",
          "Apply window film if needed",
          "Adjust for optimal cooling",
        ],
        resources: [
          { title: "Window Treatment Guide", url: "#", type: "guide" },
          { title: "Reflective Window Film", url: "#", type: "product" },
        ],
        effectiveness: 60,
        cobenefits: ["Enhanced privacy", "Reduced furniture fading", "Better sleep"],
      })
    }

    if (precipitationChange?.trend === "increasing") {
      recs.push({
        id: "flood-protection",
        category: "home",
        title: "Install Flood Protection Measures",
        description: "Protect your home from increased flooding risk with drainage and barriers",
        priority: "high",
        urgency: "short-term",
        cost: "medium",
        difficulty: "moderate",
        timeframe: "1-2 months",
        climateRisks: ["flooding", "heavy rainfall", "storm damage"],
        benefits: ["Property protection", "Reduced insurance costs", "Peace of mind"],
        steps: [
          "Assess flood risk for your property",
          "Install proper drainage systems",
          "Consider flood barriers or sandbags",
          "Waterproof basement if applicable",
          "Review flood insurance coverage",
        ],
        resources: [
          { title: "Flood Protection Guide", url: "#", type: "guide" },
          { title: "Drainage Solutions", url: "#", type: "product" },
          { title: "Flood Insurance Info", url: "#", type: "guide" },
        ],
        effectiveness: 85,
        cobenefits: ["Better yard drainage", "Reduced erosion", "Increased property value"],
      })

      recs.push({
        id: "rainwater-harvesting",
        category: "home",
        title: "Install Rainwater Collection System",
        description: "Capture and store rainwater for garden use and reduce runoff",
        priority: "low",
        urgency: "long-term",
        cost: "low",
        difficulty: "easy",
        timeframe: "1 week",
        climateRisks: ["heavy rainfall", "water scarcity"],
        benefits: ["Water conservation", "Reduced water bills", "Garden irrigation"],
        steps: [
          "Install rain barrels or cisterns",
          "Connect to downspouts",
          "Add overflow protection",
          "Install spigot for easy access",
          "Maintain system regularly",
        ],
        resources: [
          { title: "Rain Barrel Installation", url: "#", type: "guide" },
          { title: "Rainwater Collection Systems", url: "#", type: "product" },
        ],
        effectiveness: 50,
        cobenefits: ["Reduced stormwater runoff", "Free water for plants", "Environmental benefits"],
      })
    }

    // HEALTH ADAPTATIONS
    if (heatWaveIncrease?.trend === "increasing") {
      recs.push({
        id: "heat-health-plan",
        category: "health",
        title: "Develop Personal Heat Safety Plan",
        description: "Create a plan to protect yourself and family during extreme heat events",
        priority: userProfile.hasElderly || userProfile.hasChildren ? "high" : "medium",
        urgency: "immediate",
        cost: "free",
        difficulty: "easy",
        timeframe: "1 day",
        climateRisks: ["heat waves", "extreme heat", "heat-related illness"],
        benefits: ["Health protection", "Emergency preparedness", "Peace of mind"],
        steps: [
          "Identify cooling centers in your area",
          "Stock up on electrolyte drinks",
          "Plan indoor activities for hot days",
          "Know heat illness symptoms",
          "Create buddy system for vulnerable family members",
        ],
        resources: [
          { title: "Heat Safety Guidelines", url: "#", type: "guide" },
          { title: "Local Cooling Centers", url: "#", type: "service" },
          { title: "Heat Illness Prevention", url: "#", type: "guide" },
        ],
        effectiveness: 95,
        cobenefits: ["General emergency preparedness", "Family safety awareness"],
      })

      if (userProfile.hasChildren) {
        recs.push({
          id: "child-heat-protection",
          category: "health",
          title: "Child-Specific Heat Protection",
          description: "Special measures to protect children from heat-related health risks",
          priority: "high",
          urgency: "immediate",
          cost: "low",
          difficulty: "easy",
          timeframe: "1 week",
          climateRisks: ["extreme heat", "heat exhaustion", "dehydration"],
          benefits: ["Child safety", "Reduced heat illness risk", "Better outdoor activity planning"],
          steps: [
            "Adjust outdoor activity schedules",
            "Ensure proper hydration habits",
            "Choose appropriate clothing",
            "Teach heat safety to children",
            "Monitor for heat illness signs",
          ],
          resources: [
            { title: "Child Heat Safety", url: "#", type: "guide" },
            { title: "Cooling Products for Kids", url: "#", type: "product" },
          ],
          effectiveness: 90,
          cobenefits: ["Better outdoor safety habits", "Increased heat awareness"],
        })
      }
    }

    // TRANSPORTATION ADAPTATIONS
    if (userProfile.commute === "car" && temperatureIncrease?.trend === "increasing") {
      recs.push({
        id: "vehicle-heat-protection",
        category: "transportation",
        title: "Protect Vehicle from Extreme Heat",
        description: "Adapt your vehicle and driving habits for increasing heat",
        priority: "medium",
        urgency: "short-term",
        cost: "low",
        difficulty: "easy",
        timeframe: "1 week",
        climateRisks: ["extreme heat", "vehicle overheating", "tire blowouts"],
        benefits: ["Vehicle longevity", "Safety", "Comfort", "Reduced breakdown risk"],
        steps: [
          "Install sunshades or window tinting",
          "Check cooling system regularly",
          "Monitor tire pressure more frequently",
          "Keep emergency water and supplies",
          "Plan routes to avoid extreme heat exposure",
        ],
        resources: [
          { title: "Vehicle Heat Protection", url: "#", type: "guide" },
          { title: "Car Sunshades", url: "#", type: "product" },
          { title: "Emergency Car Kit", url: "#", type: "product" },
        ],
        effectiveness: 70,
        cobenefits: ["UV protection", "Reduced fuel costs", "Better vehicle maintenance"],
      })
    }

    if (precipitationChange?.trend === "increasing") {
      recs.push({
        id: "flood-safe-transportation",
        category: "transportation",
        title: "Develop Flood-Safe Transportation Plan",
        description: "Plan alternative routes and transportation methods for flooding events",
        priority: "medium",
        urgency: "short-term",
        cost: "free",
        difficulty: "easy",
        timeframe: "1 day",
        climateRisks: ["flooding", "road closures", "transportation disruption"],
        benefits: ["Mobility during floods", "Safety", "Reduced travel delays"],
        steps: [
          "Identify flood-prone routes",
          "Map alternative routes",
          "Download flood monitoring apps",
          "Plan public transportation alternatives",
          "Keep emergency supplies in vehicle",
        ],
        resources: [
          { title: "Flood Route Planning", url: "#", type: "guide" },
          { title: "Flood Alert Apps", url: "#", type: "service" },
        ],
        effectiveness: 80,
        cobenefits: ["Better route knowledge", "Emergency preparedness"],
      })
    }

    // WORK ADAPTATIONS
    if (userProfile.occupation === "outdoor" && temperatureIncrease?.trend === "increasing") {
      recs.push({
        id: "outdoor-work-heat-safety",
        category: "work",
        title: "Implement Outdoor Work Heat Safety",
        description: "Adapt work practices and equipment for extreme heat conditions",
        priority: "high",
        urgency: "immediate",
        cost: "low",
        difficulty: "easy",
        timeframe: "1 week",
        climateRisks: ["heat exhaustion", "heat stroke", "reduced productivity"],
        benefits: ["Worker safety", "Maintained productivity", "Reduced sick days"],
        steps: [
          "Adjust work schedules to avoid peak heat",
          "Increase hydration frequency",
          "Use cooling equipment and clothing",
          "Take more frequent breaks",
          "Monitor heat stress symptoms",
        ],
        resources: [
          { title: "Outdoor Worker Heat Safety", url: "#", type: "guide" },
          { title: "Cooling Vests", url: "#", type: "product" },
          { title: "Heat Stress Monitoring", url: "#", type: "guide" },
        ],
        effectiveness: 95,
        cobenefits: ["Better work-life balance", "Improved health awareness"],
      })
    }

    // COMMUNITY ADAPTATIONS
    recs.push({
      id: "community-resilience",
      category: "community",
      title: "Build Community Climate Resilience",
      description: "Connect with neighbors and local groups to build collective adaptation capacity",
      priority: "low",
      urgency: "long-term",
      cost: "free",
      difficulty: "easy",
      timeframe: "Ongoing",
      climateRisks: ["all climate risks", "social isolation", "emergency response"],
      benefits: ["Community support", "Shared resources", "Collective action", "Social connections"],
      steps: [
        "Join local climate action groups",
        "Participate in neighborhood preparedness",
        "Share adaptation experiences",
        "Advocate for community improvements",
        "Support vulnerable neighbors",
      ],
      resources: [
        { title: "Community Climate Groups", url: "#", type: "service" },
        { title: "Neighborhood Preparedness", url: "#", type: "guide" },
      ],
      effectiveness: 60,
      cobenefits: ["Social connections", "Civic engagement", "Shared knowledge"],
    })

    // EMERGENCY PREPAREDNESS
    recs.push({
      id: "climate-emergency-kit",
      category: "emergency",
      title: "Build Climate-Specific Emergency Kit",
      description: "Prepare emergency supplies tailored to your local climate risks",
      priority: "high",
      urgency: "short-term",
      cost: "medium",
      difficulty: "easy",
      timeframe: "1 week",
      climateRisks: ["all extreme weather", "power outages", "supply disruptions"],
      benefits: ["Emergency preparedness", "Peace of mind", "Family safety"],
      steps: [
        "Assess local climate risks",
        "Stock appropriate emergency supplies",
        "Include climate-specific items",
        "Plan for power outages",
        "Create family emergency plan",
      ],
      resources: [
        { title: "Emergency Kit Checklist", url: "#", type: "guide" },
        { title: "Emergency Supplies", url: "#", type: "product" },
        { title: "Family Emergency Planning", url: "#", type: "guide" },
      ],
      effectiveness: 85,
      cobenefits: ["General emergency preparedness", "Family coordination"],
    })

    // Filter recommendations based on user profile
    const filteredRecs = recs.filter((rec) => {
      // Filter by home ownership
      if (rec.prerequisites?.includes("Landlord approval") && userProfile.homeOwnership === "rent") {
        return false
      }

      // Filter by budget
      if (userProfile.budget === "low" && rec.cost === "high") {
        return false
      }

      return true
    })

    setRecommendations(filteredRecs)
  }

  const toggleAdaptationComplete = (adaptationId: string) => {
    setCompletedAdaptations((prev) =>
      prev.includes(adaptationId) ? prev.filter((id) => id !== adaptationId) : [...prev, adaptationId],
    )
  }

  const filteredRecommendations = recommendations.filter((rec) => {
    if (selectedCategory !== "all" && rec.category !== selectedCategory) return false
    if (selectedPriority !== "all" && rec.priority !== selectedPriority) return false
    return true
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "home":
        return Home
      case "health":
        return Heart
      case "transportation":
        return Car
      case "work":
        return Briefcase
      case "community":
        return Users
      case "emergency":
        return Shield
      default:
        return Circle
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300"
      case "low":
        return "bg-green-500/20 text-green-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getCostColor = (cost: string) => {
    switch (cost) {
      case "free":
        return "bg-green-500/20 text-green-300"
      case "low":
        return "bg-blue-500/20 text-blue-300"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300"
      case "high":
        return "bg-red-500/20 text-red-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  if (showProfileSetup) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg w-full max-w-4xl h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Settings className="w-6 h-6 mr-3" />
                Climate Adaptation Profile
              </h2>
              <p className="text-white/70">Tell us about yourself to get personalized recommendations</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    Housing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Home Type</Label>
                    <Select
                      value={userProfile.homeType}
                      onValueChange={(value: any) => setUserProfile({ ...userProfile, homeType: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="mobile">Mobile Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Ownership</Label>
                    <Select
                      value={userProfile.homeOwnership}
                      onValueChange={(value: any) => setUserProfile({ ...userProfile, homeOwnership: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="own">Own</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Household Size</Label>
                    <Input
                      type="number"
                      value={userProfile.householdSize}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, householdSize: Number.parseInt(e.target.value) || 1 })
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={userProfile.hasChildren}
                        onCheckedChange={(checked) => setUserProfile({ ...userProfile, hasChildren: checked })}
                      />
                      <Label className="text-white">Has Children</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={userProfile.hasElderly}
                        onCheckedChange={(checked) => setUserProfile({ ...userProfile, hasElderly: checked })}
                      />
                      <Label className="text-white">Has Elderly Members</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={userProfile.hasPets}
                        onCheckedChange={(checked) => setUserProfile({ ...userProfile, hasPets: checked })}
                      />
                      <Label className="text-white">Has Pets</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Work & Lifestyle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Occupation Type</Label>
                    <Select
                      value={userProfile.occupation}
                      onValueChange={(value: any) => setUserProfile({ ...userProfile, occupation: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office">Office Work</SelectItem>
                        <SelectItem value="outdoor">Outdoor Work</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Primary Commute</Label>
                    <Select
                      value={userProfile.commute}
                      onValueChange={(value: any) => setUserProfile({ ...userProfile, commute: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="public">Public Transit</SelectItem>
                        <SelectItem value="bike">Bicycle</SelectItem>
                        <SelectItem value="walk">Walking</SelectItem>
                        <SelectItem value="remote">Work from Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Budget for Adaptations</Label>
                    <Select
                      value={userProfile.budget}
                      onValueChange={(value: any) => setUserProfile({ ...userProfile, budget: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low ($0-$500)</SelectItem>
                        <SelectItem value="medium">Medium ($500-$5,000)</SelectItem>
                        <SelectItem value="high">High ($5,000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Priorities & Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Top Priorities (select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {[
                        "Health & Safety",
                        "Cost Savings",
                        "Comfort",
                        "Property Value",
                        "Environmental Impact",
                        "Family Protection",
                        "Work Productivity",
                        "Community Resilience",
                      ].map((priority) => (
                        <div key={priority} className="flex items-center space-x-2">
                          <Switch
                            checked={userProfile.priorities.includes(priority)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setUserProfile({
                                  ...userProfile,
                                  priorities: [...userProfile.priorities, priority],
                                })
                              } else {
                                setUserProfile({
                                  ...userProfile,
                                  priorities: userProfile.priorities.filter((p) => p !== priority),
                                })
                              }
                            }}
                          />
                          <Label className="text-white text-sm">{priority}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Health Considerations (select if applicable)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {[
                        "Heat Sensitivity",
                        "Respiratory Issues",
                        "Mobility Limitations",
                        "Chronic Conditions",
                        "Allergies",
                        "Heart Conditions",
                      ].map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Switch
                            checked={userProfile.healthConditions.includes(condition)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setUserProfile({
                                  ...userProfile,
                                  healthConditions: [...userProfile.healthConditions, condition],
                                })
                              } else {
                                setUserProfile({
                                  ...userProfile,
                                  healthConditions: userProfile.healthConditions.filter((c) => c !== condition),
                                })
                              }
                            }}
                          />
                          <Label className="text-white text-sm">{condition}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowProfileSetup(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Generate Recommendations
              </Button>
            </div>
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
              <Lightbulb className="w-6 h-6 mr-3" />
              Climate Adaptation Recommendations - {location}
            </h2>
            <p className="text-white/70">Personalized suggestions to adapt to changing climate conditions</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowProfileSetup(true)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
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
          {/* Progress Overview */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Adaptation Progress</h3>
                  <p className="text-white/70 text-sm">
                    {completedAdaptations.length} of {recommendations.length} recommendations completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{Math.round(adaptationProgress)}%</div>
                  <div className="text-white/70 text-sm">Complete</div>
                </div>
              </div>
              <Progress value={adaptationProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="home">🏠 Home</SelectItem>
                <SelectItem value="health">❤️ Health</SelectItem>
                <SelectItem value="transportation">🚗 Transportation</SelectItem>
                <SelectItem value="work">💼 Work</SelectItem>
                <SelectItem value="community">👥 Community</SelectItem>
                <SelectItem value="emergency">🛡️ Emergency</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">🔴 High</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="low">🟢 Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-white/70 text-sm">
              Showing {filteredRecommendations.length} of {recommendations.length} recommendations
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRecommendations.map((rec) => {
              const IconComponent = getCategoryIcon(rec.category)
              const isCompleted = completedAdaptations.includes(rec.id)

              return (
                <Card
                  key={rec.id}
                  className={`bg-white/10 backdrop-blur-md border-white/20 ${
                    isCompleted ? "opacity-75 border-green-500/50" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Button
                          onClick={() => toggleAdaptationComplete(rec.id)}
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto hover:bg-transparent"
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <Circle className="w-6 h-6 text-white/50" />
                          )}
                        </Button>
                        <div>
                          <CardTitle className={`text-white flex items-center ${isCompleted ? "line-through" : ""}`}>
                            <IconComponent className="w-5 h-5 mr-2" />
                            {rec.title}
                          </CardTitle>
                          <p className="text-white/70 text-sm mt-1">{rec.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-3">
                      <Badge className={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
                      <Badge className={getCostColor(rec.cost)}>{rec.cost} cost</Badge>
                      <Badge className="bg-blue-500/20 text-blue-300">{rec.timeframe}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-white/10">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="steps">Steps</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div>
                          <h4 className="text-white font-semibold mb-2">Climate Risks Addressed:</h4>
                          <div className="flex flex-wrap gap-1">
                            {rec.climateRisks.map((risk, index) => (
                              <Badge key={index} className="bg-red-500/20 text-red-300 text-xs">
                                {risk}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-2">Benefits:</h4>
                          <ul className="text-white/70 text-sm space-y-1">
                            {rec.benefits.slice(0, 3).map((benefit, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-white/70 text-sm">Effectiveness:</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={rec.effectiveness} className="w-20 h-2" />
                              <span className="text-white text-sm">{rec.effectiveness}%</span>
                            </div>
                          </div>
                          <Badge className="bg-purple-500/20 text-purple-300">{rec.difficulty}</Badge>
                        </div>
                      </TabsContent>

                      <TabsContent value="steps" className="space-y-3">
                        <h4 className="text-white font-semibold">Implementation Steps:</h4>
                        <ol className="text-white/70 text-sm space-y-2">
                          {rec.steps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-blue-500/20 text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </TabsContent>

                      <TabsContent value="resources" className="space-y-3">
                        <h4 className="text-white font-semibold">Helpful Resources:</h4>
                        <div className="space-y-2">
                          {rec.resources.map((resource, index) => (
                            <div key={index} className="flex items-center justify-between bg-white/5 rounded p-2">
                              <div className="flex items-center space-x-2">
                                {resource.type === "guide" && <BookOpen className="w-4 h-4 text-blue-400" />}
                                {resource.type === "product" && <Star className="w-4 h-4 text-yellow-400" />}
                                {resource.type === "service" && <Users className="w-4 h-4 text-green-400" />}
                                <span className="text-white text-sm">{resource.title}</span>
                              </div>
                              <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/20">
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredRecommendations.length === 0 && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No Recommendations Found</h3>
                <p className="text-white/70">
                  Try adjusting your filters or updating your profile to see more recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
