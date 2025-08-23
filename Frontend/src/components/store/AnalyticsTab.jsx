import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Card"
import { Star, TrendingUp, TrendingDown, Minus, Calendar, Users } from "lucide-react"

export default function AnalyticsTab({ analytics = {}, reviews = [] }) {
  const {
    ratingDistribution = [],
    totalReviews = 0,
    averageRating = 0
  } = analytics

  // Default rating distribution if no data
  const defaultRatingDistribution = [
    { rating: 5, count: 0 },
    { rating: 4, count: 0 },
    { rating: 3, count: 0 },
    { rating: 2, count: 0 },
    { rating: 1, count: 0 }
  ]

  const displayRatingDistribution = ratingDistribution.length > 0 ? ratingDistribution : defaultRatingDistribution

  // Calculate recent performance metrics
  const calculateRecentPerformance = () => {
    if (!reviews || reviews.length === 0) {
      return {
        weeklyTrend: 'no-data',
        weeklyChange: 0,
        recentAverage: 0,
        previousAverage: 0,
        recentReviews: 0,
        weeklyData: []
      }
    }

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    // Filter reviews by time periods
    const recentWeekReviews = reviews.filter(review => {
      const reviewDate = new Date(review.created_at || review.date)
      return reviewDate >= oneWeekAgo && reviewDate <= now
    })

    const previousWeekReviews = reviews.filter(review => {
      const reviewDate = new Date(review.created_at || review.date)
      return reviewDate >= twoWeeksAgo && reviewDate < oneWeekAgo
    })

    // Calculate averages
    const recentAverage = recentWeekReviews.length > 0 
      ? recentWeekReviews.reduce((sum, review) => sum + review.rating, 0) / recentWeekReviews.length
      : 0

    const previousAverage = previousWeekReviews.length > 0
      ? previousWeekReviews.reduce((sum, review) => sum + review.rating, 0) / previousWeekReviews.length
      : 0

    // Calculate trend
    let weeklyTrend = 'stable'
    let weeklyChange = 0

    if (recentAverage > 0 && previousAverage > 0) {
      weeklyChange = ((recentAverage - previousAverage) / previousAverage) * 100
      if (weeklyChange > 5) weeklyTrend = 'up'
      else if (weeklyChange < -5) weeklyTrend = 'down'
    } else if (recentAverage > 0 && previousAverage === 0) {
      weeklyTrend = 'up'
      weeklyChange = 100
    }

    // Generate daily data for the past week
    const weeklyData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayReviews = reviews.filter(review => {
        const reviewDate = new Date(review.created_at || review.date)
        return reviewDate.toDateString() === date.toDateString()
      })
      
      weeklyData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString(),
        reviews: dayReviews.length,
        averageRating: dayReviews.length > 0 
          ? dayReviews.reduce((sum, review) => sum + review.rating, 0) / dayReviews.length
          : 0
      })
    }

    return {
      weeklyTrend,
      weeklyChange: Math.abs(weeklyChange),
      recentAverage: Math.round(recentAverage * 10) / 10,
      previousAverage: Math.round(previousAverage * 10) / 10,
      recentReviews: recentWeekReviews.length,
      weeklyData
    }
  }

  const performanceData = calculateRecentPerformance()

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-400'
      case 'down':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getTrendText = (trend, change) => {
    if (trend === 'no-data') return 'No recent data'
    if (trend === 'up') return `+${change.toFixed(1)}% vs last week`
    if (trend === 'down') return `-${change.toFixed(1)}% vs last week`
    return 'Stable performance'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Rating Distribution</CardTitle>
          <CardDescription className="text-gray-400">How customers rate your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayRatingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-300">{item.rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: totalReviews > 0 ? `${(item.count / totalReviews) * 100}%` : '0%',
                    }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-8">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
          {totalReviews === 0 && (
            <p className="text-center text-gray-500 mt-4 text-sm">
              No reviews yet. Start getting reviews to see your rating distribution!
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Performance</CardTitle>
          <CardDescription className="text-gray-400">Your store's performance over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          {performanceData.weeklyTrend === 'no-data' ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 mb-2">No recent reviews</p>
              <p className="text-sm text-gray-500">
                Get more reviews to see your performance trends
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Performance Summary */}
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {getTrendIcon(performanceData.weeklyTrend)}
                  <div>
                    <p className="text-white font-medium">
                      {performanceData.recentAverage.toFixed(1)} ★ Average
                    </p>
                    <p className={`text-sm ${getTrendColor(performanceData.weeklyTrend)}`}>
                      {getTrendText(performanceData.weeklyTrend, performanceData.weeklyChange)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{performanceData.recentReviews}</p>
                  <p className="text-sm text-gray-400">Reviews this week</p>
                </div>
              </div>

              {/* Weekly Breakdown */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Daily Activity
                </h4>
                <div className="space-y-2">
                  {performanceData.weeklyData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 w-12">{day.day}</span>
                      <div className="flex-1 mx-3">
                        <div className="bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: day.reviews > 0 ? `${Math.min((day.reviews / Math.max(...performanceData.weeklyData.map(d => d.reviews))) * 100, 100)}%` : '0%'
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-20 justify-end">
                        {day.reviews > 0 ? (
                          <>
                            <span className="text-yellow-400">{day.averageRating.toFixed(1)}★</span>
                            <span className="text-gray-500">({day.reviews})</span>
                          </>
                        ) : (
                          <span className="text-gray-500">No reviews</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Insights */}
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                <h4 className="text-sm font-medium text-blue-300 mb-2">💡 Insights</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  {performanceData.recentReviews === 0 && (
                    <p>• No reviews this week - consider reaching out to recent customers</p>
                  )}
                  {performanceData.weeklyTrend === 'up' && (
                    <p>• Great job! Your ratings are trending upward</p>
                  )}
                  {performanceData.weeklyTrend === 'down' && (
                    <p>• Consider following up with recent customers to improve satisfaction</p>
                  )}
                  {performanceData.recentAverage >= 4.5 && (
                    <p>• Excellent performance! Keep up the great work</p>
                  )}
                  {performanceData.recentAverage < 3.5 && performanceData.recentAverage > 0 && (
                    <p>• Focus on addressing customer concerns to improve ratings</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
