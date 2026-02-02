/**
 * Format Saudi phone number (05xxxxxxxx)
 * @param {string} value - raw input
 * @returns {string} formatted phone like "05 xxx xxx xx"
 */
export function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
}

/**
 * Format credit card number (xxxx xxxx xxxx xxxx)
 * @param {string} value - raw input
 * @returns {string} formatted card number
 */
export function formatCardNumber(value) {
  const v = value.replace(/\D/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.slice(i, i + 4));
  }
  return parts.join(' ');
}

/**
 * Format card expiry date (MM/YY)
 * @param {string} value - raw input
 * @returns {string} formatted expiry
 */
export function formatExpiry(value) {
  const v = value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2);
  return v;
}

/**
 * Format currency amount with ريال
 * @param {number} amount - numeric amount
 * @returns {string} formatted like "199 ريال"
 */
export function formatCurrency(amount) {
  const formatted = new Intl.NumberFormat('ar-SA').format(amount);
  return `${formatted} ريال`;
}
