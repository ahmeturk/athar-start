import { useState, useEffect } from 'react';
import { Video, Plus, Edit2, Trash2, Eye, X, Save, Loader2, RefreshCw, Link, Clock, ToggleRight, ToggleLeft } from 'lucide-react';
import { adminAPI } from '../../api/admin';

const emptyVideo = { title: '', description: '', youtubeUrl: '', duration: '', type: 'توجيهي' };

export default function ContentPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [editModal, setEditModal] = useState(null); // null | 'new' | video object
  const [form, setForm] = useState(emptyVideo);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAPI.getVideos();
      setVideos(data.videos || []);
    } catch (err) {
      setError('فشل في تحميل الفيديوهات');
    }
    setLoading(false);
  };

  const filtered = videos.filter((v) => !filter || v.type === filter);

  const openNew = () => {
    setForm(emptyVideo);
    setEditModal('new');
  };

  const openEdit = (video) => {
    setForm({
      title: video.title || '',
      description: video.description || '',
      youtubeUrl: video.youtubeUrl || '',
      duration: video.duration || '',
      type: video.type || 'توجيهي',
    });
    setEditModal(video);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editModal === 'new') {
        const data = await adminAPI.createVideo(form);
        setVideos(data.videos || []);
      } else {
        await adminAPI.updateVideo(editModal.videoId, form);
        setVideos((prev) =>
          prev.map((v) => (v.videoId === editModal.videoId ? { ...v, ...form } : v))
        );
      }
      setEditModal(null);
    } catch (err) {
      setError('فشل في حفظ الفيديو');
    }
    setSaving(false);
  };

  const handleDelete = async (videoId) => {
    try {
      await adminAPI.deleteVideo(videoId);
      setVideos((prev) => prev.filter((v) => v.videoId !== videoId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('فشل في حذف الفيديو');
    }
  };

  const toggleActive = async (video) => {
    try {
      await adminAPI.updateVideo(video.videoId, { isActive: !video.isActive });
      setVideos((prev) =>
        prev.map((v) => (v.videoId === video.videoId ? { ...v, isActive: !v.isActive } : v))
      );
    } catch (err) {
      setError('فشل في تحديث الحالة');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-500">إدارة المحتوى</h2>
        <div className="flex gap-2">
          <button onClick={fetchVideos} className="p-2 text-gray-400 hover:text-navy-500 hover:bg-gray-100 rounded-xl transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={openNew} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
            <Plus className="h-4 w-4" />
            إضافة فيديو
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['', 'توجيهي', 'قرار'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f ? 'bg-navy-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-card'
            }`}
          >
            {f || 'الكل'} ({videos.filter((v) => !f || v.type === f).length})
          </button>
        ))}
      </div>

      {/* Video grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>لا توجد فيديوهات</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video) => (
            <div key={video.videoId} className={`bg-white rounded-2xl shadow-card overflow-hidden group ${!video.isActive ? 'opacity-60' : ''}`}>
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-navy-500 to-green-600 flex items-center justify-center relative">
                {video.youtubeUrl ? (
                  <Link className="h-10 w-10 text-white/60" />
                ) : (
                  <Video className="h-12 w-12 text-white/40" />
                )}
                {video.duration && (
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {video.duration}
                  </span>
                )}
                <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${
                  video.isActive ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {video.isActive ? 'منشور' : 'مسودة'}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h4 className="font-bold text-navy-500 mb-1 line-clamp-1">{video.title}</h4>
                <p className="text-xs text-gray-400 mb-2 line-clamp-1">{video.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{video.type}</span>
                  {video.youtubeUrl && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Link className="h-3 w-3" /> يوتيوب
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => toggleActive(video)} className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-green-500 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                    {video.isActive ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4 text-gray-400" />}
                  </button>
                  <button onClick={() => openEdit(video)} className="flex-1 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-navy-500 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <Edit2 className="h-3.5 w-3.5" /> تعديل
                  </button>
                  <button onClick={() => setDeleteConfirm(video.videoId)} className="flex-1 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-red-500 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" /> حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy-500">
                {editModal === 'new' ? 'إضافة فيديو جديد' : 'تعديل الفيديو'}
              </h3>
              <button onClick={() => setEditModal(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">عنوان الفيديو *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none"
                  placeholder="مثال: مقدمة في اكتشاف الذات"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">الوصف</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none resize-none"
                  placeholder="وصف قصير للفيديو"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">رابط يوتيوب</label>
                <input
                  value={form.youtubeUrl}
                  onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none"
                  dir="ltr"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-500 mb-1.5">المدة</label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none"
                    placeholder="8 دقائق"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-500 mb-1.5">النوع</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none bg-white"
                  >
                    <option value="توجيهي">توجيهي</option>
                    <option value="قرار">قرار</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editModal === 'new' ? 'إضافة' : 'حفظ'}
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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-navy-500 mb-2">حذف الفيديو؟</h3>
            <p className="text-gray-500 text-sm mb-6">هل أنت متأكد من حذف هذا الفيديو؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                نعم، احذف
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
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
