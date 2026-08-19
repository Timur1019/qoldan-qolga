import { Pressable, Switch, Text, View } from 'react-native';

import type { CategoryFilterFlags } from '@/constants/categoryFilters';
import { CONDITION_OPTIONS } from '@/constants/filterOptions';
import { normalizeSellerType, sellerTypeOptionsForCategory } from '@/constants/sellerTypes';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { CategoryDto } from '@/types/api';
import type { CreateAdFormState } from '@/utils/createAdForm';

import { styles } from '@/styles/screens/createAd.styles';

interface Props {
  flags: CategoryFilterFlags;
  form: CreateAdFormState;
  patch: (partial: Partial<CreateAdFormState>) => void;
  breadcrumb?: CategoryDto[];
}

export function CreateAdExtrasSection({ flags, form, patch, breadcrumb = [] }: Props) {
  const { t } = useLanguage();
  const sellerOptions = sellerTypeOptionsForCategory(form.category?.code, breadcrumb);
  const current = normalizeSellerType(form.sellerType) || form.sellerType;

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{t('create.extra')}</Text>

      <View>
        <Text style={styles.label}>{t('ads.sellerType')}</Text>
        <View style={styles.chipRow}>
          {sellerOptions.map((o) => {
            const on = current === o.value;
            return (
              <Pressable
                key={o.value}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => patch({ sellerType: o.value })}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{t(o.labelKey)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {flags.condition ? (
        <View>
          <Text style={styles.label}>{t('ads.condition')}</Text>
          <View style={styles.chipRow}>
            {CONDITION_OPTIONS.map((o) => {
              const on = form.itemCondition === o.value;
              return (
                <Pressable
                  key={o.value}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => patch({ itemCondition: o.value })}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{o.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {flags.canDeliver ? (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('ads.canDeliver')}</Text>
          <Switch
            value={!!form.canDeliver}
            onValueChange={(canDeliver) => patch({ canDeliver })}
            trackColor={{ true: colors.primary }}
          />
        </View>
      ) : null}

      {flags.giveAway ? (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('ads.giveAway')}</Text>
          <Switch
            value={!!form.giveAway}
            onValueChange={(giveAway) => patch({ giveAway, ...(giveAway ? { price: '0' } : {}) })}
            trackColor={{ true: colors.primary }}
          />
        </View>
      ) : null}

      {flags.urgentBargain ? (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('ads.urgentBargain')}</Text>
          <Switch
            value={!!form.urgentBargain}
            onValueChange={(urgentBargain) => patch({ urgentBargain })}
            trackColor={{ true: colors.primary }}
          />
        </View>
      ) : null}

      {flags.canRent ? (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('ads.canRent')}</Text>
          <Switch
            value={!!form.canRent}
            onValueChange={(canRent) => patch({ canRent })}
            trackColor={{ true: colors.primary }}
          />
        </View>
      ) : null}

      {flags.license ? (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('ads.hasLicense')}</Text>
          <Switch
            value={!!form.hasLicense}
            onValueChange={(hasLicense) => patch({ hasLicense })}
            trackColor={{ true: colors.primary }}
          />
        </View>
      ) : null}

      {flags.contract ? (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('ads.worksByContract')}</Text>
          <Switch
            value={!!form.worksByContract}
            onValueChange={(worksByContract) => patch({ worksByContract })}
            trackColor={{ true: colors.primary }}
          />
        </View>
      ) : null}
    </View>
  );
}
