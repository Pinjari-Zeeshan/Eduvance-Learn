'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UserCircle2, Mail, GraduationCap, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCurrentUser, getPurchasedCourseIds, signOut, STORE_EVENT } from '@/lib/learningStore';

export default function ProfilePage() {
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    sync();
    window.addEventListener(STORE_EVENT, sync);
    return () => window.removeEventListener(STORE_EVENT, sync);
  }, []);

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <div className="rounded-3xl border border-border bg-card p-10 shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UserCircle2 size={28} />
            </div>
            <h1 className="text-3xl font-800 text-foreground">Profile not available</h1>
            <p className="mt-3 text-muted-foreground">Please sign in to access your learning profile.</p>
            <Link href="/sign-up-login-screen" className="btn-primary mt-6 inline-flex px-6 py-3">
              Go to login
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const boughtCount = getPurchasedCourseIds().length;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-800 text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-600 uppercase tracking-[0.18em] text-primary">Profile</p>
                <h1 className="text-2xl font-800 text-foreground">{user.name}</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-600 text-foreground hover:bg-muted"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-600 text-muted-foreground">
                <UserCircle2 size={16} />
                Role
              </div>
              <p className="mt-3 text-xl font-800 text-foreground">{user.role}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-600 text-muted-foreground">
                <Mail size={16} />
                Email
              </div>
              <p className="mt-3 text-base font-700 text-foreground break-all">{user.email}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-600 text-muted-foreground">
                <GraduationCap size={16} />
                Courses
              </div>
              <p className="mt-3 text-xl font-800 text-foreground">{boughtCount}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/my-courses" className="btn-primary px-5 py-3">
              View my courses
            </Link>
            <Link href="/course-discovery" className="rounded-xl border border-border px-5 py-3 text-sm font-600 text-foreground hover:bg-muted">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
