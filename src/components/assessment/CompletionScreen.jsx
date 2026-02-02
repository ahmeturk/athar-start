import { PartyPopper, Home, RotateCcw, MessageCircle } from 'lucide-react';
import Button from '../ui/Button';
import { useAssessment } from '../../context/AssessmentContext';
import { useNavigate } from 'react-router-dom';

export default function CompletionScreen() {
  const { completeAssessment, resetAssessment, studentInfo } = useAssessment();
  const navigate = useNavigate();

  const handleGoHome = () => {
    completeAssessment();
    navigate('/');
  };

  const handleRetake = () => {
    resetAssessment();
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-3xl shadow-card p-8 md:p-12">
        <div className="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6">
          <PartyPopper className="h-10 w-10 text-green-500" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-navy-500 mb-4">
          مبروك {studentInfo.name || ''}!
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          أنت أكملت برنامج أثر البداية بنجاح! الحين عندك صورة أوضح عن
          ميولك المهنية وقدراتك. استخدم هالمعلومات عشان تاخذ قراراتك
          بثقة ووضوح.
        </p>

        <div className="bg-green-50 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-green-700 mb-3">الخطوات التالية:</h3>
          <ul className="text-right text-green-700 space-y-2 text-sm">
            <li>1. راجع تقريرك وشاركه مع أهلك ومعلميك</li>
            <li>2. ابحث أكثر عن التخصصات الموصى بها لك</li>
            <li>3. تحدث مع أشخاص يعملون في المجالات اللي تهمك</li>
            <li>4. احجز جلسة استشارية شخصية مع خبرائنا</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleGoHome} className="flex-1" size="lg">
            <Home className="h-5 w-5" />
            العودة للرئيسية
          </Button>
          <Button variant="secondary" onClick={handleRetake} className="flex-1" size="lg">
            <RotateCcw className="h-5 w-5" />
            إعادة التقييم
          </Button>
        </div>

        <button className="mt-6 text-green-500 hover:underline font-medium inline-flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          احجز جلسة استشارية
        </button>
      </div>
    </div>
  );
}
