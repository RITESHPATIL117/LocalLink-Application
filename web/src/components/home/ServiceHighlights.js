'use client';
import { FiZap, FiShield, FiClock } from 'react-icons/fi';

const HIGHLIGHTS = [
  {
    title: 'Reliable Electrical Support',
    desc: 'Experienced experts for safe home and office fixes.',
    icon: FiZap,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Certified Electrical Support',
    desc: 'Background-verified professionals with quality assurance.',
    icon: FiShield,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Instant Response',
    desc: 'Quick bookings and fast dispatch when urgency matters.',
    icon: FiClock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

export default function ServiceHighlights() {
  return (
    <section className="mb-10 md:mb-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {HIGHLIGHTS.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-11 h-11 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                <Icon size={20} />
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
