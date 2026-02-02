import { Frown, Users, AlertCircle, Lightbulb } from 'lucide-react';

const problems = [
  {
    icon: Frown,
    title: 'حيرة التخصص',
    description:
      'مش عارف تختار تخصص يناسبك؟ كثير طلاب يحسون بالضياع قدام عدد التخصصات الكبير.',
  },
  {
    icon: Users,
    title: 'ضغط المحيط',
    description:
      'أهلك وأصحابك كلٍ له رأي مختلف؟ القرار لازم يكون مبني على فهمك لنفسك أولاً.',
  },
  {
    icon: AlertCircle,
    title: 'خوف من المستقبل',
    description:
      'تخاف تختار غلط وتندم؟ مع المعلومات الصح، تقدر تاخذ قرار واثق.',
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-navy-500">هل تشعر بـ</span>
            <span className="text-green-500">الحيرة؟</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            لو أي من المشاعر هذي تمر عليك، فأنت مو لوحدك. أغلب الطلاب يحسون
            بنفس الشيء.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {problems.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <item.icon className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-navy-500 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-card border border-green-100">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-navy-500 font-medium">
              أثر البداية يساعدك تتخذ قرارك بثقة وعلم
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
