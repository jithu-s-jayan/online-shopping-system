import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).populate('wishlist');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const index = user.wishlist.findIndex((id) => id.toString() === productId);
    let isWishlisted = false;

    if (index > -1) {
      user.wishlist.splice(index, 1);
      isWishlisted = false;
    } else {
      user.wishlist.push(new mongoose.Types.ObjectId(productId));
      isWishlisted = true;
    }

    await user.save();
    await user.populate('wishlist');

    res.json({
      success: true,
      isWishlisted,
      message: isWishlisted ? 'Saved to wishlist.' : 'Removed from wishlist.',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
