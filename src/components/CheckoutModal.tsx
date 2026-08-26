'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { Loader2, CheckCircle, X, Lock } from 'lucide-react';

const PAYMENT_UPI_ID = '9594606924@fam';

interface CheckoutModalProps {
  isOpen: boolean;
  totalAmount: number;
  courseCount: number;
  courseNames: string[];
  onClose: () => void;
  onPaymentComplete: () => void | Promise<void>;
  isProcessing: boolean;
}

export default function CheckoutModal({
  isOpen,
  totalAmount,
  courseCount,
  courseNames,
  onClose,
  onPaymentComplete,
  isProcessing,
}: CheckoutModalProps) {
  const [paymentStep, setPaymentStep] = useState<'review' | 'payment'>('review');
  const [qrCode, setQrCode] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPaymentStep('review');
      setPaymentDone(false);
      return;
    }

    const paymentUri = new URL('upi://pay');
    paymentUri.searchParams.set('pa', PAYMENT_UPI_ID);
    paymentUri.searchParams.set('pn', 'Unacademy');
    paymentUri.searchParams.set('am', totalAmount.toFixed(2));
    paymentUri.searchParams.set('cu', 'INR');
    paymentUri.searchParams.set('tn', `Unacademy course purchase (${courseCount} course${courseCount === 1 ? '' : 's'})`);

    QRCode.toDataURL(paymentUri.toString(), { width: 240, margin: 2 })
      .then(setQrCode)
      .catch(() => setQrCode(''));
  }, [courseCount, isOpen, totalAmount]);

  useEffect(() => {
    if (!isOpen || paymentStep !== 'payment') return;

    const timer = window.setTimeout(async () => {
      await onPaymentComplete();
      setPaymentDone(true);
    }, 60000);

    return () => window.clearTimeout(timer);
  }, [isOpen, onPaymentComplete, paymentStep]);

  if (!isOpen) return null;

  const handlePaymentSubmit = async () => {
    setPaymentStep('payment');
  };

  if (paymentDone) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle size={32} className="text-success" />
          </div>
          <h2 className="text-2xl font-800 text-foreground">Payment Successful!</h2>
          <p className="mt-2 text-muted-foreground">Your courses have been added to your learning dashboard.</p>
          <div className="mt-6 h-1 w-full bg-gradient-to-r from-success/0 via-success to-success/0 rounded-full"></div>
          <Link href="/my-courses" className="btn-primary mt-6 w-full justify-center">
            Go to My Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-800 text-foreground">Checkout</h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-full p-2 hover:bg-muted disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Order Summary */}
        <div className="mb-6 rounded-2xl bg-muted/40 p-4">
          <h3 className="text-sm font-600 text-foreground">Order Summary</h3>
          <div className="mt-3 space-y-2">
            {courseNames.map((name, index) => (
              <p key={index} className="text-xs text-muted-foreground truncate">
                {index + 1}. {name}
              </p>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-600 text-foreground">Total Amount</span>
              <span className="text-lg font-800 text-foreground">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {paymentStep === 'payment' && (
          <div className="space-y-4 mb-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
              <h3 className="text-2xl font-800 text-foreground">Pay via UPI QR</h3>
              <p className="mt-1 text-sm text-muted-foreground">Scan using any UPI app on your phone</p>
              <div className="mt-4 flex items-center justify-center gap-3" aria-label="Supported UPI apps">
                <img src="/assets/images/ppay.png" alt="PhonePe" title="PhonePe" className="h-9 w-9 rounded-full object-contain" />
                <img src="/assets/images/paytm.png" alt="Paytm" title="Paytm" className="h-9 w-9 rounded-full object-contain" />
                <img src="/assets/images/gpay.jpg" alt="Google Pay" title="Google Pay" className="h-9 w-9 rounded-full object-contain" />
                <img src="/assets/images/bhim-upi.png" alt="BHIM UPI" title="BHIM UPI" className="h-9 w-9 rounded-full object-contain" />
              </div>
              {qrCode ? (
                <img src={qrCode} alt={`UPI payment QR code for ${PAYMENT_UPI_ID}`} className="mx-auto h-60 w-60 rounded-lg bg-white p-2" />
              ) : (
                <div className="mx-auto flex h-60 w-60 items-center justify-center rounded-lg bg-white text-sm text-muted-foreground">Loading QR code...</div>
              )}
              <p className="mt-1 text-xs text-muted-foreground">Scan to pay ₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-xl border border-info/30 bg-info/5 p-3 flex gap-2">
              <Lock size={16} className="text-info flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">Complete the payment in your UPI app, then confirm below.</p>
            </div>
          </div>
        )}

        {paymentStep === 'review' && (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-600 text-foreground hover:bg-muted disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePaymentSubmit}
              disabled={isProcessing}
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-600 text-white hover:bg-primary/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Pay ₹{totalAmount.toLocaleString('en-IN')}
                </>
              )}
            </button>
          </div>
        )}

        {paymentStep === 'payment' && !paymentDone && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-r-transparent mx-auto mb-3"></div>
            <p className="font-600 text-foreground">Processing your payment...</p>
            <p className="mt-1 text-xs text-muted-foreground">Please wait</p>
          </div>
        )}
      </div>
    </div>
  );
}
