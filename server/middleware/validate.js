import Joi from 'joi';

// Generic validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صالحة',
        errors,
      });
    }

    req.validatedBody = value;
    next();
  };
};

// === Auth Schemas ===

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'الاسم يجب أن يكون حرفين على الأقل',
    'string.max': 'الاسم طويل جداً',
    'any.required': 'الاسم مطلوب',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'البريد الإلكتروني غير صالح',
    'any.required': 'البريد الإلكتروني مطلوب',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    'any.required': 'كلمة المرور مطلوبة',
  }),
  phone: Joi.string().pattern(/^05\d{8}$/).allow('').messages({
    'string.pattern.base': 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'البريد الإلكتروني غير صالح',
    'any.required': 'البريد الإلكتروني مطلوب',
  }),
  password: Joi.string().required().messages({
    'any.required': 'كلمة المرور مطلوبة',
  }),
});

export const googleAuthSchema = Joi.object({
  credential: Joi.string().required().messages({
    'any.required': 'رمز Google مطلوب',
  }),
});

// === Assessment Schemas ===

export const studentInfoSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  grade: Joi.string().valid(
    'first-secondary', 'second-secondary', 'third-secondary', 'university', 'graduate'
  ).required(),
  city: Joi.string().required(),
  school: Joi.string().allow(''),
  age: Joi.number().min(12).max(40).allow(null),
});

export const assessmentAnswersSchema = Joi.object({
  answers: Joi.object().pattern(
    Joi.string(),
    Joi.number().min(1).max(5)
  ).required(),
});

export const chatMessageSchema = Joi.object({
  message: Joi.string().min(1).max(1000).required().messages({
    'string.min': 'الرسالة مطلوبة',
    'string.max': 'الرسالة طويلة جداً',
  }),
});

// === Payment Schemas ===

export const createPaymentSchema = Joi.object({
  method: Joi.string().valid('visa', 'mada', 'applepay', 'stcpay').required().messages({
    'any.only': 'طريقة الدفع غير صالحة',
    'any.required': 'طريقة الدفع مطلوبة',
  }),
  couponCode: Joi.string().allow('', null),
  // Card details (for visa/mada)
  cardNumber: Joi.when('method', {
    is: Joi.valid('visa', 'mada'),
    then: Joi.string().pattern(/^\d{16}$/).required(),
    otherwise: Joi.forbidden(),
  }),
  cardExpiry: Joi.when('method', {
    is: Joi.valid('visa', 'mada'),
    then: Joi.string().pattern(/^\d{2}\/\d{2}$/).required(),
    otherwise: Joi.forbidden(),
  }),
  cardCvc: Joi.when('method', {
    is: Joi.valid('visa', 'mada'),
    then: Joi.string().pattern(/^\d{3,4}$/).required(),
    otherwise: Joi.forbidden(),
  }),
  cardName: Joi.when('method', {
    is: Joi.valid('visa', 'mada'),
    then: Joi.string().min(2).required(),
    otherwise: Joi.forbidden(),
  }),
});

export const verifyCouponSchema = Joi.object({
  code: Joi.string().required().messages({
    'any.required': 'رمز الكوبون مطلوب',
  }),
});

// === Profile Schema ===

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().pattern(/^05\d{8}$/).allow(''),
  grade: Joi.string().valid(
    'first-secondary', 'second-secondary', 'third-secondary', 'university', 'graduate', ''
  ),
  city: Joi.string().allow(''),
  school: Joi.string().allow(''),
});
