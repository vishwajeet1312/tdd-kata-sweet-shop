"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Sweet } from "@/lib/sweets-context"
import { CheckCircle2 } from "lucide-react"

interface PurchaseConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sweet: Sweet | null
}

export function PurchaseConfirmationDialog({ open, onOpenChange, sweet }: PurchaseConfirmationDialogProps) {
  if (!sweet) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Purchase Successful!</DialogTitle>
          <DialogDescription className="text-center">Your order has been confirmed</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Item</span>
              <span className="font-medium">{sweet.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium">{sweet.category}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Price</span>
              <span className="font-bold text-primary text-lg">₹{sweet.price.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">Thank you for your purchase!</p>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Continue Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
