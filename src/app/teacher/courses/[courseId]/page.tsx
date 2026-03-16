import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, ArrowLeft } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function CourseManagePage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await getServerSession(authOptions)
  const { courseId } = await params
  if (!session) redirect("/login")
  const course = await db.course.findUnique({ where: { id: courseId, teacherId: (session.user as any).id }, include: { modules: { include: { lectures: true, quizzes: true } } } })
  if (!course) redirect("/teacher/dashboard")
  return (
    <div className="p-8">
      <Link href="/teacher/dashboard" className="mb-4 flex items-center"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <div className="mt-8 space-y-4">
        {course.modules.map((m) => (
          <Card key={m.id}><CardHeader><CardTitle>{m.title}</CardTitle></CardHeader></Card>
        ))}
      </div>
    </div>
  )
}
