'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Users, Clock, BookOpen, ShoppingCart, ChevronRight, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { getOriginalPrice } from '@/lib/pricing';

interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  rating: number;
  reviews: number;
  learners: string;
  duration: string;
  lessons: number;
  price: number;
  originalPrice: number;
  discount: number;
  thumbnail: string;
  badge?: string;
  badgeColor?: string;
  isLive?: boolean;
}

const featuredCourses: Course[] = [
  {
    id: 'course-001',
    title: 'GATE Complete Preparation Course 2026',
    instructor: 'Dr. Arjun Sharma',
    instructorAvatar: 'AS',
    category: 'GATE',
    rating: 4.9,
    reviews: 8420,
    learners: '42,800',
    duration: '380 hrs',
    lessons: 134,
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    thumbnail: 'gate',
    badge: 'Bestseller',
    badgeColor: 'bg-accent text-accent-foreground',
  },
  {
    id: 'course-002',
    title: 'UPSC CSE Prelims + Mains Complete Strategy',
    instructor: 'IAS Priya Nair',
    instructorAvatar: 'PN',
    category: 'UPSC',
    rating: 4.8,
    reviews: 14200,
    learners: '1,24,000',
    duration: '520 hrs',
    lessons: 210,
    price: 14999,
    originalPrice: 24999,
    discount: 40,
    thumbnail: 'upsc',
    badge: 'Top Rated',
    badgeColor: 'bg-success text-white',
  },
  {
    id: 'course-003',
    title: 'IIT-JEE Advanced Physics Masterclass',
    instructor: 'Prof. Rahul Gupta',
    instructorAvatar: 'RG',
    category: 'IIT-JEE',
    rating: 4.7,
    reviews: 6800,
    learners: '38,400',
    duration: '280 hrs',
    lessons: 96,
    price: 9999,
    originalPrice: 15999,
    discount: 38,
    thumbnail: 'jee',
    isLive: true,
  },
  {
    id: 'course-004',
    title: 'NEET Biology — Complete NCERT + PYQ Analysis',
    instructor: 'Dr. Kavya Menon',
    instructorAvatar: 'KM',
    category: 'NEET',
    rating: 4.9,
    reviews: 11400,
    learners: '86,200',
    duration: '340 hrs',
    lessons: 156,
    price: 11999,
    originalPrice: 18999,
    discount: 37,
    thumbnail: 'neet',
    badge: 'New',
    badgeColor: 'bg-info text-white',
  },
  {
    id: 'course-005',
    title: 'Full Stack Web Development Bootcamp',
    instructor: 'Vikram Patel',
    instructorAvatar: 'VP',
    category: 'Coding',
    rating: 4.8,
    reviews: 9200,
    learners: '64,000',
    duration: '420 hrs',
    lessons: 180,
    price: 7999,
    originalPrice: 12999,
    discount: 38,
    thumbnail: 'coding',
    badge: 'Bestseller',
    badgeColor: 'bg-accent text-accent-foreground',
  },
  {
    id: 'course-006',
    title: 'SSC CGL Complete Preparation 2026',
    instructor: 'Manish Tiwari',
    instructorAvatar: 'MT',
    category: 'SSC',
    rating: 4.6,
    reviews: 7800,
    learners: '52,000',
    duration: '240 hrs',
    lessons: 88,
    price: 5999,
    originalPrice: 9999,
    discount: 40,
    thumbnail: 'ssc',
  },
  {
    id: 'course-007',
    title: 'CAT Quantitative Aptitude Intensive',
    instructor: 'Neha Agarwal',
    instructorAvatar: 'NA',
    category: 'CAT',
    rating: 4.7,
    reviews: 4200,
    learners: '18,600',
    duration: '160 hrs',
    lessons: 72,
    price: 6999,
    originalPrice: 10999,
    discount: 36,
    thumbnail: 'cat',
  },
  {
    id: 'course-008',
    title: 'Data Science & ML with Python',
    instructor: 'Dr. Sanjay Bose',
    instructorAvatar: 'SB',
    category: 'Data Science',
    rating: 4.8,
    reviews: 5600,
    learners: '32,000',
    duration: '300 hrs',
    lessons: 112,
    price: 8499,
    originalPrice: 13999,
    discount: 39,
    thumbnail: 'ds',
    badge: 'Hot',
    badgeColor: 'bg-danger text-white',
  },
];

const categoryColors: Record<string, string> = {
  GATE: 'bg-purple-100 text-purple-700',
  UPSC: 'bg-blue-100 text-blue-700',
  'IIT-JEE': 'bg-orange-100 text-orange-700',
  NEET: 'bg-green-100 text-green-700',
  Coding: 'bg-slate-100 text-slate-700',
  SSC: 'bg-red-100 text-red-700',
  CAT: 'bg-indigo-100 text-indigo-700',
  'Data Science': 'bg-violet-100 text-violet-700',
};

const thumbnailGradients: Record<string, string> = {
  gate: 'from-purple-600 to-indigo-700',
  upsc: 'from-blue-600 to-blue-800',
  jee: 'from-orange-500 to-red-600',
  neet: 'from-green-500 to-teal-600',
  coding: 'from-slate-700 to-slate-900',
  ssc: 'from-red-500 to-rose-700',
  cat: 'from-indigo-500 to-purple-700',
  ds: 'from-violet-600 to-purple-800',
};

const thumbnailIcons: Record<string, string> = {
  gate: '⚙️',
  upsc: '🏛️',
  jee: '⚗️',
  neet: '🩺',
  coding: '💻',
  ssc: '📋',
  cat: '📊',
  ds: '📈',
};

function CourseCard({ course }: { course: Course }) {
  const [inCart, setInCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inCart) {
      setInCart(true);
      toast.success(`"${course.title.slice(0, 30)}..." added to cart`, {
        description: `₹${course.price.toLocaleString('en-IN')} — proceed to checkout`,
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden card-hover shadow-card group flex flex-col">
      {/* Thumbnail */}
      <div
        className={`relative h-44 bg-gradient-to-br ${thumbnailGradients[course.thumbnail]} flex items-center justify-center`}
      >
        <span className="text-5xl">{thumbnailIcons[course.thumbnail]}</span>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {course.badge && (
            <span className={`text-[11px] font-700 px-2.5 py-1 rounded-full ${course.badgeColor}`}>
              {course.badge}
            </span>
          )}
          {course.isLive && (
            <span className="flex items-center gap-1 bg-danger text-white text-[11px] font-700 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* Discount badge */}
        <div className="absolute top-3 right-3 bg-white/95 text-primary text-[11px] font-800 px-2 py-1 rounded-lg shadow-sm">
          {course.discount}% OFF
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category + Rating row */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[11px] font-700 px-2 py-0.5 rounded-full ${categoryColors[course.category] || 'bg-muted text-muted-foreground'}`}
          >
            {course.category}
          </span>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-accent text-accent" />
            <span className="text-xs font-700 text-foreground">{course.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({course.reviews.toLocaleString('en-IN')})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-700 text-sm text-foreground line-clamp-2 mb-2 leading-snug flex-1">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-[10px] font-700 shrink-0">
            {course.instructorAvatar}
          </div>
          <span className="text-xs text-muted-foreground font-500 line-clamp-1">
            {course.instructor}
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Users size={11} />
            {course.learners}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={11} />
            {course.lessons} lessons
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-800 text-lg text-foreground font-mono-nums">
              ₹{course.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-muted-foreground line-through ml-1.5 font-mono-nums">
              ₹{getOriginalPrice(course.price).toLocaleString('en-IN')}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 text-xs font-600 px-3 py-2 rounded-xl transition-all duration-150 ${
              inCart
                ? 'bg-success/10 text-success border border-success/20 cursor-default'
                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20'
            }`}
          >
            <ShoppingCart size={13} />
            {inCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedCourses() {
  return (
    <section className="py-16 bg-white" id="courses">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-600 text-primary uppercase tracking-widest mb-2">
              Featured Courses
            </p>
            <h2 className="text-2xl md:text-3xl font-800 text-foreground">Top Courses This Week</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Handpicked by our educators for maximum results
            </p>
          </div>
          <Link
            href="/course-discovery"
            className="hidden md:flex items-center gap-1.5 text-sm font-600 text-primary hover:text-secondary transition-colors"
          >
            View All Courses
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Gate Course Highlight */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-4xl shrink-0">
              ⚙️
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-accent text-accent-foreground text-xs font-700 px-2.5 py-1 rounded-full">
                  Featured
                </span>
                <span className="text-white/70 text-xs">GATE 2026</span>
              </div>
              <h3 className="text-white font-800 text-xl md:text-2xl">
                GATE Complete Preparation Course
              </h3>
              <p className="text-white/70 text-sm mt-1">
                CS, IT, ECE, EE, ME, CE • 134 video lectures • 8 mock tests • Doubt solving
              </p>
              <div className="flex items-center gap-3 mt-2">
                <Star size={14} className="fill-accent text-accent" />
                <span className="text-white font-600 text-sm">4.9</span>
                <span className="text-white/60 text-xs">(8,420 reviews)</span>
                <span className="text-white/60 text-xs">•</span>
                <span className="text-white/60 text-xs">42,800 learners</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div>
              <span className="text-white/60 text-sm line-through font-mono-nums">₹12,999</span>
              <div className="text-white font-800 text-3xl font-mono-nums">₹8,999</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-accent text-sm px-5 py-2.5">
                <ShoppingCart size={15} />
                Add to Cart
              </button>
              <Link
                href="/course-discovery"
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl px-5 py-2.5 text-sm font-600 transition-all duration-150"
              >
                <Zap size={14} />
                Buy Now
              </Link>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/course-discovery" className="btn-secondary inline-flex">
            Explore All 1,200+ Courses
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
