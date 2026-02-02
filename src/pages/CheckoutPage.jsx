import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Check,
  Tag,
  CreditCard,
  Smartphone,
  ArrowRight,
  Lock,
  Zap,
  X,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { PRICING } from '../config/constants';
import { useApp } from '../context/AppContext';

const packageFeatures = [
  'تقييم مهني (40 سؤال) - نموذج هولاند',
  'تقرير تفصيلي للشخصية المهنية',
  '8 فيديوهات توجيهية تفاعلية',
  'مساعد ذكي للإجابة على أسئلتك',
  'قياس أثر قبل وبعد البرنامج',
  'شهادة إتمام معتمدة',
];

const paymentMethods = [
  { id: 'visa', label: 'فيزا / ماستركارد', icon: CreditCard, desc: 'بطاقة ائتمان أو خصم مباشر' },
  { id: 'mada', label: 'مدى', icon: CreditCard, desc: 'بطاقة مدى المحلية' },
  { id: 'apple', label: 'Apple Pay', icon: Smartphone, desc: 'الدفع عبر أبل باي' },
  { id: 'stc', label: 'STC Pay', icon: Smartphone, desc: 'الدفع عبر STC Pay' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('visa');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null); // { code, discount }
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Price calculation
  const basePrice = PRICING.discounted;
  const couponDiscount = couponApplied ? Math.round(basePrice * (couponApplied.discount / 100)) : 0;
  const vat = Math.round((basePrice - couponDiscount) * 0.15);
  const total = basePrice - couponDiscount + vat;

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) {
      setCouponError('أدخل كود الخصم');
      return;
    }
    // Simulate coupon validation
    const validCoupons = {
      ATHAR10: { code: 'ATHAR10', discount: 10 },
      WELCOME20: { code: 'WELCOME20', discount: 20 },
      UNIEX: { code: 'UNIEX', discount: 15 },
    };
    const coupon = validCoupons[couponCode.toUpperCase()];
    if (coupon) {
      setCouponApplied(coupon);
      setCouponError('');
    } else {
      setCouponError('كود الخصم غير صالح');
      setCouponApplied(null);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleCheckout = async () => {
    if (!agreedToTerms) return;
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));
    setIsProcessing(false);
    navigate('/assessment');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-navy-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold">
              أ
            </div>
            <span className="font-bold text-navy-500 text-lg">أثر البداية</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="h-4 w-4 text-green-500" />
            <span>دفع آمن ومشفر</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              <Check className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-green-600">إنشاء الحساب</span>
          </div>
          <div className="w-12 h-0.5 bg-green-300" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <span className="text-sm font-medium text-navy-500">الدفع</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-sm font-bold">
              3
            </div>
            <span className="text-sm text-gray-400">ابدأ البرنامج</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Payment form (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Payment method */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-bold text-navy-500 mb-6">طريقة الدفع</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-right ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${isSelected ? 'text-green-700' : 'text-navy-500'}`}>
                          {method.label}
                        </p>
                        <p className="text-xs text-gray-500">{method.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Card form (shown for visa/mada) */}
              {(selectedMethod === 'visa' || selectedMethod === 'mada') && (
                <div className="mt-6 space-y-4 pt-6 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-navy-500 mb-1.5">رقم البطاقة</label>
                    <input
                      placeholder="0000 0000 0000 0000"
                      dir="ltr"
                      className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-navy-500 placeholder-gray-400 form-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-500 mb-1.5">تاريخ الانتهاء</label>
                      <input
                        placeholder="MM / YY"
                        dir="ltr"
                        className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-navy-500 placeholder-gray-400 form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-500 mb-1.5">CVV</label>
                      <input
                        placeholder="123"
                        dir="ltr"
                        type="password"
                        maxLength={4}
                        className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-navy-500 placeholder-gray-400 form-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-500 mb-1.5">الاسم على البطاقة</label>
                    <input
                      placeholder="AHMED MOHAMMED"
                      dir="ltr"
                      className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-navy-500 placeholder-gray-400 form-input"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'apple' && (
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-500 text-sm mb-4">
                    سيتم توجيهك لإتمام الدفع عبر Apple Pay
                  </p>
                  <div className="w-16 h-16 mx-auto bg-black rounded-2xl flex items-center justify-center text-white text-2xl mb-2">

                  </div>
                </div>
              )}

              {selectedMethod === 'stc' && (
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-500 text-sm mb-4">
                    أدخل رقم جوالك المسجل في STC Pay
                  </p>
                  <input
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    className="w-full max-w-xs mx-auto border-2 border-gray-200 rounded-xl py-3 px-4 text-navy-500 placeholder-gray-400 form-input text-center"
                  />
                </div>
              )}
            </div>

            {/* Coupon code */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-green-500" />
                كود خصم
              </h3>
              {couponApplied ? (
                <div className="flex items-center justify-between bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-bold text-green-700">{couponApplied.code}</p>
                      <p className="text-sm text-green-600">خصم {couponApplied.discount}% مطبّق</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-2 text-green-500 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-3">
                    <input
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="أدخل كود الخصم"
                      dir="ltr"
                      className="flex-1 border-2 border-gray-200 rounded-xl py-3 px-4 text-navy-500 placeholder-gray-400 form-input uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-6 bg-navy-500 text-white rounded-xl font-medium hover:bg-navy-600 transition-colors"
                    >
                      تطبيق
                    </button>
                  </div>
                  {couponError && (
                    <p className="mt-2 text-sm text-red-500">{couponError}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    جرّب: ATHAR10, WELCOME20, UNIEX
                  </p>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`w-5 h-5 mt-0.5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                    agreedToTerms
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                  role="checkbox"
                  aria-checked={agreedToTerms}
                >
                  {agreedToTerms && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-600 leading-relaxed">
                  أوافق على{' '}
                  <button className="text-green-500 hover:underline font-medium">الشروط والأحكام</button>
                  {' '}و{' '}
                  <button className="text-green-500 hover:underline font-medium">سياسة الخصوصية</button>
                  . أفهم أنه يمكنني استرداد المبلغ كاملاً خلال 7 أيام.
                </span>
              </label>
            </div>

            {/* Pay button */}
            <button
              onClick={handleCheckout}
              disabled={!agreedToTerms || isProcessing}
              className="w-full py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-button"
            >
              {isProcessing ? (
                <>
                  <Spinner size="sm" className="border-white border-t-transparent" />
                  <span>جاري معالجة الدفع...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>ادفع {total} {PRICING.currency}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> دفع آمن SSL</span>
              <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> بيانات مشفرة</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> ضمان استرداد 7 أيام</span>
            </div>
          </div>

          {/* Right: Order summary (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-navy-500 mb-6">ملخص الطلب</h2>

              {/* Package card */}
              <div className="bg-gradient-to-br from-navy-50 to-green-50 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-navy-500 to-green-500 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-500">باقة أثر البداية الكاملة</h3>
                    <p className="text-xs text-gray-500">وصول كامل لجميع المحتوى</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {packageFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">السعر الأصلي</span>
                  <span className="text-gray-400 line-through">{PRICING.original} {PRICING.currency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">السعر بعد الخصم ({PRICING.discount}%)</span>
                  <span className="text-navy-500 font-medium">{basePrice} {PRICING.currency}</span>
                </div>
                {couponApplied && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">كوبون ({couponApplied.code})</span>
                    <span className="text-green-600 font-medium">-{couponDiscount} {PRICING.currency}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">ضريبة القيمة المضافة (15%)</span>
                  <span className="text-navy-500 font-medium">{vat} {PRICING.currency}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="font-bold text-navy-500 text-lg">المجموع</span>
                  <span className="font-bold text-green-500 text-2xl">{total} {PRICING.currency}</span>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-green-700">ضمان استرداد كامل</p>
                <p className="text-xs text-green-600 mt-1">
                  إذا لم تكن راضياً، استرد مبلغك كاملاً خلال 7 أيام بدون أي أسئلة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
