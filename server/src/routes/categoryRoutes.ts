import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categoryController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticate, requireAdmin, createCategory);

export default router;
