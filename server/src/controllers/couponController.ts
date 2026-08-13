import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon';

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
      return;
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) {
      res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
      return;
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      res.status(400).json({ success: false, message: 'This coupon has expired.' });
      return;
    }

    if (subtotal && subtotal < coupon.minimumOrder) {
      res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minimumOrder} required for this coupon.`
      });
      return;
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discountAmount = coupon.value;
    }

    res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
