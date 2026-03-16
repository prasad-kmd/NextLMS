import { Hero } from "@/components/hero"
import { CourseCard } from "@/components/course-card"

const featuredCourses = [
  {
    title: "Full-Stack Web Development with Next.js",
    description: "Learn to build modern, scalable web applications using Next.js, React, and TypeScript.",
    instructor: "John Doe",
    category: "Development",
    price: "$99.99",
    image: "/courses/nextjs.jpg",
  },
  {
    title: "Mastering UI/UX Design",
    description: "Design beautiful and intuitive user interfaces that people love to use.",
    instructor: "Jane Smith",
    category: "Design",
    price: "$79.99",
    image: "/courses/design.jpg",
  },
  {
    title: "Data Science with Python",
    description: "Explore the world of data science and learn how to analyze and visualize data.",
    instructor: "Robert Brown",
    category: "Data Science",
    price: "$89.99",
    image: "/courses/datascience.jpg",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <Hero />
      <section className="container mx-auto px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Featured Courses</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <CourseCard key={course.title} {...course} />
          ))}
        </div>
      </section>
    </div>
  )
}
