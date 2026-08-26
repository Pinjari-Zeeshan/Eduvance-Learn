'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const categories = [
  {
    label: 'UPSC',
    emoji: '🏛️',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    count: '320+ courses',
  },
  {
    label: 'IIT-JEE',
    emoji: '⚗️',
    color: 'bg-orange-50 text-orange-700 border-orange-100',
    count: '180+ courses',
  },
  {
    label: 'NEET',
    emoji: '🩺',
    color: 'bg-green-50 text-green-700 border-green-100',
    count: '210+ courses',
  },
  {
    label: 'GATE',
    emoji: '🔧',
    color: 'bg-purple-50 text-purple-700 border-purple-100',
    count: '95+ courses',
  },
  {
    label: 'SSC',
    emoji: '📋',
    color: 'bg-red-50 text-red-700 border-red-100',
    count: '140+ courses',
  },
  {
    label: 'Banking',
    emoji: '🏦',
    color: 'bg-teal-50 text-teal-700 border-teal-100',
    count: '160+ courses',
  },
  {
    label: 'CAT',
    emoji: '📊',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    count: '75+ courses',
  },
  {
    label: 'CUET',
    emoji: '🎓',
    color: 'bg-pink-50 text-pink-700 border-pink-100',
    count: '120+ courses',
  },
  {
    label: 'Class 9–10',
    emoji: '📚',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    count: '200+ courses',
  },
  {
    label: 'Class 11–12',
    emoji: '📐',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    count: '180+ courses',
  },
  {
    label: 'Coding',
    emoji: '💻',
    color: 'bg-slate-50 text-slate-700 border-slate-100',
    count: '250+ courses',
  },
  {
    label: 'Data Science',
    emoji: '📈',
    color: 'bg-violet-50 text-violet-700 border-violet-100',
    count: '90+ courses',
  },
  {
    label: 'Web Dev',
    emoji: '🌐',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    count: '110+ courses',
  },
  {
    label: 'MBA',
    emoji: '💼',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
    count: '65+ courses',
  },
  {
    label: 'Commerce',
    emoji: '📑',
    color: 'bg-rose-50 text-rose-700 border-rose-100',
    count: '85+ courses',
  },
  {
    label: 'English',
    emoji: '🗣️',
    color: 'bg-lime-50 text-lime-700 border-lime-100',
    count: '70+ courses',
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-background" id="categories">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-600 text-primary uppercase tracking-widest mb-2">
              Browse by Category
            </p>
            <h2 className="text-2xl md:text-3xl font-800 text-foreground">
              What do you want to learn?
            </h2>
          </div>
          <Link
            href="/course-discovery"
            className="hidden md:flex items-center gap-1.5 text-sm font-600 text-primary hover:text-secondary transition-colors"
          >
            View All Categories
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-8 2xl:grid-cols-8 gap-3">
          {categories?.map((cat) => (
            <Link
              key={`cat-${cat?.label}`}
              href="/course-discovery"
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${cat?.color} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {cat?.emoji}
              </span>
              <span className="font-700 text-sm text-center leading-tight">{cat?.label}</span>
              <span className="text-[10px] font-500 opacity-70 text-center">{cat?.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
