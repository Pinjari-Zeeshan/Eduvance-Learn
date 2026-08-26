import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
        <div className="rounded-3xl gradient-primary p-10 md:p-16 text-center relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 mb-5">
              <Zap size={14} className="text-accent" />
              <span className="text-sm font-600 text-white">
                Limited Time Offer — Up to 40% Off
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-800 text-white mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-white/75 text-base md:text-lg mb-8 max-w-xl mx-auto">
              Join 4.2 million students already learning on Eduvance. Live classes, expert
              educators, and structured courses — all in one place.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/sign-up-login-screen" className="btn-accent text-base px-8 py-3.5">
                Get Started Free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/course-discovery"
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl px-8 py-3.5 font-600 text-base transition-all duration-150"
              >
                Explore Courses
              </Link>
            </div>

            <p className="text-white/50 text-xs mt-6">
              No credit card required • Cancel anytime • Free plan available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
