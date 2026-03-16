import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { GraduationCap, Plus, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function TeacherCoursesPage() {
  const session = await getServerSession(authOptions);
  const courses = await db.course.findMany({
    where: { teacherId: session?.user?.id },
    include: {
      _count: {
        select: { enrollments: true, modules: true }
      }
    }
  });

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold philosopher">Your Courses</h1>
          <p className="text-muted-foreground local-inter">Manage your curriculum and students</p>
        </div>
        <Link href="/teacher/courses/new">
          <Button className="rounded-full gap-2">
            <Plus className="h-4 w-4" />
            Create New Course
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/teacher/courses/${course.id}`}
            className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="aspect-video bg-muted relative">
              {course.image && (
                <img src={course.image} alt={course.title} className="object-cover w-full h-full" />
              )}
              <div className="absolute top-4 right-4">
                <span className={`rounded-full px-3 py-1 text-xs font-bold border ${course.isPublished ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold font-google-sans group-hover:text-primary transition-colors">{course.title}</h3>
              <p className="mb-6 line-clamp-2 text-sm text-muted-foreground local-inter">{course.description}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {course._count.modules} Modules
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {course._count.enrollments} Students
                </div>
              </div>
            </div>
          </Link>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
            <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-bold">No courses yet</h3>
            <p className="mb-6 text-muted-foreground local-inter">Start sharing your engineering knowledge today.</p>
            <Link href="/teacher/courses/new">
              <Button variant="outline" className="rounded-full">Create Your First Course</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
