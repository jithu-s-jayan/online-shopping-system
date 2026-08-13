import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId | string;
  product: mongoose.Types.ObjectId;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: mongoose.Types.DocumentArray<ICartItem & Document>;
  subtotal: number;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  selectedColor: { type: String },
  selectedSize: { type: String },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  price: { type: Number, required: true }
});

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
    subtotal: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
