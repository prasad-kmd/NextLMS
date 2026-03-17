import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CourseLearnRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Find all modules for this course
  const modules = await db.module.findMany({
    where: { courseId: id },
    orderBy: { order: "asc" },
    include: {
      lectures: { orderBy: { order: "asc" }, take: 1 },
      quizzes: { orderBy: { order: "asc" }, take: 1 }
    }
  });

  if (modules.length > 0) {
    // Try to find the first module that has either a lecture or a quiz
    for (const module of modules) {
      if (module.lectures.length > 0) {
        return redirect(`/dashboard/courses/${id}/learn/${module.lectures[0].id}`);
      }
      if (module.quizzes.length > 0) {
        return redirect(`/dashboard/courses/${id}/quiz/${module.quizzes[0].id}`);
      }
    }
  }

  // Fallback if no content is found in any module
  return redirect("/dashboard/student");
}
