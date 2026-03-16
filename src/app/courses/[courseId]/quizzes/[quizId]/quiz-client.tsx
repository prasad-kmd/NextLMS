"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function QuizClient({ quiz, courseId }: { quiz: any, courseId: string }) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const submitQuiz = async () => {
    try {
      await axios.post(`/api/courses/${courseId}/quizzes/${quiz.id}/submit`, { answers })
      toast.success("Submitted!"); router.refresh()
    } catch (e) { toast.error("Error") }
  }
  return (
    <div className="space-y-6">
      {quiz.questions.map((q: any) => (
        <Card key={q.id}>
          <CardHeader><CardTitle>{q.text}</CardTitle></CardHeader>
          <CardContent>
            <RadioGroup onValueChange={(v) => setAnswers({ ...answers, [q.id]: v })}>
              {q.options.map((o: string) => (<div key={o} className="flex items-center space-x-2"><RadioGroupItem value={o} id={o} /><Label htmlFor={o}>{o}</Label></div>))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
      <Button onClick={submitQuiz} className="w-full">Submit</Button>
    </div>
  )
}
