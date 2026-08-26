'use client';

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 'test-001',
    name: 'Ankit Verma',
    avatar: 'AV',
    result: 'GATE CSE AIR 47',
    city: 'Kanpur, UP',
    course: 'GATE Complete Preparation',
    rating: 5,
    text: "Cleared GATE CSE with AIR 47 in my very first attempt. Dr. Arjun's lectures are so clear and structured. The mock tests and doubt sessions made all the difference. Eduvance is worth every rupee.",
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'test-002',
    name: 'Sneha Krishnan',
    avatar: 'SK',
    result: 'UPSC CSE 2025 Selected',
    city: 'Chennai, TN',
    course: 'UPSC Complete Strategy',
    rating: 5,
    text: "I had failed UPSC twice before joining Eduvance. Priya ma'am's approach to GS and the current affairs module completely transformed my preparation. Selected in my 3rd attempt as IRS officer.",
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'test-003',
    name: 'Rohan Mehta',
    avatar: 'RM',
    result: 'IIT Bombay — JEE Adv.',
    city: 'Ahmedabad, GJ',
    course: 'IIT-JEE Physics Masterclass',
    rating: 5,
    text: "Prof. Gupta's Physics lectures are on another level. I was scoring 45% before joining, and after 6 months on Eduvance I cleared JEE Advanced with a rank good enough for IIT Bombay. Grateful.",
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'test-004',
    name: 'Divya Nambiar',
    avatar: 'DN',
    result: 'NEET 2025 — 698/720',
    city: 'Kochi, KL',
    course: 'NEET Biology Complete',
    rating: 5,
    text: "Dr. Kavya's Biology course is the most comprehensive I've seen. The NCERT line-by-line analysis and PYQ sessions helped me score 698/720. Got into AIIMS Delhi. Thank you Eduvance!",
    color: 'from-green-500 to-teal-600',
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + testimonials?.length) % testimonials?.length);
  const next = () => setActive((i) => (i + 1) % testimonials?.length);

  const t = testimonials?.[active];

  return (
    <section className="py-16 bg-background" id="testimonials">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-2">
            Success Stories
          </p>
          <h2 className="text-2xl md:text-3xl font-800 text-foreground">Students Who Made It</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Over 98,000 students selected in top exams through Eduvance in 2025 alone.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card relative">
            {/* Quote icon */}
            <div className="absolute top-6 right-6 opacity-10">
              <Quote size={64} className="text-primary" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-5">
              {[1, 2, 3, 4, 5]?.map((s) => (
                <Star key={`ts-star-${t?.id}-${s}`} size={18} className="fill-accent text-accent" />
              ))}
            </div>

            {/* Text */}
            <p className="text-base md:text-lg text-foreground leading-relaxed mb-6 italic">
              &ldquo;{t?.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t?.color} flex items-center justify-center text-white font-700`}
                >
                  {t?.avatar}
                </div>
                <div>
                  <p className="font-700 text-foreground">{t?.name}</p>
                  <p className="text-xs text-muted-foreground">{t?.city}</p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`inline-block text-xs font-700 bg-gradient-to-r ${t?.color} text-white px-3 py-1.5 rounded-full mb-1`}
                >
                  🏆 {t?.result}
                </div>
                <p className="text-[11px] text-muted-foreground">{t?.course}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center transition-all duration-150"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} className="text-muted-foreground" />
            </button>

            <div className="flex gap-2">
              {testimonials?.map((_, i) => (
                <button
                  key={`ts-dot-${i}`}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    i === active ? 'w-8 bg-primary' : 'w-2 bg-border'
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center transition-all duration-150"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Mini testimonial grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {testimonials?.map((t, i) => (
            <button
              key={t?.id}
              onClick={() => setActive(i)}
              className={`p-4 rounded-xl border text-left transition-all duration-150 ${
                i === active
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t?.color} flex items-center justify-center text-white text-xs font-700 shrink-0`}
                >
                  {t?.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-700 text-foreground truncate">{t?.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{t?.city}</p>
                </div>
              </div>
              <p
                className={`text-[11px] font-700 bg-gradient-to-r ${t?.color} bg-clip-text`}
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {t?.result}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
