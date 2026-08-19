import { Ionicons } from '@expo/vector-icons';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { CreateAdFormState } from '@/utils/createAdForm';
import { styles } from '@/styles/screens/createAd.styles';

type Props = {
  form: CreateAdFormState;
  patch: (partial: Partial<CreateAdFormState>) => void;
  onOpenCategory: () => void;
  t: (key: string, fallback?: string) => string;
  localizedCategory: string | null;
};

export function CreateAdBasicsSection({
  form,
  patch,
  onOpenCategory,
  t,
  localizedCategory,
}: Props) {
  return (
    <>
      <View>
        <Text style={styles.label}>{t('create.category')}</Text>
        <Pressable style={styles.selectBtn} onPress={onOpenCategory}>
          <Ionicons name="grid-outline" size={18} color={colors.primary} />
          <Text
            style={[styles.selectText, !form.category && styles.selectPlaceholder]}
            numberOfLines={1}
          >
            {localizedCategory || t('categories.select')}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.muted} />
        </Pressable>
      </View>

      <View>
        <Text style={styles.label}>{t('create.adTitle')}</Text>
        <TextInput
          style={styles.input}
          value={form.title}
          onChangeText={(title) => patch({ title })}
          placeholder={t('create.titlePlaceholder')}
          placeholderTextColor={colors.muted}
        />
      </View>

      <View>
        <Text style={styles.label}>{t('create.description')}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.description}
          onChangeText={(description) => patch({ description })}
          placeholder={t('create.descPlaceholder')}
          placeholderTextColor={colors.muted}
          multiline
        />
      </View>

      <View>
        <Text style={styles.label}>{t('create.price')}</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex]}
            value={form.price}
            onChangeText={(price) => patch({ price })}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.muted}
            editable={!form.giveAway}
          />
          <View style={styles.chipRow}>
            {(['UZS', 'USD'] as const).map((c) => (
              <Pressable
                key={c}
                style={[styles.chip, form.currency === c && styles.chipOn]}
                onPress={() => patch({ currency: c })}
              >
                <Text style={[styles.chipText, form.currency === c && styles.chipTextOn]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('edit.negotiable')}</Text>
          <Switch
            value={form.isNegotiable}
            onValueChange={(isNegotiable) => patch({ isNegotiable })}
            trackColor={{ true: colors.primary }}
          />
        </View>
      </View>
    </>
  );
}
