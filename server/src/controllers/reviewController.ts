import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { rating, comment, images } = req.body;

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const review = await Review.create({
      user: user._id,
      product: productId,
      userName: `${user.firstName} ${user.lastName}`,
      userAvatar: user.avatar,
      rating: Number(rating),
      comment,
      images: images || [],
      verifiedPurchase: true
    });

    // Update product rating average
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully.', review });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
