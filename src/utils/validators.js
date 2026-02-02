/**
 * Validate email address
 * @param {string} email
 * @returns {string|null} error message or null if valid
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'البريد الإلكتروني مطلوب';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'البريد الإلكتروني غير صحيح';
  }
  return null;
}

/**
 * Validate Saudi phone number (05xxxxxxxx)
 * @param {string} phone
 * @returns {string|null} error message or null if valid
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return 'رقم الجوال مطلوب';
  }
  const digits = phone.replace(/\D/g, '');
  if (!/^05\d{8}$/.test(digits)) {
    return 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام';
  }
  return null;
}

/**
 * Validate password (minimum 6 characters)
 * @param {string} password
 * @returns {string|null} error message or null if valid
 */
export function validatePassword(password) {
  if (!password) {
    return 'كلمة المرور مطلوبة';
  }
  if (password.length < 6) {
    return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
  }
  return null;
}

/**
 * Validate required field is non-empty
 * @param {string} value
 * @param {string} fieldName - Arabic field name for error message
 * @returns {string|null} error message or null if valid
 */
export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} مطلوب`;
  }
  return null;
}
