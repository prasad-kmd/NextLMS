# PMEngineerLK-NextJS (LMS Edition) 🚀

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)

A beautiful, high-performance Personal Learning Management System (LMS) and Engineering Portfolio. Built with a Glassmorphism UI and a robust Next.js App Router backend.

## 🌟 Key Features

-   **Role-Based Access Control (RBAC)**: Secure authentication with roles for ADMIN, TEACHER, and STUDENT.
-   **Teacher Dashboard**: Create and manage courses, modules, lectures, and quizzes through an intuitive UI.
-   **Student Experience**: Personalized learning dashboards, progress tracking, and interactive content.
-   **Secure Quiz Grading**: Server-side validation to ensure academic integrity.
-   **Content Renderer**: Advanced rendering with support for KaTeX (mathematics) and Highlight.js (code).
-   **Glassmorphism Design**: Modern, transparent UI with beautiful animations and transitions.
-   **PWA Support**: Installable as a web app for a native experience.

## 🛠 Tech Stack

-   **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Shadcn UI, Lucide Icons.
-   **Backend**: Next.js Server Actions, NextAuth.js (Credentials Provider).
-   **Database**: Supabase (PostgreSQL) with Prisma ORM.
-   **Styling**: Glassmorphism, Dark/Light mode support.

## 🚀 Getting Started

### 1. Clone and Install
```bash
git clone https://github.com/prasad-kmd/PMEngineerLK-NextJS.git
cd PMEngineerLK-NextJS
pnpm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="your-postgresql-url"
DIRECT_URL="your-direct-postgresql-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Initialize Database
```bash
pnpm exec prisma generate
pnpm exec prisma db push
```

### 4. Run Development Server
```bash
pnpm dev
```

## 🏗 Project Structure

-   `/app`: Next.js App Router (Routes & Server Actions)
-   `/components`: Reusable UI components (Glassmorphism theme)
-   `/prisma`: Database schema and migration files
-   `/lib`: Core utilities and database singleton
-   `/public`: Static assets (fonts, images, manifest)

## ⚠️ Attention Required

Please check the `attention/` directory for critical setup notes and the `suggestions/` directory for future enhancement ideas.

---
Developed with ❤️ by PrasadM & Group.
