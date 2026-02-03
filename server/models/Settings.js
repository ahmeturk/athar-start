import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'global',
      unique: true,
    },
    siteName: {
      type: String,
      default: 'أثر البداية',
    },
    siteEmail: {
      type: String,
      default: 'info@athar-start.com',
    },
    price: {
      type: Number,
      default: 139,
    },
    originalPrice: {
      type: Number,
      default: 199,
    },
    discount: {
      type: Number,
      default: 30,
    },
    maxFreeMessages: {
      type: Number,
      default: 10,
    },
    requirePayment: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    smsNotifications: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
