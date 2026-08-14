import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

import type { PriceInsight as PriceInsightData } from '@/utils/priceInsight';
import { formatPrice } from '@/utils/formatters';

import { styles } from './PriceInsight.styles';

const TITLE_KEYS = {
  excellent: 'ads.priceInsightExcellent',
  good: 'ads.priceInsightGood',
  fair: 'ads.priceInsightFair',
  high: 'ads.priceInsightHigh',
} as const;

const MARKER_BORDER = {
  excellent: '#16a34a',
  good: '#65a30d',
  fair: '#ca8a04',
  high: '#ea580c',
} as const;

const TRACK_COLORS = ['#16a34a', '#84cc16', '#eab308', '#f97316'];

type Props = {
  insight: PriceInsightData | null;
  t: (key: string, fallback?: string) => string;
  overlay?: boolean;
};

export function PriceInsight({ insight, t, overlay = false }: Props) {
  const drop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!insight) return;
    drop.setValue(0);
    Animated.timing(drop, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [drop, insight?.tier, insight?.position]);

  if (!insight) return null;

  const amount =
    String(insight.currency || '').toUpperCase() === 'USD'
      ? formatPrice(insight.diff, 'USD')
      : formatPrice(Math.round(insight.diff), 'UZS');
  let hint = t('ads.priceInsightSimilar');
  if (insight.diff > 0) {
    hint = insight.cheaper
      ? t('ads.priceInsightCheaperBy').replace('{amount}', amount)
      : t('ads.priceInsightPricierBy').replace('{amount}', amount);
  }

  const translateY = drop.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });

  return (
    <Animated.View
      style={[
        overlay ? styles.overlay : styles.inline,
        { opacity: drop, transform: [{ translateY }] },
      ]}
      pointerEvents="none"
    >
      <View style={styles.card}>
        <Text style={[styles.title, styles[insight.tier]]}>{t(TITLE_KEYS[insight.tier])}</Text>
        <Text style={styles.hint}>{hint}</Text>
        <View style={styles.track}>
          <View style={styles.trackRow}>
            {TRACK_COLORS.map((color) => (
              <View key={color} style={[styles.trackSeg, { backgroundColor: color }]} />
            ))}
          </View>
          <View
            style={[
              styles.marker,
              {
                left: `${insight.position * 100}%`,
                borderColor: MARKER_BORDER[insight.tier],
              },
            ]}
          />
        </View>
        <View style={styles.labels}>
          <Text style={styles.label}>{t('ads.priceInsightRangeCheap')}</Text>
          <Text style={styles.label}>{t('ads.priceInsightRangeExpensive')}</Text>
        </View>
      </View>
    </Animated.View>
  );
}
