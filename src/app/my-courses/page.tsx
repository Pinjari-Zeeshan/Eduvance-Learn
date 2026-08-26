'use client';

import Link from 'next/link';
import { useEffect, useState, memo } from 'react';
import { BookOpen, PlayCircle, GraduationCap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCurrentUser, getPurchasedCourses, STORE_EVENT, Course } from '@/lib/learningStore';
import { getOriginalPrice } from '@/lib/pricing';

const CourseCard = memo(({ course }: { course: Course }) => (
  <article className="rounded-3xl border border-border bg-card p-4 shadow-sm">
    <div className="mb-4 flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20 text-center text-sm font-800 text-primary">
      {course.category}
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-700 uppercase tracking-[0.12em] text-primary">
          {course.category}
        </span>
        <span className="text-xs text-muted-foreground">{course.lessons} lessons</span>
      </div>
      <h2 className="text-lg font-800 text-foreground">{course.title}</h2>
      <p className="text-sm text-muted-foreground">By {course.instructor}</p>
      <div className="flex items-center justify-between pt-3">
        <div>
          <span className="text-sm font-600 text-foreground">₹{course.price.toLocaleString('en-IN')}</span>
          <span className="ml-1.5 text-xs text-muted-foreground line-through">
            ₹{getOriginalPrice(course.price).toLocaleString('en-IN')}
          </span>
        </div>
        <Link
          href={`/my-courses/${course.id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-600 text-white"
        >
          <PlayCircle size={14} />
          Continue
        </Link>
      </div>
    </div>
  </article>
));
CourseCard.displayName = 'CourseCard';

export default function MyCoursesPage() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setCourses(getPurchasedCourses());
    } else {
      setCourses([]);
    }

    const handleStoreChange = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
      setCourses(updatedUser ? getPurchasedCourses() : []);
    };

    window.addEventListener(STORE_EVENT, handleStoreChange);
    return () => window.removeEventListener(STORE_EVENT, handleStoreChange);
  }, []);

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <div className="rounded-3xl border border-border bg-card p-10 shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-3xl font-800 text-foreground">Your learning dashboard is locked</h1>
            <p className="mt-3 text-muted-foreground">
              Sign in to view only the courses you have purchased.
            </p>
            <Link href="/sign-up-login-screen" className="btn-primary mt-6 inline-flex px-6 py-3">
              Sign in to continue
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <p className="text-sm font-600 uppercase tracking-[0.18em] text-primary">My courses</p>
          <h1 className="mt-2 text-3xl font-800 text-foreground">Welcome back, {user.name.split(' ')[0]}</h1>
        </header>

        {courses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <BookOpen size={28} />
            </div>
            <h2 className="text-2xl font-800 text-foreground">No courses purchased yet</h2>
            <p className="mt-2 text-muted-foreground">
              Your purchased courses will appear here as soon as you complete checkout.
            </p>
            <Link href="/course-discovery" className="btn-primary mt-6 inline-flex px-6 py-3">
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
