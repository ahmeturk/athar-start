import { useState, useEffect } from 'react';
import { GripVertical, Edit2, ToggleRight, ToggleLeft, Save, X, Loader2, RefreshCw, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { adminAPI } from '../../api/admin';

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
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editStep, setEditStep] = useState(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAPI.getSteps();
      setSteps(data.steps || []);
      setHasChanges(false);
    } catch (err) {
      setError('فشل في تحميل الخطوات');
    }
    setLoading(false);
  };

  const toggleStep = async (stepId) => {
    try {
      await adminAPI.toggleStep(stepId);
      setSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, enabled: !s.enabled } : s))
      );
    } catch (err) {
      setError('فشل في تحديث الخطوة');
    }
  };

  const moveStep = (index, direction) => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;

    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    // Update order numbers
    newSteps.forEach((s, i) => { s.order = i + 1; });
    setSteps(newSteps);
    setHasChanges(true);
  };

  const openEdit = (step) => {
    setEditStep(step);
    setEditName(step.name);
  };

  const saveStepName = async () => {
    if (!editName.trim()) return;
    try {
      await adminAPI.updateStep(editStep.id, { name: editName });
      setSteps((prev) =>
        prev.map((s) => (s.id === editStep.id ? { ...s, name: editName } : s))
      );
      setEditStep(null);
    } catch (err) {
      setError('فشل في تحديث الاسم');
    }
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      await adminAPI.updateSteps(steps);
      setHasChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('فشل في حفظ الترتيب');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error && steps.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchSteps} className="flex items-center gap-2 mx-auto bg-navy-500 text-white px-6 py-2 rounded-xl hover:bg-navy-600 transition-colors">
          <RefreshCw className="h-4 w-4" /> إعادة المحاولة
        </button>
      </div>
    );
  }

  const enabledCount = steps.filter((s) => s.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy-500">خطوات البرنامج</h2>
          <p className="text-sm text-gray-500 mt-1">{enabledCount} خطوة مفعلة من {steps.length}</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-full">
              <CheckCircle className="h-4 w-4" /> تم الحفظ
            </span>
          )}
          <button onClick={fetchSteps} className="p-2 text-gray-400 hover:text-navy-500 hover:bg-gray-100 rounded-xl transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
          {hasChanges && (
            <button
              onClick={saveOrder}
              disabled={saving}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              حفظ الترتيب
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={`flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 transition-colors ${
              step.enabled ? 'hover:bg-gray-50' : 'bg-gray-50/50 opacity-60'
            }`}
          >
            {/* Reorder buttons */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => moveStep(i, 'up')}
                disabled={i === 0}
                className="p-0.5 text-gray-300 hover:text-navy-500 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => moveStep(i, 'down')}
                disabled={i === steps.length - 1}
                className="p-0.5 text-gray-300 hover:text-navy-500 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <span className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center text-sm font-bold text-navy-500 flex-shrink-0">
              {i + 1}
            </span>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-navy-500 truncate">{step.name}</p>
              <p className="text-xs text-gray-400">{step.id}</p>
            </div>

            <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${typeColors[step.type] || 'bg-gray-100 text-gray-600'}`}>
              {typeLabels[step.type] || step.type}
            </span>

            <button
              onClick={() => toggleStep(step.id)}
              className="text-gray-400 hover:text-navy-500 transition-colors flex-shrink-0"
            >
              {step.enabled ? (
                <ToggleRight className="h-6 w-6 text-green-500" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-gray-300" />
              )}
            </button>

            <button
              onClick={() => openEdit(step)}
              className="p-2 text-gray-400 hover:text-navy-500 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Edit Step Name Modal */}
      {editStep && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditStep(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy-500">تعديل الخطوة</h3>
              <button onClick={() => setEditStep(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">معرف الخطوة</label>
                <input
                  value={editStep.id}
                  disabled
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 bg-gray-50 text-gray-400"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">اسم الخطوة</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">النوع</label>
                <input
                  value={typeLabels[editStep.type] || editStep.type}
                  disabled
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 bg-gray-50 text-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={saveStepName}
                disabled={!editName.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> حفظ
              </button>
              <button
                onClick={() => setEditStep(null)}
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
