import bcrypt from 'bcryptjs';

export let isMongoConnected = false;

export const setMongoConnected = (connected: boolean) => {
  isMongoConnected = connected;
};

export const initialCategories = [
  {
    _id: 'cat-1',
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    description: 'Minimalist haute couture and everyday tailored luxury garments.',
    active: true
  },
  {
    _id: 'cat-2',
    name: 'Footwear',
    slug: 'footwear',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
    description: 'Handcrafted leather boots, modern sneakers, and formal shoes.',
    active: true
  },
  {
    _id: 'cat-3',
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    description: 'Botanical skincare, artisanal perfumes, and luxury cosmetics.',
    active: true
  },
  {
    _id: 'cat-4',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'Luxury chronographs, leather goods, sunglasses, and jewelry.',
    active: true
  },
  {
    _id: 'cat-5',
    name: 'Home',
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
    description: 'Architectural decor, scented candles, and organic linen textiles.',
    active: true
  },
  {
    _id: 'cat-6',
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'High-fidelity audio systems, premium wearables, and minimalist tech.',
    active: true
  }
];

export const initialProducts = [
  {
    _id: 'prod-1',
    name: 'Aurelia Cashmere Oversized Coat',
    slug: 'aurelia-cashmere-oversized-coat',
    brand: 'Luxora Atelier',
    category: 'Fashion',
    description: 'Crafted from 100% Mongolian cashmere, this oversized coat features relaxed shoulders, horn buttons, and a belted waist for fluid elegance.',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
    ],
    price: 34999,
    discountPrice: 29999,
    stock: 12,
    variants: { colors: ['Camel', 'Onyx', 'Oatmeal'], sizes: ['S', 'M', 'L', 'XL'] },
    rating: 4.9,
    reviewCount: 24,
    isFeatured: true,
    isNewArrival: true,
    specifications: { Material: '100% Mongolian Cashmere', Lining: 'Silk Satin', Fit: 'Relaxed Oversized' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-2',
    name: 'Verona Silk Slip Maxi Dress',
    slug: 'verona-silk-slip-maxi-dress',
    brand: 'Sora Couture',
    category: 'Fashion',
    description: 'A bias-cut Mulberry silk slip dress designed with delicate adjustable straps and a graceful fluid drape for evening affairs.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80'
    ],
    price: 18500,
    discountPrice: 15999,
    stock: 15,
    variants: { colors: ['Champagne Gold', 'Midnight Navy', 'Emerald'], sizes: ['XS', 'S', 'M', 'L'] },
    rating: 4.8,
    reviewCount: 18,
    isFeatured: true,
    isNewArrival: false,
    specifications: { Material: '100% Mulberry Silk', Care: 'Dry Clean Only', Closure: 'Concealed Side Zip' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-3',
    name: 'Monarch Structured Double-Breasted Blazer',
    slug: 'monarch-structured-blazer',
    brand: 'Luxora Tailored',
    category: 'Fashion',
    description: 'Impeccably tailored wool-blend blazer featuring padded shoulders, sharp lapels, and custom gold-tone lion buttons.',
    images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&auto=format&fit=crop&q=80'
    ],
    price: 24500,
    discountPrice: 21999,
    stock: 8,
    variants: { colors: ['Deep Onyx', 'Ivory Cream'], sizes: ['S', 'M', 'L'] },
    rating: 4.7,
    reviewCount: 31,
    isFeatured: false,
    isNewArrival: true,
    specifications: { Material: '80% Virgin Wool, 20% Silk', Fit: 'Tailored Slim' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-4',
    name: 'Vanguard Leather Chelsea Boots',
    slug: 'vanguard-leather-chelsea-boots',
    brand: 'Artisan Sole',
    category: 'Footwear',
    description: 'Handcrafted Italian calfskin leather Chelsea boots featuring elastic side gussets, Goodyear welted sole, and a polished finish.',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80'
    ],
    price: 22999,
    discountPrice: 19999,
    stock: 14,
    variants: { colors: ['Espresso Brown', 'Onyx Black'], sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'] },
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isNewArrival: true,
    specifications: { Upper: 'Full-Grain Italian Calfskin', Sole: 'Leather & Rubber Injection' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-5',
    name: 'Aether Low-Top Minimalist Sneakers',
    slug: 'aether-low-top-sneakers',
    brand: 'Luxora Lab',
    category: 'Footwear',
    description: 'Sleek luxury sneakers made with supple Nappa leather, padded leather footbed, and tonal rubber cupsole.',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80'
    ],
    price: 14999,
    discountPrice: 12999,
    stock: 20,
    variants: { colors: ['Triple White', 'Monochrome Black'], sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'] },
    rating: 4.8,
    reviewCount: 50,
    isFeatured: true,
    isNewArrival: false,
    specifications: { Upper: 'Italian Nappa Leather', Lining: 'Breathable Calfskin' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-6',
    name: 'Botanical Regenerative Face Serum',
    slug: 'botanical-regenerative-face-serum',
    brand: 'Luxora Apothecary',
    category: 'Beauty',
    description: 'Infused with rare alpine rose stem cells, hyaluronic acid, and cold-pressed marula oil to restore luminous radiance.',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597261-83324467915b?w=800&auto=format&fit=crop&q=80'
    ],
    price: 6999,
    discountPrice: 5999,
    stock: 45,
    variants: { colors: ['50ml Bottle'], sizes: ['50ml'] },
    rating: 4.9,
    reviewCount: 64,
    isFeatured: true,
    isNewArrival: true,
    specifications: { Volume: '50ml / 1.7 fl. oz.', Origin: 'Switzerland', SkinType: 'All Skin Types' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-7',
    name: 'Oud & Amber Maison Eau de Parfum',
    slug: 'oud-amber-maison-perfume',
    brand: 'Maison de Luxora',
    category: 'Beauty',
    description: 'A rich, seductive fragrance opening with smoky incense and bergamot, lingering into warm Cambodian oud and golden amber notes.',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'
    ],
    price: 12500,
    discountPrice: 10999,
    stock: 22,
    variants: { colors: ['100ml Glass Spray'], sizes: ['100ml'] },
    rating: 5.0,
    reviewCount: 48,
    isFeatured: true,
    isNewArrival: false,
    specifications: { Concentration: 'Eau de Parfum (22%)', ScentFamily: 'Woody Oriental' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-8',
    name: 'Chronograph Minimalist Swiss Watch',
    slug: 'chronograph-minimalist-swiss-watch',
    brand: 'Luxora Horology',
    category: 'Accessories',
    description: 'A 40mm stainless steel chronograph watch driven by a Swiss Quartz movement, protected by scratch-resistant sapphire crystal.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ],
    price: 45000,
    discountPrice: 38999,
    stock: 6,
    variants: { colors: ['Silver Dial / Leather Strap', 'All-Black Matte'], sizes: ['40mm'] },
    rating: 4.9,
    reviewCount: 30,
    isFeatured: true,
    isNewArrival: true,
    specifications: { CaseDiameter: '40mm', Movement: 'Swiss Quartz Chronograph', Glass: 'Sapphire Crystal' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-9',
    name: 'Monogrammed Full-Grain Leather Tote Bag',
    slug: 'monogrammed-leather-tote-bag',
    brand: 'Luxora Leatherworks',
    category: 'Accessories',
    description: 'Handcrafted full-grain Italian leather tote featuring micro-suede interior, dedicated 15" laptop sleeve, and brass hardware.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
    ],
    price: 28999,
    discountPrice: 24999,
    stock: 10,
    variants: { colors: ['Cognac Tan', 'Midnight Black', 'Olive Drab'], sizes: ['One Size'] },
    rating: 4.9,
    reviewCount: 41,
    isFeatured: true,
    isNewArrival: false,
    specifications: { Dimensions: '38 x 30 x 14 cm', Material: 'Full-Grain Tuscan Leather' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-10',
    name: 'Architectural Ceramic Table Lamp',
    slug: 'architectural-ceramic-table-lamp',
    brand: 'Luxora Living',
    category: 'Home',
    description: 'Hand-thrown textured ceramic lamp with a linen drum shade, emitting warm dimmable ambient glow for serene spaces.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80'
    ],
    price: 16999,
    discountPrice: 14499,
    stock: 9,
    variants: { colors: ['Sandstone', 'Matte Chalk White'], sizes: ['48cm Height'] },
    rating: 4.9,
    reviewCount: 17,
    isFeatured: true,
    isNewArrival: true,
    specifications: { Height: '48cm', Bulb: 'Warm LED E27 Dimmable Included' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-11',
    name: 'Acoustics Wireless Noise-Cancelling Headphones',
    slug: 'acoustics-wireless-noise-cancelling-headphones',
    brand: 'Luxora Audio',
    category: 'Electronics',
    description: 'Studio-grade wireless over-ear headphones with active noise cancellation, custom 40mm beryllium drivers, and 30-hour battery life.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    price: 32999,
    discountPrice: 28999,
    stock: 15,
    variants: { colors: ['Matte Silver', 'Obsidian Black'], sizes: ['Standard'] },
    rating: 4.9,
    reviewCount: 62,
    isFeatured: true,
    isNewArrival: true,
    specifications: { Driver: '40mm Beryllium', ANC: 'Adaptive Active Cancellation', Battery: '30 Hours' },
    createdAt: new Date().toISOString()
  }
];

export const mockUser = {
  _id: 'usr-demo-123',
  firstName: 'Jithu',
  lastName: 'Kumar',
  email: 'jithu@example.com',
  phone: '+91 98765 43210',
  role: 'CUSTOMER',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  addresses: [
    {
      _id: 'addr-1',
      fullName: 'Jithu Kumar',
      phone: '+91 98765 43210',
      street: '42 Luxury Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
      isDefault: true
    }
  ],
  wishlist: ['prod-1', 'prod-4', 'prod-8'],
  preferences: { theme: 'LIGHT', notifications: true }
};

export const mockAdminUser = {
  _id: 'usr-admin-999',
  firstName: 'Luxora',
  lastName: 'Admin',
  email: 'admin@luxora.com',
  phone: '+91 99999 99999',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  addresses: [],
  wishlist: [],
  preferences: { theme: 'LIGHT', notifications: true }
};

export let mockOrdersStore: any[] = [
  {
    _id: 'ord-1001',
    orderNumber: 'LX-849201-9214',
    user: mockUser._id,
    items: [
      {
        product: 'prod-1',
        name: 'Aurelia Cashmere Oversized Coat',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80',
        brand: 'Luxora Atelier',
        selectedColor: 'Camel',
        selectedSize: 'M',
        quantity: 1,
        price: 29999
      }
    ],
    shippingAddress: mockUser.addresses[0],
    deliveryMethod: { name: 'Express White-Glove Courier', price: 499, estimatedDays: '2 Business Days' },
    paymentMethod: 'DEMO',
    paymentStatus: 'COMPLETED',
    orderStatus: 'PROCESSING',
    subtotal: 29999,
    discount: 0,
    tax: 5399,
    shipping: 499,
    total: 35897,
    timeline: [
      { status: 'PLACED', message: 'Order has been placed.', timestamp: new Date().toISOString() },
      { status: 'CONFIRMED', message: 'Order confirmed and payment processed.', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  }
];

export let mockCartStore: any = {
  items: [
    {
      _id: 'citem-1',
      product: initialProducts[0],
      selectedColor: 'Camel',
      selectedSize: 'M',
      quantity: 1,
      price: 29999
    }
  ],
  subtotal: 29999
};
