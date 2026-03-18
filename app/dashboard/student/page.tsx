import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { BookOpen, Trophy, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lectures: true,
              quizzes: true
            }
          }
        }
      }
    }
  });

  const quizResults = await db.quizResult.findMany({
    where: { userId: session.user.id, passed: true }
  });

  const availableCourses = await db.course.findMany({
    where: {
      isPublished: true,
      enrollments: {
        none: { userId: session.user.id }
      }
    }
  });

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold philosopher">Student Dashboard</h1>
        <p className="text-muted-foreground local-inter">Track your progress and continue learning</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          {/* Enrolled Courses */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold font-google-sans">Your Courses</h2>
            </div>
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="h-24 w-40 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                      {enrollment.course.image && <img src={enrollment.course.image} alt={enrollment.course.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-google-sans">{enrollment.course.title}</h3>
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-1 local-inter">{enrollment.course.description}</p>

                      {/* Simplistic Progress Bar Placeholder */}
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-1/3 bg-primary" />
                      </div>
                    </div>
                    <Link href={`/dashboard/courses/${enrollment.courseId}/learn`}>
                      <Button className="rounded-full gap-2">
                        <PlayCircle className="h-4 w-4" />
                        Continue
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}

              {enrollments.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border py-12 text-center">
                   <p className="text-muted-foreground local-inter">You haven't enrolled in any courses yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Recommended/Available Courses */}
          <section>
             <h2 className="mb-6 text-2xl font-bold font-google-sans">Explore New Courses</h2>
             <div className="grid gap-6 sm:grid-cols-2">
                {availableCourses.map((course) => (
                  <div key={course.id} className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-video bg-muted">
                       {course.image && <img src={course.image} alt={course.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold font-google-sans mb-2">{course.title}</h3>
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="ghost" size="sm" className="w-full justify-between text-primary">
                          View Details <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-8">
           <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold font-google-sans mb-4">Learning Stats</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <BookOpen className="h-4 w-4" />
                       Courses
                    </div>
                    <span className="font-bold">{enrollments.length}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <Trophy className="h-4 w-4" />
                       Quizzes Passed
                    </div>
                    <span className="font-bold">{quizResults.length}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
