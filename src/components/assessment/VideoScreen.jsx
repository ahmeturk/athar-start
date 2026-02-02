import { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { useAssessment } from '../../context/AssessmentContext';

const videoData = {
  'orientation-1': {
    title: 'مقدمة: رحلة اكتشاف الذات',
    description: 'تعرف على أهمية الوعي المهني وكيف يؤثر على مستقبلك',
    duration: '8 دقائق',
    thumbnail: 'bg-gradient-to-br from-navy-500 to-navy-700',
  },
  'orientation-2': {
    title: 'فهم الميول المهنية',
    description: 'تعلم عن نموذج هولاند وأنواع الشخصيات المهنية الستة',
    duration: '12 دقيقة',
    thumbnail: 'bg-gradient-to-br from-green-500 to-green-700',
  },
  'orientation-3': {
    title: 'استكشاف عالم التخصصات',
    description: 'نظرة شاملة على التخصصات الجامعية وعلاقتها بسوق العمل',
    duration: '10 دقائق',
    thumbnail: 'bg-gradient-to-br from-navy-600 to-green-600',
  },
  'orientation-4': {
    title: 'مهارات القرن الحادي والعشرين',
    description: 'تعرف على المهارات المطلوبة في سوق العمل المستقبلي',
    duration: '9 دقائق',
    thumbnail: 'bg-gradient-to-br from-green-600 to-navy-600',
  },
  'decision-1': {
    title: 'كيف تتخذ قرارك المهني',
    description: 'خطوات علمية لاتخاذ قرار مهني صحيح',
    duration: '11 دقيقة',
    thumbnail: 'bg-gradient-to-br from-navy-500 to-green-500',
  },
  'decision-2': {
    title: 'التخطيط الأكاديمي',
    description: 'كيف تخطط لمسارك الأكاديمي بما يتناسب مع أهدافك',
    duration: '10 دقائق',
    thumbnail: 'bg-gradient-to-br from-green-500 to-navy-500',
  },
  'decision-3': {
    title: 'تجارب ناجحة',
    description: 'قصص نجاح لطلاب اتخذوا قرارات مهنية صائبة',
    duration: '8 دقائق',
    thumbnail: 'bg-gradient-to-br from-navy-700 to-green-500',
  },
  'decision-4': {
    title: 'خطتك للمستقبل',
    description: 'كيف تبني خطة عمل واضحة لتحقيق أهدافك المهنية',
    duration: '9 دقائق',
    thumbnail: 'bg-gradient-to-br from-green-700 to-navy-500',
  },
};

export default function VideoScreen() {
  const { currentStepId, watchedVideos, markVideoWatched, goNext, goPrev } = useAssessment();
  const video = videoData[currentStepId] || videoData['orientation-1'];
  const isWatched = watchedVideos.includes(currentStepId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  // Simulate video watching with a countdown
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      markVideoWatched(currentStepId);
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft, currentStepId, markVideoWatched]);

  useEffect(() => {
    setIsPlaying(false);
    setTimeLeft(15);
  }, [currentStepId]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-card overflow-hidden">
        {/* Video player area */}
        <div className={`relative aspect-video ${video.thumbnail} flex items-center justify-center`}>
          {isPlaying ? (
            <div className="text-center text-white">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Play className="h-10 w-10 text-white fill-white" />
              </div>
              <p className="text-lg font-bold mb-2">جاري التشغيل...</p>
              <p className="text-white/80">
                {timeLeft > 0 ? `يتبقى ${timeLeft} ثانية` : 'اكتمل!'}
              </p>
            </div>
          ) : isWatched ? (
            <div className="text-center text-white">
              <CheckCircle className="h-16 w-16 mx-auto mb-3 text-green-300" />
              <p className="text-lg font-bold">تم مشاهدة الفيديو</p>
            </div>
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              className="w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:scale-110"
            >
              <Play className="h-10 w-10 text-white fill-white mr-[-4px]" />
            </button>
          )}
        </div>

        {/* Video info */}
        <div className="p-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">{video.duration}</span>
            {isWatched && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-sm px-3 py-0.5 rounded-full mr-auto">
                <CheckCircle className="h-3.5 w-3.5" /> تم المشاهدة
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-navy-500 mb-3">{video.title}</h2>
          <p className="text-gray-600 leading-relaxed mb-8">{video.description}</p>

          <div className="flex gap-4">
            <Button
              onClick={goNext}
              disabled={!isWatched}
              className="flex-1"
            >
              {isWatched ? 'التالي' : 'شاهد الفيديو أولاً'}
            </Button>
            <Button variant="ghost" onClick={goPrev}>
              رجوع
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
