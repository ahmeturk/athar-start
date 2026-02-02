import clsx from 'clsx';
import { Star } from 'lucide-react';

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 28,
};

export default function StarRating({ rating = 0, size = 'md' }) {
  const px = sizeMap[size] || sizeMap.md;

  return (
    <div className="inline-flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={px}
          className={clsx(
            'transition-colors',
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-none text-gray-300'
          )}
        />
      ))}
    </div>
  );
}
