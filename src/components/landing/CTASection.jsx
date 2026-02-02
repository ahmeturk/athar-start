import Button from '../ui/Button';

export default function CTASection({ onSignup }) {
  return (
    <section className="bg-gradient-to-br from-navy-500 to-navy-700 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          جاهز تكتشف مستقبلك؟
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          انضم لأكثر من 12,000 طالب اكتشفوا شغفهم الحقيقي وبدأوا يخططون
          لمستقبلهم بثقة ووضوح
        </p>
        <Button onClick={onSignup} size="lg" className="animate-pulse-glow">
          ابدأ رحلتك الآن
        </Button>
      </div>
    </section>
  );
}
