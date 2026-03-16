export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">About NextLMS</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          NextLMS is a cutting-edge Learning Management System designed to empower students and instructors worldwide. Our mission is to make high-quality education accessible to everyone, anywhere.
        </p>
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">Our Vision</h2>
          <p className="mt-4 text-muted-foreground">
            We believe that education is the key to personal and professional growth. Our platform provides the tools and resources needed to master new skills and stay ahead in a rapidly changing world.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Why Choose Us?</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li>Expert-led courses in various fields</li>
            <li>Flexible learning at your own pace</li>
            <li>Interactive community and support</li>
            <li>Certification of completion</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
