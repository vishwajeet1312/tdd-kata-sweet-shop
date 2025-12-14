"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RestockDialogProps {
  sweetName: string
  currentQuantity: number
  onRestock: (amount: number) => void
}

export function RestockDialog({ sweetName, currentQuantity, onRestock }: RestockDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const restockAmount = Number.parseInt(amount)
    if (isNaN(restockAmount) || restockAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    onRestock(restockAmount)
    setAmount("")
    setOpen(false)
    toast({
      title: "Restocked",
      description: `Added ${restockAmount} units to ${sweetName}`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Package className="h-4 w-4 mr-2" />
          Restock
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Restock {sweetName}</DialogTitle>
          <DialogDescription>Current stock: {currentQuantity} units</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restock-amount">Quantity to add</Label>
            <Input
              id="restock-amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter quantity"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Stock</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
