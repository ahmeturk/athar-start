import { Router } from 'express';
import {
  getDashboard,
  getUsers,
  getUserDetail,
  toggleUserActive,
  getPayments,
  getAnalytics,
  getCoupons,
  createCoupon,
  deleteCoupon,
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, requireAdmin);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetail);
router.put('/users/:id/toggle-active', toggleUserActive);
router.get('/payments', getPayments);
router.get('/analytics', getAnalytics);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);

export default router;
