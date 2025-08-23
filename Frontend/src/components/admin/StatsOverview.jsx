import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../Card"
import { Users, Store, Star, TrendingUp } from "lucide-react"

export default function StatsOverview({ users, stores, ratings }) {
  const averageRating = ratings.length > 0 
    ? (ratings.reduce((acc, rating) => acc + rating.rating_value, 0) / ratings.length).toFixed(1)
    : "0.0"

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">Total Users</CardTitle>
          <Users className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{users.length}</div>
          <p className="text-xs text-gray-400">Total registered users</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">Active Stores</CardTitle>
          <Store className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stores.length}</div>
          <p className="text-xs text-gray-400">Currently active stores</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">Total Ratings</CardTitle>
          <Star className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{ratings.length}</div>
          <p className="text-xs text-gray-400">Total user ratings</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">Avg Rating</CardTitle>
          <TrendingUp className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{averageRating}</div>
          <p className="text-xs text-gray-400">Average rating score</p>
        </CardContent>
      </Card>
    </div>
  )
}
