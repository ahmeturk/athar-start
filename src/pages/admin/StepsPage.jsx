import { GripVertical, Edit2, ToggleRight, ToggleLeft, X, Save } from 'lucide-react';
import { useState } from 'react';

const initialSteps = [
  { id: 1, name: 'صفحة الترحيب', type: 'entry', enabled: true, description: 'شاشة الترحيب والبدء' },
  { id: 2, name: 'معلومات الطالب', type: 'form', enabled: true, description: 'جمع بيانات الطالب الأساسية' },
  { id: 3, name: 'التقييم القبلي', type: 'survey', enabled: true, description: '10 أسئلة قبل البرنامج' },
  { id: 4, name: 'فيديو توجيهي 1', type: 'video', enabled: true, description: 'رحلة اكتشاف الذات' },
  { id: 5, name: 'فيديو توجيهي 2', type: 'video', enabled: true, description: 'فهم الميول المهنية' },
  { id: 6, name: 'فيديو توجيهي 3', type: 'video', enabled: true, description: 'استكشاف التخصصات' },
  { id: 7, name: 'فيديو توجيهي 4', type: 'video', enabled: true, description: 'مهارات القرن 21' },
  { id: 8, name: 'التقييم المهني (40 سؤال)', type: 'assessment', enabled: true, description: 'اختبار RIASEC المهني' },
  { id: 9, name: 'فيديو قرار 1', type: 'video', enabled: true, description: 'كيف تتخذ قرارك' },
  { id: 10, name: 'فيديو قرار 2', type: 'video', enabled: true, description: 'التخطيط الأكاديمي' },
  { id: 11, name: 'فيديو قرار 3', type: 'video', enabled: true, description: 'تجارب ناجحة' },
  { id: 12, name: 'فيديو قرار 4', type: 'video', enabled: true, description: 'خطتك للمستقبل' },
  { id: 13, name: 'التقييم البعدي', type: 'survey', enabled: true, description: '10 أسئلة بعد البرنامج' },
  { id: 14, name: 'المستشار الذكي', type: 'chat', enabled: true, description: 'محادثة مع المستشار الذكي' },
  { id: 15, name: 'النتائج', type: 'results', enabled: true, description: 'عرض نتائج التقييم' },
  { id: 16, name: 'التقرير', type: 'report', enabled: true, description: 'التقرير المهني التفصيلي' },
  { id: 17, name: 'الشهادة', type: 'certificate', enabled: true, description: 'شهادة إتمام البرنامج' },
  { id: 18, name: 'صفحة الإتمام', type: 'completion', enabled: true, description: 'شاشة الإتمام والتهنئة' },
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
  const [editModal, setEditModal] = useState(null);

  const toggleStep = (id) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const openEdit = (step) => {
    setEditModal({ ...step });
  };

  const handleEditChange = (key, value) => {
    setEditModal((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditSave = () => {
    if (!editModal.name.trim()) return;
    setSteps((prev) =>
      prev.map((s) => (s.id === editModal.id ? { ...editModal } : s))
    );
    setEditModal(null);
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
              {step.description && (
                <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
              )}
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
            <button
              onClick={() => openEdit(step)}
              className="p-2 text-gray-400 hover:text-navy-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-modalIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy-500">تعديل الخطوة</h3>
              <button onClick={() => setEditModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">اسم الخطوة</label>
                <input
                  value={editModal.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">الوصف</label>
                <input
                  value={editModal.description || ''}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input"
                  placeholder="وصف مختصر للخطوة"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">النوع</label>
                <select
                  value={editModal.type}
                  onChange={(e) => handleEditChange('type', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input bg-white"
                >
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditSave}
                disabled={!editModal.name.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                حفظ التعديلات
              </button>
              <button
                onClick={() => setEditModal(null)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
