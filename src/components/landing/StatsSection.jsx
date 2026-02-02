import { stats } from '../../data/landingData';

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-br from-navy-800 to-navy-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center animate-fadeInUp"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-300 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
