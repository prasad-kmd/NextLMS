import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CourseLearnRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const firstLecture = await db.lecture.findFirst({
      where: { module: { courseId: id } },
      orderBy: [
        { module: { order: "asc" } },
        { order: "asc" }
      ]
    });

    if (firstLecture) {
      return redirect(`/dashboard/courses/${id}/learn/${firstLecture.id}`);
    }

    const firstQuiz = await db.quiz.findFirst({
      where: { module: { courseId: id } },
      orderBy: [
        { module: { order: "asc" } },
        { order: "asc" }
      ]
    });

    if (firstQuiz) {
      return redirect(`/dashboard/courses/${id}/quiz/${firstQuiz.id}`);
    }
  } catch (error) {
    console.error("Redirect Error:", error);
  }

  return redirect("/dashboard/student");
}
