import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CourseLearnRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // 1. First, check if there are any lectures in any module of the course
    const firstLecture = await db.lecture.findFirst({
      where: {
        module: {
          courseId: id
        }
      },
      orderBy: [
        { module: { order: "asc" } },
        { order: "asc" }
      ]
    });

    if (firstLecture) {
      return redirect(`/dashboard/courses/${id}/learn/${firstLecture.id}`);
    }

    // 2. If no lectures, check for any quizzes
    const firstQuiz = await db.quiz.findFirst({
      where: {
        module: {
          courseId: id
        }
      },
      orderBy: [
        { module: { order: "asc" } },
        { order: "asc" }
      ]
    });

    if (firstQuiz) {
      return redirect(`/dashboard/courses/${id}/quiz/${firstQuiz.id}`);
    }

    console.warn(`No content found for course ${id}. Redirecting to dashboard.`);
  } catch (error) {
    console.error("Redirect logic failed:", error);
  }

  // Fallback if course is empty or error occurs
  return redirect("/dashboard/student");
}
