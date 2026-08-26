import React from 'react';
import { TrendingUp, Users, BookOpen, Trophy, Star, Clock } from 'lucide-react';

const stats = [
  {
    value: '4.2M+',
    label: 'Learners Enrolled',
    icon: <Users size={20} className="text-primary" />,
  },
  { value: '850+', label: 'Expert Educators', icon: <Star size={20} className="text-accent" /> },
  {
    value: '1,200+',
    label: 'Courses Available',
    icon: <BookOpen size={20} className="text-secondary" />,
  },
  {
    value: '98,000+',
    label: 'Selections in 2025',
    icon: <Trophy size={20} className="text-success" />,
  },
  { value: '2.4Cr+', label: 'Hours Watched', icon: <Clock size={20} className="text-info" /> },
  {
    value: '4.8 ★',
    label: 'Average Rating',
    icon: <TrendingUp size={20} className="text-accent" />,
  },
];

export default function StatsStrip() {
  return (
    <section className="bg-white border-b border-border py-8">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats?.map((stat) => (
            <div
              key={`stat-${stat?.label}`}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors duration-150"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                {stat?.icon}
              </div>
              <div className="font-800 text-xl text-foreground font-mono-nums">{stat?.value}</div>
              <div className="text-xs font-500 text-muted-foreground">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
