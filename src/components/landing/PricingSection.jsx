import { Check, Zap } from 'lucide-react';
import Button from '../ui/Button';
import { PRICING } from '../../config/constants';

const included = [
  'تقييم مهني (40 سؤال) - نموذج هولاند',
  'تقرير تفصيلي للشخصية المهنية',
  '8 فيديوهات توجيهية تفاعلية',
  'مساعد ذكي للإجابة على أسئلتك',
  'قياس أثر قبل وبعد البرنامج',
  'شهادة إتمام معتمدة',
];

export default function PricingSection({ onSignup }) {
  return (
    <section id="pricing" className="bg-gray-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-navy-500">استثمر في </span>
            <span className="text-green-500">مستقبلك</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            برنامج شامل بسعر في متناول الجميع مع ضمان استرداد كامل
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-card-hover p-8 relative overflow-hidden">
            {/* Discount badge */}
            <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
              خصم {PRICING.discount}%
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-navy-500 to-green-500 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-navy-500 mb-2">
                باقة أثر البداية الكاملة
              </h3>
              <div className="flex items-center justify-center gap-3">
                <span className="text-gray-400 line-through text-lg">
                  {PRICING.original} {PRICING.currency}
                </span>
                <span className="text-4xl font-bold text-green-500">
                  {PRICING.discounted}
                </span>
                <span className="text-gray-500">{PRICING.currency}</span>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-4 mb-8">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button onClick={onSignup} className="w-full" size="lg">
              ابدأ الآن
            </Button>

            {/* Guarantee */}
            <p className="text-center text-sm text-gray-500 mt-4">
              ضمان استرداد كامل خلال 7 أيام
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
