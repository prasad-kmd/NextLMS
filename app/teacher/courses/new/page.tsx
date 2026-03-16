"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/app/actions/lms-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NewCoursePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;

    try {
      const course = await createCourse({ title, description, image });
      toast.success("Course created successfully");
      router.push(`/teacher/courses/${course.id}`);
    } catch (error) {
      toast.error("Failed to create course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-6 max-w-2xl">
      <h1 className="text-4xl font-bold philosopher mb-8">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border border-border">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" name="title" placeholder="e.g. Introduction to Mechatronics" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="What will students learn?" rows={5} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Course Thumbnail URL</Label>
          <Input id="image" name="image" placeholder="https://..." />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Course
          </Button>
        </div>
      </form>
    </div>
  );
}
