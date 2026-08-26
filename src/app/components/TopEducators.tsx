import React from 'react';
import Link from 'next/link';
import { Star, Users, BookOpen, ChevronRight, Award } from 'lucide-react';

const educators = [
  {
    id: 'edu-001',
    name: 'Dr. Arjun Sharma',
    avatar: 'AS',
    subject: 'Computer Science',
    exams: 'GATE • ISRO • BARC',
    rating: 4.9,
    reviews: 28400,
    students: '1.2L',
    courses: 14,
    verified: true,
    color: 'from-purple-500 to-indigo-600',
    badge: 'Top GATE Educator',
  },
  {
    id: 'edu-002',
    name: 'IAS Priya Nair',
    avatar: 'PN',
    subject: 'UPSC GS & Optional',
    exams: 'UPSC CSE',
    rating: 4.8,
    reviews: 42000,
    students: '3.4L',
    courses: 8,
    verified: true,
    color: 'from-blue-500 to-blue-700',
    badge: '#1 UPSC Educator',
  },
  {
    id: 'edu-003',
    name: 'Prof. Rahul Gupta',
    avatar: 'RG',
    subject: 'Physics & Mathematics',
    exams: 'IIT-JEE • NEET',
    rating: 4.7,
    reviews: 19800,
    students: '88K',
    courses: 11,
    verified: true,
    color: 'from-orange-500 to-red-600',
    badge: 'IIT Alumnus',
  },
  {
    id: 'edu-004',
    name: 'Dr. Kavya Menon',
    avatar: 'KM',
    subject: 'Biology',
    exams: 'NEET • AIIMS',
    rating: 4.9,
    reviews: 34600,
    students: '2.1L',
    courses: 9,
    verified: true,
    color: 'from-green-500 to-teal-600',
    badge: 'MBBS • MD',
  },
  {
    id: 'edu-005',
    name: 'Vikram Patel',
    avatar: 'VP',
    subject: 'Full Stack & DSA',
    exams: 'Coding • Placements',
    rating: 4.8,
    reviews: 16200,
    students: '64K',
    courses: 7,
    verified: true,
    color: 'from-slate-600 to-slate-800',
    badge: 'Ex-Google Engineer',
  },
];

export default function TopEducators() {
  return (
    <section className="py-16 bg-white" id="educators">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-600 text-primary uppercase tracking-widest mb-2">
              Our Educators
            </p>
            <h2 className="text-2xl md:text-3xl font-800 text-foreground">Learn from the Best</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              IIT/IIM alumni, UPSC toppers, and industry veterans
            </p>
          </div>
          <Link
            href="#educators-all"
            className="hidden md:flex items-center gap-1.5 text-sm font-600 text-primary hover:text-secondary transition-colors"
          >
            Meet All Educators
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Educators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
          {educators?.map((edu) => (
            <div
              key={edu?.id}
              className="bg-card border border-border rounded-2xl p-5 text-center card-hover shadow-card cursor-pointer group"
            >
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${edu?.color} flex items-center justify-center text-white text-2xl font-800 mx-auto`}
                >
                  {edu?.avatar}
                </div>
                {edu?.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-info rounded-full flex items-center justify-center border-2 border-white">
                    <Award size={12} className="text-white" />
                  </div>
                )}
              </div>

              {/* Name & Subject */}
              <h3 className="font-700 text-sm text-foreground mb-0.5">{edu?.name}</h3>
              <p className="text-xs text-muted-foreground mb-1">{edu?.subject}</p>

              {/* Badge */}
              <span className="inline-block text-[10px] font-700 bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-3">
                {edu?.badge}
              </span>

              {/* Exams */}
              <p className="text-[11px] text-muted-foreground mb-3">{edu?.exams}</p>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mb-3">
                <Star size={12} className="fill-accent text-accent" />
                <span className="text-xs font-700 text-foreground">{edu?.rating}</span>
                <span className="text-[10px] text-muted-foreground">
                  ({edu?.reviews?.toLocaleString('en-IN')})
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-4 pt-3 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Users size={11} className="text-primary" />
                    <span className="text-xs font-700 text-foreground">{edu?.students}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Students</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <BookOpen size={11} className="text-primary" />
                    <span className="text-xs font-700 text-foreground">{edu?.courses}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Courses</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
