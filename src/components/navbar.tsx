"use client"

import { Search, Share2, Bookmark } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="ml-auto flex items-center gap-4 md:gap-2 lg:gap-4">
        <form className="relative hidden flex-1 md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
          />
        </form>
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Bookmark className="h-5 w-5" />
          <span className="sr-only">Bookmark</span>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
