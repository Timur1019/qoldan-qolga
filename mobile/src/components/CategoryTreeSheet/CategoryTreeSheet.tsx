import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { referenceApi } from '@/api/client';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { CategoryDto } from '@/types/api';
import { localizedName } from '@/utils/localizedName';

import { styles } from './CategoryTreeSheet.styles';

interface Level {
  parent: CategoryDto | null;
  items: CategoryDto[];
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (cat: CategoryDto) => void;
}

export function CategoryTreeSheet({ visible, onClose, onSelect }: Props) {
  const { language, t } = useLanguage();
  const [stack, setStack] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setError('');
    setLoading(true);
    referenceApi
      .getCategories()
      .then((list) => {
        const items = Array.isArray(list) ? (list as CategoryDto[]) : [];
        setStack([{ parent: null, items }]);
      })
      .catch(() => {
        setStack([]);
        setError(t('categories.empty'));
      })
      .finally(() => setLoading(false));
  }, [visible, t]);

  const level = stack[stack.length - 1];
  const nameOf = (c: CategoryDto) => localizedName(c, language);

  const open = async (cat: CategoryDto) => {
    if (!cat.hasChildren) {
      onSelect(cat);
      onClose();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const list = await referenceApi.getCategoryChildren(cat.code);
      const items = Array.isArray(list) ? (list as CategoryDto[]) : [];
      if (items.length === 0) {
        onSelect(cat);
        onClose();
        return;
      }
      setStack((prev) => [...prev, { parent: cat, items }]);
    } catch {
      setError(t('categories.childrenError', "Bolalar yuklanmadi"));
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (stack.length <= 1) {
      onClose();
      return;
    }
    setStack((prev) => prev.slice(0, -1));
  };

  const title = level?.parent ? nameOf(level.parent) : t('categories.title', 'Kategoriya');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Pressable onPress={goBack} hitSlop={8} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </Pressable>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>

          {loading ? (
            <ActivityIndicator style={styles.loader} color={colors.primary} />
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled">
              {error ? <Text style={styles.error}>{error}</Text> : null}
              {level?.parent ? (
                <Pressable
                  style={styles.row}
                  onPress={() => {
                    onSelect(level.parent!);
                    onClose();
                  }}
                >
                  <Text style={styles.rowText}>
                    {language === 'ru'
                      ? `Все «${nameOf(level.parent)}»`
                      : `Barcha «${nameOf(level.parent)}»`}
                  </Text>
                </Pressable>
              ) : null}
              {(level?.items || []).map((c) => (
                <Pressable key={c.code} style={styles.row} onPress={() => open(c)}>
                  <Text style={styles.rowText}>{nameOf(c)}</Text>
                  {c.hasChildren ? (
                    <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                  ) : null}
                </Pressable>
              ))}
              {!error && (level?.items || []).length === 0 ? (
                <Text style={styles.empty}>{t('categories.blank', "Bo'sh")}</Text>
              ) : null}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
