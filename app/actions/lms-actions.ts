"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

async function checkTeacher() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createCourse(data: { title: string; description?: string; image?: string }) {
  const user = await checkTeacher();
  const course = await db.course.create({
    data: {
      ...data,
      teacherId: user.id,
    },
  });
  revalidatePath("/teacher/courses");
  return course;
}

export async function updateCourse(id: string, data: { title?: string; description?: string; image?: string; isPublished?: boolean }) {
  await checkTeacher();
  const course = await db.course.update({
    where: { id },
    data,
  });
  revalidatePath("/teacher/courses");
  return course;
}

export async function deleteCourse(id: string) {
  await checkTeacher();
  await db.course.delete({
    where: { id },
  });
  revalidatePath("/teacher/courses");
}

export async function createModule(courseId: string, data: { title: string; order: number }) {
  await checkTeacher();
  const module = await db.module.create({
    data: {
      ...data,
      courseId,
    },
  });
  revalidatePath(`/teacher/courses/${courseId}`);
  return module;
}

export async function createLecture(moduleId: string, data: { title: string; content: string; order: number }) {
  await checkTeacher();
  const lecture = await db.lecture.create({
    data: {
      ...data,
      moduleId,
    },
  });
  const module = await db.module.findUnique({ where: { id: moduleId } });
  if (module) revalidatePath(`/teacher/courses/${module.courseId}`);
  return lecture;
}

export async function createQuiz(moduleId: string, data: { title: string; order: number }) {
  await checkTeacher();
  const quiz = await db.quiz.create({
    data: {
      ...data,
      moduleId,
    },
  });
  const module = await db.module.findUnique({ where: { id: moduleId } });
  if (module) revalidatePath(`/teacher/courses/${module.courseId}`);
  return quiz;
}

export async function createQuestion(quizId: string, data: { text: string; type: string; options: string[]; correctAnswer: string }) {
  await checkTeacher();
  const question = await db.question.create({
    data: {
      ...data,
      quizId,
    },
  });
  return question;
}

export async function enrollInCourse(courseId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const enrollment = await db.enrollment.create({
    data: {
      userId: session.user.id,
      courseId,
    },
  });
  revalidatePath("/dashboard/student");
  return enrollment;
}

export async function updateProgress(lectureId: string, isCompleted: boolean) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const progress = await db.progress.upsert({
    where: {
      userId_lectureId: {
        userId: session.user.id,
        lectureId,
      },
    },
    update: { isCompleted },
    create: {
      userId: session.user.id,
      lectureId,
      isCompleted,
    },
  });
  return progress;
}
