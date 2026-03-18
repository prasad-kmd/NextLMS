"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function gradeQuiz(quizId: string, userAnswers: string[]) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: { id: 'asc' } // Ensure deterministic order matching client
      }
    },
  });

  if (!quiz) throw new Error("Quiz not found");

  let score = 0;
  const total = quiz.questions.length;

  quiz.questions.forEach((question, index) => {
    if (question.correctAnswer === userAnswers[index]) {
      score++;
    }
  });

  const passed = total > 0 ? (score / total >= 0.7) : true;

  await db.quizResult.create({
    data: {
      userId: session.user.id,
      quizId,
      score,
      passed,
    },
  });

  return { score, total };
}
