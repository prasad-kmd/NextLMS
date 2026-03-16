import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  const userRole = (session.user as any)?.role
  if (userRole === "TEACHER" || userRole === "ADMIN") redirect("/teacher/dashboard")
  else redirect("/student/dashboard")
}
