import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Card"
import { Star } from "lucide-react"

export function UserReviews({ userReviews, stores }) {
  const getStoreNameById = (storeId) => {
    const store = stores.find(s => s.store_id === storeId || s._id === storeId || s.id === storeId);
    return store ? store.name : 'Unknown Store';
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">My Reviews</CardTitle>
        <CardDescription className="text-gray-400">Your rating history and reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userReviews.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">No reviews yet</div>
              <div className="text-gray-500">Start rating stores to see your reviews here</div>
            </div>
          ) : (
            userReviews.map((review) => {
              return (
                <div key={review.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">
                      {getStoreNameById(review.storeId)}
                    </h3>
                    <div className="flex items-center gap-2">
                      {renderStars(review.ratingValue)}
                      <span className="text-sm text-gray-400">
                        {review.createdAt 
                          ? new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short', 
                              day: 'numeric'
                            })
                          : review.createdAt || "N/A"
                        }
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
