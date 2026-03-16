"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ email: "", password: "" })

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const callback = await signIn("credentials", { ...data, redirect: false })
    setLoading(false)
    if (callback?.error) toast.error(callback.error)
    if (callback?.ok && !callback?.error) { toast.success("Logged in!"); router.push("/dashboard"); router.refresh() }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader><CardTitle className="text-2xl text-center">Login</CardTitle></CardHeader>
        <form onSubmit={loginUser}>
          <CardContent className="space-y-4">
            <div className="space-y-2"><label>Email</label><Input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} required /></div>
            <div className="space-y-2"><label>Password</label><Input type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} required /></div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
            <p className="text-sm">Don't have an account? <Link href="/register" className="text-blue-500">Register</Link></p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
