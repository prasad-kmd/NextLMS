import bcrypt from "bcryptjs"
import { db } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, name, password, role } = await req.json()
    if (!email || !name || !password) return new NextResponse("Missing fields", { status: 400 })
    const exists = await db.user.findUnique({ where: { email } })
    if (exists) return new NextResponse("User already exists", { status: 400 })
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await db.user.create({ data: { email, name, password: hashedPassword, role: role || "STUDENT" } })
    return NextResponse.json(user)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
