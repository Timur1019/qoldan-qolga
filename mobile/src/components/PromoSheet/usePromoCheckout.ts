import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';

import { adsApi } from '@/api/client';
import { useLanguage } from '@/context/LanguageContext';
import type { AdListItemDto } from '@/types/api';
import type { PromoOrderDto, PromoProvider, PromoServiceDto } from '@/types/promo';
import { isMockPaymentUrl } from '@/utils/formatPromoMoney';

/**
 * Тарифы + создание заказа и переход к оплате (Payme / Click).
 */
export function usePromoCheckout(ad: AdListItemDto | null) {
  const { t, language } = useLanguage();
  const [plans, setPlans] = useState<PromoServiceDto[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [provider, setProvider] = useState<PromoProvider>('PAYME');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ad) return;
    let cancelled = false;
    setLoadingPlans(true);
    setError('');
    adsApi
      .getPromoServices()
      .then((list) => {
        if (cancelled) return;
        const items = Array.isArray(list) ? (list as PromoServiceDto[]) : [];
        setPlans(items);
        if (items.length > 0) setSelectedCode(items[0].code);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : t('common.error'));
      })
      .finally(() => {
        if (!cancelled) setLoadingPlans(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ad?.id, t]);

  const submit = async (onDone?: () => void) => {
    if (!ad?.id) return;
    if (!selectedCode) {
      setError(t('ads.promoSelectServiceWarning'));
      return;
    }
    if (!provider) {
      setError(t('ads.promoSelectProviderWarning'));
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const order = (await adsApi.createPromoOrder(ad.id, {
        serviceCode: selectedCode,
        provider,
      })) as PromoOrderDto;

      const orderId = order?.orderId;
      const paymentUrl = order?.paymentUrl?.trim() || '';
      if (!orderId) {
        setError(t('ads.promoOrderMissing'));
        return;
      }
      if (!paymentUrl) {
        setError(t('ads.promoPaymentUrlMissing'));
        return;
      }

      onDone?.();

      const mock = isMockPaymentUrl(paymentUrl);
      router.push({
        pathname: '/promo/result',
        params: { orderId, ...(mock ? { mock: '1' } : {}) },
      } as never);

      if (!mock) {
        await WebBrowser.openBrowserAsync(paymentUrl);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    plans,
    loadingPlans,
    selectedCode,
    setSelectedCode,
    provider,
    setProvider,
    submitting,
    error,
    setError,
    submit,
    isUz: language === 'uz',
  };
}
