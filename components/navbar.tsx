"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Candy, LogOut, ShieldCheck } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Candy className="h-6 w-6" />
            Sweet Shop
          </Link>

          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/login">
                  <Button variant={isActive("/login") ? "default" : "ghost"}>Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant={isActive("/register") ? "default" : "outline"}>Register</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button variant={isActive("/dashboard") ? "default" : "ghost"}>Dashboard</Button>
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant={isActive("/admin") ? "default" : "ghost"}>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
