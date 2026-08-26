'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
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

const openMediaDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available in this browser.'));
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
    const result = await new Promise<{ courseId: string; items: UploadedMediaItem[] } | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(courseId);
      request.onsuccess = () => resolve((request.result as { courseId: string; items: UploadedMediaItem[] } | undefined) ?? null);
      request.onerror = () => reject(request.error ?? new Error('Failed to read course media'));
    });

    return result?.items ?? [];
  } catch {
    return [];
  }
};

const saveCourseMedia = async (courseId: string, items: UploadedMediaItem[]) => {
  if (typeof window === 'undefined' || !('indexedDB' in window)) return;

  const db = await openMediaDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put({ courseId, items });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Failed to save course media'));
  });
};

const getObjectUrl = (blob: Blob) => URL.createObjectURL(blob);

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
      'Eligibility, participating institutes, admission requirements and recruitment criteria can vary. Students should always check the latest official notification and the individual institute/organization requirements before applying.',
      '---',
      '# Why Prepare for GATE?',
      'GATE is more than just an entrance examination.',
      'A strong preparation strategy helps students develop:',
      '- Strong engineering fundamentals',
      '- Problem-solving ability',
      '- Analytical thinking',
      '- Mathematical skills',
      '- Time-management skills',
      '- Conceptual clarity',
      '- Examination temperament',
      'A good GATE score can help students explore opportunities in:',
      '### Higher Education',
      'Admission opportunities in postgraduate programs at leading institutes, subject to individual institute eligibility and admission criteria.',
      '### Research',
      'GATE can support pathways toward advanced study and research opportunities where applicable.',
      '### Public-Sector Opportunities',
      'Some organizations use GATE scores as part of their recruitment process. Requirements, accepted papers, cut-offs and selection procedures vary by organization and year.',
      '### Career Specialization',
      'GATE preparation can strengthen fundamentals that are valuable for engineering and technical careers.',
      '---',
      '# GATE Examination Structure',
      'The exact examination pattern and rules are subject to the official notification for the relevant year.',
      'The typical GATE computer-based examination includes:',
      '### General Aptitude',
      'Questions designed to evaluate:',
      '- Verbal ability',
      '- Numerical ability',
      '- Analytical reasoning',
      '- Basic comprehension',
      '### Engineering Mathematics',
      'For applicable engineering papers, mathematics forms an important part of preparation and typically covers relevant undergraduate mathematical concepts.',
      '### Subject-Specific Section',
      'The remaining portion focuses on the candidate\'s selected GATE paper and its prescribed syllabus.',
      '---',
      '# Question Types',
      'GATE generally uses different types of questions, including:',
      '### MCQ — Multiple Choice Questions',
      'Questions with multiple options where the candidate selects the correct answer.',
      '### MSQ — Multiple Select Questions',
      'Questions where one or more options may be correct.',
      '### NAT — Numerical Answer Type',
      'Questions where the candidate enters a numerical answer instead of selecting an option.',
      'Students should understand the difference between these question types because their answering methods and marking rules can differ.',
      '---',
      '# Marking & Negative Marking',
      'Candidates should carefully understand the official marking scheme for their examination year.',
      'Depending on the question type, negative marking may apply to certain incorrect MCQ responses, while other question types may have different evaluation rules.',
      'Our course therefore emphasizes:',
      '- Accuracy',
      '- Question selection',
      '- Time management',
      '- Avoiding unnecessary attempts',
      '- Numerical problem-solving',
      '- Previous-year question practice',
      '**Always refer to the latest official GATE notification for the exact marking scheme applicable to your examination.**',
      '---',
      '# GATE Preparation Strategy',
      'Our preparation methodology follows a structured five-stage approach:',
      '## 01 — Concept Building',
      'Develop strong fundamentals from the basics.',
      'Students learn:',
      '- Core concepts',
      '- Important definitions',
      '- Fundamental formulas',
      '- Theoretical foundations',
      '- Practical applications',
      '---',
      '## 02 — Problem Solving',
      'After learning a concept, students solve progressively challenging problems.',
      'Practice includes:',
      '- Basic questions',
      '- Conceptual questions',
      '- Numerical problems',
      '- Previous-year questions',
      '- Application-based problems',
      '---',
      '## 03 — Previous-Year Questions',
      'Previous-year GATE questions are an essential part of preparation.',
      'Students analyze:',
      '- Frequently tested concepts',
      '- Question patterns',
      '- Difficulty levels',
      '- Numerical approaches',
      '- Common mistakes',
      '- Important topics',
      '---',
      '## 04 — Revision',
      'Structured revision helps students retain concepts for the long term.',
      'Our revision approach includes:',
      '- Short notes',
      '- Formula revision',
      '- Topic-wise revision',
      '- Weak-topic revision',
      '- Rapid revision sessions',
      '- Important-question practice',
      '---',
      '## 05 — Mock Tests & Analysis',
      'Regular mock tests help students simulate the examination environment.',
      'After every test, students can analyze:',
      '- Score',
      '- Accuracy',
      '- Attempt rate',
      '- Time spent',
      '- Correct answers',
      '- Incorrect answers',
      '- Unattempted questions',
      '- Topic-wise performance',
      '- Areas requiring improvement',
      '---',
      '# What You Will Learn',
      'The course is designed to cover the complete syllabus relevant to the selected GATE paper.',
      'Depending on the chosen paper, the curriculum can include:',
      '### General Aptitude',
      '- Verbal Aptitude',
      '- Quantitative Aptitude',
      '- Analytical Reasoning',
      '- Spatial/Logical reasoning',
      '- Basic comprehension',
      '### Engineering Mathematics',
      'Relevant topics such as:',
      '- Linear Algebra',
      '- Calculus',
      '- Differential Equations',
      '- Probability & Statistics',
      '- Numerical Methods',
      '- Discrete Mathematics',
      'The exact mathematics syllabus depends on the selected GATE paper.',
      '### Core Engineering Subjects',
      'For **GATE Computer Science & Information Technology (CS)**, the course can cover:',
      '- Engineering Mathematics',
      '- Digital Logic',
      '- Computer Organization & Architecture',
      '- Programming & Data Structures',
      '- Algorithms',
      '- Theory of Computation',
      '- Compiler Design',
      '- Operating Systems',
      '- Databases',
      '- Computer Networks',
      'For other GATE papers, the course curriculum should dynamically display the corresponding official syllabus.',
      '---',
      '# GATE CS Preparation — Detailed Coverage',
      'For students preparing specifically for **GATE CSE**, the course can be organized into the following modules:',
      '## Engineering Mathematics',
      '- Linear Algebra',
      '- Calculus',
      '- Probability',
      '- Statistics',
      '- Discrete Mathematics',
      '## Digital Logic',
      '- Boolean Algebra',
      '- Logic Gates',
      '- Combinational Circuits',
      '- Sequential Circuits',
      '- Number Systems',
      '- Digital Arithmetic',
      '## Computer Organization & Architecture',
      '- Instruction Set Architecture',
      '- CPU Organization',
      '- Memory Hierarchy',
      '- Cache',
      '- Pipelining',
      '- Input/Output',
      '- Addressing Modes',
      '## Programming & Data Structures',
      '- C Programming',
      '- Arrays',
      '- Linked Lists',
      '- Stacks',
      '- Queues',
      '- Trees',
      '- Graphs',
      '- Hashing',
      '## Algorithms',
      '- Searching',
      '- Sorting',
      '- Greedy Algorithms',
      '- Dynamic Programming',
      '- Divide & Conquer',
      '- Graph Algorithms',
      '- Complexity Analysis',
      '## Theory of Computation',
      '- Regular Languages',
      '- Finite Automata',
      '- Context-Free Grammars',
      '- Pushdown Automata',
      '- Turing Machines',
      '- Decidability',
      '## Compiler Design',
      '- Lexical Analysis',
      '- Parsing',
      '- Syntax-Directed Translation',
      '- Runtime Environments',
      '- Intermediate Code',
      '- Code Optimization',
      '## Operating Systems',
      '- Processes',
      '- Threads',
      '- CPU Scheduling',
      '- Synchronization',
      '- Deadlocks',
      '- Memory Management',
      '- Virtual Memory',
      '- File Systems',
      '## Databases',
      '- ER Model',
      '- Relational Model',
      '- SQL',
      '- Relational Algebra',
      '- Functional Dependencies',
      '- Normalization',
      '- Transactions',
      '- Concurrency Control',
      '## Computer Networks',
      '- Network Models',
      '- Data Link Layer',
      '- Network Layer',
      '- Transport Layer',
      '- Application Layer',
      '- Routing',
      '- TCP/IP',
      '- Congestion Control',
      '- Network Security Fundamentals',
      '---',
      '# Course Features',
      '## 🎥 Comprehensive Video Lectures',
      'Learn concepts through structured video lessons designed for progressive understanding.',
      '---',
      '## 📚 Digital Study Material',
      'Access:',
      '- Lecture notes',
      '- Formula sheets',
      '- Topic summaries',
      '- Practice material',
      '- Important questions',
      '- Revision notes',
      '---',
      '## 📝 Practice Questions',
      'Practice questions after each major topic help reinforce concepts.',
      '---',
      '## 🧠 Previous-Year Questions',
      'Solve carefully selected GATE questions and understand the approach required to solve them efficiently.',
      '---',
      '## ⏱️ Mock Tests',
      'Attempt timed mock tests designed to simulate the actual examination environment.',
      '---',
      '## 📊 Performance Analytics',
      'Track:',
      '- Score',
      '- Accuracy',
      '- Completion',
      '- Topic performance',
      '- Test performance',
      '- Weak areas',
      '- Improvement trends',
      '---',
      '## ❓ Doubt Support',
      'Students can raise questions related to:',
      '- Concepts',
      '- Numerical problems',
      '- Previous-year questions',
      '- Test questions',
      '---',
      '## 🔄 Structured Revision',
      'Follow dedicated revision modules before the examination.',
      '---',
      '# Suggested Learning Path',
      'Follow this recommended sequence:',
      '### Phase 1 — Foundation',
      'Build fundamental concepts.',
      '### Phase 2 — Core Subjects',
      'Complete the major syllabus topics.',
      '### Phase 3 — Practice',
      'Solve topic-wise questions.',
      '### Phase 4 — Previous-Year Questions',
      'Analyze previous GATE questions.',
      '### Phase 5 — Revision',
      'Revise important concepts and formulas.',
      '### Phase 6 — Mock Tests',
      'Attempt full-length tests under timed conditions.',
      '### Phase 7 — Final Revision',
      'Focus on:',
      '- Weak topics',
      '- Important formulas',
      '- Frequently tested concepts',
      '- Previous mistakes',
      '- Time management',
      '---',
      '# Who Should Take This Course?',
      'This course is suitable for:',
      '### Engineering Students',
      'Students pursuing engineering degrees who want structured GATE preparation.',
      '### Final-Year Students',
      'Students preparing alongside their final-year academics.',
      '### Graduates',
      'Engineering graduates preparing for postgraduate opportunities or other GATE-related pathways.',
      '### Repeat Aspirants',
      'Students attempting GATE again and looking for a more structured preparation strategy.',
      '### Beginners',
      'Students who want to start preparation from fundamentals.',
      '---',
      '# Course Duration',
      '**Flexible Self-Paced Learning**',
      'The course can be completed according to the student\'s individual preparation schedule.',
      'Recommended preparation:',
      '**6–12 months**',
      'depending on:',
      '- Current preparation level',
      '- Selected GATE paper',
      '- Available study time',
      '- Target score',
      '- Previous academic foundation',
      '---',
      '# Recommended Daily Study Plan',
      'A student can structure preparation approximately as follows:',
      '### 2 Hours',
      'Concept learning',
      '### 1–2 Hours',
      'Problem solving',
      '### 30–60 Minutes',
      'Previous-year questions',
      '### 30 Minutes',
      'Revision',
      '### Weekly',
      'Mock test + detailed analysis',
      'The exact schedule should be customized according to the student\'s availability and preparation level.',
      '---',
      '# What Makes This Course Different?',
      '### Structured Learning',
      'Follow a planned sequence instead of studying randomly.',
      '### Concept First',
      'Understand the concept before memorizing formulas.',
      '### Practice Driven',
      'Every major topic is reinforced through questions.',
      '### Data-Based Improvement',
      'Use test analytics to identify strengths and weaknesses.',
      '### Exam-Oriented Preparation',
      'Focus on concepts and problem-solving patterns relevant to GATE.',
      '### Flexible Learning',
      'Study at your own pace and revisit difficult topics whenever required.',
      '---',
      '# Course Pricing',
      '## GATE Complete Preparation Course',
      '### ₹8,999/-',
      'Original Price:',
      '~~₹12,999~~',
      '### Included:',
      '✓ Complete course curriculum',
      '✓ Video lectures',
      '✓ Study material',
      '✓ Previous-year questions',
      '✓ Practice questions',
      '✓ Mock tests',
      '✓ Performance analytics',
      '✓ Doubt support',
      '✓ Progress tracking',
      '✓ Course completion tracking',
      '**One-time course purchase**',
      '---',
      '# Course Outcome',
      'By completing this course, students should aim to develop:',
      '- Strong conceptual foundations',
      '- Better numerical problem-solving ability',
      '- Familiarity with GATE-style questions',
      '- Improved examination strategy',
      '- Better time management',
      '- Awareness of weak and strong areas',
      '- Confidence in attempting full-length examinations',
      'Course completion does not guarantee a particular GATE rank, score, admission, scholarship or recruitment outcome. Results depend on individual preparation, performance, eligibility and applicable rules.',
      '---',
      '# Frequently Asked Questions',
      '### What is GATE?',
      'GATE stands for Graduate Aptitude Test in Engineering. It is a national-level examination used for various higher-education and other opportunities, depending on the paper and applicable rules.',
      '### Who can prepare for GATE?',
      'Eligibility depends on the official rules for the relevant examination year. Students should check the latest official GATE notification before applying.',
      '### Is this course suitable for beginners?',
      'Yes. The course is structured to build concepts progressively, although students should review the prerequisites relevant to their selected GATE paper.',
      '### Does the course include previous-year questions?',
      'Yes. Previous-year questions are an important part of the preparation strategy.',
      '### Are mock tests included?',
      'Yes. The course includes mock-test and performance-analysis components as specified by the course package.',
      '### Can I study at my own pace?',
      'Yes. The platform supports self-paced learning for recorded content.',
      '### Can I track my progress?',
      'Yes. Students can monitor course completion, lesson progress and test performance through the dashboard.',
      '### Is the course valid for every GATE paper?',
      'The syllabus is paper-specific. Students should select the appropriate GATE paper and corresponding curriculum.',
      '### Does purchasing the course guarantee a GATE rank?',
      'No. Course enrollment does not guarantee a particular score or rank. Results depend on individual preparation and examination performance.',
      '---',
      '# Start Your GATE Preparation Today',
      '## Your GATE journey starts with one strong decision.',
      'Build your concepts.',
      'Practice consistently.',
      'Analyze your performance.',
      'Revise intelligently.',
      'And walk into the examination with confidence.',
      '### **Join the GATE Complete Preparation Course**',
      '**₹8,999/-**',
      '**Start Learning**',
      'For other courses, make your own context.'
    ]
  }
};

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
    const loadMedia = async () => {
      const items = await readCourseMedia(courseId);
      if (isMounted) {
        setMediaItems(items);
      }
    };

    loadMedia();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  if (!course || !user || !purchasedIds.includes(course.id)) {
    return notFound();
  }

  const content = courseContent[course.id] ?? {
    title: course.title,
    overview: 'This course includes expert-led lessons, practice, mock tests, and revision support tailored to your preparation goals.',
    pageSections: [
      '# Course Overview',
      'This course includes structured learning, practice and progress tracking.',
      '## What you will learn',
      '- Expert-led instruction',
      '- Concept-based practice',
      '- Performance analytics',
      '- Structured revision'
    ]
  };

  const handleSubmitMedia = async () => {
    if (!courseId) return;

    if (!formTitle.trim()) {
      setUploadError('Please enter a title for this course video.');
      return;
    }

    if (!thumbnailFile) {
      setUploadError('Please upload a thumbnail image under 1MB.');
      return;
    }

    if (!videoFile) {
      setUploadError('Please upload a video file under 100MB.');
      return;
    }

    if (thumbnailFile.size > 1024 * 1024) {
      setUploadError('Thumbnail image must be less than 1MB.');
      return;
    }

    if (videoFile.size > 100 * 1024 * 1024) {
      setUploadError('Video must be less than 100MB.');
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
      setUploadError('Something went wrong while uploading the files. Please try again.');
    }
  };

  const handleRemoveMedia = async (id: string) => {
    if (!courseId) return;
    const nextItems = mediaItems.filter((item) => item.id !== id);
    await saveCourseMedia(courseId, nextItems);
    setMediaItems(nextItems);
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
                <div key={item.id} className="group relative min-w-[260px] max-w-[260px] overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(item.id)}
                    className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                    aria-label={`Remove ${item.title}`}
                  >
                    <X size={14} />
                  </button>
                  <div className="h-36 overflow-hidden bg-muted">
                    <img src={getObjectUrl(item.thumbnail)} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-700 text-foreground">{item.title}</p>
                    <video controls className="mt-3 h-28 w-full rounded-xl bg-black object-cover">
                      <source src={getObjectUrl(item.video)} />
                    </video>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <article className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="prose prose-slate max-w-none text-foreground prose-headings:font-800 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7 prose-li:leading-7 prose-strong:text-foreground">
              {content.pageSections.map((section, index) => {
                if (section.startsWith('# ')) {
                  return <h1 key={`${section}-${index}`} className="mt-8 first:mt-0">{section.replace('# ', '')}</h1>;
                }
                if (section.startsWith('## ')) {
                  return <h2 key={`${section}-${index}`} className="mt-8">{section.replace('## ', '')}</h2>;
                }
                if (section.startsWith('### ')) {
                  return <h3 key={`${section}-${index}`} className="mt-6">{section.replace('### ', '')}</h3>;
                }
                if (section.startsWith('---')) {
                  return <hr key={`${section}-${index}`} className="my-6 border-border" />;
                }
                if (section.startsWith('- ')) {
                  return <li key={`${section}-${index}`} className="ml-6 list-disc">{section.replace('- ', '')}</li>;
                }
                if (section.startsWith('**') && section.endsWith('**')) {
                  return <p key={`${section}-${index}`} className="mt-4 font-700"><strong>{section.slice(2, -2)}</strong></p>;
                }
                if (section.includes('**') && section.includes('**')) {
                  const formatted = section.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  return <p key={`${section}-${index}`} className="mt-4" dangerouslySetInnerHTML={{ __html: formatted }} />;
                }
                return <p key={`${section}-${index}`} className="mt-4">{section}</p>;
              })}
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
                onClick={() => {
                  setIsUploadOpen(false);
                  setUploadError('');
                }}
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
