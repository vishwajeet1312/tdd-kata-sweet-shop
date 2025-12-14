import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISweet extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  quantity: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SweetSchema = new Schema<ISweet>(
  {
    name: {
      type: String,
      required: [true, 'Sweet name is required'],
      trim: true,
      minlength: [2, 'Sweet name must be at least 2 characters'],
      maxlength: [100, 'Sweet name must not exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description must not exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['chocolate', 'candy', 'gummy', 'hard candy', 'lollipop', 'other'],
        message: '{VALUE} is not a valid category',
      },
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '/placeholder.svg',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
SweetSchema.index({ name: 'text', description: 'text' });
SweetSchema.index({ category: 1 });
SweetSchema.index({ price: 1 });

// Prevent model recompilation in development
const Sweet: Model<ISweet> = mongoose.models.Sweet || mongoose.model<ISweet>('Sweet', SweetSchema);

export default Sweet;
