import Link from "next/link"
import { Button } from "@/components/ui/button"
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold">Welcome to <span className="text-blue-600">NextLMS</span></h1>
      <div className="mt-8 flex gap-4">
        <Link href="/login"><Button>Login</Button></Link>
        <Link href="/register"><Button variant="outline">Register</Button></Link>
      </div>
    </div>
  )
}
