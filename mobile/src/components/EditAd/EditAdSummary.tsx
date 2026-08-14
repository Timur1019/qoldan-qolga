import { Image, Pressable, Switch, Text, View } from 'react-native';

import { imageUrl } from '@/api/client';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { CreateAdFormState } from '@/utils/createAdForm';
import type { EditAdSummarySection } from '@/utils/editAdSummary';

import { styles } from './EditAdSummary.styles';

interface Props {
  sections: EditAdSummarySection[];
  form: CreateAdFormState;
  existingImageUrls: string[];
  showDeliverToggle: boolean;
  onEdit: (key: EditAdSummarySection['key']) => void;
  onToggleDeliver: (value: boolean) => void;
}

export function EditAdSummary({
  sections,
  form,
  existingImageUrls,
  showDeliverToggle,
  onEdit,
  onToggleDeliver,
}: Props) {
  const { t } = useLanguage();
  return (
    <View>
      <View style={styles.list}>
        {sections.map((section) => (
          <View key={section.key} style={styles.section}>
            <View style={styles.head}>
              <Text style={styles.title}>{section.title}</Text>
              <Pressable onPress={() => onEdit(section.key)} hitSlop={8}>
                <Text style={styles.change}>{t('edit.change')}</Text>
              </Pressable>
            </View>

            {section.key === 'photos' ? (
              <View style={styles.photoRow}>
                {existingImageUrls.slice(0, 4).map((uri) => (
                  <Image key={uri} source={{ uri: imageUrl(uri) }} style={styles.photo} />
                ))}
                {form.localImages.slice(0, 4).map((uri) => (
                  <Image key={uri} source={{ uri }} style={styles.photo} />
                ))}
                {!existingImageUrls.length && !form.localImages.length ? (
                  <Text style={[styles.line, styles.lineMuted]}>{t('edit.noPhotos')}</Text>
                ) : null}
              </View>
            ) : (
              section.lines.map((line, idx) => (
                <Text
                  key={`${section.key}-${idx}`}
                  style={[styles.line, (!line || line === '—') && styles.lineMuted]}
                  numberOfLines={section.key === 'description' ? 4 : 3}
                >
                  {line}
                </Text>
              ))
            )}
          </View>
        ))}
      </View>

      {showDeliverToggle ? (
        <View style={styles.deliverCard}>
          <Text style={styles.deliverText}>{t('edit.deliver')}</Text>
          <Switch
            value={form.canDeliver}
            onValueChange={onToggleDeliver}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      ) : null}
    </View>
  );
}
