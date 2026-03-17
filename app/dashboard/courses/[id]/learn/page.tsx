import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CourseLearnRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return redirect("/dashboard/student");
  }

  try {
    // Ensure the course exists
    const course = await db.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lectures: { orderBy: { order: "asc" }, take: 1 },
            quizzes: { orderBy: { order: "asc" }, take: 1 }
          }
        }
      }
    });

    if (!course || !course.modules || course.modules.length === 0) {
      console.warn(`Course ${id} not found or has no modules.`);
      return redirect("/dashboard/student");
    }

    // Iterate through modules to find the first piece of content
    for (const module of course.modules) {
      if (module.lectures && module.lectures.length > 0) {
        return redirect(`/dashboard/courses/${id}/learn/${module.lectures[0].id}`);
      }
      if (module.quizzes && module.quizzes.length > 0) {
        return redirect(`/dashboard/courses/${id}/quiz/${module.quizzes[0].id}`);
      }
    }

    console.warn(`No content found in any module for course ${id}.`);
  } catch (error) {
    console.error("Critical Redirect Error:", error);
  }

  return redirect("/dashboard/student");
}
