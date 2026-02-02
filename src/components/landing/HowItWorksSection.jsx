import * as LucideIcons from 'lucide-react';
import { processSteps } from '../../data/landingData';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-navy-500">كيف يعمل </span>
            <span className="text-green-500">البرنامج؟</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            أربع خطوات بسيطة تبدأ بها رحلتك نحو اكتشاف مستقبلك المهني
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, i) => {
            const Icon = LucideIcons[step.icon] || LucideIcons.Star;
            return (
              <div
                key={step.num}
                className="relative text-center animate-fadeInUp"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Connector line */}
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -left-4 w-8 h-0.5 bg-green-200" />
                )}

                <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                  {/* Step number */}
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-navy-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-6">
                    {step.num}
                  </div>

                  <div className="w-14 h-14 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-green-500" />
                  </div>

                  <h3 className="text-lg font-bold text-navy-500 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
