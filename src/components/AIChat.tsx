'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, BookOpen, MessageCircle, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { COURSES, getCartCourseIds, getCurrentUser, STORE_EVENT } from '@/lib/learningStore';

type ChatMessage = {
  id: number;
  role: 'assistant' | 'user';
  content: string;
};

const starterMessage: ChatMessage = {
  id: 1,
  role: 'assistant',
  content:
    'Hi! I’m Eduvance Assist. Ask me about courses, pricing, checkout, your learning dashboard, or how to get started.',
};

const quickQuestions = ['What courses do you offer?', 'How does checkout work?', 'Where are my courses?'];

function formatPrice(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function answerQuestion(question: string) {
  const normalized = question.toLowerCase().trim();
  const user = getCurrentUser();
  const cartCount = getCartCourseIds().length;

  if (/^(hi|hello|hey|namaste|good morning|good evening)/.test(normalized)) {
    return `Hello${user ? `, ${user.name.split(' ')[0]}` : ''}! What would you like to learn today?`;
  }

  if (normalized.includes('course') && /(offer|available|catalog|teach|have)/.test(normalized)) {
    const categories = [...new Set(COURSES.map((course) => course.category))].join(', ');
    return `We currently have ${COURSES.length} courses across ${categories}. Explore the full catalog to filter by exam, difficulty, language, and price.`;
  }

  const matchedCourse = COURSES.find((course) => {
    const terms = [course.title, course.category, course.examType].join(' ').toLowerCase();
    return terms.includes(normalized) || normalized.includes(course.category.toLowerCase());
  });
  if (matchedCourse) {
    return `${matchedCourse.title} is taught by ${matchedCourse.instructor}. It has a ${matchedCourse.rating}/5 rating, ${matchedCourse.lessons} lessons, and costs ${formatPrice(matchedCourse.price)}. You can find it in Explore.`;
  }

  if (/(price|cost|fee|expensive|discount|how much)/.test(normalized)) {
    const lowest = COURSES.reduce((current, course) => (course.price < current.price ? course : current));
    return `Course prices currently start at ${formatPrice(lowest.price)}. Each course page shows its full price, original price, discount, lessons, and language before you add it to your cart.`;
  }

  if (/(checkout|buy|purchase|payment|pay|cart)/.test(normalized)) {
    return cartCount > 0
      ? `You have ${cartCount} course${cartCount === 1 ? '' : 's'} in your cart. Open Cart, review your order, then choose UPI or card payment to complete checkout.`
      : 'Open any course from Explore and select Add to cart. Then open Cart to review your order and choose UPI or card payment.';
  }

  if (/(my course|enrolled|access|dashboard|learn)/.test(normalized)) {
    return user
      ? `Welcome back, ${user.name.split(' ')[0]}! Open My Courses in the navigation to continue learning or choose a course to see its lessons.`
      : 'After you sign in and complete checkout, your purchases appear in My Courses. Use Sign In in the navigation to get started.';
  }

  if (/(sign up|signup|register|login|log in|sign in|account)/.test(normalized)) {
    return 'Choose Sign In or Get Started in the navigation. You can create an account with your name, email, and password, then return to Explore.';
  }

  if (/(live|class|test|educator|teacher)/.test(normalized)) {
    return 'Eduvance brings together live classes, practice tests, and expert educators. Use the navigation links to jump to Live, Tests, or Educators on the home page.';
  }

  if (/(language|hindi|english|duration|lesson|beginner|advanced|rating)/.test(normalized)) {
    return 'Course listings include language, lesson count, duration, difficulty, rating, instructor, and last-updated details so you can compare before enrolling.';
  }

  if (/(refund|cancel|support|help|contact)/.test(normalized)) {
    return 'For a refund, cancellation, or account-specific issue, please contact the Eduvance support team with your order details. I can help you browse courses and use checkout here.';
  }

  return 'I can help with course discovery, prices, discounts, checkout, payments, sign-in, and My Courses. Try asking “What courses do you offer?” or “How does checkout work?”';
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncContext = () => {
      setUserName(getCurrentUser()?.name ?? null);
      setCartCount(getCartCourseIds().length);
    };
    syncContext();
    window.addEventListener(STORE_EVENT, syncContext);
    return () => window.removeEventListener(STORE_EVENT, syncContext);
  }, []);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const submitQuestion = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: 'user', content: trimmed },
      { id: Date.now() + 1, role: 'assistant', content: answerQuestion(trimmed) },
    ]);
    setInput('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuestion(input);
  };

  return (
    <div className="fixed bottom-5 right-4 z-[60] sm:bottom-6 sm:right-6">
      {open && (
        <section
          aria-label="Eduvance AI assistant"
          className="mb-3 flex h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-slate-900/15 sm:w-[390px]"
        >
          <header className="flex items-center justify-between bg-gradient-to-r from-primary to-rose-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-sm font-800">Eduvance Assist</p>
                <p className="mt-0.5 text-[11px] text-white/75">{userName ? `Ready for you, ${userName.split(' ')[0]}` : 'Instant learning support'}</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Close chat">
              <X size={18} />
            </button>
          </header>

          <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto bg-[#fffaf8] p-4" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Bot size={15} /></div>}
                <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 ${message.role === 'user' ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md border border-border bg-white text-foreground shadow-sm'}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="space-y-2 pl-9">
                <p className="text-[11px] font-700 uppercase tracking-[0.08em] text-muted-foreground">Try asking</p>
                {quickQuestions.map((question) => (
                  <button key={question} type="button" onClick={() => submitQuestion(question)} className="block w-full rounded-lg border border-primary/20 bg-white px-3 py-2 text-left text-xs font-600 text-primary transition hover:border-primary hover:bg-primary/5">
                    {question}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border bg-white p-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-xl border border-border bg-muted/60 p-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question..." aria-label="Ask Eduvance Assist" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground" />
              <button type="submit" disabled={!input.trim()} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send question"><Send size={15} /></button>
            </form>
            <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><BookOpen size={11} /> {cartCount} in cart</span>
              <button type="button" onClick={() => setMessages([starterMessage])} className="flex items-center gap-1 hover:text-primary" aria-label="Start a new chat"><RotateCcw size={11} /> New chat</button>
            </div>
          </div>
        </section>
      )}

      <button type="button" onClick={() => setOpen((current) => !current)} className="group flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl" aria-label={open ? 'Close AI chat' : 'Open AI chat'}>
        {open ? <X size={22} /> : <MessageCircle size={23} />}
        {!open && <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-600 text-white opacity-0 shadow-lg transition group-hover:opacity-100">Ask Eduvance Assist</span>}
      </button>
    </div>
  );
}