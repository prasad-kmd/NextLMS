"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createModule, createLecture, createQuiz, updateCourse, createQuestion } from "@/app/actions/lms-actions";
import { toast } from "sonner";
import { Plus, GripVertical, FileText, HelpCircle, Loader2, Save, Send } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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

  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [newLecture, setNewLecture] = useState({ title: "", content: "" });
  const [isLectureLoading, setIsLectureLoading] = useState(false);

  const handleAddLecture = async () => {
     if (!activeModule || !newLecture.title) return;
     setIsLectureLoading(true);
     try {
        const module = course.modules.find((m: any) => m.id === activeModule);
        await createLecture(activeModule, {
           title: newLecture.title,
           content: newLecture.content,
           order: module.lectures.length + 1
        });
        toast.success("Lecture added");
        setNewLecture({ title: "", content: "" });
        setActiveModule(null);
     } catch (error) {
        toast.error("Failed to add lecture");
     } finally {
        setIsLectureLoading(false);
     }
  };

  const [newQuiz, setNewQuiz] = useState({ title: "" });
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const handleAddQuiz = async () => {
     if (!activeModule || !newQuiz.title) return;
     setIsQuizLoading(true);
     try {
        const module = course.modules.find((m: any) => m.id === activeModule);
        await createQuiz(activeModule, { title: newQuiz.title, order: module.quizzes.length + 1 });
        toast.success("Quiz added");
        setNewQuiz({ title: "" });
        setActiveModule(null);
     } catch (error) {
        toast.error("Failed to add quiz");
     } finally {
        setIsQuizLoading(false);
     }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold philosopher">{course.title}</h1>
          <p className="text-muted-foreground local-inter">Managing Course Curriculum</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-full" onClick={handlePublishToggle}>
            {course.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-card p-6 rounded-2xl border border-border shadow-sm">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 font-google-sans">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                Modules & Content
             </h2>

             <div className="space-y-6">
                {course.modules.map((module: any) => (
                   <div key={module.id} className="p-6 rounded-2xl border border-border bg-muted/20 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-6">
                         <h3 className="font-bold text-lg">{module.title}</h3>
                         <div className="flex gap-2">
                            <Dialog>
                               <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="rounded-full h-8" onClick={() => setActiveModule(module.id)}>
                                     <Plus className="h-4 w-4 mr-1" /> Lecture
                                  </Button>
                               </DialogTrigger>
                               <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                     <DialogTitle>Add New Lecture</DialogTitle>
                                     <DialogDescription>Create a new lecture for module: {module.title}</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                     <div className="space-y-2">
                                        <Label>Lecture Title</Label>
                                        <Input placeholder="Enter title" value={newLecture.title} onChange={(e) => setNewLecture({...newLecture, title: e.target.value})} />
                                     </div>
                                     <div className="space-y-2">
                                        <Label>Content (Markdown supported)</Label>
                                        <Textarea placeholder="Enter content" rows={10} value={newLecture.content} onChange={(e) => setNewLecture({...newLecture, content: e.target.value})} />
                                     </div>
                                  </div>
                                  <DialogFooter>
                                     <Button onClick={handleAddLecture} disabled={isLectureLoading}>
                                        {isLectureLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Add Lecture
                                     </Button>
                                  </DialogFooter>
                               </DialogContent>
                            </Dialog>

                            <Dialog>
                               <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="rounded-full h-8" onClick={() => setActiveModule(module.id)}>
                                     <Plus className="h-4 w-4 mr-1" /> Quiz
                                  </Button>
                               </DialogTrigger>
                               <DialogContent>
                                  <DialogHeader>
                                     <DialogTitle>Add New Quiz</DialogTitle>
                                     <DialogDescription>Create a new quiz for module: {module.title}</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                     <div className="space-y-2">
                                        <Label>Quiz Title</Label>
                                        <Input placeholder="Enter title" value={newQuiz.title} onChange={(e) => setNewQuiz({title: e.target.value})} />
                                     </div>
                                  </div>
                                  <DialogFooter>
                                     <Button onClick={handleAddQuiz} disabled={isQuizLoading}>
                                        {isQuizLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Add Quiz
                                     </Button>
                                  </DialogFooter>
                               </DialogContent>
                            </Dialog>
                         </div>
                      </div>

                      <div className="space-y-3 ml-4">
                         {module.lectures.map((lecture: any) => (
                            <div key={lecture.id} className="flex items-center justify-between p-3 text-sm bg-card rounded-xl border border-border shadow-sm group">
                               <div className="flex items-center gap-3">
                                  <FileText className="h-4 w-4 text-primary/70" />
                                  <span className="font-medium">{lecture.title}</span>
                                </div>
                            </div>
                         ))}
                         {module.quizzes.map((quiz: any) => (
                            <div key={quiz.id} className="flex items-center justify-between p-3 text-sm bg-card rounded-xl border border-border border-dashed shadow-sm group">
                               <div className="flex items-center gap-3">
                                  <HelpCircle className="h-4 w-4 text-orange-500" />
                                  <span className="font-medium">{quiz.title}</span>
                               </div>
                            </div>
                         ))}

                         {module.lectures.length === 0 && module.quizzes.length === 0 && (
                            <div className="text-center py-6 text-xs text-muted-foreground border-border border-dashed border rounded-xl">
                               No content in this module yet.
                            </div>
                         )}
                      </div>
                   </div>
                ))}

                <div className="flex gap-4 p-4 rounded-2xl border border-dashed border-border bg-muted/5">
                   <Input
                      placeholder="New module title..."
                      className="bg-card border-none h-11 focus-visible:ring-primary/30"
                      value={newModuleName}
                      onChange={(e) => setNewModuleName(e.target.value)}
                   />
                   <Button onClick={handleAddModule} className="rounded-full px-6 h-11 gap-2">
                      <Plus className="h-4 w-4" />
                      Add Module
                   </Button>
                </div>
             </div>
          </section>
        </div>

        <div className="space-y-8">
           <section className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-lg font-bold mb-6 font-google-sans">Course Summary</h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm py-2 border-b border-border">
                    <span className="text-muted-foreground">Modules</span>
                    <span className="font-bold">{course.modules.length}</span>
                 </div>
                 <div className="flex justify-between text-sm py-2 border-b border-border">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`font-bold ${course.isPublished ? 'text-green-500' : 'text-yellow-500'}`}>
                       {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                 </div>
              </div>
           </section>

           <section className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-lg font-bold mb-6 font-google-sans">Quick Actions</h3>
              <div className="grid gap-3">
                 <Button variant="secondary" className="justify-start gap-2 h-11 rounded-full">
                    <Save className="h-4 w-4" /> Save as Draft
                 </Button>
                 <Button variant="outline" className="justify-start gap-2 h-11 rounded-full" onClick={() => router.push(`/courses/${course.id}`)}>
                    <Send className="h-4 w-4" /> Preview Course
                 </Button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
