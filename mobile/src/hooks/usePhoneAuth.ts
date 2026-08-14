import { useCallback, useEffect, useState } from 'react';

import { authApi } from '@/api/client';
import { normalizePhoneInput } from '@/utils/phoneFormat';

export type PhoneAuthStep = 'phone' | 'code';

type SendCodeResponse = {
  phone?: string;
  phoneMasked?: string;
  resendAfterSeconds?: number;
  debugCode?: string;
};

type VerifyResponse = {
  token: string;
  userId: string;
  email?: string;
  phone?: string;
  displayName?: string;
  role?: string;
  avatar?: string;
  newUser?: boolean;
};

export function usePhoneAuth() {
  const [step, setStep] = useState<PhoneAuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [phoneNormalized, setPhoneNormalized] = useState('');
  const [phoneMasked, setPhoneMasked] = useState('');
  const [code, setCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [resendAfter, setResendAfter] = useState(0);
  const [debugCode, setDebugCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (resendAfter <= 0) return undefined;
    const id = setInterval(() => {
      setResendAfter((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [resendAfter]);

  const reset = useCallback(() => {
    setStep('phone');
    setPhone('');
    setPhoneNormalized('');
    setPhoneMasked('');
    setCode('');
    setDisplayName('');
    setResendAfter(0);
    setDebugCode('');
    setError('');
    setSubmitting(false);
  }, []);

  const sendCode = useCallback(async () => {
    setError('');
    setSubmitting(true);
    try {
      const normalized = normalizePhoneInput(phone);
      const res = (await authApi.sendPhoneCode(normalized)) as SendCodeResponse;
      setPhoneNormalized(res.phone || normalized);
      setPhoneMasked(res.phoneMasked || '');
      setResendAfter(res.resendAfterSeconds || 60);
      setDebugCode(res.debugCode || '');
      setStep('code');
      setCode(res.debugCode || '');
      return res;
    } finally {
      setSubmitting(false);
    }
  }, [phone]);

  const resendCode = useCallback(async () => {
    if (resendAfter > 0) return;
    setError('');
    setSubmitting(true);
    try {
      const normalized = phoneNormalized || normalizePhoneInput(phone);
      const res = (await authApi.sendPhoneCode(normalized)) as SendCodeResponse;
      setResendAfter(res.resendAfterSeconds || 60);
      setDebugCode(res.debugCode || '');
      if (res.debugCode) setCode(res.debugCode);
      return res;
    } finally {
      setSubmitting(false);
    }
  }, [phone, phoneNormalized, resendAfter]);

  const verifyCode = useCallback(async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = (await authApi.verifyPhoneCode({
        phone: phoneNormalized || normalizePhoneInput(phone),
        code: code.trim(),
        displayName: displayName.trim() || undefined,
      })) as VerifyResponse;
      return res;
    } finally {
      setSubmitting(false);
    }
  }, [phone, phoneNormalized, code, displayName]);

  return {
    step,
    setStep,
    phone,
    setPhone,
    phoneNormalized,
    phoneMasked,
    code,
    setCode,
    displayName,
    setDisplayName,
    resendAfter,
    debugCode,
    error,
    setError,
    submitting,
    sendCode,
    resendCode,
    verifyCode,
    reset,
  };
}
