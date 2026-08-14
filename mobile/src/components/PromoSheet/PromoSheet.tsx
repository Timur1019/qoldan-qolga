import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { AdListItemDto } from '@/types/api';
import type { PromoProvider } from '@/types/promo';

import { PromoAdPreview } from './PromoAdPreview';
import { PromoPlanCard } from './PromoPlanCard';
import { styles } from './PromoSheet.styles';
import { usePromoCheckout } from './usePromoCheckout';

type Props = {
  visible: boolean;
  ad: AdListItemDto | null;
  onClose: () => void;
};

export function PromoSheet({ visible, ad, onClose }: Props) {
  const { t } = useLanguage();
  const {
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
    isUz,
  } = usePromoCheckout(visible ? ad : null);

  if (!ad) return null;

  const day1 = plans.find((p) => p.code === 'day1');
  const week7 = plans.find((p) => p.code === 'week7');
  const month30 = plans.find((p) => p.code === 'month30');
  const premium = plans.find((p) => p.code === 'premium');
  const otherPlans = plans.filter(
    (p) => !['day1', 'week7', 'month30', 'premium'].includes(p.code)
  );

  const selectPlan = (code: string) => {
    setSelectedCode(code);
    setError('');
  };

  const selectProvider = (next: PromoProvider) => {
    setProvider(next);
    setError('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('ads.promoModalTitle')}</Text>
            <Pressable style={styles.close} onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <Text style={styles.sectionLabel}>{t('ads.promoYourAd')}</Text>
            <PromoAdPreview ad={ad} />

            {loadingPlans ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 24 }} />
            ) : (
              <>
                {day1 ? (
                  <PromoPlanCard
                    plan={day1}
                    selected={selectedCode === day1.code}
                    onSelect={selectPlan}
                    isUz={isUz}
                    selectLabel={t('ads.promoSelectPlan')}
                  />
                ) : null}
                {week7 ? (
                  <PromoPlanCard
                    plan={week7}
                    selected={selectedCode === week7.code}
                    onSelect={selectPlan}
                    isUz={isUz}
                    selectLabel={t('ads.promoSelectPlan')}
                  />
                ) : null}
                {month30 ? (
                  <PromoPlanCard
                    plan={month30}
                    selected={selectedCode === month30.code}
                    onSelect={selectPlan}
                    isUz={isUz}
                    selectLabel={t('ads.promoSelectPlan')}
                  />
                ) : null}
                {otherPlans.map((plan) => (
                  <PromoPlanCard
                    key={plan.code}
                    plan={plan}
                    selected={selectedCode === plan.code}
                    onSelect={selectPlan}
                    isUz={isUz}
                    selectLabel={t('ads.promoSelectPlan')}
                  />
                ))}
                {premium ? (
                  <PromoPlanCard
                    plan={premium}
                    selected={selectedCode === premium.code}
                    onSelect={selectPlan}
                    isUz={isUz}
                    selectLabel={t('ads.promoSelectPlan')}
                    featured
                  />
                ) : null}
              </>
            )}

            <View style={styles.providers}>
              <Text style={styles.sectionLabel}>{t('ads.promoPayWith')}</Text>
              <View style={styles.providerRow}>
                <Pressable
                  style={[styles.provider, provider === 'PAYME' && styles.providerActive]}
                  onPress={() => selectProvider('PAYME')}
                >
                  <Text
                    style={[
                      styles.providerText,
                      provider === 'PAYME' && styles.providerTextActive,
                    ]}
                  >
                    Payme
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.provider, provider === 'CLICK' && styles.providerActive]}
                  onPress={() => selectProvider('CLICK')}
                >
                  <Text
                    style={[
                      styles.providerText,
                      provider === 'CLICK' && styles.providerTextActive,
                    ]}
                  >
                    Click
                  </Text>
                </Pressable>
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={[styles.payBtn, (submitting || loadingPlans) && styles.payBtnDisabled]}
              disabled={submitting || loadingPlans}
              onPress={() => void submit(onClose)}
            >
              <Text style={styles.payBtnText}>
                {submitting ? t('common.loading') : t('ads.promoPromoteBtn')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
