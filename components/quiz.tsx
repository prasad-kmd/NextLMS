"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { gradeQuiz } from "@/app/actions/quiz-actions"
import { toast } from "sonner"

export interface Question {
  id: string
  text: string
  options: string[]
}

export interface QuizProps {
  id: string
  title: string
  questions: Question[]
}

export function Quiz({ id, title, questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
  }

  const handleNextQuestion = async () => {
    if (selectedOption === null) return

    const newAnswers = [...userAnswers, selectedOption]
    setUserAnswers(newAnswers)

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      setIsSubmitting(true)
      try {
        const res = await gradeQuiz(id, newAnswers)
        setResult(res)
      } catch (error) {
        toast.error("Failed to submit quiz")
        console.error(error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setUserAnswers([])
    setResult(null)
  }

  if (!questions || questions.length === 0) {
    return (
      <Card className="my-8 border-red-500/50 bg-red-500/5">
        <CardContent className="pt-6 text-center text-red-500">
          No questions provided for this quiz.
        </CardContent>
      </Card>
    )
  }

  if (result) {
    const percentage = Math.round((result.score / result.total) * 100)

    return (
      <Card className="my-8 overflow-hidden border-2 border-primary/20 bg-background/50 backdrop-blur-sm animate-in zoom-in-95 duration-300">
        <CardHeader className="bg-primary/5 text-center pb-8 pt-8 border-b">
          <CardTitle className="text-2xl font-google-sans">Quiz Completed!</CardTitle>
          <div className="mt-4 flex flex-col items-center">
            <div className="text-3xl font-bold text-foreground mb-2">
              {result.score} / {result.total}
            </div>
            <div className="text-xl font-bold text-primary mb-4">{percentage}%</div>
            <p className="text-muted-foreground font-google-sans">
              {result.score === result.total ? "Perfect score! You're an expert." :
               result.score >= result.total / 2 ? "Great job! You have a good understanding." :
               "Keep learning and try again!"}
            </p>
          </div>
        </CardHeader>
        <CardFooter className="justify-center py-6 bg-muted/5">
          <Button onClick={handleReset} variant="outline" className="gap-2 font-google-sans">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const question = questions[currentQuestion]

  return (
    <Card className="my-8 overflow-hidden border-border bg-background/50 backdrop-blur-sm shadow-lg interactive-quiz-card">
      <CardHeader className="border-b bg-muted/30 py-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          {title && <span className="text-xs font-semibold text-muted-foreground font-google-sans uppercase tracking-widest">{title}</span>}
        </div>
        <CardTitle className="text-xl font-google-sans leading-tight text-foreground">
          {question.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="grid gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === option

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={cn(
                  "flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all duration-200",
                  "hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]",
                  isSelected ? "border-primary bg-primary/10 shadow-sm" : "border-transparent bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold",
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/5 py-4 justify-between">
        <Button
          onClick={handleNextQuestion}
          disabled={selectedOption === null || isSubmitting}
          className="w-full sm:w-auto gap-2 font-google-sans px-8 h-11 transition-all hover:gap-3"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {currentQuestion + 1 < questions.length ? "Next Question" : "Submit Quiz"}
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
