import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CourseLearnRedirectPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const firstLecture = await db.lecture.findFirst({
    where: { module: { courseId: id } },
    orderBy: [
      { module: { order: "asc" } },
      { order: "asc" }
    ]
  });

  if (!firstLecture) {
    // Check if there is a quiz if no lecture exists
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

    return redirect("/dashboard/student");
  }

  return redirect(`/dashboard/courses/${id}/learn/${firstLecture.id}`);
}
