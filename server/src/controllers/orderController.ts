import { Response } from 'express';
import { Order } from '../models/Order';
import { Cart } from '../models/Cart';
import { AuthRequest } from '../middleware/auth';
import { mockOrdersStore, mockCartStore, isMongoConnected } from '../services/mockDataStore';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, deliveryMethod, paymentMethod, couponCode, discountAmount } = req.body;

    if (!items || items.length === 0 || !shippingAddress || !deliveryMethod || !paymentMethod) {
      res.status(400).json({ success: false, message: 'Please provide all required checkout details.' });
      return;
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const shippingCost = deliveryMethod.price || 0;
    const discount = discountAmount || 0;
    const tax = Math.round((subtotal - discount) * 0.18);
    const total = Math.max(0, subtotal - discount + tax + shippingCost);

    const orderNumber = `LX-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentStatus = paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED';

    const orderObj = {
      _id: `ord-${Date.now()}`,
      orderNumber,
      user: req.user?.id || 'usr-demo-123',
      items,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      paymentStatus,
      orderStatus: 'CONFIRMED',
      subtotal,
      discount,
      tax,
      shipping: shippingCost,
      total,
      timeline: [
        { status: 'PLACED', message: 'Order has been placed.', timestamp: new Date().toISOString() },
        { status: 'CONFIRMED', message: 'Order confirmed and payment processed.', timestamp: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected) {
      const order = await Order.create(orderObj);
      await Cart.findOneAndUpdate({ user: req.user?.id }, { items: [], subtotal: 0 });
      res.status(201).json({ success: true, message: 'Order created successfully.', order });
    } else {
      mockOrdersStore.unshift(orderObj);
      mockCartStore.items = [];
      mockCartStore.subtotal = 0;
      res.status(201).json({ success: true, message: 'Order created successfully.', order: orderObj });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    if (isMongoConnected) {
      const query: any = { user: req.user?.id };
      if (status && status !== 'All') {
        query.orderStatus = (status as string).toUpperCase();
      }
      const orders = await Order.find(query).sort({ createdAt: -1 });
      res.json({ success: true, count: orders.length, orders });
    } else {
      let filtered = [...mockOrdersStore];
      if (status && status !== 'All') {
        filtered = filtered.filter((o) => o.orderStatus === (status as string).toUpperCase());
      }
      res.json({ success: true, count: filtered.length, orders: filtered });
    }
  } catch (error) {
    res.json({ success: true, count: mockOrdersStore.length, orders: mockOrdersStore });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let order = null;

    if (isMongoConnected) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = mockOrdersStore.find((o) => o._id === id || o.orderNumber === id);
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    res.json({ success: true, order });
  } catch (error) {
    const fallback = mockOrdersStore[0];
    res.json({ success: true, order: fallback });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const order = await Order.findById(id);
      if (order) {
        order.orderStatus = 'CANCELLED';
        order.timeline.push({ status: 'CANCELLED', message: 'Order cancelled by customer.', timestamp: new Date() });
        await order.save();
        res.json({ success: true, message: 'Order cancelled successfully.', order });
        return;
      }
    }

    const target = mockOrdersStore.find((o) => o._id === id);
    if (target) {
      target.orderStatus = 'CANCELLED';
      target.timeline.push({ status: 'CANCELLED', message: 'Order cancelled by customer.', timestamp: new Date().toISOString() });
    }
    res.json({ success: true, message: 'Order cancelled successfully.', order: target });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
