export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await getServerSession(authOptions)
  const { courseId } = await params
  const course = await db.course.findUnique({ where: { id: courseId }, include: { teacher: true, modules: { include: { lectures: true } } } })
  if (!course) redirect("/dashboard")
  const enrollment = session ? await db.enrollment.findUnique({ where: { userId_courseId: { userId: (session.user as any).id, courseId } } }) : null
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">{course.title}</h1>
      <p className="mb-8">By {course.teacher.name}</p>
      {!enrollment ? (
        <form action={`/api/courses/${courseId}/enroll`} method="POST"><Button type="submit">Enroll</Button></form>
      ) : (
        <div className="space-y-4">
          {course.modules.map((m) => (
            <Card key={m.id}><CardHeader><CardTitle>{m.title}</CardTitle></CardHeader><CardContent>
              {m.lectures.map((l) => (<div key={l.id}><Link href={`/courses/${courseId}/lectures/${l.id}`} className="text-blue-500">{l.title}</Link></div>))}
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  )
}
