import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../Card"
import { Star, MessageSquare, TrendingUp, Users } from "lucide-react"

export default function StoreStatsOverview({ stats = {} }) {
  const {
    averageRating = 0,
    totalReviews = 0,
    monthlyGrowth = 0,
    responseRate = 0
  } = stats

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            Average Rating
          </CardTitle>
          <Star className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {averageRating.toFixed(1)}
          </div>
          <p className="text-xs text-gray-400">
            Based on all reviews
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            Total Reviews
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalReviews}</div>
          <p className="text-xs text-gray-400">
            All-time customer reviews
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            Monthly Growth
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            +{monthlyGrowth}%
          </div>
          <p className="text-xs text-gray-400">
            Review growth this month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            Response Rate
          </CardTitle>
          <Users className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {responseRate}%
          </div>
          <p className="text-xs text-gray-400">
            Reviews with responses
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
