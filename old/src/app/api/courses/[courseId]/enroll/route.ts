import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return new NextResponse("Unauthorized", { status: 401 })
  const { courseId } = await params
  await db.enrollment.create({ data: { userId: (session.user as any).id, courseId } })
  return NextResponse.redirect(new URL(`/courses/${courseId}`, req.url), { status: 303 })
}
