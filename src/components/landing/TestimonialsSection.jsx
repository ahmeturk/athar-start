import { testimonials } from '../../data/landingData';
import StarRating from '../ui/StarRating';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-navy-500">ماذا يقول </span>
            <span className="text-green-500">طلابنا؟</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            آلاف الطلاب اكتشفوا مستقبلهم المهني مع أثر البداية
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 animate-fadeInUp"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <StarRating rating={t.rating} size="sm" />
              <p className="text-gray-600 leading-relaxed my-4 text-sm">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-navy-100 to-green-100 rounded-full flex items-center justify-center">
                  <span className="text-navy-500 font-bold text-sm">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-500">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
