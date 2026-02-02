const stats = [
  { value: '12,000+', label: 'طالب استفاد' },
  { value: '98%', label: 'نسبة الرضا' },
  { value: '52%', label: 'تحسن الوعي المهني' },
  { value: '500+', label: 'مدرسة شريكة' },
];

export default function MarqueeBanner() {
  // Duplicate stats three times for seamless loop
  const repeatedStats = [...stats, ...stats, ...stats];

  return (
    <section className="bg-navy-800 py-4 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {repeatedStats.map((stat, i) => (
          <div key={i} className="inline-flex items-center mx-12">
            <span className="text-3xl font-bold text-green-400">
              {stat.value}
            </span>
            <span className="text-white mr-3">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
