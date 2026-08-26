'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  Search,
  ShoppingCart,
  Bell,
  Menu,
  X,
  BookOpen,
  Tv,
  ClipboardList,
  Users,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Flame,
  User,
  LogOut,
} from 'lucide-react';
import { getCartCourseIds, getCurrentUser, signOut, STORE_EVENT } from '@/lib/learningStore';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: <LayoutDashboard size={16} /> },
  { label: 'Explore', href: '/course-discovery', icon: <Search size={16} /> },
  { label: 'Courses', href: '/course-discovery', icon: <BookOpen size={16} /> },
  { label: 'Live', href: '#live', icon: <Tv size={16} /> },
  { label: 'Tests', href: '#tests', icon: <ClipboardList size={16} /> },
  { label: 'Educators', href: '#educators', icon: <Users size={16} /> },
];

const NOTIF_COUNT = 3;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [cartCount, setCartCount] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncState = () => {
      setUser(getCurrentUser());
      setCartCount(getCartCourseIds().length);
    };

    syncState();
    window.addEventListener(STORE_EVENT, syncState);
    return () => window.removeEventListener(STORE_EVENT, syncState);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-white border-b border-border'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <AppLogo size={36} />
              <span className="font-extrabold text-xl tracking-tight text-primary hidden sm:block">
                Eduvance
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 ml-6">
              {navItems.map((item) => (
                <Link
                  key={`nav-${item.label}`}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-500 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-150"
                >
                  {item.label}
                  {item.label === 'Live' && (
                    <span className="flex items-center gap-0.5 bg-danger text-white text-[10px] font-700 px-1.5 py-0.5 rounded-full">
                      <Flame size={8} />
                      LIVE
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search Bar (desktop) */}
            <div className="hidden md:flex items-center relative">
              {searchOpen ? (
                <div className="flex items-center bg-muted rounded-xl px-3 py-2 gap-2 w-64 xl:w-80 border border-border">
                  <Search size={16} className="text-muted-foreground shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, educators..."
                    className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close search"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-muted-foreground px-3 py-2 rounded-xl text-sm transition-all duration-150 border border-border"
                  aria-label="Open search"
                >
                  <Search size={16} />
                  <span className="hidden xl:block">Search...</span>
                  <kbd className="hidden xl:flex items-center gap-0.5 text-[10px] bg-white px-1.5 py-0.5 rounded border border-border font-mono">
                    ⌘K
                  </kbd>
                </button>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-xl hover:bg-muted transition-all duration-150 group"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingCart
                size={20}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center bg-primary text-white text-[10px] font-700 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-xl hover:bg-muted transition-all duration-150 group hidden md:flex"
              aria-label={`${NOTIF_COUNT} notifications`}
            >
              <Bell
                size={20}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              />
              {NOTIF_COUNT > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center bg-danger text-white text-[10px] font-700 rounded-full">
                  {NOTIF_COUNT}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/my-courses"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-600 text-foreground hover:bg-primary/5 rounded-xl transition-all duration-150"
                >
                  <BookOpen size={15} />
                  My Courses
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-sm font-600 text-foreground hover:bg-primary/5 transition-all duration-150"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-[11px] font-700">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-600 text-muted-foreground hover:bg-danger/5 hover:text-danger rounded-xl transition-all duration-150"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/sign-up-login-screen"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-600 text-primary hover:bg-primary/5 rounded-xl transition-all duration-150"
                >
                  <LogIn size={15} />
                  Sign In
                </Link>
                <Link href="/sign-up-login-screen" className="btn-primary py-2 px-4 text-sm">
                  <UserPlus size={15} />
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-muted transition-all duration-150"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'max-h-screen border-t border-border' : 'max-h-0'
          } bg-white`}
        >
          <div className="px-4 py-3 space-y-1">
            {/* Mobile Search */}
            <div className="flex items-center bg-muted rounded-xl px-3 py-2.5 gap-2 mb-3 border border-border">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses, educators..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
              />
            </div>

            {navItems.map((item) => (
              <Link
                key={`mobile-nav-${item.label}`}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 text-foreground hover:bg-primary/5 hover:text-primary transition-all duration-150"
              >
                <span className="text-primary">{item.icon}</span>
                {item.label}
                {item.label === 'Live' && (
                  <span className="ml-auto bg-danger text-white text-[10px] font-700 px-1.5 py-0.5 rounded-full">
                    LIVE
                  </span>
                )}
              </Link>
            ))}

            {user ? (
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border bg-muted text-foreground font-600 text-sm"
                >
                  <User size={15} />
                  {user.name}
                </Link>
                <Link
                  href="/my-courses"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-border text-foreground font-600 text-sm hover:bg-primary/5"
                >
                  My Courses
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl border border-border text-danger font-600 text-sm hover:bg-danger/5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <Link
                  href="/sign-up-login-screen"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border-2 border-primary text-primary font-600 text-sm hover:bg-primary hover:text-white transition-all duration-150"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up-login-screen"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center py-2.5 text-sm"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
