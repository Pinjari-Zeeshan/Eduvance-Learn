import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseDiscoveryContent from '@/app/course-discovery/components/CourseDiscoveryContent';

export default function CourseDiscoveryPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <CourseDiscoveryContent />
      <Footer />
    </main>
  );
}
