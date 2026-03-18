import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { ContentRenderer } from "@/components/content-renderer";
import Link from "next/link";
import { CheckCircle, Circle, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function LearningPage({ params }: { params: Promise<{ id: string, lectureId: string }> }) {
  const { id: courseId, lectureId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const course = await db.course.findUnique({
    where: { id: courseId },
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

  const lecture = await db.lecture.findUnique({
    where: { id: lectureId }
  });

  if (!lecture) notFound();

  const userProgress = await db.progress.findMany({
    where: { userId: session.user.id, lecture: { module: { courseId } } }
  });

  const completedLectureIds = new Set(userProgress.filter(p => p.isCompleted).map(p => p.lectureId));

  // Find next and previous items
  const allItems: { type: 'lecture' | 'quiz', id: string, title: string }[] = [];
  course.modules.forEach(module => {
    module.lectures.forEach(l => allItems.push({ type: 'lecture', id: l.id, title: l.title }));
    module.quizzes.forEach(q => allItems.push({ type: 'quiz', id: q.id, title: q.title }));
  });

  const currentIndex = allItems.findIndex(item => item.id === lectureId);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar - Course Content */}
      <aside className="w-80 border-r border-border bg-card/50 backdrop-blur-md overflow-y-auto hidden lg:block">
        <div className="p-6">
          <h2 className="text-xl font-bold philosopher mb-1">{course.title}</h2>
          <div className="h-1.5 w-full rounded-full bg-muted mt-4">
             <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(completedLectureIds.size / allItems.filter(i => i.type === 'lecture').length) * 100}%` }} />
          </div>
        </div>
        <nav className="px-2 pb-12">
          {course.modules.map((module) => (
            <div key={module.id} className="mb-6">
              <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{module.title}</h3>
              <div className="space-y-1">
                {module.lectures.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/courses/${courseId}/learn/${item.id}`}
                    className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${item.id === lectureId ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted text-muted-foreground'}`}
                  >
                    {completedLectureIds.has(item.id) ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                    <span className="truncate">{item.title}</span>
                  </Link>
                ))}
                {module.quizzes.map((quiz) => (
                   <Link
                    key={quiz.id}
                    href={`/dashboard/courses/${courseId}/quiz/${quiz.id}`}
                    className="flex items-center gap-3 px-4 py-2 text-sm rounded-lg text-muted-foreground hover:bg-muted"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="truncate">{quiz.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/dashboard/student" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="text-sm font-bold text-primary local-inter">Lecture {lecture.order}</div>
          </div>

          <h1 className="text-4xl font-bold mb-8 philosopher">{lecture.title}</h1>

          <div className="prose prose-invert max-w-none mb-12">
            <ContentRenderer content={lecture.content || ""} />
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
             {prevItem ? (
                <Link href={`/dashboard/courses/${courseId}/${prevItem.type === 'lecture' ? 'learn' : 'quiz'}/${prevItem.id}`}>
                   <Button variant="outline" className="rounded-full gap-2">
                      <ChevronLeft className="h-4 w-4" /> {prevItem.title}
                   </Button>
                </Link>
             ) : <div />}

             {nextItem ? (
                <Link href={`/dashboard/courses/${courseId}/${nextItem.type === 'lecture' ? 'learn' : 'quiz'}/${nextItem.id}`}>
                   <Button className="rounded-full gap-2">
                      {nextItem.title} <ChevronRight className="h-4 w-4" />
                   </Button>
                </Link>
             ) : (
                <Link href="/dashboard/student">
                   <Button className="rounded-full bg-green-600 hover:bg-green-700">Finish Course</Button>
                </Link>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
