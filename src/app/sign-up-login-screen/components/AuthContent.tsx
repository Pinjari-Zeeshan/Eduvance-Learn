'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AppLogo from '@/components/ui/AppLogo';
import { getCurrentUser, signIn, signUp } from '@/lib/learningStore';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  User,
  ArrowRight,
  Check,
  ChevronRight,
  Star,
  BookOpen,
  Users,
  Award,
  Smartphone,
  AlertCircle,
  Loader2,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type AuthMode = 'signin' | 'signup';
type AuthMethod = 'email' | 'phone' | 'google';

interface EmailFormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  rememberMe?: boolean;
}

interface PhoneFormData {
  phone: string;
}

// ─── Password Strength ────────────────────────────────────────────────────────

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-danger' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-warning' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-info' };
  return { score, label: 'Strong', color: 'bg-success' };
}

// ─── OTP Input ────────────────────────────────────────────────────────────────

function OtpInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[idx] = digit;
    onChange(next);
    if (digit && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...value];
    pasted.split('').forEach((d, i) => {
      next[i] = d;
    });
    onChange(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {value.map((digit, idx) => (
        <input
          key={`otp-${idx}`}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className={`w-11 h-12 text-center text-lg font-700 rounded-xl border-2 outline-none transition-all duration-150 font-mono-nums ${
            digit
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border bg-card text-foreground focus:border-primary'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Google Button ────────────────────────────────────────────────────────────

function GoogleAuthButton({ mode: _mode }: { mode: AuthMode }) {
  const [loading, setLoading] = useState(false);

  const handleGoogle = () => {
    setLoading(true);
    // Backend integration point: redirect to /api/auth/google
    setTimeout(() => {
      setLoading(false);
      toast.info('Google OAuth requires backend configuration. Please use email signup instead.');
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-card border-2 border-border hover:border-primary/40 hover:bg-muted rounded-xl py-3 text-sm font-600 text-foreground transition-all duration-150 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin text-primary" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path
              d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h13.2c-.6 3-2.3 5.5-4.8 7.2v6h7.8c4.6-4.2 7.3-10.4 7.3-17.4z"
              fill="#4285F4"
            />
            <path
              d="M24 48c6.5 0 12-2.1 16-5.8l-7.8-6c-2.2 1.5-5 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.4v6.2C6.4 42.5 14.6 48 24 48z"
              fill="#34A853"
            />
            <path
              d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6v-6.2H2.4C.9 16.4 0 20.1 0 24s.9 7.6 2.4 10.8l8.1-6.2z"
              fill="#FBBC05"
            />
            <path
              d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.4 5.5 2.4 13.2l8.1 6.2C12.4 13.7 17.7 9.5 24 9.5z"
              fill="#EA4335"
            />
          </svg>
        )}
        {loading ? 'Connecting...' : `Continue with Google`}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground font-500">
            or continue with
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Email Form ───────────────────────────────────────────────────────────────

function EmailForm({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmailFormData>({ mode: 'onChange' });

  const password = watch('password', '');
  const strength = getPasswordStrength(password);

  const onSubmit = async (data: EmailFormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const user =
      mode === 'signup'
        ? signUp(data.name || '', data.email, data.password)
        : signIn(data.email, data.password);
    setLoading(false);

    if (!user) {
      toast.error(
        mode === 'signin'
          ? 'Invalid email or password. Please check your credentials.'
          : 'Unable to create the account. Please try again.'
      );
      return;
    }

    setSuccess(true);
    toast.success(
      mode === 'signin'
        ? `Welcome back, ${user.name.split(' ')[0]}! Redirecting to your profile...`
        : 'Account created successfully! Welcome to Eduvance.'
    );

    setTimeout(() => {
      router.push('/profile');
      router.refresh();
      window.location.href = '/profile';
    }, 600);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
        <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center">
          <Check size={28} className="text-success" />
        </div>
        <div>
          <h3 className="font-700 text-lg text-foreground mb-1">
            {mode === 'signin' ? 'Signed In!' : 'Account Created!'}
          </h3>
          <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
        <Link href="/" className="btn-primary text-sm px-6 py-2.5">
          Go to Dashboard
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Name field (signup only) */}
      {mode === 'signup' && (
        <div>
          <label className="block text-xs font-600 text-foreground mb-1.5" htmlFor="auth-name">
            Full Name
          </label>
          <div className="relative">
            <User
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="auth-name"
              type="text"
              placeholder="Rahul Sharma"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-150 ${
                errors.name
                  ? 'border-danger bg-danger/5 focus:border-danger'
                  : 'border-border bg-card focus:border-primary'
              }`}
              {...register('name', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-danger flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.name.message}
            </p>
          )}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-xs font-600 text-foreground mb-1.5" htmlFor="auth-email">
          Email Address
        </label>
        <div className="relative">
          <Mail
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="auth-email"
            type="email"
            placeholder="rahul@example.com"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-150 ${
              errors.email
                ? 'border-danger bg-danger/5 focus:border-danger'
                : 'border-border bg-card focus:border-primary'
            }`}
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-danger flex items-center gap-1">
            <AlertCircle size={11} />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-600 text-foreground" htmlFor="auth-password">
            Password
          </label>
          {mode === 'signin' && (
            <a href="#forgot" className="text-xs font-500 text-primary hover:underline">
              Forgot password?
            </a>
          )}
        </div>
        <div className="relative">
          <Lock
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="auth-password"
            type={showPassword ? 'text' : 'password'}
            placeholder={mode === 'signup' ? 'Min 8 chars, 1 uppercase, 1 number' : '••••••••'}
            className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm outline-none transition-all duration-150 ${
              errors.password
                ? 'border-danger bg-danger/5 focus:border-danger'
                : 'border-border bg-card focus:border-primary'
            }`}
            {...register('password', {
              required: 'Password is required',
              minLength:
                mode === 'signup'
                  ? { value: 8, message: 'Password must be at least 8 characters' }
                  : undefined,
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-danger flex items-center gap-1">
            <AlertCircle size={11} />
            {errors.password.message}
          </p>
        )}

        {/* Password strength (signup only) */}
        {mode === 'signup' && password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={`strength-bar-${s}`}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    strength.score >= s ? strength.color : 'bg-border'
                  }`}
                />
              ))}
            </div>
            {strength.label && (
              <p
                className={`text-[11px] font-600 ${
                  strength.score <= 1
                    ? 'text-danger'
                    : strength.score <= 2
                      ? 'text-warning'
                      : strength.score <= 3
                        ? 'text-info'
                        : 'text-success'
                }`}
              >
                {strength.label} password
              </p>
            )}
          </div>
        )}
      </div>

      {/* Confirm Password (signup only) */}
      {mode === 'signup' && (
        <div>
          <label className="block text-xs font-600 text-foreground mb-1.5" htmlFor="auth-confirm">
            Confirm Password
          </label>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="auth-confirm"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm outline-none transition-all duration-150 ${
                errors.confirmPassword
                  ? 'border-danger bg-danger/5 focus:border-danger'
                  : 'border-border bg-card focus:border-primary'
              }`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === password || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-danger flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      )}

      {/* Remember me (signin only) */}
      {mode === 'signin' && (
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded accent-primary"
            {...register('rememberMe')}
          />
          <span className="text-sm text-muted-foreground">Remember me for 30 days</span>
        </label>
      )}

      {/* Terms (signup only) */}
      {mode === 'signup' && (
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to Eduvance&apos;s{' '}
          <a href="#terms" className="text-primary hover:underline font-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#privacy" className="text-primary hover:underline font-500">
            Privacy Policy
          </a>
          .
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ minWidth: '160px' }}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
          </>
        ) : (
          <>
            {mode === 'signin' ? 'Sign In to Eduvance' : 'Create Free Account'}
            <ArrowRight size={15} />
          </>
        )}
      </button>
    </form>
  );
}

// ─── Phone Form ───────────────────────────────────────────────────────────────

function PhoneForm() {
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [phoneError, setPhoneError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>({ mode: 'onChange' });

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (data: PhoneFormData) => {
    if (!/^[6-9]\d{9}$/.test(data.phone)) {
      setPhoneError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setPhoneError('');
    setLoading(true);
    setPhone(data.phone);
    // Backend integration point: POST /api/auth/send-otp
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep('otp');
    startResendTimer();
    toast.success(`OTP sent to +91 ${data.phone}`);
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      toast.error('Enter the complete 6-digit OTP');
      return;
    }
    setLoading(true);
    // Backend integration point: POST /api/auth/verify-otp
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    if (otpValue === '123456') {
      setStep('success');
      toast.success('Phone verified! Welcome to Eduvance.');
    } else {
      toast.error('Incorrect OTP. Use 123456 for demo.');
    }
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
        <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center">
          <Check size={28} className="text-success" />
        </div>
        <div>
          <h3 className="font-700 text-lg text-foreground mb-1">Phone Verified!</h3>
          <p className="text-sm text-muted-foreground">+91 {phone} • Account ready</p>
        </div>
        <Link href="/" className="btn-primary text-sm px-6 py-2.5">
          Go to Dashboard
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="space-y-5">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Smartphone size={22} className="text-primary" />
          </div>
          <p className="text-sm font-600 text-foreground mb-1">Enter OTP</p>
          <p className="text-xs text-muted-foreground">
            Sent to <span className="font-600 text-foreground">+91 {phone}</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Demo OTP: <span className="font-700 font-mono-nums text-primary">123456</span>
          </p>
        </div>

        <OtpInput value={otp} onChange={setOtp} />

        <button
          onClick={handleVerifyOtp}
          disabled={loading || otp.join('').length < 6}
          className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => setStep('phone')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Change number
          </button>
          {resendTimer > 0 ? (
            <span className="text-muted-foreground font-mono-nums">Resend in {resendTimer}s</span>
          ) : (
            <button
              onClick={() => {
                startResendTimer();
                toast.info('OTP resent!');
              }}
              className="text-primary font-600 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleSendOtp)} className="space-y-4" noValidate>
      <div>
        <label className="block text-xs font-600 text-foreground mb-1.5" htmlFor="auth-phone">
          Mobile Number
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          We&apos;ll send a 6-digit OTP to verify your number
        </p>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-3 text-sm font-600 text-foreground shrink-0">
            🇮🇳 +91
          </div>
          <div className="relative flex-1">
            <Phone
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="auth-phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="9876543210"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-150 font-mono-nums ${
                errors.phone || phoneError
                  ? 'border-danger bg-danger/5 focus:border-danger'
                  : 'border-border bg-card focus:border-primary'
              }`}
              {...register('phone', {
                required: 'Mobile number is required',
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: 'Enter a valid 10-digit Indian mobile number',
                },
              })}
            />
          </div>
        </div>
        {(errors.phone || phoneError) && (
          <p className="mt-1 text-xs text-danger flex items-center gap-1">
            <AlertCircle size={11} />
            {errors.phone?.message || phoneError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-70"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Smartphone size={15} />}
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        Standard SMS rates may apply. OTP valid for 10 minutes.
      </p>
    </form>
  );
}

// ─── Main Auth Content ────────────────────────────────────────────────────────

export default function AuthContent() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [method, setMethod] = useState<AuthMethod>('email');
  const router = useRouter();

  useEffect(() => {
    if (getCurrentUser()) {
      router.replace('/profile');
    }
  }, [router]);

  const valuePropItems = [
    { icon: <BookOpen size={16} />, text: '12,000+ video lessons across all subjects' },
    { icon: <Users size={16} />, text: '4.2 million students learning daily' },
    { icon: <Star size={16} />, text: "Live classes with India's top educators" },
    { icon: <Award size={16} />, text: '98,000+ selections in competitive exams in 2025' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] gradient-hero flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/20 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <AppLogo size={40} />
            <span className="font-extrabold text-2xl text-white tracking-tight">Eduvance</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-500 text-white/90">
              India&apos;s #1 Exam Preparation Platform
            </span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-800 text-white mb-4 leading-tight">
            Learn Better.
            <br />
            <span className="text-accent">Go Further.</span>
          </h2>

          <p className="text-white/70 text-base mb-8 max-w-md leading-relaxed">
            Join millions of students preparing for UPSC, IIT-JEE, NEET, GATE, SSC and more with
            India&apos;s most trusted online education platform.
          </p>

          {/* Value props */}
          <div className="space-y-3 mb-8">
            {valuePropItems.map((item, i) => (
              <div key={`vp-${i}`} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-accent shrink-0">
                  {item.icon}
                </div>
                <span className="text-sm text-white/80">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Floating course card */}
          <div className="glass-card rounded-2xl p-5 max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-2xl shrink-0">
                ⚙️
              </div>
              <div>
                <p className="text-white font-700 text-sm">GATE Complete Prep 2026</p>
                <p className="text-white/60 text-xs">134 lessons • 8 mock tests</p>
              </div>
              <div className="ml-auto">
                <span className="text-accent font-800 font-mono-nums text-sm">₹8,999</span>
                <p className="text-white/50 text-[10px] line-through font-mono-nums text-right">
                  ₹12,999
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['AV', 'SK', 'RM', 'DN'].map((av) => (
                  <div
                    key={`av-${av}`}
                    className="w-6 h-6 rounded-full gradient-primary border-2 border-white/20 flex items-center justify-center text-white text-[9px] font-700"
                  >
                    {av}
                  </div>
                ))}
              </div>
              <span className="text-white/60 text-xs">+42,800 enrolled</span>
              <div className="ml-auto flex items-center gap-1">
                <Star size={11} className="fill-accent text-accent" />
                <span className="text-white text-xs font-700">4.9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative flex items-center gap-6 text-xs text-white/40">
          <span>© 2026 Eduvance</span>
          <a href="#privacy" className="hover:text-white/70 transition-colors">
            Privacy
          </a>
          <a href="#terms" className="hover:text-white/70 transition-colors">
            Terms
          </a>
          <a href="#help" className="hover:text-white/70 transition-colors">
            Help
          </a>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo size={32} />
            <span className="font-extrabold text-xl text-primary">Eduvance</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-800 text-foreground mb-1">
              {mode === 'signin' ? 'Welcome back!' : 'Create your account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'signin'
                ? 'Sign in to continue your learning journey'
                : 'Start learning for free — no credit card needed'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-600 transition-all duration-150 ${
                mode === 'signin'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-600 transition-all duration-150 ${
                mode === 'signup'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Method Tabs */}
          <div className="flex border-b border-border mb-6 gap-0">
            {(['email', 'phone', 'google'] as AuthMethod[]).map((m) => (
              <button
                key={`method-${m}`}
                onClick={() => setMethod(m)}
                className={`flex-1 flex items-center justify-center gap-1.5 pb-3 text-xs font-600 border-b-2 transition-all duration-150 ${
                  method === m
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'email' && <Mail size={13} />}
                {m === 'phone' && <Phone size={13} />}
                {m === 'google' && (
                  <svg width="13" height="13" viewBox="0 0 48 48" fill="none">
                    <path
                      d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h13.2c-.6 3-2.3 5.5-4.8 7.2v6h7.8c4.6-4.2 7.3-10.4 7.3-17.4z"
                      fill="#4285F4"
                    />
                    <path
                      d="M24 48c6.5 0 12-2.1 16-5.8l-7.8-6c-2.2 1.5-5 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.4v6.2C6.4 42.5 14.6 48 24 48z"
                      fill="#34A853"
                    />
                    <path
                      d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6v-6.2H2.4C.9 16.4 0 20.1 0 24s.9 7.6 2.4 10.8l8.1-6.2z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.4 5.5 2.4 13.2l8.1 6.2C12.4 13.7 17.7 9.5 24 9.5z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                {m === 'email' ? 'Email' : m === 'phone' ? 'Phone' : 'Google'}
              </button>
            ))}
          </div>

          {/* Form Content */}
          {method === 'google' && (
            <div className="py-4">
              <GoogleAuthButton mode={mode} />
              <p className="text-xs text-muted-foreground text-center mt-4">
                Google OAuth requires backend configuration with Google Cloud Console.
              </p>
            </div>
          )}

          {method === 'email' && (
            <>
              <GoogleAuthButton mode={mode} />
              <EmailForm mode={mode} />
            </>
          )}

          {method === 'phone' && (
            <>
              <GoogleAuthButton mode={mode} />
              <PhoneForm />
            </>
          )}

          {/* Toggle mode link */}
          <p className="text-center text-sm text-muted-foreground mt-5">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-primary font-600 hover:underline"
            >
              {mode === 'signin' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {/* Mobile back to home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <ChevronRight size={12} className="rotate-180" />
              Back to Eduvance Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
