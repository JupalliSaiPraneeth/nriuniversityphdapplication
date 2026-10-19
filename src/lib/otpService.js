import { dbService, supabase, isSupabaseConfigured } from './supabase';

// In-memory OTP cache for instant delivery & verification
const otpCache = new Map();

/**
 * Generate a random 6-digit verification code.
 */
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const otpService = {
  /**
   * Request OTP for candidate email
   */
  async requestOTP(rawEmail) {
    if (!rawEmail || !rawEmail.trim()) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const email = rawEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address format (e.g. candidate@example.com).' };
    }

    // 1. Look up submitted application by email
    const application = await dbService.findApplicationByEmail(email);
    if (!application) {
      return {
        success: false,
        error: `No submitted Ph.D. application found for "${email}". Please check the email entered or fill out a new application.`,
      };
    }

    // 2. Local fallback code (valid 10 minutes)
    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    const otpData = {
      code,
      email,
      applicationId: application.id,
      applicationNumber: application.application_number,
      expiresAt,
      attempts: 0,
    };

    otpCache.set(email, otpData);
    try {
      sessionStorage.setItem(`nriit_otp_${email}`, JSON.stringify(otpData));
    } catch (e) {}

    // 3. Dispatch real email OTP through Supabase & configured SMTP
    const emailDelivery = {
      channel: 'supabase',
      sentToInbox: false,
      reason: null,
    };

    if (isSupabaseConfigured() && supabase?.auth?.signInWithOtp) {
      try {
        const { error: supaErr } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
          },
        });
        if (supaErr) {
          console.warn('[Supabase Auth OTP dispatch note]:', supaErr.message);
          emailDelivery.reason = supaErr.message;
        } else {
          emailDelivery.sentToInbox = true;
        }
      } catch (err) {
        emailDelivery.reason = err.message;
      }
    }

    // 4. Optional EmailJS dispatch if configured
    const emailJsService = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const emailJsTemplate = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const emailJsKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (emailJsService && emailJsTemplate && emailJsKey) {
      try {
        const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: emailJsService,
            template_id: emailJsTemplate,
            user_id: emailJsKey,
            template_params: {
              to_email: email,
              otp_code: code,
              candidate_name: application.applicant_name || 'Candidate',
              application_number: application.application_number || '',
              sender_name: 'Dr. RVR NRI Institute of Technology (Deemed to be University)',
              institute_name: 'Dr. RVR NRI Institute of Technology (Deemed to be University)',
            },
          }),
        });
        if (emailRes.ok) {
          emailDelivery.channel = 'emailjs';
          emailDelivery.sentToInbox = true;
        }
      } catch (err) {
        console.warn('EmailJS dispatch note:', err);
      }
    }

    return {
      success: true,
      email,
      code,
      delivery: emailDelivery,
      application,
      message: `A verification code has been dispatched to ${email}.`,
    };
  },

  /**
   * Verify entered OTP (accepts the code from Supabase email or local fallback)
   */
  async verifyOTP(rawEmail, inputCode) {
    if (!rawEmail || !inputCode) {
      return { success: false, error: 'Email and verification code are required.' };
    }

    const email = rawEmail.trim().toLowerCase();
    const cleanCode = String(inputCode).trim();

    // Retrieve local session if present
    let otpData = otpCache.get(email);
    if (!otpData) {
      try {
        const stored = sessionStorage.getItem(`nriit_otp_${email}`);
        if (stored) otpData = JSON.parse(stored);
      } catch (e) {}
    }

    let isVerified = false;

    // 1. Verify with Supabase Auth OTP (handles the 8-digit or 6-digit token sent to user's real email)
    if (isSupabaseConfigured() && supabase?.auth?.verifyOtp) {
      // Try 'email'
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: cleanCode,
          type: 'email',
        });
        if (!error && (data?.user || data?.session)) {
          isVerified = true;
        }
      } catch (err) {}

      // Try 'signup' if needed
      if (!isVerified) {
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: cleanCode,
            type: 'signup',
          });
          if (!error && (data?.user || data?.session)) {
            isVerified = true;
          }
        } catch (err) {}
      }

      // Try 'magiclink' if needed
      if (!isVerified) {
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: cleanCode,
            type: 'magiclink',
          });
          if (!error && (data?.user || data?.session)) {
            isVerified = true;
          }
        } catch (err) {}
      }
    }

    // 2. Also accept local generated code if available
    if (!isVerified && otpData && otpData.code === cleanCode && Date.now() <= otpData.expiresAt) {
      isVerified = true;
    }

    if (!isVerified) {
      if (otpData) {
        otpData.attempts += 1;
        otpCache.set(email, otpData);
      }
      return {
        success: false,
        error: 'Incorrect verification code. Please check the code in your email and try again.',
      };
    }

    // Find the candidate's application
    const appId = otpData?.applicationId;
    let application = null;
    if (appId) {
      application = await dbService.getApplication(appId);
    }
    if (!application) {
      application = await dbService.findApplicationByEmail(email);
    }

    // Clean up used OTP
    otpCache.delete(email);
    try {
      sessionStorage.removeItem(`nriit_otp_${email}`);
    } catch (e) {}

    return {
      success: true,
      application,
      message: 'Email successfully verified.',
    };
  },
};
