import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { JOB_HIRE, JOB_SEEK, jobFieldFlags } from '@/constants/jobCategories';
import type { CategoryDto } from '@/types/api';

import { styles } from '@/styles/screens/category.styles';

interface Props {
  categoryCode?: string;
  breadcrumb?: CategoryDto[];
}

export function JobModeBar({ categoryCode, breadcrumb = [] }: Props) {
  const flags = jobFieldFlags(categoryCode, breadcrumb);
  if (!flags.jobs) return null;
  return (
    <View style={styles.subChipsWrap}>
      <Pressable
        style={[styles.subChip, flags.seek && styles.subChipOn]}
        onPress={() => router.push(`/categories/${JOB_SEEK}`)}
      >
        <Text style={[styles.subChipText, flags.seek && styles.subChipTextOn]}>Ish qidiraman</Text>
      </Pressable>
      <Pressable
        style={[styles.subChip, flags.hire && styles.subChipOn]}
        onPress={() => router.push(`/categories/${JOB_HIRE}`)}
      >
        <Text style={[styles.subChipText, flags.hire && styles.subChipTextOn]}>Xodim qidiraman</Text>
      </Pressable>
    </View>
  );
}
