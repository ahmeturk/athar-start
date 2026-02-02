import { Check, ArrowLeft, Play } from 'lucide-react';
import Button from '../ui/Button';

export default function HeroSection({ onSignup, onScrollTo }) {
  return (
    <section className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/20 py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="animate-fadeInUp">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-700 font-medium">
                أكثر من 12,000 طالب استفاد
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-navy-500">اكتشف </span>
              <span className="text-green-500">مستقبلك</span>
              <br />
              <span className="text-navy-500">المهني بثقة</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              برنامج متكامل يساعدك تكتشف ميولك المهنية وتخطط لمستقبلك
              الأكاديمي والمهني بخطوات علمية ومدروسة.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Button
                onClick={onSignup}
                size="lg"
                className="animate-pulse-glow"
              >
                ابدأ رحلتك الآن
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onScrollTo?.('how-it-works')}
                icon={<Play className="h-5 w-5 fill-current" />}
              >
                شاهد كيف يعمل
              </Button>
            </div>

            {/* Guarantees */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                ضمان استرداد 7 أيام
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                دعم فني متواصل
              </span>
            </div>
          </div>

          {/* Report mockup */}
          <div className="relative flex justify-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {/* Main card */}
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-card-hover p-6 animate-float">
              {/* Card header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-navy-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  أ
                </div>
                <div>
                  <h3 className="font-bold text-navy-500 text-sm">
                    تقرير أثر البداية
                  </h3>
                  <p className="text-xs text-gray-400">نتائج تقييم هولاند</p>
                </div>
              </div>

              {/* Mock chart bars */}
              <div className="space-y-3 mb-6">
                {[
                  { label: 'واقعي', width: '75%', color: 'bg-navy-500' },
                  { label: 'بحثي', width: '90%', color: 'bg-green-500' },
                  { label: 'فني', width: '60%', color: 'bg-navy-400' },
                  { label: 'اجتماعي', width: '85%', color: 'bg-green-400' },
                  { label: 'قيادي', width: '70%', color: 'bg-navy-300' },
                  { label: 'تقليدي', width: '45%', color: 'bg-green-300' },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{bar.label}</span>
                      <span className="text-gray-400">{bar.width.replace('%', '')}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bar.color}`}
                        style={{ width: bar.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mock result */}
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">التوصية المهنية الأولى</p>
                <p className="text-sm font-bold text-navy-500">الهندسة المعمارية</p>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute top-4 -left-4 bg-white rounded-xl shadow-card-hover px-4 py-2 animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-500">دقة التقييم</p>
                  <p className="text-xs text-green-500 font-bold">98%</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 -right-4 bg-white rounded-xl shadow-card-hover px-4 py-2 animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center">
                  <span className="text-navy-600 font-bold text-xs">70+</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-500">معتمد عالمياً</p>
                  <p className="text-xs text-gray-400">دولة حول العالم</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
