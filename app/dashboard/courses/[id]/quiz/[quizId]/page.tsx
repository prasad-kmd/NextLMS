import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { Quiz } from "@/components/quiz";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function QuizPage({ params }: { params: Promise<{ id: string, quizId: string }> }) {
  const { id: courseId, quizId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: { id: 'asc' }, // Match server action order
        select: {
          id: true,
          text: true,
          options: true,
        }
      }
    }
  });

  if (!quiz) notFound();

  return (
    <div className="container mx-auto py-12 px-6 max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <Link href={`/dashboard/courses/${courseId}/learn`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Course
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4 philosopher">{quiz.title}</h1>
      <p className="text-muted-foreground local-inter mb-12">Please answer all questions to complete the module.</p>

      <Quiz
        id={quiz.id}
        title={quiz.title}
        questions={quiz.questions.map(q => ({
          id: q.id,
          text: q.text,
          options: q.options
        }))}
      />
    </div>
  );
}
