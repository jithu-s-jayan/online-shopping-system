import { Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { mockCartStore, initialProducts, isMongoConnected } from '../services/mockDataStore';

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoConnected) {
      let cart = await Cart.findOne({ user: req.user?.id }).populate('items.product');
      if (!cart) {
        cart = await Cart.create({ user: req.user?.id, items: [], subtotal: 0 });
      }
      res.json({ success: true, cart });
    } else {
      res.json({ success: true, cart: mockCartStore });
    }
  } catch (error) {
    res.json({ success: true, cart: mockCartStore });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, selectedColor, selectedSize, quantity = 1 } = req.body;
    let product: any = null;

    if (isMongoConnected) {
      product = await Product.findById(productId);
    }
    if (!product) {
      product = initialProducts.find((p) => p._id === productId) || initialProducts[0];
    }

    if (isMongoConnected) {
      let cart = await Cart.findOne({ user: req.user?.id });
      if (!cart) {
        cart = new Cart({ user: req.user?.id, items: [], subtotal: 0 });
      }

      const price = product.discountPrice || product.price;

      const existingIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += Number(quantity);
      } else {
        cart.items.push({
          product: product._id as any,
          selectedColor,
          selectedSize,
          quantity: Number(quantity),
          price
        });
      }

      cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await cart.save();
      await cart.populate('items.product');

      res.json({ success: true, message: 'Product added to bag.', cart });
    } else {
      const price = product.discountPrice || product.price;
      const existing = mockCartStore.items.find(
        (i: any) => i.product._id === productId && i.selectedColor === selectedColor && i.selectedSize === selectedSize
      );

      if (existing) {
        existing.quantity += Number(quantity);
      } else {
        mockCartStore.items.push({
          _id: `item-${Date.now()}`,
          product,
          selectedColor,
          selectedSize,
          quantity: Number(quantity),
          price
        });
      }

      mockCartStore.subtotal = mockCartStore.items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
      res.json({ success: true, message: 'Product added to bag.', cart: mockCartStore });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (isMongoConnected) {
      const cart = await Cart.findOne({ user: req.user?.id });
      if (cart) {
        const item = cart.items.id(itemId as any);
        if (item) {
          if (quantity <= 0) cart.items.pull({ _id: itemId });
          else item.quantity = Number(quantity);

          cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
          await cart.save();
          await cart.populate('items.product');
          res.json({ success: true, cart });
          return;
        }
      }
    }

    if (quantity <= 0) {
      mockCartStore.items = mockCartStore.items.filter((i: any) => i._id !== itemId);
    } else {
      const item = mockCartStore.items.find((i: any) => i._id === itemId);
      if (item) item.quantity = Number(quantity);
    }
    mockCartStore.subtotal = mockCartStore.items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
    res.json({ success: true, cart: mockCartStore });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    if (isMongoConnected) {
      const cart = await Cart.findOne({ user: req.user?.id });
      if (cart) {
        cart.items.pull({ _id: itemId });
        cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        await cart.save();
        await cart.populate('items.product');
        res.json({ success: true, message: 'Item removed from bag.', cart });
        return;
      }
    }

    mockCartStore.items = mockCartStore.items.filter((i: any) => i._id !== itemId);
    mockCartStore.subtotal = mockCartStore.items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
    res.json({ success: true, message: 'Item removed from bag.', cart: mockCartStore });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoConnected) {
      const cart = await Cart.findOne({ user: req.user?.id });
      if (cart) {
        cart.items = [] as any;
        cart.subtotal = 0;
        await cart.save();
      }
    }
    mockCartStore.items = [];
    mockCartStore.subtotal = 0;
    res.json({ success: true, message: 'Cart cleared.', cart: mockCartStore });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
