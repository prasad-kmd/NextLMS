"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enrollInCourse } from "@/app/actions/lms-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookOpen, GraduationCap, ArrowRight, CheckCircle } from "lucide-react";

export function CourseDetailsClient({ course, isEnrolled, session }: { course: any, isEnrolled: boolean, session: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      await enrollInCourse(course.id);
      toast.success("Successfully enrolled!");
      router.push(`/dashboard/courses/${course.id}/learn`);
    } catch (error) {
      toast.error("Failed to enroll");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-5xl font-bold philosopher">{course.title}</h1>
          <p className="text-xl text-muted-foreground local-inter leading-relaxed">{course.description}</p>

          <div className="flex items-center gap-4 py-6 border-y border-border">
             <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
             </div>
             <div>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Instructor</p>
                <p className="text-lg font-bold">{course.teacher.name || "Engineering Instructor"}</p>
             </div>
          </div>

          <section className="pt-8">
             <h2 className="text-2xl font-bold font-google-sans mb-6">Course Curriculum</h2>
             <div className="space-y-4">
                {course.modules.map((module: any) => (
                  <div key={module.id} className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-bold text-lg mb-4">{module.title}</h3>
                    <div className="space-y-2">
                       {module.lectures.map((lecture: any) => (
                         <div key={lecture.id} className="flex items-center gap-3 text-muted-foreground text-sm">
                            <BookOpen className="h-4 w-4" />
                            {lecture.title}
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
           <div className="rounded-2xl border border-border bg-card p-8 shadow-xl backdrop-blur-md">
              <div className="aspect-video bg-muted rounded-xl mb-6 overflow-hidden">
                 {course.image && <img src={course.image} alt={course.title} className="w-full h-full object-cover" />}
              </div>

              {isEnrolled ? (
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-green-500 font-bold mb-4">
                      <CheckCircle className="h-5 w-5" />
                      You are enrolled
                   </div>
                   <Button className="w-full h-12 text-lg rounded-full" onClick={() => router.push(`/dashboard/courses/${course.id}/learn`)}>
                      Continue Learning
                   </Button>
                </div>
              ) : (
                <Button className="w-full h-12 text-lg rounded-full gap-2" onClick={handleEnroll} disabled={isLoading}>
                   {isLoading ? "Enrolling..." : "Enroll Now"}
                   <ArrowRight className="h-5 w-5" />
                </Button>
              )}

              <p className="mt-6 text-center text-sm text-muted-foreground local-inter">
                 Lifetime access to course materials.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
