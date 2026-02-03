import Payment from '../models/Payment.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';
import { createMoyasarPayment, verifyMoyasarPayment } from '../services/paymentService.js';

const BASE_PRICE = 199;
const SALE_PRICE = 139;
const VAT_RATE = 0.15;

/**
 * POST /api/payments/create
 */
export const createPayment = async (req, res, next) => {
  try {
    const { method, couponCode, cardNumber, cardExpiry, cardCvc, cardName } = req.validatedBody;

    // Check if user already paid
    if (req.user.hasPaid) {
      return res.status(400).json({
        success: false,
        message: 'لقد تم الدفع مسبقاً',
      });
    }

    // Calculate pricing
    let subtotal = SALE_PRICE;
    let couponDiscount = 0;
    let appliedCoupon = null;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon && coupon.isValid()) {
        couponDiscount = coupon.discount;
        subtotal = SALE_PRICE * (1 - couponDiscount / 100);
        appliedCoupon = coupon;
      }
    }

    const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
    const total = Math.round((subtotal + vat) * 100) / 100;

    // Create payment via gateway
    const gatewayResult = await createMoyasarPayment({
      amount: total,
      method,
      cardDetails: { cardNumber, cardExpiry, cardCvc, cardName },
      description: `أثر البداية - اختبار التقييم المهني - ${req.user.name}`,
      metadata: {
        userId: req.user._id.toString(),
        email: req.user.email,
      },
    });

    // Save payment record
    const payment = await Payment.create({
      user: req.user._id,
      amount: total,
      method,
      status: gatewayResult.status,
      gatewayId: gatewayResult.gatewayId,
      gatewayResponse: gatewayResult.rawResponse,
      pricing: {
        basePrice: BASE_PRICE,
        discount: BASE_PRICE - SALE_PRICE,
        couponCode: couponCode?.toUpperCase() || null,
        couponDiscount,
        subtotal,
        vat,
        total,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // If payment is successful immediately (simulated or instant)
    if (gatewayResult.status === 'paid') {
      req.user.hasPaid = true;
      await req.user.save();

      // Increment coupon usage
      if (appliedCoupon) {
        appliedCoupon.currentUses += 1;
        await appliedCoupon.save();
      }
    }

    res.status(201).json({
      success: true,
      payment: {
        id: payment._id,
        status: payment.status,
        total: payment.pricing.total,
        gatewayId: payment.gatewayId,
        transactionUrl: gatewayResult.transactionUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/verify/:paymentId
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'عملية الدفع غير موجودة',
      });
    }

    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح',
      });
    }

    // Verify with gateway
    const result = await verifyMoyasarPayment(payment.gatewayId);

    payment.status = result.status;
    payment.gatewayResponse = result.rawResponse;
    await payment.save();

    // Update user if payment confirmed
    if (result.verified) {
      await User.findByIdAndUpdate(payment.user, { hasPaid: true });
    }

    res.json({
      success: true,
      status: payment.status,
      verified: result.verified,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/verify-coupon
 */
export const verifyCoupon = async (req, res, next) => {
  try {
    const { code } = req.validatedBody;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'رمز الكوبون غير صالح أو منتهي',
      });
    }

    // Calculate discounted price
    const discountedPrice = SALE_PRICE * (1 - coupon.discount / 100);
    const vat = Math.round(discountedPrice * VAT_RATE * 100) / 100;

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        discountedPrice: Math.round(discountedPrice * 100) / 100,
        vat,
        total: Math.round((discountedPrice + vat) * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payments/my-payments
 */
export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('amount status method pricing createdAt');

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    next(error);
  }
};
