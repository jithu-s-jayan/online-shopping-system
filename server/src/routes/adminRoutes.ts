import { Router } from 'express';
import {
  getDashboardMetrics,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getAllCustomersAdmin
} from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/metrics', getDashboardMetrics);
router.get('/orders', getAllOrdersAdmin);
router.put('/orders/:id/status', updateOrderStatusAdmin);
router.get('/customers', getAllCustomersAdmin);

export default router;
