export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import QuizClient from "./quiz-client"

export default async function QuizPage({ params }: { params: Promise<{ courseId: string, quizId: string }> }) {
  const session = await getServerSession(authOptions)
  const { courseId, quizId } = await params
  if (!session) redirect("/login")
  const quiz = await db.quiz.findUnique({ where: { id: quizId }, include: { questions: true } })
  if (!quiz) redirect(`/courses/${courseId}`)
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      <QuizClient quiz={quiz} courseId={courseId} />
    </div>
  )
}
