import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CourseEditor } from "./course-editor";

export default async function TeacherCourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await db.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lectures: { orderBy: { order: "asc" } },
          quizzes: { orderBy: { order: "asc" } }
        }
      }
    }
  });

  if (!course) notFound();

  return <CourseEditor course={course} />;
}
