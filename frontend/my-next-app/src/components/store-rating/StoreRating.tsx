"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Review } from "@/types/review-shop"

export default function StoreRating() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      username: "Chimcucuccu",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      comment: "Tuyệt vời 5 sao 10 điểm",
    },
  ])

  const handleRatingChange = (value: number) => {
    setRating(value)
  }

  const handleSubmit = () => {
    if (comment.trim()) {
      const newReview: Review = {
        id: Date.now().toString(),
        username: "User" + Math.floor(Math.random() * 1000),
        avatar: "/placeholder.svg?height=60&width=60",
        rating,
        comment,
      }
      setReviews([newReview, ...reviews])
      setComment("")
      setRating(0)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">Đánh giá cửa hàng</h2>

        <div className="mb-4">
          <div className="flex items-center justify-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => handleRatingChange(star)} className="focus:outline-none">
                <Star
                  className={cn("w-6 h-6 mx-1", rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Xin mời bạn để lại đánh giá để T2BIKE có thể phát triển hơn nhau!"
              className="rounded-full py-6 px-4 border-gray-200"
            />
            <Button
              onClick={handleSubmit}
              className="rounded-full bg-pink-500 hover:bg-pink-600 h-12 w-12 p-0 flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="flex-shrink-0">
                <Image
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{review.username}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-4 h-4",
                          review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mt-1">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
