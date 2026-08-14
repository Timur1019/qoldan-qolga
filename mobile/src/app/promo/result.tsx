import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { adsApi } from '@/api/client';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { PromoOrderDto } from '@/types/promo';

import { styles } from '@/styles/screens/promoResult.styles';

const POLL_MS = 2000;
const MAX_POLLS = 20;

export default function PromoResultScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ orderId?: string; mock?: string }>();
  const orderId = typeof params.orderId === 'string' ? params.orderId : '';
  const isMock = params.mock === '1';

  const [status, setStatus] = useState('PENDING');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [polling, setPolling] = useState(!!orderId);

  useEffect(() => {
    if (!orderId) {
      setError(t('ads.promoOrderMissing'));
      setPolling(false);
      return undefined;
    }

    let cancelled = false;
    let polls = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = () => {
      adsApi
        .getPromoOrder(orderId)
        .then((res) => {
          if (cancelled) return;
          const order = res as PromoOrderDto;
          const next = order.status || 'PENDING';
          setStatus(next);
          if (next === 'PAID' || next === 'FAILED' || next === 'CANCELLED') {
            setPolling(false);
            return;
          }
          polls += 1;
          if (polls < MAX_POLLS) {
            timer = setTimeout(poll, POLL_MS);
          } else {
            setPolling(false);
          }
        })
        .catch((e) => {
          if (!cancelled) {
            setError(e instanceof Error ? e.message : t('common.error'));
            setPolling(false);
          }
        });
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId, t]);

  const completeMock = async () => {
    if (!orderId || busy) return;
    setBusy(true);
    setError('');
    try {
      await adsApi.mockCompletePromoPayment(orderId);
      setStatus('PAID');
      setPolling(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  const paid = status === 'PAID';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {paid ? t('ads.promoResultSuccessTitle') : t('ads.promoResultPendingTitle')}
        </Text>
        <Text style={styles.text}>
          {paid ? t('ads.promoResultSuccessText') : t('ads.promoResultPendingText')}
        </Text>

        {!paid && polling ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 8 }} />
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {isMock && !paid ? (
          <Pressable style={styles.mockBtn} onPress={() => void completeMock()} disabled={busy}>
            <Text style={styles.mockBtnText}>
              {busy ? t('common.loading') : t('ads.promoMockPayBtn')}
            </Text>
          </Pressable>
        ) : null}

        <Pressable style={styles.primary} onPress={() => router.replace('/(tabs)/sell')}>
          <Text style={styles.primaryText}>{t('ads.promoBackToMyAds')}</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.secondaryText}>{t('tabs.search')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
