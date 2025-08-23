import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Card"
import { Button } from "../Button"
import { Textarea } from "../Textarea"
import { Label } from "../Label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Dialog"
import { Star, Reply } from "lucide-react"

export default function ReviewsManagement({ reviews, onSubmitResponse }) {
  const [selectedReview, setSelectedReview] = useState(null)
  const [responseText, setResponseText] = useState("")

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )

  const handleSubmitResponse = async () => {
    if (responseText.trim() && selectedReview) {
      await onSubmitResponse(selectedReview, responseText)
      setResponseText("")
      setSelectedReview(null)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Customer Reviews</CardTitle>
        <CardDescription className="text-gray-400">
          Manage and respond to customer feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-white">
                    {`User id: ${review.user_id}`}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-300">
                      {review.date}
                    </span>
                  </div>
                </div>
                {!review.response && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReview(review)}
                        className="flex items-center gap-2 bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:text-white"
                      >
                        <Reply className="h-4 w-4" />
                        Reply
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Reply to Review</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Respond to{" "}
                          {review.customerName ||
                            `User ${review.user_id}`}
                          's review
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="text-sm font-medium text-white">
                              {review.customerName ||
                                `User ${review.user_id}`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">
                            {review.comment}
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="response" className="text-gray-300">
                            Your Response
                          </Label>
                          <Textarea
                            id="response"
                            placeholder="Thank you for your feedback..."
                            value={responseText}
                            onChange={(e) =>
                              setResponseText(e.target.value)
                            }
                            rows={4}
                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                          />
                        </div>
                        <Button
                          onClick={handleSubmitResponse}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={!responseText.trim()}
                        >
                          Send Response
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <p className="text-gray-300 mb-3">{review.comment}</p>
              {review.response && (
                <div className="bg-blue-900/30 border-l-4 border-blue-500 p-3 mt-3">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">
                      Your response:
                    </span>{" "}
                    {review.response}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
