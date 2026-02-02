import { GripVertical, Edit2, ToggleRight, ToggleLeft } from 'lucide-react';
import { useState } from 'react';

const initialSteps = [
  { id: 1, name: 'صفحة الترحيب', type: 'entry', enabled: true },
  { id: 2, name: 'معلومات الطالب', type: 'form', enabled: true },
  { id: 3, name: 'التقييم القبلي', type: 'survey', enabled: true },
  { id: 4, name: 'فيديو توجيهي 1', type: 'video', enabled: true },
  { id: 5, name: 'فيديو توجيهي 2', type: 'video', enabled: true },
  { id: 6, name: 'فيديو توجيهي 3', type: 'video', enabled: true },
  { id: 7, name: 'فيديو توجيهي 4', type: 'video', enabled: true },
  { id: 8, name: 'التقييم المهني (40 سؤال)', type: 'assessment', enabled: true },
  { id: 9, name: 'فيديو قرار 1', type: 'video', enabled: true },
  { id: 10, name: 'فيديو قرار 2', type: 'video', enabled: true },
  { id: 11, name: 'فيديو قرار 3', type: 'video', enabled: true },
  { id: 12, name: 'فيديو قرار 4', type: 'video', enabled: true },
  { id: 13, name: 'التقييم البعدي', type: 'survey', enabled: true },
  { id: 14, name: 'المستشار الذكي', type: 'chat', enabled: true },
  { id: 15, name: 'النتائج', type: 'results', enabled: true },
  { id: 16, name: 'التقرير', type: 'report', enabled: true },
  { id: 17, name: 'الشهادة', type: 'certificate', enabled: true },
  { id: 18, name: 'صفحة الإتمام', type: 'completion', enabled: true },
];

const typeLabels = {
  entry: 'ترحيب',
  form: 'نموذج',
  survey: 'استبيان',
  video: 'فيديو',
  assessment: 'تقييم',
  chat: 'محادثة',
  results: 'نتائج',
  report: 'تقرير',
  certificate: 'شهادة',
  completion: 'إتمام',
};

const typeColors = {
  entry: 'bg-blue-100 text-blue-700',
  form: 'bg-purple-100 text-purple-700',
  survey: 'bg-yellow-100 text-yellow-700',
  video: 'bg-green-100 text-green-700',
  assessment: 'bg-navy-100 text-navy-600',
  chat: 'bg-pink-100 text-pink-700',
  results: 'bg-orange-100 text-orange-700',
  report: 'bg-teal-100 text-teal-700',
  certificate: 'bg-amber-100 text-amber-700',
  completion: 'bg-emerald-100 text-emerald-700',
};

export default function StepsPage() {
  const [steps, setSteps] = useState(initialSteps);

  const toggleStep = (id) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-500">خطوات البرنامج</h2>
        <p className="text-sm text-gray-500">{steps.filter((s) => s.enabled).length} خطوة مفعلة</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={`flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 transition-colors ${
              step.enabled ? 'hover:bg-gray-50' : 'bg-gray-50/50 opacity-60'
            }`}
          >
            <GripVertical className="h-5 w-5 text-gray-300 cursor-grab" />
            <span className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center text-sm font-bold text-navy-500">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="font-medium text-navy-500">{step.name}</p>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${typeColors[step.type]}`}>
              {typeLabels[step.type]}
            </span>
            <button
              onClick={() => toggleStep(step.id)}
              className="text-gray-400 hover:text-navy-500 transition-colors"
            >
              {step.enabled ? (
                <ToggleRight className="h-6 w-6 text-green-500" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-gray-300" />
              )}
            </button>
            <button className="p-2 text-gray-400 hover:text-navy-500 hover:bg-gray-100 rounded-lg transition-colors">
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
