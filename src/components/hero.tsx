import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Master New Skills with <span className="text-blue-600">NextLMS</span>
          </h1>
          <p className="mt-6 max-w-[600px] text-lg text-muted-foreground sm:text-xl">
            Discover thousands of courses from industry experts and take your career to the next level. Flexible, affordable, and high-quality education at your fingertips.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/courses">
              <Button size="lg">Browse Courses</Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute top-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_top_right,var(--blue-100),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_50%)]" />
    </section>
  )
}
