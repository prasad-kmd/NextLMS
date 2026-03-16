export const dynamic = "force-dynamic";
import { db } from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
export default async function CoursesPage() {
  const courses = await db.course.findMany({ include: { teacher: true } })
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((c: any) => (
          <Card key={c.id}><CardHeader><CardTitle>{c.title}</CardTitle></CardHeader><CardContent><Link href={`/courses/${c.id}`}><Button>View</Button></Link></CardContent></Card>
        ))}
      </div>
    </div>
  )
}
