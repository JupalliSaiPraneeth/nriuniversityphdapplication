import React, { useState, useEffect, useRef } from 'react';
import { otpService } from '../../lib/otpService';

export default function EditApplicationModal({ isOpen, onClose, onVerified, initialEmail = '' }) {
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'success'
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '', '', '']); // 8 boxes for Supabase OTP
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setStep('email');
      setEmail(initialEmail || '');
      setOtpDigits(['', '', '', '', '', '', '', '']);
      setErrorMessage('');
      setLoading(false);
      setResendCountdown(0);
    }
  }, [isOpen, initialEmail]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  if (!isOpen) return null;

  const handleRequestOTP = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await otpService.requestOTP(email);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to dispatch verification code.');
        setLoading(false);
        return;
      }

      setStep('otp');
      setResendCountdown(30);
      setOtpDigits(['', '', '', '', '', '', '', '']);
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCountdown > 0 || loading) return;
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await otpService.requestOTP(email);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to resend verification code.');
      } else {
        setResendCountdown(30);
        setOtpDigits(['', '', '', '', '', '', '', '']);
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }
    } catch (err) {
      setErrorMessage('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only accept numeric digit
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    if (cleanVal && index < otpDigits.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 8 filled
    if (cleanVal && index === otpDigits.length - 1 && newDigits.every((d) => d !== '')) {
      handleVerify(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (!pasteData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setOtpDigits(newDigits);

    if (pasteData.length >= 6) {
      handleVerify(pasteData);
    } else {
      inputRefs.current[pasteData.length]?.focus();
    }
  };

  const handleVerify = async (codeToVerify) => {
    const fullCode = (codeToVerify || otpDigits.join('')).trim();
    if (fullCode.length < 6) {
      setErrorMessage('Please enter the verification code sent to your email.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await otpService.verifyOTP(email, fullCode);
      if (!res.success) {
        setErrorMessage(res.error || 'Verification failed. Please check the code in your email and try again.');
        setLoading(false);
        return;
      }

      setStep('success');
      setTimeout(() => {
        onVerified(res.application);
        onClose();
      }, 900);
    } catch (err) {
      setErrorMessage(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="bg-brand-950 text-white px-5 py-4 flex items-center justify-between border-b border-brand-900">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Edit Submitted Application
            </h2>
            <p className="text-[11px] text-brand-300">
              Dr. RVR NRI Institute of Technology (Deemed to be University)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-7 h-7 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center text-sm font-bold transition cursor-pointer"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* STEP 1: ENTER REGISTERED EMAIL */}
          {step === 'email' && (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label htmlFor="registered-email" className="block text-xs font-bold text-slate-800 mb-1">
                  Registered Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="registered-email"
                  type="email"
                  placeholder="Enter email used when submitting form"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  autoFocus
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs"
                />
                <span className="text-[11px] text-slate-500 mt-1.5 block leading-relaxed">
                  We will verify your application and send a verification code directly to your email.
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">!</span>
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              <div className="pt-1 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-sm font-bold"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <span>Send Verification Code →</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 'otp' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-sm font-bold text-slate-900">
                  Enter Verification Code
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  We sent a verification code to <span className="font-semibold text-brand-950">{email}</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setErrorMessage('');
                  }}
                  className="text-[11px] text-brand-700 hover:underline font-semibold mt-1 inline-block"
                >
                  Change email address
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs text-blue-900">
                <div>
                  <span className="font-bold block text-xs">Verification Code Sent:</span>
                  <span className="text-[11px] text-blue-800 leading-relaxed block mt-0.5">
                    Please check your email inbox at <strong>{email}</strong> for the code and enter it below. (Check spam/junk if delayed).
                  </span>
                </div>
              </div>

              {/* 8 OTP Input Boxes */}
              <div className="flex justify-center items-center gap-1.5 sm:gap-2 py-1" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-8 sm:w-10 h-11 sm:h-12 text-center text-base sm:text-lg font-bold font-mono border-2 rounded-lg border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden transition shadow-2xs"
                  />
                ))}
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 text-center">
                  {errorMessage}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleVerify()}
                  disabled={loading || otpDigits.join('').length < 6}
                  className="w-full btn-primary text-xs py-2.5 font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <span>Verify & Open Form to Edit →</span>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendCountdown > 0 || loading}
                    className="font-bold text-brand-700 hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer"
                  >
                    {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: VERIFICATION SUCCESS */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Identity Verified Successfully!
              </h3>
              <p className="text-xs text-slate-600">
                Opening your Ph.D. application for editing...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
