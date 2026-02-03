import { useState } from 'react';
import { Video, Plus, Edit2, Trash2, Eye, X } from 'lucide-react';

const defaultVideos = [
  { id: 1, title: 'مقدمة: رحلة اكتشاف الذات', type: 'توجيهي', duration: '8:00', views: 8420, status: 'منشور', url: '' },
  { id: 2, title: 'فهم الميول المهنية', type: 'توجيهي', duration: '12:00', views: 7380, status: 'منشور', url: '' },
  { id: 3, title: 'استكشاف عالم التخصصات', type: 'توجيهي', duration: '10:00', views: 6920, status: 'منشور', url: '' },
  { id: 4, title: 'مهارات القرن الحادي والعشرين', type: 'توجيهي', duration: '9:00', views: 6100, status: 'منشور', url: '' },
  { id: 5, title: 'كيف تتخذ قرارك المهني', type: 'قرار', duration: '11:00', views: 5800, status: 'منشور', url: '' },
  { id: 6, title: 'التخطيط الأكاديمي', type: 'قرار', duration: '10:00', views: 5200, status: 'مسودة', url: '' },
  { id: 7, title: 'تجارب ناجحة', type: 'قرار', duration: '8:00', views: 4900, status: 'منشور', url: '' },
  { id: 8, title: 'خطتك للمستقبل', type: 'قرار', duration: '9:00', views: 4500, status: 'منشور', url: '' },
];

const emptyVideo = { title: '', type: 'توجيهي', duration: '', status: 'مسودة', url: '' };

export default function ContentPage() {
  const [filter, setFilter] = useState('');
  const [videos, setVideos] = useState(defaultVideos);
  const [modal, setModal] = useState(null); // null | { mode: 'add' | 'edit', video }
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = videos.filter((v) => !filter || v.type === filter);

  const openAdd = () => setModal({ mode: 'add', video: { ...emptyVideo } });
  const openEdit = (video) => setModal({ mode: 'edit', video: { ...video } });

  const handleModalChange = (key, value) => {
    setModal((prev) => ({ ...prev, video: { ...prev.video, [key]: value } }));
  };

  const handleSave = () => {
    if (!modal.video.title.trim()) return;
    if (modal.mode === 'add') {
      const newId = Math.max(...videos.map((v) => v.id), 0) + 1;
      setVideos((prev) => [...prev, { ...modal.video, id: newId, views: 0 }]);
    } else {
      setVideos((prev) => prev.map((v) => (v.id === modal.video.id ? modal.video : v)));
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-500">إدارة المحتوى</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          إضافة فيديو
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['', 'توجيهي', 'قرار'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-navy-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-card'
            }`}
          >
            {f || 'الكل'}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((video) => (
          <div key={video.id} className="bg-white rounded-2xl shadow-card overflow-hidden group">
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-navy-500 to-green-600 flex items-center justify-center relative">
              <Video className="h-12 w-12 text-white/40" />
              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                {video.duration}
              </span>
              <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${
                video.status === 'منشور' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              }`}>
                {video.status}
              </span>
            </div>

            {/* Info */}
            <div className="p-4">
              <h4 className="font-bold text-navy-500 mb-1">{video.title}</h4>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{video.type}</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {video.views.toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEdit(video)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-navy-500 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" /> تعديل
                </button>
                <button
                  onClick={() => setDeleteConfirm(video.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-red-500 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-modalIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy-500">
                {modal.mode === 'add' ? 'إضافة فيديو جديد' : 'تعديل الفيديو'}
              </h3>
              <button onClick={() => setModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">عنوان الفيديو</label>
                <input
                  value={modal.video.title}
                  onChange={(e) => handleModalChange('title', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input"
                  placeholder="أدخل عنوان الفيديو"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-500 mb-1.5">النوع</label>
                  <select
                    value={modal.video.type}
                    onChange={(e) => handleModalChange('type', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input bg-white"
                  >
                    <option value="توجيهي">توجيهي</option>
                    <option value="قرار">قرار</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-500 mb-1.5">المدة</label>
                  <input
                    value={modal.video.duration}
                    onChange={(e) => handleModalChange('duration', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input"
                    placeholder="10:00"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">رابط الفيديو</label>
                <input
                  value={modal.video.url || ''}
                  onChange={(e) => handleModalChange('url', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input"
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">الحالة</label>
                <select
                  value={modal.video.status}
                  onChange={(e) => handleModalChange('status', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input bg-white"
                >
                  <option value="منشور">منشور</option>
                  <option value="مسودة">مسودة</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={!modal.video.title.trim()}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
              >
                {modal.mode === 'add' ? 'إضافة' : 'حفظ التعديلات'}
              </button>
              <button
                onClick={() => setModal(null)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-modalIn" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-navy-500 mb-2">حذف الفيديو</h3>
            <p className="text-gray-500 mb-6">هل أنت متأكد من حذف هذا الفيديو؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                حذف
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
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
