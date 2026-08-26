'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 'faq-001',
    q: 'Can I access courses offline?',
    a: 'Yes, Plus and Pro plan subscribers can download up to 50 and unlimited videos respectively for offline viewing through the Eduvance mobile app. Downloaded content is available for 30 days.',
  },
  {
    id: 'faq-002',
    q: 'What is the difference between a subscription and buying a course?',
    a: 'A subscription gives you access to live classes, select recorded content, and platform features. Buying an individual course gives you lifetime access to that specific course and all its updates. You can mix both — subscribe for live classes and buy courses you want permanently.',
  },
  {
    id: 'faq-003',
    q: 'How do I get my doubts resolved?',
    a: 'Free users can post doubts on community forums. Plus users get 10 doubt resolution sessions per month via live chat with educators. Pro users get unlimited doubt sessions including 1-on-1 video calls with educators.',
  },
  {
    id: 'faq-004',
    q: 'Is there a refund policy?',
    a: 'We offer a 7-day refund policy for individual course purchases if you have watched less than 20% of the course content. Subscription refunds are processed on a pro-rata basis within the first 15 days. Please contact support@eduvance.in for refund requests.',
  },
  {
    id: 'faq-005',
    q: 'Are the mock tests based on the latest exam pattern?',
    a: 'Yes, all mock tests are updated within 30 days of any official exam pattern change. Our content team monitors official notifications from UPSC, NTA, GATE committee, and other exam bodies and updates question banks accordingly.',
  },
  {
    id: 'faq-006',
    q: 'Can I switch between courses or plans mid-way?',
    a: "You can upgrade your subscription plan at any time — you'll only pay the difference. Downgrading takes effect at the next billing cycle. Individual course access is not affected by subscription changes.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<string | null>('faq-001');

  return (
    <section className="py-16 bg-background" id="faq">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs font-600 text-primary uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-800 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Can&apos;t find your answer?{' '}
              <a
                href="mailto:support@eduvance.in"
                className="text-primary hover:underline font-500"
              >
                Contact our support team
              </a>
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {faqs?.map((faq) => (
              <div
                key={faq?.id}
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                  open === faq?.id ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <button
                  onClick={() => setOpen(open === faq?.id ? null : faq?.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={open === faq?.id}
                >
                  <span className="font-600 text-sm text-foreground pr-4">{faq?.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-primary shrink-0 transition-transform duration-200 ${
                      open === faq?.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    open === faq?.id ? 'max-h-60' : 'max-h-0'
                  }`}
                >
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {faq?.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
