import { Router } from 'express';
import { getProductReviews, addReview } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/products/:productId', getProductReviews);
router.post('/products/:productId', authenticate, addReview);

export default router;
