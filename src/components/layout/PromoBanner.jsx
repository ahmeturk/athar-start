import { Sparkles } from 'lucide-react';

export default function PromoBanner({ onSignup }) {
  return (
    <div className="bg-green-500 text-white py-2.5 text-center text-sm">
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4" />
        <span>عرض خاص: خصم 30% لفترة محدودة!</span>
        <button
          onClick={onSignup}
          className="underline font-bold mr-2 hover:text-white/80 transition-colors"
        >
          سجّل الآن
        </button>
      </div>
    </div>
  );
}
