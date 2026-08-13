import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  variants: {
    colors: string[];
    sizes: string[];
  };
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  specifications: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 10, min: 0 },
    variants: {
      colors: [{ type: String }],
      sizes: [{ type: String }]
    },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    specifications: { type: Map, of: String, default: {} }
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', brand: 'text', category: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
