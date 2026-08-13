import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Coupon } from '../models/Coupon';
import { Review } from '../models/Review';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/luxora_db';

const categoriesData = [
  {
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    description: 'Minimalist haute couture and everyday tailored luxury garments.'
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
    description: 'Handcrafted leather boots, modern sneakers, and formal shoes.'
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    description: 'Botanical skincare, artisanal perfumes, and luxury cosmetics.'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'Luxury chronographs, leather goods, sunglasses, and jewelry.'
  },
  {
    name: 'Home',
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
    description: 'Architectural decor, scented candles, and organic linen textiles.'
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'High-fidelity audio systems, premium wearables, and minimalist tech.'
  }
];

const productsData = [
  // FASHION
  {
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
    specifications: { Material: '100% Mongolian Cashmere', Lining: 'Silk Satin', Fit: 'Relaxed Oversized' }
  },
  {
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
    specifications: { Material: '100% Mulberry Silk', Care: 'Dry Clean Only', Closure: 'Concealed Side Zip' }
  },
  {
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
    specifications: { Material: '80% Virgin Wool, 20% Silk', Fit: 'Tailored Slim' }
  },
  {
    name: 'Knit Merino Wool Turtle Neck',
    slug: 'knit-merino-wool-turtle-neck',
    brand: 'Minimalist Co',
    category: 'Fashion',
    description: 'Ultra-soft extra fine Merino wool knit sweater engineered with seamless knitting technique for supreme warmth and minimal silhouette.',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80'
    ],
    price: 9999,
    discountPrice: 8499,
    stock: 25,
    variants: { colors: ['Sand', 'Charcoal', 'Forest Green'], sizes: ['S', 'M', 'L', 'XL'] },
    rating: 4.9,
    reviewCount: 42,
    isFeatured: false,
    isNewArrival: false,
    specifications: { Material: '100% Extra Fine Merino Wool', Gauge: '12 Gauge Knit' }
  },
  {
    name: 'Lucent Linen Resort Shirt',
    slug: 'lucent-linen-resort-shirt',
    brand: 'Luxora Atelier',
    category: 'Fashion',
    description: 'Lightweight French linen camp-collar shirt washed for extreme softness. Ideal for warm weather and effortless resort styling.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
    ],
    price: 7499,
    discountPrice: 5999,
    stock: 30,
    variants: { colors: ['Pure White', 'Sky Azure', 'Terracotta'], sizes: ['M', 'L', 'XL'] },
    rating: 4.6,
    reviewCount: 15,
    isFeatured: false,
    isNewArrival: true,
    specifications: { Material: '100% Organic French Linen' }
  },

  // FOOTWEAR
  {
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
    specifications: { Upper: 'Full-Grain Italian Calfskin', Sole: 'Leather & Rubber Injection' }
  },
  {
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
    specifications: { Upper: 'Italian Nappa Leather', Lining: 'Breathable Calfskin' }
  },
  {
    name: 'Soleil Strappy Leather Stiletto Heels',
    slug: 'soleil-strappy-stiletto-heels',
    brand: 'Sora Couture',
    category: 'Footwear',
    description: 'Refined 85mm stiletto heels crafted with delicate cross straps and cushioned arch support for high fashion comfort.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'
    ],
    price: 16500,
    discountPrice: 14499,
    stock: 10,
    variants: { colors: ['Gold Metallic', 'Nude Sand', 'Classic Black'], sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7'] },
    rating: 4.7,
    reviewCount: 19,
    isFeatured: false,
    isNewArrival: true,
    specifications: { HeelHeight: '85mm / 3.3 inches', Material: 'Patent Leather' }
  },
  {
    name: 'Suede Belgian Penny Loafers',
    slug: 'suede-belgian-penny-loafers',
    brand: 'Artisan Sole',
    category: 'Footwear',
    description: 'Unstructured suede Belgian loafers with soft leather binding and cushioned insoles for effortless luxury tailoring.',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80'
    ],
    price: 17999,
    discountPrice: 15499,
    stock: 12,
    variants: { colors: ['Taupe Suede', 'Navy Suede'], sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'] },
    rating: 4.9,
    reviewCount: 27,
    isFeatured: false,
    isNewArrival: false,
    specifications: { Upper: 'Water-resistant Calf Suede' }
  },

  // BEAUTY
  {
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
    specifications: { Volume: '50ml / 1.7 fl. oz.', Origin: 'Switzerland', SkinType: 'All Skin Types' }
  },
  {
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
    specifications: { Concentration: 'Eau de Parfum (22%)', ScentFamily: 'Woody Oriental' }
  },
  {
    name: 'Velvet Matte Hydrating Lipstick - Crimson',
    slug: 'velvet-matte-hydrating-lipstick-crimson',
    brand: 'Luxora Beauty',
    category: 'Beauty',
    description: 'Enriched with jojoba ester and vitamin E, delivering intense color payoff with a velvety weightless feel.',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80'
    ],
    price: 3200,
    discountPrice: 2800,
    stock: 50,
    variants: { colors: ['Royal Crimson', 'Nude Rose', 'Berry Velvet'], sizes: ['3.5g'] },
    rating: 4.7,
    reviewCount: 35,
    isFeatured: false,
    isNewArrival: true,
    specifications: { Finish: 'Velvet Matte', Weight: '3.5g' }
  },
  {
    name: 'Rejuvenating Night Elixir Oil',
    slug: 'rejuvenating-night-elixir-oil',
    brand: 'Luxora Apothecary',
    category: 'Beauty',
    description: 'Overnight cell renewal oil formulated with organic rosehip, bakuchiol, and squalane for plump, youthful skin.',
    images: [
      'https://images.unsplash.com/photo-1608248597261-83324467915b?w=800&auto=format&fit=crop&q=80'
    ],
    price: 5499,
    discountPrice: 4699,
    stock: 30,
    variants: { colors: ['30ml Glass Dropper'], sizes: ['30ml'] },
    rating: 4.8,
    reviewCount: 29,
    isFeatured: false,
    isNewArrival: false,
    specifications: { KeyIngredient: 'Natural Bakuchiol (Retinol alternative)' }
  },

  // ACCESSORIES
  {
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
    specifications: { CaseDiameter: '40mm', Movement: 'Swiss Quartz Chronograph', Glass: 'Sapphire Crystal' }
  },
  {
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
    specifications: { Dimensions: '38 x 30 x 14 cm', Material: 'Full-Grain Tuscan Leather' }
  },
  {
    name: 'Polarized Aviator Titanium Sunglasses',
    slug: 'polarized-aviator-titanium-sunglasses',
    brand: 'Aether Eyewear',
    category: 'Accessories',
    description: 'Ultra-lightweight Japanese beta-titanium frames paired with glare-reducing polarized lenses offering 100% UV400 protection.',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
    ],
    price: 11999,
    discountPrice: 9999,
    stock: 18,
    variants: { colors: ['Gold / Green Gradient', 'Silver / Smoke Grey'], sizes: ['Standard'] },
    rating: 4.8,
    reviewCount: 22,
    isFeatured: false,
    isNewArrival: true,
    specifications: { FrameMaterial: 'Beta-Titanium', Protection: 'UV400 Polarized' }
  },

  // HOME
  {
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
    specifications: { Height: '48cm', Bulb: 'Warm LED E27 Dimmable Included' }
  },
  {
    name: 'Cedar & Tobacco Scented Soy Candle',
    slug: 'cedar-tobacco-scented-soy-candle',
    brand: 'Maison de Luxora',
    category: 'Home',
    description: 'Hand-poured 100% natural soy wax candle in a dark amber glass vessel, burning up to 60 hours with notes of virginian cedar and smoked tobacco leaf.',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80'
    ],
    price: 3800,
    discountPrice: 3200,
    stock: 40,
    variants: { colors: ['300g Vessel'], sizes: ['300g'] },
    rating: 4.9,
    reviewCount: 55,
    isFeatured: false,
    isNewArrival: false,
    specifications: { BurnTime: '60 Hours', Wax: '100% Organic Soy Wax' }
  },
  {
    name: 'Washed Pure Linen Duvet Set',
    slug: 'washed-pure-linen-duvet-set',
    brand: 'Luxora Living',
    category: 'Home',
    description: 'Crafted from 100% French flax linen, pre-washed for vintage softness that becomes smoother with every wash cycle.',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80'
    ],
    price: 19999,
    discountPrice: 16999,
    stock: 14,
    variants: { colors: ['Flax Beige', 'Eucalyptus Green', 'Pure White'], sizes: ['Queen', 'King'] },
    rating: 4.8,
    reviewCount: 26,
    isFeatured: false,
    isNewArrival: true,
    specifications: { Material: '100% French Flax Linen', Includes: '1 Duvet Cover + 2 Pillowcases' }
  },

  // ELECTRONICS
  {
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
    specifications: { Driver: '40mm Beryllium', ANC: 'Adaptive Active Cancellation', Battery: '30 Hours' }
  },
  {
    name: 'Precision Aluminum Wireless Keyboard & Mouse',
    slug: 'precision-aluminum-wireless-keyboard-mouse',
    brand: 'Luxora Tech',
    category: 'Electronics',
    description: 'Anodized CNC aluminum wireless keyboard with low-profile tactile switches and a whisper-quiet ergonomic precision mouse.',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
    ],
    price: 14999,
    discountPrice: 12499,
    stock: 22,
    variants: { colors: ['Space Grey', 'Silver Steel'], sizes: ['Full Layout'] },
    rating: 4.8,
    reviewCount: 33,
    isFeatured: false,
    isNewArrival: false,
    specifications: { Connectivity: 'Bluetooth 5.2 + 2.4GHz Wireless', Battery: 'Rechargeable USB-C' }
  }
];

const couponsData = [
  {
    code: 'LUXORA10',
    type: 'PERCENTAGE',
    value: 10,
    minimumOrder: 5000,
    expiryDate: new Date('2027-12-31'),
    usageLimit: 500,
    active: true
  },
  {
    code: 'ELEVATE20',
    type: 'PERCENTAGE',
    value: 20,
    minimumOrder: 15000,
    expiryDate: new Date('2027-12-31'),
    usageLimit: 200,
    active: true
  },
  {
    code: 'WELCOME2000',
    type: 'FIXED',
    value: 2000,
    minimumOrder: 10000,
    expiryDate: new Date('2027-12-31'),
    usageLimit: 100,
    active: true
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});
    await Review.deleteMany({});

    console.log('Cleared existing data.');

    // Seed Categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${categories.length} categories.`);

    // Seed Products
    const products = await Product.insertMany(productsData);
    console.log(`Seeded ${products.length} products.`);

    // Seed Coupons
    const coupons = await Coupon.insertMany(couponsData);
    console.log(`Seeded ${coupons.length} coupons.`);

    // Seed Users
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('password123', salt);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);

    const demoUser = await User.create({
      firstName: 'Jithu',
      lastName: 'Kumar',
      email: 'jithu@example.com',
      phone: '+91 9876543210',
      passwordHash: demoPasswordHash,
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      addresses: [
        {
          fullName: 'Jithu Kumar',
          phone: '+91 9876543210',
          street: '42 Luxury Avenue, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
          isDefault: true
        }
      ],
      wishlist: [products[0]._id, products[5]._id, products[10]._id]
    });

    const adminUser = await User.create({
      firstName: 'Luxora',
      lastName: 'Admin',
      email: 'admin@luxora.com',
      phone: '+91 9999999999',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    console.log('Seeded Customer & Admin accounts.');

    // Seed Initial Sample Reviews
    await Review.create([
      {
        user: demoUser._id,
        product: products[0]._id,
        userName: 'Jithu Kumar',
        userAvatar: demoUser.avatar,
        rating: 5,
        comment: 'Exquisite cashmere quality! The drape and warmth are unmatched. Highly recommended.',
        verifiedPurchase: true
      },
      {
        user: demoUser._id,
        product: products[5]._id,
        userName: 'Elena Rostova',
        rating: 5,
        comment: 'Flawless craftmanship. The leather feels incredible and fits true to size.',
        verifiedPurchase: true
      }
    ]);

    console.log('Seeded initial reviews.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seed();
