'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, X, Zap, Crown, Star } from 'lucide-react';

const plans = [
  {
    id: 'plan-free',
    name: 'Free',
    tagline: 'Get started for free',
    monthlyPrice: 0,
    annualPrice: 0,
    icon: <Star size={20} />,
    color: 'border-border',
    headerColor: 'bg-muted',
    ctaColor: 'btn-secondary',
    ctaText: 'Start Free',
    popular: false,
    features: [
      { text: 'Access to 50+ free lessons', included: true },
      { text: 'Daily current affairs (UPSC)', included: true },
      { text: '2 mock tests per month', included: true },
      { text: 'Community forums', included: true },
      { text: 'Live class recordings (delayed 7 days)', included: true },
      { text: 'HD video quality', included: false },
      { text: 'Doubt solving sessions', included: false },
      { text: 'Offline downloads', included: false },
      { text: 'Performance analytics', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'plan-plus',
    name: 'Plus',
    tagline: 'For serious aspirants',
    monthlyPrice: 999,
    annualPrice: 7999,
    icon: <Zap size={20} />,
    color: 'border-primary',
    headerColor: 'gradient-primary',
    ctaColor: 'btn-primary',
    ctaText: 'Start Plus',
    popular: true,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Unlimited live class access', included: true },
      { text: 'HD video quality', included: true },
      { text: 'Unlimited mock tests', included: true },
      { text: 'Doubt solving sessions (10/month)', included: true },
      { text: 'Offline downloads (50 videos)', included: true },
      { text: 'Performance analytics', included: true },
      { text: 'Study planner & reminders', included: true },
      { text: 'Priority support (24 hrs)', included: false },
      { text: '1-on-1 mentorship sessions', included: false },
    ],
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    tagline: 'Maximum results guaranteed',
    monthlyPrice: 1999,
    annualPrice: 14999,
    icon: <Crown size={20} />,
    color: 'border-accent',
    headerColor: 'bg-gradient-to-br from-amber-500 to-orange-600',
    ctaColor: 'btn-accent',
    ctaText: 'Start Pro',
    popular: false,
    features: [
      { text: 'Everything in Plus', included: true },
      { text: 'Unlimited doubt solving', included: true },
      { text: 'Unlimited offline downloads', included: true },
      { text: 'Priority support (2 hrs)', included: true },
      { text: '2 mentorship sessions/month', included: true },
      { text: 'Personalized study plan', included: true },
      { text: 'Interview prep & mock interviews', included: true },
      { text: 'Certificate of completion', included: true },
      { text: 'Early access to new courses', included: true },
      { text: 'Dedicated success manager', included: true },
    ],
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="py-16 bg-white" id="pricing">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-600 text-primary uppercase tracking-widest mb-2">Pricing</p>
          <h2 className="text-2xl md:text-3xl font-800 text-foreground">
            Choose Your Learning Plan
          </h2>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Flexible plans for every aspirant. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-muted rounded-xl p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-600 transition-all duration-150 ${
                !annual ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-600 transition-all duration-150 ${
                annual ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Annual
              <span className="bg-success text-white text-[10px] font-700 px-1.5 py-0.5 rounded-full">
                Save 33%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans?.map((plan) => (
            <div
              key={plan?.id}
              className={`relative bg-card rounded-2xl border-2 ${plan?.color} overflow-hidden shadow-card ${
                plan?.popular ? 'shadow-primary scale-[1.02]' : ''
              }`}
            >
              {plan?.popular && (
                <div className="absolute top-0 left-0 right-0 text-center py-1.5 gradient-primary text-white text-xs font-700 uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className={`p-6 ${plan?.popular ? 'pt-10' : ''}`}>
                {/* Plan header */}
                <div className="flex items-center gap-2 mb-1">
                  <span className={`${plan?.popular ? 'text-primary' : 'text-muted-foreground'}`}>
                    {plan?.icon}
                  </span>
                  <h3 className="font-800 text-lg text-foreground">{plan?.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{plan?.tagline}</p>

                {/* Price */}
                <div className="mb-6">
                  {plan?.monthlyPrice === 0 ? (
                    <div className="text-4xl font-800 text-foreground">Free</div>
                  ) : (
                    <>
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-800 text-foreground font-mono-nums">
                          ₹
                          {annual
                            ? Math.floor(plan?.annualPrice / 12)?.toLocaleString('en-IN')
                            : plan?.monthlyPrice?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-muted-foreground text-sm mb-1">/month</span>
                      </div>
                      {annual && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ₹{plan?.annualPrice?.toLocaleString('en-IN')} billed annually
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href="/sign-up-login-screen"
                  className={`${plan?.ctaColor} w-full justify-center py-3 text-sm mb-6 block text-center`}
                >
                  {plan?.ctaText}
                </Link>

                {/* Features */}
                <ul className="space-y-2.5">
                  {plan?.features?.map((feature, fi) => (
                    <li key={`plan-${plan?.id}-feat-${fi}`} className="flex items-start gap-2.5">
                      {feature?.included ? (
                        <Check size={15} className="text-success shrink-0 mt-0.5" />
                      ) : (
                        <X size={15} className="text-muted-foreground/40 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-xs ${feature?.included ? 'text-foreground' : 'text-muted-foreground/60'}`}
                      >
                        {feature?.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Individual courses can also be purchased separately. No subscription required for single
          course purchases.
        </p>
      </div>
    </section>
  );
}
