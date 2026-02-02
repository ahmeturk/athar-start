import * as LucideIcons from 'lucide-react';
import { features } from '../../data/landingData';

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-navy-500">ليش تختار </span>
            <span className="text-green-500">أثر البداية؟</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            برنامج متكامل مبني على أسس علمية عالمية يساعدك تكتشف نفسك وتخطط لمستقبلك
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = LucideIcons[feature.icon] || LucideIcons.Star;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 group animate-fadeInUp"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-navy-50 to-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-navy-500 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
