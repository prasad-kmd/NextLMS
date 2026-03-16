"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createModule, createLecture, createQuiz, updateCourse } from "@/app/actions/lms-actions";
import { toast } from "sonner";
import { Plus, GripVertical, FileText, HelpCircle, Loader2, Save } from "lucide-react";

export function CourseEditor({ course }: { course: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const handlePublishToggle = async () => {
    try {
      await updateCourse(course.id, { isPublished: !course.isPublished });
      toast.success(course.isPublished ? "Course unpublished" : "Course published");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const [newModuleName, setNewModuleName] = useState("");
  const handleAddModule = async () => {
     if (!newModuleName) return;
     try {
       await createModule(course.id, { title: newModuleName, order: course.modules.length + 1 });
       setNewModuleName("");
       toast.success("Module added");
     } catch (error) {
       toast.error("Failed to add module");
     }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold philosopher">{course.title}</h1>
          <p className="text-muted-foreground local-inter">Managing Course Curriculum</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handlePublishToggle}>
            {course.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-card p-6 rounded-2xl border border-border">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                Modules & Content
             </h2>

             <div className="space-y-6">
                {course.modules.map((module: any) => (
                   <div key={module.id} className="p-4 rounded-xl border border-border bg-muted/30">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="font-bold">{module.title}</h3>
                         <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => toast.info("Add lecture coming soon UI")}>
                               <Plus className="h-4 w-4 mr-1" /> Lecture
                            </Button>
                         </div>
                      </div>

                      <div className="space-y-2 ml-4">
                         {module.lectures.map((lecture: any) => (
                            <div key={lecture.id} className="flex items-center gap-3 p-2 text-sm bg-card rounded-lg border border-border">
                               <FileText className="h-4 w-4 text-muted-foreground" />
                               {lecture.title}
                            </div>
                         ))}
                         {module.quizzes.map((quiz: any) => (
                            <div key={quiz.id} className="flex items-center gap-3 p-2 text-sm bg-card rounded-lg border border-border border-dashed">
                               <HelpCircle className="h-4 w-4 text-primary" />
                               {quiz.title}
                            </div>
                         ))}
                      </div>
                   </div>
                ))}

                <div className="flex gap-2">
                   <Input
                      placeholder="New module title..."
                      value={newModuleName}
                      onChange={(e) => setNewModuleName(e.target.value)}
                   />
                   <Button onClick={handleAddModule}>Add Module</Button>
                </div>
             </div>
          </section>
        </div>

        <div className="space-y-8">
           <section className="bg-card p-6 rounded-2xl border border-border">
              <h3 className="text-lg font-bold mb-4">Course Settings</h3>
              <div className="space-y-4">
                 <div>
                    <Label>Thumbnail URL</Label>
                    <Input defaultValue={course.image || ""} />
                 </div>
                 <Button className="w-full">Update Info</Button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
