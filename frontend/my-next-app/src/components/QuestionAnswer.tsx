"use client"

import { useState } from "react"
import { Heart, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Question = {
  id: string
  user: string
  text: string
  timestamp: string
  likes: number
  liked: boolean
  answers: Answer[]
}

type Answer = {
  id: string
  user: string
  text: string
  timestamp: string
}

export default function QuestionsAnswers() {
  const [question, setQuestion] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [reply, setReply] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      user: "Chimcuccuccu",
      text: "Cháu em học lớp 5 có đi vừa xe này không ạ?",
      timestamp: "2 giờ trước",
      likes: 0,
      liked: false,
      answers: [
        {
          id: "a1",
          user: "T2BIKE",
          text: "Dạ T2BIKE xin chào anh Chimcuccuccu\nĐây là xe size M nên thoải cả là mời anh nhé\nThân mến.",
          timestamp: "1 giờ trước",
        },
      ],
    },
  ])

  const handleQuestionSubmit = () => {
    if (!question.trim()) return

    const newQuestion: Question = {
      id: `q${Date.now()}`,
      user: "Khách hàng",
      text: question,
      timestamp: "Vừa xong",
      likes: 0,
      liked: false,
      answers: [],
    }

    setQuestions([newQuestion, ...questions])
    setQuestion("")
  }

  const handleReplySubmit = (questionId: string) => {
    if (!reply.trim()) return

    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [
              ...q.answers,
              {
                id: `a${Date.now()}`,
                user: "Khách hàng",
                text: reply,
                timestamp: "Vừa xong",
              },
            ],
          }
        }
        return q
      }),
    )

    setReply("")
    setReplyTo(null)
  }

  const toggleLike = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            likes: q.liked ? q.likes - 1 : q.likes + 1,
            liked: !q.liked,
          }
        }
        return q
      }),
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-center mb-6">Hỏi và đáp</h2>

      <div className="mb-6 relative">
        <Textarea
          placeholder="Xin mời để lại câu hỏi, T2BIKE sẽ trả lời lại trong 1h, các câu hỏi từ 22h - 6h sẽ được trả lời vào sáng hôm sau."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="pr-16 min-h-[100px] resize-none rounded-lg border-gray-200 focus:border-gray-300 focus:ring-gray-200"
        />
        <Button
          size="icon"
          className="absolute right-3 bottom-3 rounded-full bg-pink-500 hover:bg-pink-600"
          onClick={handleQuestionSubmit}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {questions.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold">{q.user}</div>
                  <div className="text-sm text-gray-500">{q.timestamp}</div>
                </div>
                <p className="mb-3">{q.text}</p>
                <div className="flex justify-between items-center">
                  <motion.button
                    className={cn(
                      "flex items-center gap-1 px-3 py-1 rounded-full",
                      q.liked ? "text-pink-500" : "text-gray-500",
                    )}
                    onClick={() => toggleLike(q.id)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className={cn("w-4 h-4", q.liked && "fill-pink-500")} />
                    <span>{q.likes > 0 ? q.likes : ""}</span>
                  </motion.button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setReplyTo(replyTo === q.id ? null : q.id)}
                  >
                    Trả lời
                  </Button>
                </div>
              </div>

              {q.answers.map((answer) => (
                <div key={answer.id} className="bg-gray-50 p-4 border-t border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-pink-500">{answer.user}</div>
                    <div className="text-sm text-gray-500">{answer.timestamp}</div>
                  </div>
                  <p className="whitespace-pre-line">{answer.text}</p>
                </div>
              ))}

              {replyTo === q.id && (
                <motion.div
                  className="p-4 bg-gray-50 border-t border-gray-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="relative">
                    <Textarea
                      placeholder="Nhập câu trả lời của bạn..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="pr-16 min-h-[80px] resize-none rounded-lg border-gray-200 focus:border-gray-300 focus:ring-gray-200"
                    />
                    <Button
                      size="icon"
                      className="absolute right-3 bottom-3 rounded-full bg-pink-500 hover:bg-pink-600"
                      onClick={() => handleReplySubmit(q.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

