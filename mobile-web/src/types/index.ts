export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  avatar?: string;
  addresses: Address[];
  preferences: {
    theme: 'LIGHT' | 'DARK' | 'SYSTEM';
    notifications: boolean;
  };
}

export interface Product {
  _id: string;
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
  specifications?: Record<string, string>;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface CartItem {
  _id?: string;
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  subtotal: number;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  brand: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  price: number;
}

export interface TimelineEvent {
  status: string;
  message: string;
  timestamp: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  deliveryMethod: {
    name: string;
    price: number;
    estimatedDays: string;
  };
  paymentMethod: 'DEMO' | 'RAZORPAY' | 'STRIPE' | 'COD';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  orderStatus: 'PLACED' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  timeline: TimelineEvent[];
  createdAt: string;
}

export interface Review {
  _id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  createdAt: string;
}
