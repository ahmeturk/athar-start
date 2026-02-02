import { Sparkles, Clock, Shield, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import { useAssessment } from '../../context/AssessmentContext';

const benefits = [
  { icon: Sparkles, text: 'تقييم مهني مبني على نموذج هولاند العالمي' },
  { icon: Clock, text: 'يستغرق حوالي 2-3 ساعات لإكماله' },
  { icon: Shield, text: 'نتائجك سرية وخاصة بك' },
  { icon: CheckCircle, text: 'تحصل على تقرير وشهادة بعد الإكمال' },
];

export default function EntryScreen() {
  const { goNext } = useAssessment();

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-3xl shadow-card p-8 md:p-12">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-navy-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg">
          أ
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-navy-500 mb-4">
          مرحباً بك في أثر البداية
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          رحلة اكتشاف ذاتك المهنية تبدأ هنا! سنساعدك تفهم ميولك وقدراتك
          وتخطط لمستقبلك بثقة.
        </p>

        <div className="space-y-4 mb-10 text-right">
          {benefits.map((b) => (
            <div key={b.text} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <b.icon className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-gray-700">{b.text}</span>
            </div>
          ))}
        </div>

        <Button onClick={goNext} size="lg" className="w-full sm:w-auto">
          ابدأ الآن
        </Button>
      </div>
    </div>
  );
}
