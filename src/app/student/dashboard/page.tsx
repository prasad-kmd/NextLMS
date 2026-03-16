export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")
  const enrollments = await db.enrollment.findMany({ where: { userId: (session.user as any).id }, include: { course: true } })
  return (
    <div className="p-8">
      <div className="flex justify-between mb-8"><h1 className="text-3xl font-bold">Student Dashboard</h1><Link href="/courses"><Button><BookOpen className="mr-2 h-4 w-4" />Browse</Button></Link></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {enrollments.map((e) => (
          <Card key={e.id}><CardHeader><CardTitle>{e.course.title}</CardTitle></CardHeader><CardContent><Link href={`/courses/${e.courseId}`}><Button variant="outline">Continue</Button></Link></CardContent></Card>
        ))}
      </div>
    </div>
  )
}
