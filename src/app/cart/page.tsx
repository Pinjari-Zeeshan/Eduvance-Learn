'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ShoppingCart, ArrowRight, Trash2, Smartphone, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutModal from '@/components/CheckoutModal';
import { getOriginalPrice } from '@/lib/pricing';
import {
  getCartCourses,
  getCurrentUser,
  removeFromCart,
  STORE_EVENT,
  createOrder,
  completePayment,
  PAYMENT_EVENT,
  isUserAdmin,
  COURSES,
} from '@/lib/learningStore';

export default function CartPage() {
  const [user, setUser] = useState(getCurrentUser());
  const [items, setItems] = useState(getCartCourses());
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  useEffect(() => {
    const sync = () => {
      setUser(getCurrentUser());
      setItems(getCartCourses());
    };

    sync();
    window.addEventListener(STORE_EVENT, sync);
    return () => window.removeEventListener(STORE_EVENT, sync);
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );

  const handleRemoveItem = (courseId: string) => {
    removeFromCart(courseId);
    setItems(getCartCourses());
    toast.info('Course removed from cart');
  };

  const handleCheckout = () => {
    const isAdmin = isUserAdmin();
    if (isAdmin) {
      // For admin, directly add all courses to purchased
      const cartIds = items.map((i) => i.id);
      const order = createOrder(cartIds, 'upi');
      if (order) {
        completePayment(order.id);
        setItems([]);
        toast.success('Courses added to your learning dashboard!');
      }
      return;
    }

    // For regular users, show payment modal
    if (items.length === 0) {
      toast.info('Your cart is empty. Add a course to continue.');
      return;
    }
    const cartIds = items.map((i) => i.id);
    const order = createOrder(cartIds, 'upi');
    if (order) {
      setCurrentOrder(order);
      setIsCheckoutOpen(true);
    }
  };

  const handlePaymentComplete = useCallback(async () => {
    if (!currentOrder) return;
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const success = completePayment(currentOrder.id);
      if (success) {
        setItems([]);
        toast.success('Payment successful! Courses added to your learning dashboard.');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [currentOrder]);

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <div className="rounded-3xl border border-border bg-card p-10 shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingCart size={28} />
            </div>
            <h1 className="text-3xl font-800 text-foreground">Your cart is waiting</h1>
            <p className="mt-3 text-muted-foreground">
              Sign in to save your course picks and complete checkout.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link href="/sign-up-login-screen" className="btn-primary px-6 py-3">
                Sign in
              </Link>
              <Link href="/course-discovery" className="rounded-xl border border-border px-6 py-3 text-sm font-600 text-foreground hover:bg-muted">
                Explore courses
              </Link>
            </div>
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
        <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-600 uppercase tracking-[0.18em] text-primary">Cart</p>
            <h1 className="text-3xl font-800 text-foreground">Ready to start learning</h1>
          </div>
          <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-600 text-primary">
            {items.length} {items.length === 1 ? 'course' : 'courses'}
          </div>
        </header>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <Sparkles size={28} />
            </div>
            <h2 className="text-2xl font-800 text-foreground">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Browse the catalog and add your next course to continue.
            </p>
            <Link href="/course-discovery" className="btn-primary mt-6 inline-flex items-center gap-2 px-6 py-3">
              Explore courses
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
            <div className="space-y-4">
              {items.map((course) => (
                <article key={course.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20 text-sm font-800 text-primary">
                      {course.category}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-800 text-foreground">{course.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        By {course.instructor} • {course.lessons} lessons • {course.duration} mins
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <div className="text-right">
                        <div className="text-xl font-800 text-foreground">₹{course.price.toLocaleString('en-IN')}</div>
                        <div className="text-xs text-muted-foreground line-through">
                          ₹{getOriginalPrice(course.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeFromCart(course.id);
                          setItems(getCartCourses());
                        }}
                        className="inline-flex items-center gap-2 text-sm font-600 text-danger hover:text-danger/80"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-800 text-foreground">Order summary</h2>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-600 text-foreground">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹0</span>
                </div>
              </div>
              <div className="my-5 h-px bg-border" />
              <div className="flex items-center justify-between text-lg font-800 text-foreground">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <button type="button" onClick={handleCheckout} className="btn-primary mt-6 w-full justify-center gap-2 px-4 py-3">
                <Smartphone size={16} />
                {isUserAdmin() ? 'Add to My Courses' : 'Proceed to checkout'}
              </button>
              <Link href="/course-discovery" className="mt-3 block text-center text-sm font-600 text-primary hover:underline">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        totalAmount={total}
        courseCount={items.length}
        courseNames={items.map((c) => c.title)}
        onClose={() => {
          setIsCheckoutOpen(false);
          setCurrentOrder(null);
        }}
        onPaymentComplete={handlePaymentComplete}
        isProcessing={isProcessing}
      />

      <Footer />
    </main>
  );
}
