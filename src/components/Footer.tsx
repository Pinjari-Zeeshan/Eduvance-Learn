import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Courses: [
    { label: 'UPSC Preparation', href: '/course-discovery' },
    { label: 'IIT-JEE', href: '/course-discovery' },
    { label: 'NEET', href: '/course-discovery' },
    { label: 'GATE', href: '/course-discovery' },
    { label: 'SSC & Banking', href: '/course-discovery' },
    { label: 'CAT & MBA', href: '/course-discovery' },
  ],
  Platform: [
    { label: 'Live Classes', href: '#live' },
    { label: 'Practice Tests', href: '#tests' },
    { label: 'Study Material', href: '#material' },
    { label: 'Educators', href: '#educators' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Certificates', href: '#certificates' },
  ],
  Company: [
    { label: 'About Us', href: '#about' },
    { label: 'Careers', href: '#careers' },
    { label: 'Blog', href: '#blog' },
    { label: 'Press', href: '#press' },
    { label: 'Partners', href: '#partners' },
    { label: 'Contact', href: '#contact' },
  ],
  Support: [
    { label: 'Help Center', href: '#help' },
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Refund Policy', href: '#refund' },
    { label: 'Cookie Policy', href: '#cookies' },
    { label: 'Accessibility', href: '#accessibility' },
  ],
};

// Custom SVG social icons (brand icons removed from lucide-react v1)
function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const socialLinks = [
  { icon: <TwitterIcon />, href: '#', label: 'Twitter / X' },
  { icon: <YoutubeIcon />, href: '#', label: 'YouTube' },
  { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
  { icon: <LinkedinIcon />, href: '#', label: 'LinkedIn' },
  { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <AppLogo size={36} />
              <span className="font-extrabold text-xl text-white tracking-tight">Eduvance</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              India&apos;s most trusted online education platform for competitive exams and
              professional skills. Learn from top educators. Build your future.
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5 mb-6">
              <a
                href="mailto:support@eduvance.in"
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={14} className="text-primary shrink-0" />
                support@eduvance.in
              </a>
              <a
                href="tel:1800-123-4567"
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Phone size={14} className="text-primary shrink-0" />
                1800-123-4567 (Toll Free)
              </a>
              <div className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                <span>Koramangala, Bengaluru, Karnataka 560034</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks?.map((social) => (
                <a
                  key={`social-${social?.label}`}
                  href={social?.href}
                  aria-label={social?.label}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-primary text-gray-400 hover:text-white transition-all duration-150"
                >
                  {social?.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks)?.map(([category, links]) => (
            <div key={`footer-col-${category}`}>
              <h4 className="text-white font-600 text-sm mb-4 tracking-wide uppercase text-xs">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links?.map((link) => (
                  <li key={`footer-link-${category}-${link?.label}`}>
                    <Link
                      href={link?.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © 2026 Eduvance Education Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>🇮🇳 Made in India</span>
            <span>•</span>
            <span>ISO 27001 Certified</span>
            <span>•</span>
            <span>UGC Recognised</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
