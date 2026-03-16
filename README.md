# NextLMS

An optimized LMS created using NextJS/TS, Supabase/PostgreSQL, Prisma ORM, NextAuth.js, and Tailwind CSS + shadcn/ui.

## Features
- RBAC (Admin/Teacher/Student)
- Course & Content Management
- Student Enrollment & Progress Tracking
- Quizzes & Assessments
- Personalized Dashboards

## Setup
1. Configure `DATABASE_URL` and `NEXTAUTH_SECRET` in `.env`.
2. Run `pnpm prisma db push`.
3. Start development server with `pnpm dev`.
