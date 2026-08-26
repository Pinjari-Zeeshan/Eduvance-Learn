'use client';

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  examType: string;
  rating: number;
  reviews: number;
  learners: number;
  duration: number;
  lessons: number;
  price: number;
  originalPrice: number;
  discount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  badge?: string;
  badgeColor?: string;
  language: string;
  lastUpdated: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  purchasedCourseIds: string[];
}

export interface Order {
  id: string;
  userId: string;
  courseIds: string[];
  totalAmount: number;
  paymentMethod: 'upi';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export const USERS: UserAccount[] = [
  {
    id: 'admin-001',
    name: 'Pinjari Zee',
    email: 'pinjari.zee@gmail.com',
    password: 'Zee@2006',
    role: 'Admin',
    purchasedCourseIds: ['course-001', 'course-002', 'course-003'],
  },
];

const USERS_KEY = 'eduvance.users';
const DEMO_EMAILS = new Set([
  'aarav.mehta@eduvance.in',
  'isha.rao@eduvance.in',
  'kabir.khan@eduvance.in',
  'meera.iyer@eduvance.in',
  'rohan.das@eduvance.in',
]);

const readUsers = (): UserAccount[] => {
  if (!isBrowser()) return USERS;
  
  // Return cached result if available
  const cacheKey = window.localStorage.getItem('eduvance.users');
  if (usersCache !== null && usersCacheKey === cacheKey) {
    return usersCache;
  }
  
  try {
    const stored = window.localStorage.getItem(USERS_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    const persistedUsers = Array.isArray(parsed)
      ? parsed.filter((user) => user && typeof user === 'object' && typeof user.email === 'string')
      : [];

    const merged = [...USERS, ...persistedUsers].filter(
      (user) => !DEMO_EMAILS.has(user.email.toLowerCase())
    );

    const uniqueByEmail = new Map<string, UserAccount>();
    merged.forEach((user) => {
      if (user?.email) uniqueByEmail.set(user.email.toLowerCase(), user);
    });

    const sanitized = Array.from(uniqueByEmail.values());
    if (sanitized.length !== merged.length) {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(sanitized));
    }

    // Cache the result
    usersCache = sanitized;
    usersCacheKey = cacheKey;
    return sanitized;
  } catch {
    const result = USERS.filter((user) => !DEMO_EMAILS.has(user.email.toLowerCase()));
    usersCache = result;
    usersCacheKey = window.localStorage.getItem('eduvance.users');
    return result;
  }
};

const writeUsers = (users: UserAccount[]) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  invalidateUsersCache();
  window.dispatchEvent(new Event(STORE_EVENT));
};

export const COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'GATE Complete Preparation Course 2026',
    instructor: 'Dr. Arjun Sharma',
    instructorAvatar: 'AS',
    category: 'GATE',
    examType: 'Engineering',
    rating: 4.9,
    reviews: 8420,
    learners: 42800,
    duration: 380,
    lessons: 134,
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    difficulty: 'Advanced',
    thumbnail: 'gate',
    badge: 'Bestseller',
    badgeColor: 'bg-accent text-accent-foreground',
    language: 'Hindi + English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-002',
    title: 'UPSC CSE Prelims + Mains Complete Strategy',
    instructor: 'IAS Priya Nair',
    instructorAvatar: 'PN',
    category: 'UPSC',
    examType: 'Civil Services',
    rating: 4.8,
    reviews: 14200,
    learners: 124000,
    duration: 520,
    lessons: 210,
    price: 14999,
    originalPrice: 24999,
    discount: 40,
    difficulty: 'Advanced',
    thumbnail: 'upsc',
    badge: 'Top Rated',
    badgeColor: 'bg-success text-white',
    language: 'Hindi + English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-003',
    title: 'IIT-JEE Advanced Physics Masterclass',
    instructor: 'Prof. Rahul Gupta',
    instructorAvatar: 'RG',
    category: 'IIT-JEE',
    examType: 'Engineering',
    rating: 4.7,
    reviews: 6800,
    learners: 38400,
    duration: 280,
    lessons: 96,
    price: 9999,
    originalPrice: 15999,
    discount: 38,
    difficulty: 'Advanced',
    thumbnail: 'jee',
    language: 'Hindi',
    lastUpdated: 'Jul 2026',
  },
  {
    id: 'course-004',
    title: 'NEET Biology - Complete NCERT + PYQ Analysis',
    instructor: 'Dr. Kavya Menon',
    instructorAvatar: 'KM',
    category: 'NEET',
    examType: 'Medical',
    rating: 4.9,
    reviews: 11400,
    learners: 86200,
    duration: 340,
    lessons: 156,
    price: 11999,
    originalPrice: 18999,
    discount: 37,
    difficulty: 'Intermediate',
    thumbnail: 'neet',
    badge: 'New',
    badgeColor: 'bg-info text-white',
    language: 'Hindi + English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-005',
    title: 'Full Stack Web Development Bootcamp',
    instructor: 'Vikram Patel',
    instructorAvatar: 'VP',
    category: 'Coding',
    examType: 'Skills',
    rating: 4.8,
    reviews: 9200,
    learners: 64000,
    duration: 420,
    lessons: 180,
    price: 7999,
    originalPrice: 12999,
    discount: 38,
    difficulty: 'Beginner',
    thumbnail: 'coding',
    badge: 'Bestseller',
    badgeColor: 'bg-accent text-accent-foreground',
    language: 'English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-006',
    title: 'SSC CGL Complete Preparation 2026',
    instructor: 'Manish Tiwari',
    instructorAvatar: 'MT',
    category: 'SSC',
    examType: 'Government',
    rating: 4.6,
    reviews: 7800,
    learners: 52000,
    duration: 240,
    lessons: 88,
    price: 5999,
    originalPrice: 9999,
    discount: 40,
    difficulty: 'Intermediate',
    thumbnail: 'ssc',
    language: 'Hindi',
    lastUpdated: 'Jul 2026',
  },
  {
    id: 'course-007',
    title: 'CAT Quantitative Aptitude Intensive',
    instructor: 'Neha Agarwal',
    instructorAvatar: 'NA',
    category: 'CAT',
    examType: 'Management',
    rating: 4.7,
    reviews: 4200,
    learners: 18600,
    duration: 160,
    lessons: 72,
    price: 6999,
    originalPrice: 10999,
    discount: 36,
    difficulty: 'Intermediate',
    thumbnail: 'cat',
    language: 'English',
    lastUpdated: 'Jun 2026',
  },
  {
    id: 'course-008',
    title: 'Data Science & ML with Python',
    instructor: 'Dr. Sanjay Bose',
    instructorAvatar: 'SB',
    category: 'Data Science',
    examType: 'Skills',
    rating: 4.8,
    reviews: 5600,
    learners: 32000,
    duration: 300,
    lessons: 112,
    price: 8499,
    originalPrice: 13999,
    discount: 39,
    difficulty: 'Intermediate',
    thumbnail: 'ds',
    badge: 'Hot',
    badgeColor: 'bg-danger text-white',
    language: 'English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-009',
    title: 'Banking & Finance - IBPS PO Complete',
    instructor: 'Ravi Shankar',
    instructorAvatar: 'RS',
    category: 'Banking',
    examType: 'Government',
    rating: 4.5,
    reviews: 9800,
    learners: 74000,
    duration: 200,
    lessons: 80,
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    difficulty: 'Beginner',
    thumbnail: 'banking',
    language: 'Hindi + English',
    lastUpdated: 'Jul 2026',
  },
  {
    id: 'course-010',
    title: 'NEET Chemistry - Organic + Inorganic Mastery',
    instructor: 'Dr. Suresh Kumar',
    instructorAvatar: 'SK',
    category: 'NEET',
    examType: 'Medical',
    rating: 4.7,
    reviews: 6400,
    learners: 48000,
    duration: 260,
    lessons: 104,
    price: 8999,
    originalPrice: 13999,
    discount: 36,
    difficulty: 'Intermediate',
    thumbnail: 'neet',
    language: 'Hindi + English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-011',
    title: 'IIT-JEE Chemistry - Physical + Organic',
    instructor: 'Dr. Anita Mishra',
    instructorAvatar: 'AM',
    category: 'IIT-JEE',
    examType: 'Engineering',
    rating: 4.6,
    reviews: 5200,
    learners: 29000,
    duration: 240,
    lessons: 90,
    price: 8499,
    originalPrice: 13999,
    discount: 39,
    difficulty: 'Advanced',
    thumbnail: 'jee',
    language: 'Hindi',
    lastUpdated: 'Jul 2026',
  },
  {
    id: 'course-012',
    title: 'CUET UG - Complete Preparation All Subjects',
    instructor: 'Pooja Sharma',
    instructorAvatar: 'PS',
    category: 'CUET',
    examType: 'Undergraduate',
    rating: 4.6,
    reviews: 3800,
    learners: 22000,
    duration: 180,
    lessons: 76,
    price: 5499,
    originalPrice: 8999,
    discount: 39,
    difficulty: 'Beginner',
    thumbnail: 'cuet',
    badge: 'New',
    badgeColor: 'bg-info text-white',
    language: 'Hindi + English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-013',
    title: 'GATE ECE - Electronics & Communication',
    instructor: 'Prof. Deepak Rao',
    instructorAvatar: 'DR',
    category: 'GATE',
    examType: 'Engineering',
    rating: 4.8,
    reviews: 4600,
    learners: 21000,
    duration: 340,
    lessons: 118,
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    difficulty: 'Advanced',
    thumbnail: 'gate',
    language: 'English',
    lastUpdated: 'Jul 2026',
  },
  {
    id: 'course-014',
    title: 'MBA Preparation - CAT + XAT + SNAP Complete',
    instructor: 'Neha Agarwal',
    instructorAvatar: 'NA',
    category: 'MBA',
    examType: 'Management',
    rating: 4.7,
    reviews: 3200,
    learners: 14800,
    duration: 200,
    lessons: 84,
    price: 7499,
    originalPrice: 11999,
    discount: 38,
    difficulty: 'Intermediate',
    thumbnail: 'cat',
    language: 'English',
    lastUpdated: 'Jun 2026',
  },
  {
    id: 'course-015',
    title: 'Python for Data Analysis & Visualization',
    instructor: 'Dr. Sanjay Bose',
    instructorAvatar: 'SB',
    category: 'Data Science',
    examType: 'Skills',
    rating: 4.9,
    reviews: 7200,
    learners: 42000,
    duration: 120,
    lessons: 52,
    price: 3999,
    originalPrice: 5199,
    discount: 23,
    difficulty: 'Beginner',
    thumbnail: 'ds',
    language: 'English',
    lastUpdated: 'Aug 2026',
  },
  {
    id: 'course-016',
    title: 'English Communication & Grammar Mastery',
    instructor: 'Kavitha Reddy',
    instructorAvatar: 'KR',
    category: 'English',
    examType: 'Skills',
    rating: 4.5,
    reviews: 8800,
    learners: 58000,
    duration: 80,
    lessons: 40,
    price: 2999,
    originalPrice: 3899,
    discount: 31,
    difficulty: 'Beginner',
    thumbnail: 'english',
    language: 'English',
    lastUpdated: 'Jul 2026',
  },
];

const SESSION_KEY = 'eduvance.currentUserId';
const CART_KEY = 'eduvance.cartCourseIds';
const PURCHASES_KEY = 'eduvance.purchasedCourseIds';
const ORDERS_KEY = 'eduvance.orders';
export const STORE_EVENT = 'eduvance-store-change';
export const PAYMENT_EVENT = 'eduvance-payment-complete';

const isBrowser = () => typeof window !== 'undefined';

// Cache for optimization
let usersCache: UserAccount[] | null = null;
let usersCacheKey: string | null = null;

const getUserStorageKey = (baseKey: string) => {
  const currentUser = getCurrentUser();
  return currentUser ? `${baseKey}.${currentUser.id}` : `${baseKey}.guest`;
};

const invalidateUsersCache = () => {
  usersCache = null;
  usersCacheKey = null;
};

const readIds = (key: string): string[] => {
  if (!isBrowser()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

const writeIds = (key: string, ids: string[]) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids))));
  invalidateUsersCache();
  window.dispatchEvent(new Event(STORE_EVENT));
};

const emitStoreEvent = () => {
  if (!isBrowser()) return;
  invalidateUsersCache();
  window.dispatchEvent(new Event(STORE_EVENT));
};

export const getCurrentUser = () => {
  if (!isBrowser()) return null;
  const id = window.localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const user = readUsers().find((account) => account.id === id);
  if (user) return user;
  window.localStorage.removeItem(SESSION_KEY);
  invalidateUsersCache();
  emitStoreEvent();
  return null;
};

export const signUp = (name: string, email: string, password: string) => {
  if (!isBrowser()) return null;
  const trimmedEmail = email.trim();
  const trimmedName = name.trim();
  if (!trimmedEmail || !trimmedName || !password) return null;

  const users = readUsers();
  const existing = users.find(
    (account) => account.email.toLowerCase() === trimmedEmail.toLowerCase()
  );

  if (existing) {
    window.localStorage.setItem(SESSION_KEY, existing.id);
    emitStoreEvent();
    return existing;
  }

  const newUser: UserAccount = {
    id: `user-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: trimmedName,
    email: trimmedEmail,
    password,
    role: 'User',
    purchasedCourseIds: [],
  };

  writeUsers([...users, newUser]);
  window.localStorage.setItem(SESSION_KEY, newUser.id);
  window.localStorage.setItem('eduvance.lastUserEmail', trimmedEmail);
  emitStoreEvent();
  return newUser;
};

export const signIn = (email: string, password: string) => {
  if (!isBrowser()) return null;
  const users = readUsers();
  const user = users.find(
    (account) =>
      account.email.toLowerCase() === email.trim().toLowerCase() && account.password === password
  );
  if (!user) return null;

  window.localStorage.setItem(SESSION_KEY, user.id);
  window.localStorage.setItem('eduvance.lastUserEmail', user.email);
  emitStoreEvent();
  return user;
};

export const signOut = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem('eduvance.lastUserEmail');
  emitStoreEvent();
};

export const getCartCourseIds = () => readIds(getUserStorageKey(CART_KEY));

export const getCartCourses = () => {
  const ids = getCartCourseIds();
  return COURSES.filter((course) => ids.includes(course.id));
};

export const addToCart = (courseId: string) => {
  const key = getUserStorageKey(CART_KEY);
  writeIds(key, [...getCartCourseIds(), courseId]);
};

export const removeFromCart = (courseId: string) => {
  const key = getUserStorageKey(CART_KEY);
  writeIds(key, getCartCourseIds().filter((id) => id !== courseId));
};

export const isInCart = (courseId: string) => getCartCourseIds().includes(courseId);

export const getPurchasedCourseIds = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  return readIds(`${PURCHASES_KEY}.${currentUser.id}`);
};

export const getPurchasedCourses = () => {
  const ids = getPurchasedCourseIds();
  return COURSES.filter((course) => ids.includes(course.id));
};

export const purchaseCart = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  const cartIds = getCartCourseIds();
  if (cartIds.length === 0) return [];
  const purchasedKey = `${PURCHASES_KEY}.${currentUser.id}`;
  const existing = readIds(purchasedKey);
  const purchasedIds = Array.from(new Set([...existing, ...cartIds]));
  writeIds(purchasedKey, purchasedIds);
  writeIds(getUserStorageKey(CART_KEY), []);
  return COURSES.filter((course) => cartIds.includes(course.id));
};

// ─── Payment & Order System ───────────────────────────────────────────────────

export const createOrder = (courseIds: string[], paymentMethod: 'upi'): Order | null => {
  const currentUser = getCurrentUser();
  if (!currentUser || courseIds.length === 0) return null;

  const totalAmount = courseIds.reduce((sum, id) => {
    const course = COURSES.find((c) => c.id === id);
    return sum + (course?.price || 0);
  }, 0);

  const order: Order = {
    id: `order-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    userId: currentUser.id,
    courseIds,
    totalAmount,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (!isBrowser()) return order;

  const orders = getAllOrders();
  const updatedOrders = [...orders, order];
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));

  return order;
};

export const getAllOrders = (): Order[] => {
  if (!isBrowser()) return [];
  try {
    const stored = window.localStorage.getItem(ORDERS_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getUserOrders = (): Order[] => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  return getAllOrders().filter((order) => order.userId === currentUser.id);
};

export const completePayment = (orderId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser || !isBrowser()) return false;

  const orders = getAllOrders();
  const orderIndex = orders.findIndex((o) => o.id === orderId && o.userId === currentUser.id);
  if (orderIndex === -1) return false;

  const order = orders[orderIndex];
  order.status = 'completed';
  order.completedAt = new Date().toISOString();

  // Add courses to purchased for the user
  const purchasedKey = `${PURCHASES_KEY}.${currentUser.id}`;
  const existing = readIds(purchasedKey);
  const purchasedIds = Array.from(new Set([...existing, ...order.courseIds]));
  writeIds(purchasedKey, purchasedIds);

  // Clear cart
  writeIds(getUserStorageKey(CART_KEY), []);

  // Update orders
  orders[orderIndex] = order;
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  window.dispatchEvent(new Event(PAYMENT_EVENT));
  emitStoreEvent();

  return true;
};

export const isUserAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.role === 'Admin';
};
