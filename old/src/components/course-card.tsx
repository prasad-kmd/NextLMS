import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface CourseProps {
  title: string
  description: string
  instructor: string
  category: string
  price: string
  image: string
}

export function CourseCard({ title, description, instructor, category, price, image }: CourseProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full bg-muted">
         <div className="flex h-full items-center justify-center text-muted-foreground">Course Thumbnail</div>
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{category}</Badge>
          <span className="font-bold text-blue-600">{price}</span>
        </div>
        <CardTitle className="mt-2 line-clamp-1">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs font-medium">By {instructor}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Enroll Now</Button>
      </CardFooter>
    </Card>
  )
}
