import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CourseDetailsClient } from "./course-details-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const course = await db.course.findUnique({
    where: { id },
    include: {
      teacher: { select: { name: true } },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lectures: { select: { id: true, title: true, order: true }, orderBy: { order: "asc" } },
        }
      },
      enrollments: session ? { where: { userId: session.user.id } } : false,
    }
  });

  if (!course) notFound();

  const isEnrolled = course.enrollments && course.enrollments.length > 0;

  return (
    <div className="container mx-auto py-12 px-6 max-w-5xl">
      <CourseDetailsClient course={course} isEnrolled={!!isEnrolled} session={session} />
    </div>
  );
}
