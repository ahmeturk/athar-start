import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
    max: 100, // percentage
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  maxUses: {
    type: Number,
    default: null, // null = unlimited
  },
  currentUses: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    default: null, // null = no expiry
  },
}, {
  timestamps: true,
});

// Check if coupon is valid
couponSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.maxUses && this.currentUses >= this.maxUses) return false;
  if (this.expiresAt && new Date() > this.expiresAt) return false;
  return true;
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
