"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, MailCheckIcon } from "lucide-animated"
import { GraduationCap, BookOpen, Info, LayoutDashboard, Terminal, Settings, ChevronLeft, ChevronRight, Book } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useSidebar } from "./sidebar-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const userRole = (session?.user as any)?.role

  const commonItems = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Glossary", href: "/glossary", icon: Book },
    { name: "About", href: "/about", icon: Info },
  ]

  const studentItems = [
    { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "Browse Courses", href: "/courses", icon: BookOpen },
  ]

  const teacherItems = [
    { name: "Teacher Panel", href: "/teacher/dashboard", icon: Terminal },
    { name: "My Courses", href: "/teacher/courses", icon: BookOpen },
  ]

  const navItems = [
    ...commonItems,
    ...(userRole === "STUDENT" ? studentItems : []),
    ...(userRole === "TEACHER" || userRole === "ADMIN" ? teacherItems : []),
  ]

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-r bg-card/30 backdrop-blur-xl transition-all duration-300 lg:flex",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-6">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2 font-bold group transition-all">
            <GraduationCap className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xl mozilla-headline tracking-tighter">NextLMS</span>
          </Link>
        )}
        {isCollapsed && (
           <Link href="/" className="flex items-center justify-center w-full">
             <GraduationCap className="h-6 w-6 text-primary" />
           </Link>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 google-sans",
                        isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent",
                        isCollapsed && "justify-center px-0"
                    )}
                    >
                    <Icon className={cn("h-5 w-5 shrink-0", isActive ? "animate-pulse" : "")} />
                    {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                </TooltipTrigger>
                {isCollapsed && (
                    <TooltipContent side="right" sideOffset={10}>
                        {item.name}
                    </TooltipContent>
                )}
            </Tooltip>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center h-10 rounded-xl hover:bg-muted text-muted-foreground transition-colors border border-transparent hover:border-border"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><ChevronLeft className="h-4 w-4" /> Collapse</div>}
        </button>
      </div>
    </aside>
  )
}
