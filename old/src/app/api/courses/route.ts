import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { NextResponse } from "next/server"
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || ((session.user as any).role !== "TEACHER" && (session.user as any).role !== "ADMIN")) return new NextResponse("Unauthorized", { status: 401 })
  const { title, description } = await req.json()
  const course = await db.course.create({ data: { title, description, teacherId: (session.user as any).id } })
  return NextResponse.json(course)
}
