"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { useSweets } from "@/lib/sweets-context"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddSweetDialog } from "@/components/admin/add-sweet-dialog"
import { EditSweetDialog } from "@/components/admin/edit-sweet-dialog"
import { DeleteSweetDialog } from "@/components/admin/delete-sweet-dialog"
import { RestockDialog } from "@/components/admin/restock-dialog"
import { Toaster } from "@/components/ui/toaster"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldCheck } from "lucide-react"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const { sweets, updateSweet, addSweet, deleteSweet, restockSweet } = useSweets()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "admin") {
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
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-primary/10 p-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">Manage your sweet inventory, add new items, and restock products</p>
        </div>

        <Alert className="mb-6 bg-accent/10 border-accent">
          <AlertDescription>
            You have admin privileges. You can add, edit, delete, and restock sweets from this panel.
          </AlertDescription>
        </Alert>

        <div className="mb-6">
          <AddSweetDialog onAdd={addSweet} />
        </div>

        {sweets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No sweets in inventory. Add your first sweet to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {sweets.map((sweet) => (
              <Card key={sweet.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{sweet.name}</span>
                    <Badge
                      variant={sweet.quantity === 0 ? "destructive" : sweet.quantity < 20 ? "secondary" : "default"}
                    >
                      {sweet.quantity === 0 ? "Out of Stock" : sweet.quantity < 20 ? "Low Stock" : "In Stock"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image src={sweet.image || "/placeholder.svg"} alt={sweet.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-medium">{sweet.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-medium text-primary">₹{sweet.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p className="font-medium">{sweet.quantity} units</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">ID</p>
                          <p className="font-medium text-xs">{sweet.id}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="text-sm">{sweet.description || "No description provided"}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <EditSweetDialog sweet={sweet} onUpdate={updateSweet} />
                        <RestockDialog
                          sweetName={sweet.name}
                          currentQuantity={sweet.quantity}
                          onRestock={(amount) => restockSweet(sweet.id, amount)}
                        />
                        <DeleteSweetDialog sweetName={sweet.name} onDelete={() => deleteSweet(sweet.id)} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
}
