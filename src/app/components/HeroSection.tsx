'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, ChevronRight, Star, Users, BookOpen, Award } from 'lucide-react';

const heroStats = [
  { value: '4.2M+', label: 'Active Learners', icon: <Users size={16} /> },
  { value: '850+', label: 'Expert Educators', icon: <Award size={16} /> },
  { value: '12,000+', label: 'Video Lessons', icon: <BookOpen size={16} /> },
  { value: '4.8', label: 'Avg. Rating', icon: <Star size={16} /> },
];

const rotatingWords = ['UPSC', 'IIT-JEE', 'NEET', 'GATE', 'CAT', 'Coding'];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % rotatingWords?.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden gradient-hero min-h-[88vh] flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary/10 blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>
      <div className="relative max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Left Content */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-500 text-white/90">
                India&apos;s #1 Exam Preparation Platform
              </span>
              <ChevronRight size={14} className="text-white/60" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-800 leading-tight mb-4">
              Learn From the Best.
              <br />
              <span className="text-white">Build Your Future.</span>
            </h1>

            {/* Rotating exam name */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl md:text-2xl font-600 text-white/70">Crack</span>
              <span
                className="text-xl md:text-2xl font-800 text-accent transition-all duration-300"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(8px)',
                }}
              >
                {rotatingWords?.[wordIndex]}
              </span>
              <span className="text-xl md:text-2xl font-600 text-white/70">with confidence</span>
            </div>

            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              Live classes, expert educators, structured courses and personalized learning — all in
              one place. Join 4.2 million students already learning on Eduvance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/course-discovery" className="btn-accent text-base px-6 py-3">
                Explore Courses
                <ChevronRight size={16} />
              </Link>
              <Link
                href="/sign-up-login-screen"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl px-6 py-3 font-600 text-base transition-all duration-150"
              >
                <Play size={16} className="fill-white" />
                Start Learning Free
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6">
              {heroStats?.map((stat) => (
                <div key={`hero-stat-${stat?.label}`} className="flex items-center gap-2">
                  <span className="text-accent">{stat?.icon}</span>
                  <div>
                    <div className="text-xl font-800 text-white font-mono-nums">{stat?.value}</div>
                    <div className="text-xs text-white/60 font-500">{stat?.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Floating Course Cards */}
          <div className="hidden lg:block relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main card */}
              <div className="absolute top-8 left-0 right-0 mx-auto w-[85%] glass-card rounded-2xl p-5 shadow-2xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <BookOpen size={22} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-700 text-sm">GATE Complete Preparation</p>
                    <p className="text-white/60 text-xs mt-0.5">by Dr. Arjun Sharma • CS & IT</p>
                  </div>
                  <div className="shrink-0">
                    <span className="bg-accent text-accent-foreground text-xs font-700 px-2 py-1 rounded-lg">
                      31% OFF
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>Your Progress</span>
                    <span className="font-mono-nums font-600 text-accent">64%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>86 of 134 lessons completed</span>
                  <span className="text-white font-600">Continue →</span>
                </div>
              </div>

              {/* Floating badge 1 */}
              <div className="absolute bottom-24 left-0 glass-card rounded-xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center">
                    <Award size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-700">Priya Mehta</p>
                    <p className="text-white/60 text-[10px]">Just enrolled in NEET</p>
                  </div>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div className="absolute bottom-10 right-0 glass-card rounded-xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5]?.map((s) => (
                      <Star key={`hero-star-${s}`} size={12} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-white text-xs font-600">4.9 / 5 Rating</p>
                </div>
                <p className="text-white/60 text-[10px] mt-1">from 28,400+ reviews</p>
              </div>

              {/* Live badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-danger/90 text-white text-xs font-700 px-3 py-1.5 rounded-full shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />6 Classes Live
                Now
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>
    </section>
  );
}
