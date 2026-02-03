import { useRef, useCallback } from 'react';
import { FileText, Download, Share2, Printer } from 'lucide-react';
import Button from '../ui/Button';
import { useAssessment } from '../../context/AssessmentContext';

export default function ReportScreen() {
  const { results, studentInfo, goNext, goPrev } = useAssessment();
  const reportRef = useRef(null);

  if (!results) return null;

  const topThree = results.results.slice(0, 3);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadPDF = useCallback(() => {
    // Use the browser's print-to-PDF functionality
    window.print();
  }, []);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'تقرير أثر البداية',
      text: `تقرير ${studentInfo.name || 'الطالب'} المهني - رمز هولاند: ${results.topThreeCode}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed silently
      }
    } else {
      // Fallback: copy summary to clipboard
      const text = `تقرير أثر البداية المهني\nالاسم: ${studentInfo.name || 'الطالب'}\nرمز هولاند: ${results.topThreeCode}\nالأنماط: ${topThree.map(r => `${r.name} (${r.percentage}%)`).join('، ')}`;
      try {
        await navigator.clipboard.writeText(text);
        alert('تم نسخ ملخص التقرير');
      } catch {
        // Clipboard not available
      }
    }
  }, [studentInfo, results, topThree]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Report header */}
      <div ref={reportRef} className="bg-white rounded-3xl shadow-card p-8 text-center print:shadow-none">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-navy-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            أ
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-navy-500">تقرير أثر البداية</h2>
            <p className="text-sm text-gray-500">التقرير المهني التفصيلي</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">اسم الطالب</p>
          <p className="text-lg font-bold text-navy-500">{studentInfo.name || 'الطالب'}</p>
          <div className="flex justify-center gap-8 mt-4 text-sm text-gray-500">
            {studentInfo.grade && <span>{studentInfo.grade}</span>}
            {studentInfo.city && <span>{studentInfo.city}</span>}
            <span>{new Date().toLocaleDateString('ar-SA')}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 print:hidden">
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-500 transition-colors">
            <Download className="h-4 w-4" /> تحميل PDF
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-500 transition-colors">
            <Printer className="h-4 w-4" /> طباعة
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-500 transition-colors">
            <Share2 className="h-4 w-4" /> مشاركة
          </button>
        </div>
      </div>

      {/* Profile summary */}
      <div className="bg-white rounded-3xl shadow-card p-8">
        <h3 className="text-xl font-bold text-navy-500 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-500" />
          ملخص شخصيتك المهنية
        </h3>

        <div className="bg-gradient-to-br from-navy-50 to-green-50 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-2">رمز هولاند الخاص بك</p>
          <p className="text-4xl font-bold text-navy-500 tracking-widest mb-4">
            {results.topThreeCode}
          </p>
          <div className="space-y-2">
            {topThree.map((r) => (
              <div key={r.code} className="flex items-center gap-2">
                <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-green-500 text-sm shadow-sm">
                  {r.code}
                </span>
                <span className="font-medium text-navy-500">{r.name}</span>
                <span className="text-sm text-gray-500">({r.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {topThree.map((r) => (
            <div key={r.code} className="p-4 rounded-xl bg-gray-50">
              <h4 className="font-bold text-navy-500 mb-1">
                النمط {r.name} ({r.nameEn})
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Career recommendations */}
      <div className="bg-white rounded-3xl shadow-card p-8">
        <h3 className="text-xl font-bold text-navy-500 mb-6">التخصصات الموصى بها</h3>
        {results.careers.map((career, i) => (
          <div
            key={career.name}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 mb-3 last:mb-0"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-green-500">{i + 1}</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-navy-500">{career.name}</p>
              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span>التوافق: {career.match}%</span>
                <span>الراتب: {career.salary} ريال</span>
                <span>الطلب: {career.demand}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 print:hidden">
        <Button onClick={goNext} className="flex-1" size="lg">
          الحصول على الشهادة
        </Button>
        <Button variant="ghost" onClick={goPrev}>
          رجوع
        </Button>
      </div>
    </div>
  );
}
