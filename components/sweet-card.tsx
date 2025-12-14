"use client"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Sweet } from "@/lib/sweets-context"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PurchaseConfirmationDialog } from "@/components/purchase-confirmation-dialog"

interface SweetCardProps {
  sweet: Sweet
  onPurchase?: (id: string) => Promise<void>
}

export function SweetCard({ sweet, onPurchase }: SweetCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { toast } = useToast()

  const handlePurchase = async () => {
    if (!onPurchase) return

    setIsPurchasing(true)
    try {
      await onPurchase(sweet.id)
      setShowConfirmation(true)
      toast({
        title: "Success!",
        description: `${sweet.name} added to your order`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to purchase item",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const isOutOfStock = sweet.quantity === 0

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
        <div className="relative aspect-square bg-muted">
          <Image src={sweet.image || "/placeholder.svg"} alt={sweet.name} fill className="object-cover" />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="flex-1 p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight">{sweet.name}</h3>
            <Badge variant="secondary" className="shrink-0">
              {sweet.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{sweet.description}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-primary">₹{sweet.price.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">Stock: {sweet.quantity}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button onClick={handlePurchase} disabled={isOutOfStock || isPurchasing} className="w-full">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isPurchasing ? "Processing..." : isOutOfStock ? "Out of Stock" : "Purchase"}
          </Button>
        </CardFooter>
      </Card>

      <PurchaseConfirmationDialog open={showConfirmation} onOpenChange={setShowConfirmation} sweet={sweet} />
    </>
  )
}
