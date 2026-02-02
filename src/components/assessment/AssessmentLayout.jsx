import { ArrowRight } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import { useAssessment } from '../../context/AssessmentContext';

export default function AssessmentLayout({ children }) {
  const { progress, currentStep, totalSteps } = useAssessment();

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-navy-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                أ
              </div>
              <span className="font-bold text-navy-500">أثر البداية</span>
            </div>
            <span className="text-sm text-gray-500">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
