import { useCallback, useMemo } from 'react';
import { Award, Download, Share2 } from 'lucide-react';
import Button from '../ui/Button';
import { useAssessment } from '../../context/AssessmentContext';

export default function CertificateScreen() {
  const { studentInfo, results, goNext, goPrev } = useAssessment();

  const certificateId = useMemo(
    () => `ATH-${Date.now().toString(36).toUpperCase()}`,
    []
  );

  const handleDownload = useCallback(() => {
    window.print();
  }, []);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'شهادة أثر البداية',
      text: `${studentInfo.name || 'الطالب'} أتم برنامج أثر البداية بنجاح! رمز هولاند: ${results?.topThreeCode || '---'}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `شهادة إتمام برنامج أثر البداية\nالاسم: ${studentInfo.name || 'الطالب'}\nرمز هولاند: ${results?.topThreeCode || '---'}\nرقم الشهادة: ${certificateId}`
        );
        alert('تم نسخ بيانات الشهادة');
      } catch {
        // Clipboard not available
      }
    }
  }, [studentInfo, results, certificateId]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-card p-8 text-center print:shadow-none">
        <div className="w-16 h-16 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-6 print:hidden">
          <Award className="h-8 w-8 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-navy-500 mb-2 print:hidden">شهادة إتمام البرنامج</h2>
        <p className="text-gray-500 mb-8 print:hidden">مبروك! أنت أكملت برنامج أثر البداية بنجاح</p>

        {/* Certificate mockup */}
        <div className="border-4 border-navy-200 rounded-2xl p-8 mb-8 bg-gradient-to-br from-navy-50/50 to-green-50/50">
          <div className="border-2 border-navy-100 rounded-xl p-6">
            {/* Top decorative */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-l from-navy-200 to-transparent" />
              <div className="w-12 h-12 bg-gradient-to-br from-navy-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold">
                أ
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-navy-200 to-transparent" />
            </div>

            <p className="text-sm text-gray-500 mb-2">شهادة إتمام</p>
            <h3 className="text-2xl font-bold text-navy-500 mb-1">برنامج أثر البداية</h3>
            <p className="text-sm text-gray-500 mb-6">للإرشاد واكتشاف الذات المهني</p>

            <p className="text-gray-500 mb-2">يشهد بأن</p>
            <p className="text-3xl font-bold text-navy-500 mb-6">
              {studentInfo.name || 'الطالب'}
            </p>

            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              قد أتم بنجاح جميع متطلبات برنامج أثر البداية للإرشاد المهني
              واكتشاف الذات، وحصل على رمز هولاند:
            </p>

            <div className="inline-block bg-navy-500 text-white rounded-xl px-8 py-3 font-bold text-2xl tracking-widest mb-6">
              {results?.topThreeCode || '---'}
            </div>

            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <div>
                <p className="font-medium text-navy-500">التاريخ</p>
                <p>{new Date().toLocaleDateString('ar-SA')}</p>
              </div>
              <div>
                <p className="font-medium text-navy-500">رقم الشهادة</p>
                <p dir="ltr">{certificateId}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8 print:hidden">
          <button onClick={handleDownload} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-500 transition-colors px-4 py-2 rounded-xl hover:bg-gray-50">
            <Download className="h-4 w-4" /> تحميل الشهادة
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-500 transition-colors px-4 py-2 rounded-xl hover:bg-gray-50">
            <Share2 className="h-4 w-4" /> مشاركة
          </button>
        </div>

        <div className="flex gap-4 print:hidden">
          <Button onClick={goNext} className="flex-1" size="lg">
            إنهاء البرنامج
          </Button>
          <Button variant="ghost" onClick={goPrev}>
            رجوع
          </Button>
        </div>
      </div>
    </div>
  );
}
