import { useEffect } from 'react';
import { Trophy, TrendingUp, Briefcase, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { useAssessment } from '../../context/AssessmentContext';

export default function ResultsScreen() {
  const { results, calculateResults, goNext, goPrev } = useAssessment();

  useEffect(() => {
    if (!results) calculateResults();
  }, [results, calculateResults]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري تحليل نتائجك...</p>
        </div>
      </div>
    );
  }

  const topThree = results.results.slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-gradient-to-br from-navy-500 to-navy-700 rounded-3xl p-8 text-white text-center">
        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
          <Trophy className="h-8 w-8 text-yellow-300" />
        </div>
        <h2 className="text-3xl font-bold mb-2">نتائج تقييمك المهني</h2>
        <p className="text-gray-300 mb-4">
          بناءً على إجاباتك، هذا ملفك المهني وفق نموذج هولاند
        </p>
        <div className="inline-block bg-white/20 rounded-full px-6 py-2">
          <span className="font-bold text-2xl tracking-widest">
            {results.topThreeCode}
          </span>
        </div>
      </div>

      {/* RIASEC scores */}
      <div className="bg-white rounded-3xl shadow-card p-8">
        <h3 className="text-xl font-bold text-navy-500 mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          درجاتك في الأنماط الستة
        </h3>
        <div className="space-y-4">
          {results.results.map((r, i) => (
            <div key={r.code}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-navy-500">
                  {r.name} ({r.nameEn})
                </span>
                <span className="text-sm text-gray-500">{r.percentage}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    i < 3
                      ? 'bg-gradient-to-l from-green-400 to-green-600'
                      : 'bg-gray-300'
                  }`}
                  style={{ width: `${r.percentage}%` }}
                />
              </div>
              {i < 3 && (
                <p className="text-xs text-gray-500 mt-1">{r.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Career matches */}
      <div className="bg-white rounded-3xl shadow-card p-8">
        <h3 className="text-xl font-bold text-navy-500 mb-6 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-green-500" />
          التخصصات المناسبة لك
        </h3>
        <div className="space-y-4">
          {results.careers.map((career, i) => (
            <div
              key={career.name}
              className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-green-200 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center font-bold text-green-500">
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold text-navy-500">{career.name}</p>
                  <p className="text-sm text-gray-500">
                    الراتب: {career.salary} ريال | الطلب: {career.demand}
                  </p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold text-green-500">
                  {career.match}%
                </span>
                <p className="text-xs text-gray-400">توافق</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={goNext} className="flex-1" size="lg">
          عرض التقرير الكامل
        </Button>
        <Button variant="ghost" onClick={goPrev}>
          رجوع
        </Button>
      </div>
    </div>
  );
}
