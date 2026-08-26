'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  Users,
  Clock,
  BookOpen,
  ShoppingCart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { addToCart, isInCart } from '@/lib/learningStore';
import { getOriginalPrice } from '@/lib/pricing';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  examType: string;
  rating: number;
  reviews: number;
  learners: number;
  duration: number; // hours
  lessons: number;
  price: number;
  originalPrice: number;
  discount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  badge?: string;
  badgeColor?: string;
  language: string;
  lastUpdated: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Backend integration point: replace with GET /api/courses?filters=...

const allCourses: Course[] = [
  {
    id: 'course-001',
    title: 'GATE Complete Preparation Course 2026',
    instructor: 'Dr. Arjun Sharma',
    instructorAvatar: 'AS',
    category: 'GATE',
    examType: 'Engineering',
    rating: 4.9,
    reviews: 8420,
    learners: 42800,
    duration: 380,
    lessons: 134,
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    difficulty: 'Advanced',
    thumbnail: 'gate',
    badge: 'Bestseller',
    badgeColor: 'bg-accent text-accent-foreground',
    language: 'Hindi + English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-002',
    title: 'UPSC CSE Prelims + Mains Complete Strategy',
    instructor: 'IAS Priya Nair',
    instructorAvatar: 'PN',
    category: 'UPSC',
    examType: 'Civil Services',
    rating: 4.8,
    reviews: 14200,
    learners: 124000,
    duration: 520,
    lessons: 210,
    price: 14999,
    originalPrice: 24999,
    discount: 40,
    difficulty: 'Advanced',
    thumbnail: 'upsc',
    badge: 'Top Rated',
    badgeColor: 'bg-success text-white',
    language: 'Hindi + English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-003',
    title: 'IIT-JEE Advanced Physics Masterclass',
    instructor: 'Prof. Rahul Gupta',
    instructorAvatar: 'RG',
    category: 'IIT-JEE',
    examType: 'Engineering',
    rating: 4.7,
    reviews: 6800,
    learners: 38400,
    duration: 280,
    lessons: 96,
    price: 9999,
    originalPrice: 15999,
    discount: 38,
    difficulty: 'Advanced',
    thumbnail: 'jee',
    language: 'Hindi',
    lastUpdated: 'Jul 2026',
  },
  {
    id: 'course-004',
    title: 'NEET Biology — Complete NCERT + PYQ Analysis',
    instructor: 'Dr. Kavya Menon',
    instructorAvatar: 'KM',
    category: 'NEET',
    examType: 'Medical',
    rating: 4.9,
    reviews: 11400,
    learners: 86200,
    duration: 340,
    lessons: 156,
    price: 11999,
    originalPrice: 18999,
    discount: 37,
    difficulty: 'Intermediate',
    thumbnail: 'neet',
    badge: 'New',
    badgeColor: 'bg-info text-white',
    language: 'Hindi + English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-005',
    title: 'Full Stack Web Development Bootcamp',
    instructor: 'Vikram Patel',
    instructorAvatar: 'VP',
    category: 'Coding',
    examType: 'Skills',
    rating: 4.8,
    reviews: 9200,
    learners: 64000,
    duration: 420,
    lessons: 180,
    price: 7999,
    originalPrice: 12999,
    discount: 38,
    difficulty: 'Beginner',
    thumbnail: 'coding',
    badge: 'Bestseller',
    badgeColor: 'bg-accent text-accent-foreground',
    language: 'English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-006',
    title: 'SSC CGL Complete Preparation 2026',
    instructor: 'Manish Tiwari',
    instructorAvatar: 'MT',
    category: 'SSC',
    examType: 'Government',
    rating: 4.6,
    reviews: 7800,
    learners: 52000,
    duration: 240,
    lessons: 88,
    price: 5999,
    originalPrice: 9999,
    discount: 40,
    difficulty: 'Intermediate',
    thumbnail: 'ssc',
    language: 'Hindi',
    lastUpdated: 'Jul 2026',
  },
  {
    id: 'course-007',
    title: 'CAT Quantitative Aptitude Intensive',
    instructor: 'Neha Agarwal',
    instructorAvatar: 'NA',
    category: 'CAT',
    examType: 'Management',
    rating: 4.7,
    reviews: 4200,
    learners: 18600,
    duration: 160,
    lessons: 72,
    price: 6999,
    originalPrice: 10999,
    discount: 36,
    difficulty: 'Intermediate',
    thumbnail: 'cat',
    language: 'English',
    lastUpdated: 'Jun 2026',
  },
  {
    id: 'course-008',
    title: 'Data Science & ML with Python',
    instructor: 'Dr. Sanjay Bose',
    instructorAvatar: 'SB',
    category: 'Data Science',
    examType: 'Skills',
    rating: 4.8,
    reviews: 5600,
    learners: 32000,
    duration: 300,
    lessons: 112,
    price: 8499,
    originalPrice: 13999,
    discount: 39,
    difficulty: 'Intermediate',
    thumbnail: 'ds',
    badge: 'Hot',
    badgeColor: 'bg-danger text-white',
    language: 'English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-009',
    title: 'Banking & Finance — IBPS PO Complete',
    instructor: 'Ravi Shankar',
    instructorAvatar: 'RS',
    category: 'Banking',
    examType: 'Government',
    rating: 4.5,
    reviews: 9800,
    learners: 74000,
    duration: 200,
    lessons: 80,
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    difficulty: 'Beginner',
    thumbnail: 'banking',
    language: 'Hindi + English',
    lastUpdated: 'Jul 2026',
  },
  {
    id: 'course-010',
    title: 'NEET Chemistry — Organic + Inorganic Mastery',
    instructor: 'Dr. Suresh Kumar',
    instructorAvatar: 'SK',
    category: 'NEET',
    examType: 'Medical',
    rating: 4.7,
    reviews: 6400,
    learners: 48000,
    duration: 260,
    lessons: 104,
    price: 8999,
    originalPrice: 13999,
    discount: 36,
    difficulty: 'Intermediate',
    thumbnail: 'neet',
    language: 'Hindi + English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-011',
    title: 'IIT-JEE Chemistry — Physical + Organic',
    instructor: 'Dr. Anita Mishra',
    instructorAvatar: 'AM',
    category: 'IIT-JEE',
    examType: 'Engineering',
    rating: 4.6,
    reviews: 5200,
    learners: 29000,
    duration: 240,
    lessons: 90,
    price: 8499,
    originalPrice: 13999,
    discount: 39,
    difficulty: 'Advanced',
    thumbnail: 'jee',
    language: 'Hindi',
    lastUpdated: 'Jul 2026',
  },
  {
    id: 'course-012',
    title: 'CUET UG — Complete Preparation All Subjects',
    instructor: 'Pooja Sharma',
    instructorAvatar: 'PS',
    category: 'CUET',
    examType: 'Undergraduate',
    rating: 4.6,
    reviews: 3800,
    learners: 22000,
    duration: 180,
    lessons: 76,
    price: 5499,
    originalPrice: 8999,
    discount: 39,
    difficulty: 'Beginner',
    thumbnail: 'cuet',
    badge: 'New',
    badgeColor: 'bg-info text-white',
    language: 'Hindi + English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-013',
    title: 'GATE ECE — Electronics & Communication',
    instructor: 'Prof. Deepak Rao',
    instructorAvatar: 'DR',
    category: 'GATE',
    examType: 'Engineering',
    rating: 4.8,
    reviews: 4600,
    learners: 21000,
    duration: 340,
    lessons: 118,
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    difficulty: 'Advanced',
    thumbnail: 'gate',
    language: 'English',
    lastUpdated: 'Jul 2026',
  },
  {
    id: 'course-014',
    title: 'MBA Preparation — CAT + XAT + SNAP Complete',
    instructor: 'Neha Agarwal',
    instructorAvatar: 'NA',
    category: 'MBA',
    examType: 'Management',
    rating: 4.7,
    reviews: 3200,
    learners: 14800,
    duration: 200,
    lessons: 84,
    price: 7499,
    originalPrice: 11999,
    discount: 38,
    difficulty: 'Intermediate',
    thumbnail: 'cat',
    language: 'English',
    lastUpdated: 'Jun 2026',
  },
  {
    id: 'course-015',
    title: 'Python for Data Analysis & Visualization',
    instructor: 'Dr. Sanjay Bose',
    instructorAvatar: 'SB',
    category: 'Data Science',
    examType: 'Skills',
    rating: 4.9,
    reviews: 7200,
    learners: 42000,
    duration: 120,
    lessons: 52,
    price: 3999,
    originalPrice: 6999,
    discount: 43,
    difficulty: 'Beginner',
    thumbnail: 'ds',
    language: 'English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-016',
    title: 'English Communication & Grammar Mastery',
    instructor: 'Kavitha Reddy',
    instructorAvatar: 'KR',
    category: 'English',
    examType: 'Skills',
    rating: 4.5,
    reviews: 8800,
    learners: 58000,
    duration: 80,
    lessons: 40,
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    difficulty: 'Beginner',
    thumbnail: 'english',
    language: 'English',
    lastUpdated: 'Jul 2026',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'All',
  'UPSC',
  'IIT-JEE',
  'NEET',
  'GATE',
  'SSC',
  'Banking',
  'CAT',
  'CUET',
  'Coding',
  'Data Science',
  'MBA',
  'English',
];
const EXAM_TYPES = [
  'All',
  'Civil Services',
  'Engineering',
  'Medical',
  'Management',
  'Government',
  'Skills',
  'Undergraduate',
];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

const thumbnailGradients: Record<string, string> = {
  gate: 'from-purple-600 to-indigo-700',
  upsc: 'from-blue-600 to-blue-800',
  jee: 'from-orange-500 to-red-600',
  neet: 'from-green-500 to-teal-600',
  coding: 'from-slate-700 to-slate-900',
  ssc: 'from-red-500 to-rose-700',
  cat: 'from-indigo-500 to-purple-700',
  ds: 'from-violet-600 to-purple-800',
  banking: 'from-teal-500 to-cyan-700',
  cuet: 'from-pink-500 to-rose-600',
  english: 'from-lime-500 to-green-600',
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
  banking: '🏦',
  cuet: '🎓',
  english: '🗣️',
};

const categoryColors: Record<string, string> = {
  GATE: 'bg-purple-100 text-purple-700',
  UPSC: 'bg-blue-100 text-blue-700',
  'IIT-JEE': 'bg-orange-100 text-orange-700',
  NEET: 'bg-green-100 text-green-700',
  Coding: 'bg-slate-100 text-slate-700',
  SSC: 'bg-red-100 text-red-700',
  CAT: 'bg-indigo-100 text-indigo-700',
  'Data Science': 'bg-violet-100 text-violet-700',
  Banking: 'bg-teal-100 text-teal-700',
  MBA: 'bg-amber-100 text-amber-700',
  CUET: 'bg-pink-100 text-pink-700',
  English: 'bg-lime-100 text-lime-700',
};

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-success/10 text-success',
  Intermediate: 'bg-warning/10 text-warning',
  Advanced: 'bg-danger/10 text-danger',
};

const ITEMS_PER_PAGE = 9;

// ─── Course Card ──────────────────────────────────────────────────────────────

function CourseCard({ course, view }: { course: Course; view: 'grid' | 'list' }) {
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    setInCart(isInCart(course.id));
  }, [course.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inCart) {
      addToCart(course.id);
      setInCart(true);
      toast.success(`Added to cart`, {
        description: `${course.title.slice(0, 35)}...`,
      });
    }
  };

  if (view === 'list') {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-card-hover transition-all duration-200 flex gap-0">
        {/* Thumbnail */}
        <div
          className={`w-48 shrink-0 bg-gradient-to-br ${thumbnailGradients[course.thumbnail] || 'from-gray-500 to-gray-700'} flex items-center justify-center`}
        >
          <span className="text-4xl">{thumbnailIcons[course.thumbnail] || '📚'}</span>
        </div>

        <div className="flex flex-col flex-1 p-5 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-[11px] font-700 px-2 py-0.5 rounded-full ${categoryColors[course.category] || 'bg-muted text-muted-foreground'}`}
              >
                {course.category}
              </span>
              <span
                className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${difficultyColors[course.difficulty]}`}
              >
                {course.difficulty}
              </span>
              {course.badge && (
                <span
                  className={`text-[11px] font-700 px-2 py-0.5 rounded-full ${course.badgeColor}`}
                >
                  {course.badge}
                </span>
              )}
            </div>
            <h3 className="font-700 text-sm text-foreground mb-1 line-clamp-1">{course.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">
              {course.instructor} • {course.language}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star size={11} className="fill-accent text-accent" />
                <span className="font-700 text-foreground">{course.rating}</span>
                <span>({course.reviews.toLocaleString('en-IN')})</span>
              </span>
              <span className="flex items-center gap-1">
                <Users size={11} />
                {course.learners.toLocaleString('en-IN')}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {course.duration} hrs
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={11} />
                {course.lessons} lessons
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end justify-between shrink-0 gap-3">
            <div className="text-right">
              <div className="font-800 text-lg text-foreground font-mono-nums">
                ₹{course.price.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-muted-foreground line-through font-mono-nums">
                ₹{getOriginalPrice(course.price).toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] font-700 text-success">{course.discount}% off</div>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 text-xs font-600 px-4 py-2 rounded-xl transition-all duration-150 ${
                inCart
                  ? 'bg-success/10 text-success border border-success/20 cursor-default'
                  : 'bg-primary text-white hover:bg-secondary border border-primary'
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

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden card-hover shadow-card group flex flex-col">
      {/* Thumbnail */}
      <div
        className={`relative h-44 bg-gradient-to-br ${thumbnailGradients[course.thumbnail] || 'from-gray-500 to-gray-700'} flex items-center justify-center`}
      >
        <span className="text-5xl">{thumbnailIcons[course.thumbnail] || '📚'}</span>
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {course.badge && (
            <span className={`text-[11px] font-700 px-2.5 py-1 rounded-full ${course.badgeColor}`}>
              {course.badge}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-white/95 text-primary text-[11px] font-800 px-2 py-1 rounded-lg shadow-sm">
          {course.discount}% OFF
        </div>
        <div className="absolute bottom-3 left-3">
          <span
            className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${difficultyColors[course.difficulty]}`}
          >
            {course.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
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

        <h3 className="font-700 text-sm text-foreground line-clamp-2 mb-2 leading-snug flex-1">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-[10px] font-700 shrink-0">
            {course.instructorAvatar}
          </div>
          <span className="text-xs text-muted-foreground font-500 line-clamp-1">
            {course.instructor}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Users size={11} />
            {course.learners.toLocaleString('en-IN')}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {course.duration}h
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={11} />
            {course.lessons}
          </span>
        </div>

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

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

interface Filters {
  category: string;
  examType: string;
  difficulty: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  maxDuration: number;
}

function FilterSidebar({
  filters,
  onChange,
  onReset,
  activeCount,
}: {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onReset: () => void;
  activeCount: number;
}) {
  return (
    <aside className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-primary" />
          <span className="font-700 text-sm text-foreground">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-primary text-white text-[10px] font-700 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-600 text-primary hover:text-secondary transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-700 text-foreground uppercase tracking-wider mb-3">Category</p>
        <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <label
              key={`filter-cat-${cat}`}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filters.category === cat}
                onChange={() => onChange({ category: cat })}
                className="accent-primary w-3.5 h-3.5"
              />
              <span
                className={`text-sm transition-colors ${filters.category === cat ? 'text-primary font-600' : 'text-foreground group-hover:text-primary'}`}
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Exam Type */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-700 text-foreground uppercase tracking-wider mb-3">Exam Type</p>
        <div className="space-y-1.5">
          {EXAM_TYPES.map((et) => (
            <label
              key={`filter-exam-${et}`}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                name="examType"
                value={et}
                checked={filters.examType === et}
                onChange={() => onChange({ examType: et })}
                className="accent-primary w-3.5 h-3.5"
              />
              <span
                className={`text-sm transition-colors ${filters.examType === et ? 'text-primary font-600' : 'text-foreground group-hover:text-primary'}`}
              >
                {et}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-700 text-foreground uppercase tracking-wider mb-3">
          Price Range
        </p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>
                Min:{' '}
                <span className="font-600 text-foreground font-mono-nums">
                  ₹{filters.minPrice.toLocaleString('en-IN')}
                </span>
              </span>
              <span>
                Max:{' '}
                <span className="font-600 text-foreground font-mono-nums">
                  ₹{filters.maxPrice.toLocaleString('en-IN')}
                </span>
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={25000}
              step={500}
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
          <div className="flex gap-2">
            {[0, 2999, 5999, 9999].map((p) => (
              <button
                key={`price-chip-${p}`}
                onClick={() => onChange({ maxPrice: p === 0 ? 25000 : p })}
                className={`flex-1 text-[10px] font-600 py-1 rounded-lg border transition-all duration-150 ${
                  filters.maxPrice === (p === 0 ? 25000 : p)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-muted text-muted-foreground border-border hover:border-primary'
                }`}
              >
                {p === 0 ? 'Any' : `≤₹${(p / 1000).toFixed(0)}K`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-700 text-foreground uppercase tracking-wider mb-3">Difficulty</p>
        <div className="space-y-1.5">
          {DIFFICULTIES.map((d) => (
            <label
              key={`filter-diff-${d}`}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                name="difficulty"
                value={d}
                checked={filters.difficulty === d}
                onChange={() => onChange({ difficulty: d })}
                className="accent-primary w-3.5 h-3.5"
              />
              <span
                className={`text-sm transition-colors ${filters.difficulty === d ? 'text-primary font-600' : 'text-foreground group-hover:text-primary'}`}
              >
                {d}
              </span>
              {d !== 'All' && (
                <span
                  className={`ml-auto text-[10px] font-600 px-1.5 py-0.5 rounded-full ${difficultyColors[d]}`}
                >
                  {d === 'Beginner' ? '●' : d === 'Intermediate' ? '●●' : '●●●'}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-700 text-foreground uppercase tracking-wider mb-3">
          Minimum Rating
        </p>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 0].map((r) => (
            <label
              key={`filter-rating-${r}`}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                name="minRating"
                value={r}
                checked={filters.minRating === r}
                onChange={() => onChange({ minRating: r })}
                className="accent-primary w-3.5 h-3.5"
              />
              <div className="flex items-center gap-1">
                {r === 0 ? (
                  <span className="text-sm text-foreground">Any rating</span>
                ) : (
                  <>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={`rs-${r}-${s}`}
                        size={12}
                        className={s <= Math.floor(r) ? 'fill-accent text-accent' : 'text-border'}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{r}+</span>
                  </>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-700 text-foreground uppercase tracking-wider mb-3">
          Max Duration
        </p>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Up to</span>
            <span className="font-600 text-foreground font-mono-nums">
              {filters.maxDuration >= 600 ? 'Any' : `${filters.maxDuration} hrs`}
            </span>
          </div>
          <input
            type="range"
            min={40}
            max={600}
            step={20}
            value={filters.maxDuration}
            onChange={(e) => onChange({ maxDuration: Number(e.target.value) })}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>40h</span>
            <span>200h</span>
            <span>400h</span>
            <span>Any</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const DEFAULT_FILTERS: Filters = {
  category: 'All',
  examType: 'All',
  difficulty: 'All',
  minPrice: 0,
  maxPrice: 25000,
  minRating: 0,
  maxDuration: 600,
};

export default function CourseDiscoveryContent() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const handleFilterChange = (partial: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const activeFilterCount = [
    filters.category !== 'All',
    filters.examType !== 'All',
    filters.difficulty !== 'All',
    filters.maxPrice < 25000,
    filters.minRating > 0,
    filters.maxDuration < 600,
  ].filter(Boolean).length;

  // Active filter chips
  const activeChips: { label: string; key: keyof Filters; value: unknown }[] = [];
  if (filters.category !== 'All')
    activeChips.push({ label: filters.category, key: 'category', value: 'All' });
  if (filters.examType !== 'All')
    activeChips.push({ label: filters.examType, key: 'examType', value: 'All' });
  if (filters.difficulty !== 'All')
    activeChips.push({ label: filters.difficulty, key: 'difficulty', value: 'All' });
  if (filters.maxPrice < 25000)
    activeChips.push({
      label: `≤₹${filters.maxPrice.toLocaleString('en-IN')}`,
      key: 'maxPrice',
      value: 25000,
    });
  if (filters.minRating > 0)
    activeChips.push({ label: `${filters.minRating}+ ★`, key: 'minRating', value: 0 });
  if (filters.maxDuration < 600)
    activeChips.push({ label: `≤${filters.maxDuration}h`, key: 'maxDuration', value: 600 });

  const filtered = useMemo(() => {
    const result = allCourses.filter((c) => {
      if (filters.category !== 'All' && c.category !== filters.category) return false;
      if (filters.examType !== 'All' && c.examType !== filters.examType) return false;
      if (filters.difficulty !== 'All' && c.difficulty !== filters.difficulty) return false;
      if (c.price > filters.maxPrice) return false;
      if (c.rating < filters.minRating) return false;
      if (c.duration > filters.maxDuration) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !c.title.toLowerCase().includes(q) &&
          !c.instructor.toLowerCase().includes(q) &&
          !c.category.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });

    switch (sort) {
      case 'popular':
        result.sort((a, b) => b.learners - a.learners);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
    }
    return result;
  }, [filters, search, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label || 'Sort';

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-500">Explore Courses</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-800 text-foreground mb-1">Explore Courses</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} courses across {CATEGORIES.length - 1} categories
        </p>
      </div>

      {/* Search + Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="flex-1 flex items-center bg-card border border-border rounded-xl px-4 py-2.5 gap-2 focus-within:border-primary transition-colors">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search courses, educators, subjects..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-500 text-foreground hover:border-primary transition-colors whitespace-nowrap"
          >
            <TrendingUp size={15} className="text-primary" />
            {currentSortLabel}
            <ChevronDown
              size={14}
              className={`text-muted-foreground transition-transform ${sortOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-20 min-w-[180px] overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={`sort-${opt.value}`}
                  onClick={() => {
                    setSort(opt.value);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    sort === opt.value
                      ? 'bg-primary/10 text-primary font-600'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-card border border-border rounded-xl p-1 gap-1">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all duration-150 ${view === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
            aria-label="Grid view"
          >
            <Grid3X3 size={15} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all duration-150 ${view === 'list' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
            aria-label="List view"
          >
            <List size={15} />
          </button>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-600 text-foreground hover:border-primary transition-colors"
        >
          <SlidersHorizontal size={15} className="text-primary" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-primary text-white text-[10px] font-700 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {activeChips.map((chip) => (
            <button
              key={`chip-${chip.key}-${String(chip.value)}`}
              onClick={() => handleFilterChange({ [chip.key]: chip.value } as Partial<Filters>)}
              className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-600 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all duration-150 border border-primary/20"
            >
              {chip.label}
              <X size={11} />
            </button>
          ))}
          <button
            onClick={handleReset}
            className="text-xs font-600 text-muted-foreground hover:text-danger transition-colors px-2"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-7">
        {/* Sidebar — Desktop */}
        <div className="hidden lg:block w-64 xl:w-72 shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            activeCount={activeFilterCount}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative bg-background w-80 max-w-[90vw] h-full overflow-y-auto p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-700 text-foreground">Filters</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onChange={(f) => {
                  handleFilterChange(f);
                }}
                onReset={handleReset}
                activeCount={activeFilterCount}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-600 text-foreground">
                {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)}
              </span>{' '}
              of <span className="font-600 text-foreground">{filtered.length}</span> courses
            </p>
            {search && (
              <p className="text-xs text-muted-foreground">
                Results for &ldquo;<span className="text-primary font-600">{search}</span>&rdquo;
              </p>
            )}
          </div>

          {/* Empty State */}
          {paginated.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                <Search size={28} className="text-muted-foreground" />
              </div>
              <h3 className="font-700 text-lg text-foreground mb-2">No courses found</h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-sm">
                No courses match your current filters. Try adjusting your search or clearing some
                filters.
              </p>
              <button onClick={handleReset} className="btn-primary text-sm px-5 py-2.5">
                Clear All Filters
              </button>
            </div>
          )}

          {/* Course Grid / List */}
          {paginated.length > 0 && (
            <>
              <div
                className={
                  view === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5'
                    : 'flex flex-col gap-3'
                }
              >
                {paginated.map((course) => (
                  <CourseCard key={course.id} course={course} view={view} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Page <span className="font-600 text-foreground">{page}</span> of{' '}
                    <span className="font-600 text-foreground">{totalPages}</span>
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:border-primary hover:text-primary transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce<(number | string)[]>((acc, p, idx, arr) => {
                        if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1)
                          acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === '...' ? (
                          <span
                            key={`ellipsis-${i}`}
                            className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={`page-${p}`}
                            onClick={() => setPage(p as number)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-600 transition-all duration-150 ${
                              page === p
                                ? 'bg-primary text-white'
                                : 'border border-border hover:border-primary hover:text-primary text-foreground'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:border-primary hover:text-primary transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Items per page */}
                  <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Show</span>
                    <select
                      className="bg-card border border-border rounded-lg px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                      defaultValue={9}
                    >
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                    <span>per page</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Featured GATE Banner */}
      <div className="mt-12 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shrink-0">
            ⚙️
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-accent text-accent-foreground text-xs font-700 px-2.5 py-1 rounded-full">
                Featured
              </span>
              <span className="text-white/70 text-xs">GATE 2026 — All Branches</span>
            </div>
            <h3 className="text-white font-800 text-lg md:text-xl">
              GATE Complete Preparation Course
            </h3>
            <p className="text-white/70 text-sm mt-0.5">
              134 video lectures • 8 mock tests • Doubt solving • ₹8,999
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              addToCart('course-001');
              toast.success('GATE course added to cart!');
            }}
            className="btn-accent text-sm px-5 py-2.5"
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
          <button className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl px-5 py-2.5 text-sm font-600 transition-all duration-150">
            <Zap size={14} />
            Buy Now ₹8,999
          </button>
        </div>
      </div>
    </div>
  );
}
