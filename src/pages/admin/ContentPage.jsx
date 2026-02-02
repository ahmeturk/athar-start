import { useState } from 'react';
import { Video, Plus, Edit2, Trash2, Eye, GripVertical } from 'lucide-react';

const mockVideos = [
  { id: 1, title: 'مقدمة: رحلة اكتشاف الذات', type: 'توجيهي', duration: '8:00', views: 8420, status: 'منشور' },
  { id: 2, title: 'فهم الميول المهنية', type: 'توجيهي', duration: '12:00', views: 7380, status: 'منشور' },
  { id: 3, title: 'استكشاف عالم التخصصات', type: 'توجيهي', duration: '10:00', views: 6920, status: 'منشور' },
  { id: 4, title: 'مهارات القرن الحادي والعشرين', type: 'توجيهي', duration: '9:00', views: 6100, status: 'منشور' },
  { id: 5, title: 'كيف تتخذ قرارك المهني', type: 'قرار', duration: '11:00', views: 5800, status: 'منشور' },
  { id: 6, title: 'التخطيط الأكاديمي', type: 'قرار', duration: '10:00', views: 5200, status: 'مسودة' },
  { id: 7, title: 'تجارب ناجحة', type: 'قرار', duration: '8:00', views: 4900, status: 'منشور' },
  { id: 8, title: 'خطتك للمستقبل', type: 'قرار', duration: '9:00', views: 4500, status: 'منشور' },
];

export default function ContentPage() {
  const [filter, setFilter] = useState('');

  const filtered = mockVideos.filter(
    (v) => !filter || v.type === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-500">إدارة المحتوى</h2>
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
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
                <button className="flex-1 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-navy-500 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit2 className="h-3.5 w-3.5" /> تعديل
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-red-500 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" /> حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
