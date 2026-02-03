import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
    minlength: [2, 'الاسم يجب أن يكون حرفين على الأقل'],
    maxlength: [100, 'الاسم طويل جداً'],
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'البريد الإلكتروني غير صالح'],
  },
  password: {
    type: String,
    minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
    select: false, // Don't include password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    match: [/^05\d{8}$/, 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام'],
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  avatar: {
    type: String,
    default: null,
  },
  // Google OAuth
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  // Student-specific fields
  grade: {
    type: String,
    enum: ['first-secondary', 'second-secondary', 'third-secondary', 'university', 'graduate', ''],
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  school: {
    type: String,
    default: '',
  },
  // Account status
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  hasPaid: {
    type: Boolean,
    default: false,
  },
  // Timestamps
  lastLoginAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    avatar: this.avatar,
    grade: this.grade,
    city: this.city,
    school: this.school,
    hasPaid: this.hasPaid,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);
export default User;
