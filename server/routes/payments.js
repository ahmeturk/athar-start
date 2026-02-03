import { Router } from 'express';
import {
  createPayment,
  verifyPayment,
  verifyCoupon,
  getMyPayments,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { validate, createPaymentSchema, verifyCouponSchema } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.post('/create', validate(createPaymentSchema), createPayment);
router.post('/verify/:paymentId', verifyPayment);
router.post('/verify-coupon', validate(verifyCouponSchema), verifyCoupon);
router.get('/my-payments', getMyPayments);

export default router;
