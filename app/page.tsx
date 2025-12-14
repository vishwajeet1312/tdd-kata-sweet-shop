"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Candy, ShoppingBag, Shield, Sparkles } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8 py-16">
          <div className="rounded-full bg-primary/10 p-4">
            <Candy className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-balance max-w-4xl">Welcome to Sweet Shop</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
            Discover a delightful collection of premium sweets and treats. Browse, search, and purchase your favorites
            with ease.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 py-16">
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card border border-border">
            <div className="rounded-full bg-accent/10 p-3">
              <ShoppingBag className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Easy Shopping</h3>
            <p className="text-muted-foreground">Browse and purchase delicious sweets with just a few clicks</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card border border-border">
            <div className="rounded-full bg-primary/10 p-3">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Premium Quality</h3>
            <p className="text-muted-foreground">All our sweets are carefully curated for the best taste and quality</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card border border-border">
            <div className="rounded-full bg-accent/10 p-3">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Secure Platform</h3>
            <p className="text-muted-foreground">
              Your data and transactions are protected with enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
