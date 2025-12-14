"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Sweet {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  image: string
  description: string
}

interface SweetsContextType {
  sweets: Sweet[]
  updateSweet: (id: string, updates: Partial<Sweet>) => void
  addSweet: (sweet: Omit<Sweet, "id">) => void
  deleteSweet: (id: string) => void
  restockSweet: (id: string, amount: number) => void
  purchaseSweet: (id: string) => Promise<void>
}

const SweetsContext = createContext<SweetsContextType | undefined>(undefined)

// Mock initial data
const initialSweets: Sweet[] = [
  {
    id: "1",
    name: "Chocolate Truffles",
    category: "Chocolate",
    price: 12.99,
    quantity: 50,
    image: "/chocolate-truffles.png",
    description: "Rich, decadent chocolate truffles",
  },
  {
    id: "2",
    name: "Strawberry Gummies",
    category: "Gummies",
    price: 5.99,
    quantity: 0,
    image: "/strawberry-gummies.jpg",
    description: "Sweet and chewy strawberry gummies",
  },
  {
    id: "3",
    name: "Vanilla Fudge",
    category: "Fudge",
    price: 8.99,
    quantity: 30,
    image: "/vanilla-fudge.jpg",
    description: "Smooth and creamy vanilla fudge",
  },
  {
    id: "4",
    name: "Caramel Chews",
    category: "Caramel",
    price: 6.99,
    quantity: 45,
    image: "/caramel-chews.jpg",
    description: "Soft and buttery caramel chews",
  },
  {
    id: "5",
    name: "Mint Chocolates",
    category: "Chocolate",
    price: 9.99,
    quantity: 25,
    image: "/mint-chocolates.jpg",
    description: "Refreshing mint chocolate squares",
  },
  {
    id: "6",
    name: "Lemon Drops",
    category: "Hard Candy",
    price: 4.99,
    quantity: 60,
    image: "/lemon-drops.jpg",
    description: "Tangy lemon hard candies",
  },
  {
    id: "7",
    name: "Peanut Brittle",
    category: "Brittle",
    price: 10.99,
    quantity: 20,
    image: "/peanut-brittle.jpg",
    description: "Crunchy peanut brittle",
  },
  {
    id: "8",
    name: "Raspberry Jellies",
    category: "Gummies",
    price: 7.99,
    quantity: 35,
    image: "/raspberry-jellies.jpg",
    description: "Soft raspberry jelly candies",
  },
]

export function SweetsProvider({ children }: { children: React.ReactNode }) {
  const [sweets, setSweets] = useState<Sweet[]>([])

  useEffect(() => {
    // Load from localStorage or use initial data
    const stored = localStorage.getItem("sweets")
    if (stored) {
      setSweets(JSON.parse(stored))
    } else {
      setSweets(initialSweets)
      localStorage.setItem("sweets", JSON.stringify(initialSweets))
    }
  }, [])

  useEffect(() => {
    // Save to localStorage whenever sweets change
    if (sweets.length > 0) {
      localStorage.setItem("sweets", JSON.stringify(sweets))
    }
  }, [sweets])

  const updateSweet = (id: string, updates: Partial<Sweet>) => {
    setSweets((prev) => prev.map((sweet) => (sweet.id === id ? { ...sweet, ...updates } : sweet)))
  }

  const addSweet = (sweet: Omit<Sweet, "id">) => {
    const newSweet = {
      ...sweet,
      id: Date.now().toString(),
    }
    setSweets((prev) => [...prev, newSweet])
  }

  const deleteSweet = (id: string) => {
    setSweets((prev) => prev.filter((sweet) => sweet.id !== id))
  }

  const restockSweet = (id: string, amount: number) => {
    setSweets((prev) =>
      prev.map((sweet) => (sweet.id === id ? { ...sweet, quantity: sweet.quantity + amount } : sweet)),
    )
  }

  const purchaseSweet = async (id: string) => {
    const sweet = sweets.find((s) => s.id === id)

    if (!sweet || sweet.quantity === 0) {
      throw new Error("Sweet not available")
    }

    // In production, this would call the actual API
    // await fetch('/api/purchase', {
    //   method: 'POST',
    //   body: JSON.stringify({ sweetId: id, userId: currentUserId })
    // })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Update local state
    setSweets((prev) =>
      prev.map((sweet) => (sweet.id === id && sweet.quantity > 0 ? { ...sweet, quantity: sweet.quantity - 1 } : sweet)),
    )
  }

  return (
    <SweetsContext.Provider value={{ sweets, updateSweet, addSweet, deleteSweet, restockSweet, purchaseSweet }}>
      {children}
    </SweetsContext.Provider>
  )
}

export function useSweets() {
  const context = useContext(SweetsContext)
  if (context === undefined) {
    throw new Error("useSweets must be used within a SweetsProvider")
  }
  return context
}
