'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, memo, useCallback } from 'react';
import { notFound, useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CalendarCheck2,
  Clock3,
  GraduationCap,
  Plus,
  Sparkles,
  Star,
  Upload,
  Users,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COURSES, getCurrentUser, getPurchasedCourseIds } from '@/lib/learningStore';

interface UploadedMediaItem {
  id: string;
  title: string;
  thumbnail: Blob;
  video: Blob;
}

const DB_NAME = 'eduvance-course-media';
const STORE_NAME = 'media';

// Course content moved outside component to avoid recreating on every render
const courseContent: Record<string, { title: string; overview: string; pageSections: string[] }> = {
  'course-001': {
    title: 'GATE Complete Preparation Course',
    overview:
      'Master GATE with structured learning, expert guidance and smart preparation. This course follows a clear concept-first, problem-solving-driven strategy to help students strengthen fundamentals and improve performance in the exam.',
    pageSections: [
      '# GATE Complete Preparation Course',
      '### Master GATE with Structured Learning, Expert Guidance & Smart Preparation',
      '**Prepare smarter. Learn systematically. Perform with confidence.**',
      'The **GATE (Graduate Aptitude Test in Engineering)** is one of India\'s most important examinations for engineering and science graduates. A strong GATE score can open opportunities for postgraduate education at premier institutes, recruitment opportunities in participating organizations, and advanced academic and professional pathways.',
      'Our **GATE Complete Preparation Course** is designed to provide structured preparation through comprehensive lectures, conceptual learning, practice, revision, mock tests, study material and performance analysis.',
      '---',
      '## About GATE',
      '**GATE — Graduate Aptitude Test in Engineering** — is a national-level examination that primarily evaluates a candidate\'s understanding of undergraduate-level concepts in engineering, technology, science, architecture, commerce and related disciplines, depending on the examination paper.',
      'The examination is jointly organized by the **IISc and seven IITs** on behalf of the National Coordination Board.',
      'GATE scores are used by institutes and organizations for purposes such as:',
      '- Admission to postgraduate programs',
      '- M.Tech/M.E./M.Arch and related programs',
      '- Research and higher studies',
      '- Scholarships/financial assistance subject to applicable rules',
      '- Recruitment opportunities in participating organizations',
      '- Academic specialization',
      '- Career advancement',
      '---',
      '# Start Your GATE Preparation Today',
      'Build your concepts, practice consistently, analyze your performance, revise intelligently.',
      'For other courses, make your own context.'
    ]
  }
};

const openMediaDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'courseId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open media store'));
  });

const readCourseMedia = async (courseId: string): Promise<UploadedMediaItem[]> => {
  if (typeof window === 'undefined' || !('indexedDB' in window)) return [];
  try {
    const db = await openMediaDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(courseId);
      request.onsuccess = () => resolve(request.result?.items ?? []);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
};

const saveCourseMedia = async (courseId: string, items: UploadedMediaItem[]) => {
  if (typeof window === 'undefined' || !('indexedDB' in window)) return;
  const db = await openMediaDb();
  return new Promise<void>((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const request = tx.objectStore(STORE_NAME).put({ courseId, items });
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
  });
};

// Memoized media card with proper URL cleanup
const MediaCard = memo(
  ({ item, onRemove }: { item: UploadedMediaItem; onRemove: (id: string) => void }) => {
    const urls = useMemo(() => ({
      thumbnail: URL.createObjectURL(item.thumbnail),
      video: URL.createObjectURL(item.video),
    }), [item.thumbnail, item.video]);

    useEffect(() => {
      return () => {
        URL.revokeObjectURL(urls.thumbnail);
        URL.revokeObjectURL(urls.video);
      };
    }, [urls]);

    return (
      <div className="group relative min-w-[260px] max-w-[260px] overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
          aria-label={`Remove ${item.title}`}
        >
          <X size={14} />
        </button>
        <div className="h-36 overflow-hidden bg-muted">
          <img src={urls.thumbnail} alt={item.title} className="h-full w-full object-cover" />
        </div>
        <div className="p-3">
          <p className="text-sm font-700 text-foreground">{item.title}</p>
          <video controls className="mt-3 h-28 w-full rounded-xl bg-black object-cover">
            <source src={urls.video} />
          </video>
        </div>
      </div>
    );
  }
);
MediaCard.displayName = 'MediaCard';

// Memoized markdown renderer
const MarkdownSection = memo(({ section, index }: { section: string; index: number }) => {
  if (section.startsWith('# ')) return <h1 key={index} className="mt-8 first:mt-0">{section.replace('# ', '')}</h1>;
  if (section.startsWith('## ')) return <h2 key={index} className="mt-8">{section.replace('## ', '')}</h2>;
  if (section.startsWith('### ')) return <h3 key={index} className="mt-6">{section.replace('### ', '')}</h3>;
  if (section.startsWith('---')) return <hr key={index} className="my-6 border-border" />;
  if (section.startsWith('- ')) return <li key={index} className="ml-6 list-disc">{section.replace('- ', '')}</li>;
  if (section.startsWith('**') && section.endsWith('**')) return <p key={index} className="mt-4 font-700"><strong>{section.slice(2, -2)}</strong></p>;
  if (section.includes('**')) {
    const html = section.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <p key={index} className="mt-4" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <p key={index} className="mt-4">{section}</p>;
});
MarkdownSection.displayName = 'MarkdownSection';

export default function CoursePreviewPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId;
  
  const course = useMemo(
    () => COURSES.find((item) => item.id === courseId) ?? null,
    [courseId]
  );

  const user = getCurrentUser();
  const purchasedIds = getPurchasedCourseIds();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<UploadedMediaItem[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!courseId) return;
    let isMounted = true;
    readCourseMedia(courseId).then((items) => {
      if (isMounted) setMediaItems(items);
    });
    return () => { isMounted = false; };
  }, [courseId]);

  const handleRemoveMedia = useCallback(async (id: string) => {
    if (!courseId) return;
    const nextItems = mediaItems.filter((item) => item.id !== id);
    await saveCourseMedia(courseId, nextItems);
    setMediaItems(nextItems);
  }, [courseId, mediaItems]);

  const handleSubmitMedia = useCallback(async () => {
    if (!courseId || !formTitle.trim() || !thumbnailFile || !videoFile) {
      setUploadError('Please fill all fields');
      return;
    }

    if (thumbnailFile.size > 1024 * 1024 || videoFile.size > 100 * 1024 * 1024) {
      setUploadError('File size exceeds limit');
      return;
    }

    try {
      const nextItem: UploadedMediaItem = {
        id: `${Date.now()}`,
        title: formTitle.trim(),
        thumbnail: thumbnailFile,
        video: videoFile,
      };
      const nextItems = [...mediaItems, nextItem];
      await saveCourseMedia(courseId, nextItems);
      setMediaItems(nextItems);
      setFormTitle('');
      setThumbnailFile(null);
      setVideoFile(null);
      setUploadError('');
      setIsUploadOpen(false);
    } catch {
      setUploadError('Upload failed. Try again.');
    }
  }, [courseId, formTitle, thumbnailFile, videoFile, mediaItems]);

  if (!course || !user || !purchasedIds.includes(course.id)) {
    return notFound();
  }

  const content = courseContent[course.id] ?? {
    title: course.title,
    overview: 'Expert-led course with comprehensive learning materials.',
    pageSections: ['# Course Overview', 'This course includes structured learning, practice and progress tracking.']
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href="/my-courses" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-600 text-foreground hover:bg-muted">
            <ArrowLeft size={15} />
            Back to My Courses
          </Link>
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-600 text-white shadow-sm"
          >
            <Plus size={15} />
            Add lesson
          </button>
        </div>

        <header className="overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-700 uppercase tracking-[0.16em] text-primary">
                <BookOpen size={12} />
                {course.category}
              </div>
              <h1 className="text-3xl font-800 text-foreground sm:text-4xl">{content.title}</h1>
              <p className="mt-4 text-base text-muted-foreground">{content.overview}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><Star size={14} className="text-accent" /> {course.rating} rating</span>
                <span className="inline-flex items-center gap-2"><Users size={14} className="text-primary" /> {course.learners.toLocaleString()} learners</span>
                <span className="inline-flex items-center gap-2"><Clock3 size={14} className="text-info" /> {course.duration} mins</span>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-primary/15 via-background to-secondary/10 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-600 text-muted-foreground">Instructor</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-700 text-primary shadow-sm">{course.instructor}</span>
              </div>
              <div className="space-y-3 text-sm text-foreground">
                <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 shadow-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground"><CalendarCheck2 size={14} /> Duration</span>
                  <span className="font-700">{course.duration} mins</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 shadow-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground"><GraduationCap size={14} /> Difficulty</span>
                  <span className="font-700">{course.difficulty}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 shadow-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground"><Sparkles size={14} /> Lessons</span>
                  <span className="font-700">{course.lessons}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {mediaItems.length > 0 && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-800 text-foreground">Course videos</h2>
              <span className="text-xs font-600 text-muted-foreground">{mediaItems.length} uploaded</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {mediaItems.map((item) => (
                <MediaCard key={item.id} item={item} onRemove={handleRemoveMedia} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <article className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="prose prose-slate max-w-none text-foreground prose-headings:font-800 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7 prose-li:leading-7 prose-strong:text-foreground">
              {content.pageSections.map((section, index) => (
                <MarkdownSection key={index} section={section} index={index} />
              ))}
            </div>
          </article>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-800 text-foreground">Course highlights</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-accent" /> Structured syllabus</li>
                <li className="flex items-center gap-2"><BookOpen size={14} className="text-primary" /> Practice questions</li>
                <li className="flex items-center gap-2"><GraduationCap size={14} className="text-secondary" /> Mock tests & analytics</li>
                <li className="flex items-center gap-2"><Clock3 size={14} className="text-info" /> Self-paced learning</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-800 text-foreground">Exam focus</h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="rounded-xl bg-muted/40 p-3">General aptitude, engineering mathematics and subject-specific preparation.</div>
                <div className="rounded-xl bg-muted/40 p-3">Previous-year problem solving and mock-test analysis.</div>
                <div className="rounded-xl bg-muted/40 p-3">Revision strategy built around concept clarity and speed.</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-800 text-foreground">Add course media</h3>
              <button
                type="button"
                onClick={() => { setIsUploadOpen(false); setUploadError(''); }}
                className="rounded-full p-2 hover:bg-muted"
                aria-label="Close upload form"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-600 text-foreground">Title</label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Week 1: Engineering Maths"
                  className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none ring-0 transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-600 text-foreground">Thumbnail image</label>
                <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-600 file:text-white"
                  />
                  <p className="mt-2 text-[11px] text-muted-foreground">Max size: 1MB</p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-600 text-foreground">Video upload</label>
                <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-600 file:text-white"
                  />
                  <p className="mt-2 text-[11px] text-muted-foreground">Max size: 100MB</p>
                </div>
              </div>

              {uploadError && (
                <div className="rounded-xl border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
                  {uploadError}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmitMedia}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-700 text-white"
              >
                <Upload size={15} />
                Upload media
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
