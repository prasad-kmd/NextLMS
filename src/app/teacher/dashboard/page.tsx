export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, BookOpen, Users } from "lucide-react"

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || ((session.user as any).role !== "TEACHER" && (session.user as any).role !== "ADMIN")) redirect("/")
  const courses = await db.course.findMany({ where: { teacherId: (session.user as any).id }, include: { _count: { select: { enrollments: true } } } })
  return (
    <div className="p-8">
      <div className="flex justify-between mb-8"><h1 className="text-3xl font-bold">Teacher Dashboard</h1><Link href="/teacher/courses/new"><Button><PlusCircle className="mr-2 h-4 w-4" />New Course</Button></Link></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card><CardHeader><CardTitle className="text-sm">Total Courses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{courses.length}</div></CardContent></Card>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course: any) => (
          <Card key={course.id}><CardHeader><CardTitle>{course.title}</CardTitle></CardHeader><CardContent><Link href={`/teacher/courses/${course.id}`}><Button variant="outline">Manage</Button></Link></CardContent></Card>
        ))}
      </div>
    </div>
  )
}
