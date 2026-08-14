import { Pressable, Text, View } from 'react-native';

import type { PromoServiceDto } from '@/types/promo';
import { formatPromoMoney } from '@/utils/formatPromoMoney';

import { styles } from './PromoPlanCard.styles';

type Props = {
  plan: PromoServiceDto;
  selected: boolean;
  onSelect: (code: string) => void;
  isUz: boolean;
  selectLabel: string;
  featured?: boolean;
};

export function PromoPlanCard({
  plan,
  selected,
  onSelect,
  isUz,
  selectLabel,
  featured = false,
}: Props) {
  const name = isUz ? plan.nameUz : plan.nameRu;
  const features = isUz ? plan.featuresUz || [] : plan.featuresRu || [];
  const duration = plan.durationDays;
  const durationLabel =
    duration == null
      ? null
      : isUz
        ? `${duration} kun`
        : `${duration} ${duration === 1 ? 'день' : 'дней'}`;

  return (
    <Pressable
      style={[styles.card, selected && styles.selected, featured && styles.featured]}
      onPress={() => onSelect(plan.code)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {featured ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Premium</Text>
        </View>
      ) : null}
      <View style={styles.head}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{formatPromoMoney(plan.price)}</Text>
        {durationLabel ? <Text style={styles.duration}>{durationLabel}</Text> : null}
      </View>
      <View style={styles.features}>
        {features.map((f) => (
          <View key={f} style={styles.feature}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>
      <View style={[styles.cta, selected && styles.ctaSelected]}>
        <Text style={[styles.ctaText, selected && styles.ctaTextSelected]}>{selectLabel}</Text>
      </View>
    </Pressable>
  );
}
