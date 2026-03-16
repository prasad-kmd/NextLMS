"use client"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/sidebar-context"
import { BookmarksProvider } from "@/hooks/use-bookmarks"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <SidebarProvider>
            <BookmarksProvider>
              {children}
              <Toaster position="top-center" richColors />
            </BookmarksProvider>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
