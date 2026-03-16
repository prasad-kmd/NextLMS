import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string, quizId: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return new NextResponse("Unauthorized", { status: 401 })
  const { quizId } = await params
  const { answers } = await req.json()
  const quiz = await db.quiz.findUnique({ where: { id: quizId }, include: { questions: true } })
  if (!quiz) return new NextResponse("Not found", { status: 404 })
  let correct = 0
  quiz.questions.forEach(q => { if (answers[q.id] === q.correctAnswer) correct++ })
  const score = Math.round((correct / quiz.questions.length) * 100)
  const res = await db.quizResult.create({ data: { userId: (session.user as any).id, quizId, score, passed: score >= 60 } })
  return NextResponse.json(res)
}
