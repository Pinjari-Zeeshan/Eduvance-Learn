'use client';

import React, { useState, useEffect } from 'react';
import { Tv, Clock, Users, ChevronRight, Calendar } from 'lucide-react';

interface LiveClass {
  id: string;
  title: string;
  educator: string;
  educatorAvatar: string;
  subject: string;
  category: string;
  startTime: string;
  duration: string;
  enrolled: number;
  status: 'live' | 'upcoming' | 'starting-soon';
  color: string;
}

const liveClasses: LiveClass[] = [
  {
    id: 'live-001',
    title: 'GATE 2026: Operating Systems — Process Scheduling Deep Dive',
    educator: 'Dr. Arjun Sharma',
    educatorAvatar: 'AS',
    subject: 'Computer Science',
    category: 'GATE',
    startTime: 'Live Now',
    duration: '2 hrs',
    enrolled: 3840,
    status: 'live',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'live-002',
    title: 'UPSC Prelims: Economy — Monetary Policy & RBI Framework',
    educator: 'IAS Priya Nair',
    educatorAvatar: 'PN',
    subject: 'General Studies II',
    category: 'UPSC',
    startTime: 'Starts in 18 min',
    duration: '1.5 hrs',
    enrolled: 6200,
    status: 'starting-soon',
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'live-003',
    title: 'NEET: Genetics & Evolution — Mendelian Inheritance',
    educator: 'Dr. Kavya Menon',
    educatorAvatar: 'KM',
    subject: 'Biology',
    category: 'NEET',
    startTime: 'Today, 7:00 PM',
    duration: '2.5 hrs',
    enrolled: 4800,
    status: 'upcoming',
    color: 'from-green-500 to-teal-600',
  },
  {
    id: 'live-004',
    title: 'IIT-JEE: Electromagnetic Induction — Faraday & Lenz Law',
    educator: 'Prof. Rahul Gupta',
    educatorAvatar: 'RG',
    subject: 'Physics',
    category: 'IIT-JEE',
    startTime: 'Today, 8:30 PM',
    duration: '2 hrs',
    enrolled: 2900,
    status: 'upcoming',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'live-005',
    title: 'CAT: Data Interpretation — Complex Caselets',
    educator: 'Neha Agarwal',
    educatorAvatar: 'NA',
    subject: 'DI & LR',
    category: 'CAT',
    startTime: 'Tomorrow, 6:00 AM',
    duration: '1.5 hrs',
    enrolled: 1600,
    status: 'upcoming',
    color: 'from-indigo-500 to-purple-600',
  },
];

export default function LiveClassesStrip() {
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    setLiveCount(liveClasses.filter((c) => c.status === 'live').length);
  }, []);

  return (
    <section className="py-16 bg-background" id="live">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-600 text-primary uppercase tracking-widest">
                Live Classes
              </p>
              {liveCount > 0 && (
                <span className="flex items-center gap-1 bg-danger/10 text-danger text-[11px] font-700 px-2 py-0.5 rounded-full border border-danger/20">
                  <span className="w-1.5 h-1.5 bg-danger rounded-full animate-pulse" />
                  {liveCount} Live Now
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-800 text-foreground">
              Don&apos;t Miss Today&apos;s Classes
            </h2>
          </div>
          <a
            href="#live-all"
            className="hidden md:flex items-center gap-1.5 text-sm font-600 text-primary hover:text-secondary transition-colors"
          >
            View Full Schedule
            <ChevronRight size={16} />
          </a>
        </div>

        {/* Live Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
          {liveClasses.slice(0, 3).map((cls) => (
            <div
              key={cls.id}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col"
            >
              {/* Color strip */}
              <div className={`h-1.5 bg-gradient-to-r ${cls.color}`} />

              <div className="p-5 flex flex-col flex-1">
                {/* Status + Category */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-700 bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {cls.category}
                  </span>
                  {cls.status === 'live' && (
                    <span className="flex items-center gap-1 bg-danger text-white text-[11px] font-700 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      LIVE
                    </span>
                  )}
                  {cls.status === 'starting-soon' && (
                    <span className="flex items-center gap-1 bg-warning/15 text-warning text-[11px] font-700 px-2.5 py-1 rounded-full border border-warning/20">
                      <Clock size={11} />
                      Starting Soon
                    </span>
                  )}
                  {cls.status === 'upcoming' && (
                    <span className="flex items-center gap-1 bg-info/10 text-info text-[11px] font-700 px-2.5 py-1 rounded-full border border-info/20">
                      <Calendar size={11} />
                      Upcoming
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-700 text-sm text-foreground line-clamp-2 mb-3 leading-snug flex-1">
                  {cls.title}
                </h3>

                {/* Educator */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-7 h-7 rounded-full bg-gradient-to-br ${cls.color} flex items-center justify-center text-white text-[11px] font-700 shrink-0`}
                  >
                    {cls.educatorAvatar}
                  </div>
                  <div>
                    <p className="text-xs font-600 text-foreground">{cls.educator}</p>
                    <p className="text-[10px] text-muted-foreground">{cls.subject}</p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {cls.startTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={11} />
                    {cls.enrolled.toLocaleString('en-IN')} enrolled
                  </span>
                </div>

                {/* CTA */}
                <button
                  className={`w-full py-2.5 rounded-xl text-sm font-600 flex items-center justify-center gap-2 transition-all duration-150 ${
                    cls.status === 'live'
                      ? 'bg-danger text-white hover:bg-danger/90'
                      : 'bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20'
                  }`}
                >
                  <Tv size={14} />
                  {cls.status === 'live' ? 'Join Now' : 'Set Reminder'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming ticker */}
        <div className="mt-6 bg-white border border-border rounded-xl p-3 overflow-hidden">
          <div className="flex items-center gap-4">
            <span className="shrink-0 text-xs font-700 text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
              UPCOMING
            </span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-8 animate-ticker whitespace-nowrap">
                {[...liveClasses, ...liveClasses].map((cls, i) => (
                  <span
                    key={`ticker-${cls.id}-${i}`}
                    className="text-xs font-500 text-muted-foreground shrink-0"
                  >
                    📅 <strong className="text-foreground">{cls.category}</strong>:{' '}
                    {cls.title.slice(0, 40)}... — {cls.startTime}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
