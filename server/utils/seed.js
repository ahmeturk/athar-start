/**
 * Seed script - creates initial admin user and default coupons
 * Run: node utils/seed.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@athar.com' });
    if (!adminExists) {
      await User.create({
        name: 'مدير النظام',
        email: 'admin@athar.com',
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
      });
      console.log('✅ Admin user created: admin@athar.com / admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Create default coupons
    const defaultCoupons = [
      { code: 'ATHAR10', discount: 10, maxUses: 100 },
      { code: 'WELCOME20', discount: 20, maxUses: 50 },
      { code: 'UNIEX', discount: 15, maxUses: null },
    ];

    for (const couponData of defaultCoupons) {
      const exists = await Coupon.findOne({ code: couponData.code });
      if (!exists) {
        await Coupon.create(couponData);
        console.log(`✅ Coupon created: ${couponData.code} (${couponData.discount}% off)`);
      } else {
        console.log(`ℹ️ Coupon ${couponData.code} already exists`);
      }
    }

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
