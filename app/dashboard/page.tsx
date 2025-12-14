"use client"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useSweets } from "@/lib/sweets-context"
import type { Sweet } from "@/lib/sweets-context"
import { Navbar } from "@/components/navbar"
import { SweetCard } from "@/components/sweet-card"
import { SearchFilter, type FilterState } from "@/components/search-filter"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { sweets, purchaseSweet } = useSweets()
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    minPrice: "",
    maxPrice: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(sweets.map((sweet) => sweet.category))
    return Array.from(cats).sort()
  }, [sweets])

  // Filter sweets based on search and filter criteria
  const filteredSweets = useMemo(() => {
    return sweets.filter((sweet: Sweet) => {
      // Search filter
      if (filters.search && !sweet.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Category filter
      if (filters.category !== "all" && sweet.category !== filters.category) {
        return false
      }

      // Min price filter
      if (filters.minPrice && sweet.price < Number.parseFloat(filters.minPrice)) {
        return false
      }

      // Max price filter
      if (filters.maxPrice && sweet.price > Number.parseFloat(filters.maxPrice)) {
        return false
      }

      return true
    })
  }, [sweets, filters])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">Browse our delicious collection of sweets</p>
        </div>

        <div className="mb-8">
          <SearchFilter onFilterChange={setFilters} categories={categories} />
        </div>

        {filteredSweets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {sweets.length === 0 ? "No sweets available at the moment." : "No sweets match your filters."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredSweets.length} of {sweets.length} sweets
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSweets.map((sweet) => (
                <SweetCard key={sweet.id} sweet={sweet} onPurchase={purchaseSweet} />
              ))}
            </div>
          </>
        )}
      </div>
      <Toaster />
    </div>
  )
}
