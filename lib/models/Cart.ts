import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICartItem {
  sweet: mongoose.Types.ObjectId;
  quantity: number;
  priceAtAdd: number;
}

export interface ICart extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
  getTotalPrice(): Promise<number>;
  getTotalItems(): number;
}

const CartItemSchema = new Schema<ICartItem>({
  sweet: {
    type: Schema.Types.ObjectId,
    ref: 'Sweet',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  priceAtAdd: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive'],
  },
});

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

// Method to calculate total price
CartSchema.methods.getTotalPrice = async function (): Promise<number> {
  return this.items.reduce((total: number, item: ICartItem) => {
    return total + item.priceAtAdd * item.quantity;
  }, 0);
};

// Method to get total number of items
CartSchema.methods.getTotalItems = function (): number {
  return this.items.reduce((total: number, item: ICartItem) => {
    return total + item.quantity;
  }, 0);
};

// Prevent model recompilation in development
const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
