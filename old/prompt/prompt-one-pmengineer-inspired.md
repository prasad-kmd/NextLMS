## 🎯 **Upgrade NextLMS/This Repo with PMEngineerLK Design & Features**

### **Project Overview**

We have two repositories:

1.  **Source of Inspiration (`[PMEngineerLK-NextJS](https://github.com/prasad-kmd/PMEngineerLK-NextJS)`)**: A polished blogfolio with glassmorphism UI, custom interactions, a file-based CMS, and an interactive quiz system.
2.  **Target Project (`NextLMS/This Repo`)**: A functional LMS with a solid backend (RBAC, Prisma, Supabase, NextAuth) but a basic frontend.

**Goal**: Transform the `NextLMS/This Repo` frontend by porting over the visual design, UI components, and useful frontend features from `[PMEngineerLK-NextJS](https://github.com/prasad-kmd/PMEngineerLK-NextJS)`. Keep the existing LMS backend logic and database structure intact.

> Note: The LMS already implements the following backend features (via Prisma, NextAuth, and server actions). The AI must ensure these continue to work after the frontend upgrades.

> Dependencies: Before porting components, check package.json of PMEngineerLK for any additional libraries (like sonner, framer-motion, katex, chart.js, etc.) and install them in the target project.

> The ported quiz component should call existing server actions (or API routes) in NextLMS to save submissions. For example, after a quiz is completed, it should invoke submitQuiz(quizId, answers) which is already defined in the LMS backend.

### **Part 1: Adapt the Look & Appearance**

**Objective**: Make the LMS visually identical in feel to the blogfolio.

**Checklist**:

1.  **Core Styling & Theme**:
    - Copy the `tailwind.config.js` from `[PMEngineerLK-NextJS](https://github.com/prasad-kmd/PMEngineerLK-NextJS)` to `NextLMS/This Repo`. Ensure all custom theme extensions (colors, animations, glassmorphism utilities) are merged.
    - Copy the global CSS file (likely `styles/globals.css` or `app/globals.css`) to bring over the base styles, glassmorphism effects, and any custom CSS variables.
    - Integrate the **Global Theme Management** (using `next-themes`) exactly as implemented in the source project.

2.  **Global UI Enhancements**:
    - Port the **`CustomCursor`** component and its associated logic/hooks. Ensure it works across the LMS.
    - Port the **`CustomContextMenu`** component. Adapt it to show LMS-relevant actions (e.g., "Mark as done", "Save for later", "Copy link") when right-clicking on courses or lectures.
    - Port the **Click-Spark Effects**.
    - Integrate the **Connectivity Listener** (Sonner toasts for online/offline status).

3.  **Layout & Components**:
    - Layout Update Steps 1. Copy `app/layout.tsx` structure from PMEngineerLK → `src/app/layout.tsx` 2. Ensure it wraps children with: - `<ThemeProvider>` (from next-themes) - `<SidebarProvider>` (from sidebar-context) - `<FloatingNavbar>` above `<main>` 3. Keep existing NextAuth `<SessionProvider>` wrapper intact 4. Preserve your existing RBAC middleware logic
    - Use the same header/footer styles.
    - Port over reusable UI components like cards, buttons, and dialogs from the source project's `components/` directory to give the LMS a consistent, polished look. Apply the glassmorphism effect to cards (like course cards, dashboard widgets).

### **Part 2: Adapt Key Functions from PMEngineerLK**

**Objective**: Enhance the LMS by integrating specific frontend features from the source project. The backend (Prisma schema, API routes, server actions) should remain largely unchanged.

**Checklist**:

1.  **File-Based Content Display (Lectures) but Database is prefered**: this is optional, do not implement if it risk the current status of the project.

2.  **Interactive Quiz System**:
    - **Task**: Port the entire quiz system from `[PMEngineerLK-NextJS](https://github.com/prasad-kmd/PMEngineerLK-NextJS)`:
      - The custom `[quiz]` syntax parser (likely in `lib/content.ts` or a dedicated utility).
      - The React component that renders the quiz (`components/Quiz.tsx` or similar).
      - ⚠️ **Critical Security Requirement**:
        - The client-side quiz component (`Quiz.tsx`) should ONLY collect answers.
        - **Never** send `isCorrect` field to the browser.
        - Grading must happen in a Server Action/API route that:
          1. Fetches the quiz with correct answers from Prisma
          2. Compares submitted answers server-side
          3. Saves `QuizAttempt` + `Answer` records
          4. Returns only the score to the client

    - **Integration**: This system should be used within the file-based lectures (as in the source). The quiz results (score, answers) must be saved to the LMS database using the existing `QuizSubmission` and `StudentAnswer` models. You will need to connect the frontend quiz component to the backend server actions/API routes of `NextLMS/This Repo`.

3.  **Discovery & Navigation**:
    - Port the **Command Palette (Cmd+K)**. Its search index should be adapted to search across LMS content: course titles, module names, lecture titles, and glossary terms.
    - Port the **Wiki & Glossary** structure. This can be repurposed as a "Course Glossary" or "Key Terms" section for the entire LMS, linking to relevant lectures.

4.  **Technical Enhancements**:
    - **Table of Contents (TOC)**: Port the auto-generated TOC component. It should appear on lecture pages (especially long ones) to help students navigate.
    - **PWA Support**: Copy the `public/sw.js` service worker and `manifest.json` logic to make the LMS installable and work offline. This is a huge win for students.
    - **SafeLink Redirects**: Port the `/external-link` interstitial for security when users click external resource links.

### Components to Port (Prioritized)

#### 🔴 Must-Have (MVP)

- theme-provider, floating-navbar, footer, toc, scroll-progress
- content-renderer, search (command palette)
- connectivity-listener, sidebar-context

#### 🟡 Nice-to-Have (Post-MVP)

- custom-cursor (disable by default), custom-context-menu, ClickSpark
- bookmark-button, MagicBento, web-share-button

#### ⚪ Optional / Evaluate Later

- ai-content-indicator, push-notification-manager, service-worker-registrar

### **Final Deliverable**

A pull request or a set of changes that transforms `NextLMS/This Repo` into a visually stunning platform that borrows the **look and feel** and **frontend capabilities** of `[PMEngineerLK-NextJS](https://github.com/prasad-kmd/PMEngineerLK-NextJS)`, while keeping its robust LMS backend fully functional.

---

## Functionality that should include in this LMS

For a **basic LMS** (Minimum Viable Product), you only need the functions that enable the core loop: **Create Content → Enroll → Learn → Track**.

Here are the primary functions categorized by role, aligned with your tech stack and constraints:

### 1. Core System Functions (Infrastructure)

- **Authentication & Authorization:**
  - Secure Login/Logout (NextAuth.js).
  - **Role-Based Access Control (RBAC):** System must distinguish between `Teacher` and `Student` to show/hide features.
- **User Management:**
  - Profile viewing (Name, Email, Role).
  - Password management (Hashing via bcrypt).

### 2. Teacher Functions (Content Creation)

- **Course CRUD:**
  - Create, Edit, Delete Courses (Title, Description, Thumbnail).
  - Publish/Unpublish Courses (Toggle visibility to students).
- **Curriculum Management:**
  - Create **Modules/Sections** to group lessons.
  - Create **Lectures** within modules (Rich Text content).
  - Reorder Modules and Lectures (Drag-and-drop or position indexing).
- **Assessment Creation:**
  - Create **Quizzes** attached to specific lectures.
  - Add Questions (Multiple Choice or True/False).
  - Define Correct Answers (Stored securely in DB).
- **Student Oversight:**
  - View list of enrolled students per course.
  - View student quiz scores/completion rates.

### 3. Student Functions (Consumption)

- **Course Discovery & Enrollment:**
  - Browse/List available published courses.
  - **Enroll** in a course (Creates a database record linking User ↔ Course).
- **Learning Interface:**
  - View Course Content (Rich Text rendering).
  - Navigate between Modules and Lectures (Sidebar navigation).
- **Progress Tracking:**
  - **Mark Lecture as Complete:** Updates `LectureProgress` table.
  - View Overall Course Progress (e.g., "40% Completed").
- **Assessment Taking:**
  - Take Quizzes attached to lectures.
  - View Immediate Results (Score/Grade) after submission.

### 4. Dashboard Functions (Visualization)

- **Student Dashboard:**
  - "My Courses" list (Enrolled only).
  - Resume Learning button (Links to last accessed lecture).
  - Recent Quiz Scores.
- **Teacher Dashboard:**
  - "My Courses" list (Created by me).
  - Quick stats (Total Enrollments, Average Quiz Score).

### 5. Data Logic (Backend)

- **Progress Calculation:** Logic to calculate `% complete` based on `Completed Lectures / Total Lectures`.
- **Secure Grading:** Logic to compare Student Answers vs. Correct Options **server-side** (never expose correct answers to the client).
- **Access Control:** Middleware to ensure students cannot access `/teacher` routes and unenrolled users cannot access course content.

### What to Exclude for "Basic"

- ❌ **Video Streaming:** Use text/images or external links (YouTube/Vimeo embeds) instead of hosting files.
- ❌ **Payments:** Enrollment is free/manual.
- ❌ **Certificates:** No PDF generation yet.
- ❌ **Discussion Forums:** No comments or student-to-student chat.
- ❌ **Email Notifications:** No automated emails for now.

### Acceptance Criteria

- [ ] Visual: Course cards have glassmorphism effect (`bg-background/80 backdrop-blur`)
- [ ] Theme: Dark/light toggle persists across page reloads
- [ ] Quiz: Submitting answers triggers server action; `isCorrect` never appears in browser DevTools Network tab
- [ ] Navigation: Cmd+K opens search with course/lecture results
- [ ] RBAC: Student cannot access `/teacher/*` routes (403 redirect)
- [ ] Mobile: FloatingNavbar collapses to hamburger menu on <768px
