"use server"

import { db } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function submitQuizAttempt(quizId: string, answers: number[]) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const userId = (session.user as any).id

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { id: 'asc' } } },
  })

  if (!quiz) {
    throw new Error("Quiz not found")
  }

  let score = 0
  quiz.questions.forEach((question: any, index: number) => {
    if (index < answers.length) {
        if (question.correctAnswer === String(answers[index])) {
          score++
        }
    }
  })

  const passed = score >= Math.ceil(quiz.questions.length / 2)

  const result = await db.quizResult.create({
    data: {
      userId,
      quizId,
      score,
      passed,
    },
  })

  revalidatePath("/dashboard")

  return {
    score,
    total: quiz.questions.length,
    passed,
  }
}
