import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // Payment details
  amount: {
    type: Number,
    required: true, // in SAR (halalas * 100 for Moyasar)
  },
  currency: {
    type: String,
    default: 'SAR',
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  // Payment method
  method: {
    type: String,
    enum: ['visa', 'mada', 'applepay', 'stcpay'],
    required: true,
  },
  // Moyasar payment ID
  gatewayId: {
    type: String,
    default: null,
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  // Pricing breakdown
  pricing: {
    basePrice: { type: Number, default: 199 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    couponDiscount: { type: Number, default: 0 }, // percentage
    subtotal: { type: Number, required: true },
    vat: { type: Number, required: true }, // 15%
    total: { type: Number, required: true },
  },
  // Metadata
  ipAddress: String,
  userAgent: String,
  // Refund details
  refundedAt: Date,
  refundReason: String,
  refundAmount: Number,
}, {
  timestamps: true,
});

// Index for admin queries
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ 'pricing.couponCode': 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
