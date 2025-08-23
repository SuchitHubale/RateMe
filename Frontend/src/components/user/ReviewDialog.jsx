import React, { useState } from "react"
import { Button } from "../Button"
import { Textarea } from "../Textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Dialog"
import { Star } from "lucide-react"

export function ReviewDialog({ store, onSubmitReview }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const renderStars = (rating, interactive = false, onStarClick) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} ${
              interactive ? "cursor-pointer hover:text-yellow-400" : ""
            }`}
            onClick={() => interactive && onStarClick?.(star)}
          />
        ))}
      </div>
    )
  }

  const handleSubmit = async () => {
    if (rating > 0 && comment.trim()) {
      await onSubmitReview(store, rating, comment)
      setRating(0)
      setComment("")
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Rate This Store
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Rate {store?.name}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Share your experience with other customers
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-300">Your Rating</label>
            {renderStars(rating, true, setRating)}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-300">Your Review</label>
            <Textarea
              placeholder="Tell others about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
            disabled={rating === 0 || !comment.trim()}
          >
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
