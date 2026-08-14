import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { referenceApi } from '@/api/client';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { CategoryDto } from '@/types/api';
import { localizedName } from '@/utils/localizedName';

import { styles } from './FeedInterestsPicker.styles';

interface StackLevel {
  parentCode: string | null;
  title: string;
  items: CategoryDto[];
}

interface Props {
  roots: CategoryDto[];
  selectedCodes: string[];
  onChange: (codes: string[]) => void;
}

export function FeedInterestsPicker({ roots, selectedCodes, onChange }: Props) {
  const { language, t } = useLanguage();
  const [stack, setStack] = useState<StackLevel[]>([
    { parentCode: null, title: t('categories.all'), items: roots },
  ]);
  const [loading, setLoading] = useState(false);
  const [catByCode, setCatByCode] = useState<Record<string, CategoryDto>>({});

  const nameOf = useCallback((c: CategoryDto) => localizedName(c, language), [language]);

  useEffect(() => {
    setStack([{ parentCode: null, title: t('categories.all'), items: roots }]);
    setCatByCode((prev) => {
      const next = { ...prev };
      for (const r of roots) next[r.code] = r;
      return next;
    });
  }, [roots, t]);

  const level = stack[stack.length - 1];

  const remember = useCallback((items: CategoryDto[]) => {
    setCatByCode((prev) => {
      const next = { ...prev };
      for (const c of items) next[c.code] = c;
      return next;
    });
  }, []);

  const toggle = useCallback(
    (code: string) => {
      onChange(
        selectedCodes.includes(code) ? selectedCodes.filter((c) => c !== code) : [...selectedCodes, code]
      );
    },
    [onChange, selectedCodes]
  );

  const openChildren = async (cat: CategoryDto) => {
    if (!cat.hasChildren) {
      toggle(cat.code);
      return;
    }
    setLoading(true);
    try {
      const list = await referenceApi.getCategoryChildren(cat.code);
      const items = Array.isArray(list) ? (list as CategoryDto[]) : [];
      remember(items);
      setStack((prev) => [...prev, { parentCode: cat.code, title: nameOf(cat), items }]);
    } catch {
      toggle(cat.code);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (stack.length <= 1) return;
    setStack((prev) => prev.slice(0, -1));
  };

  return (
    <View style={styles.wrap}>
      {selectedCodes.length > 0 ? (
        <View style={styles.selectedWrap}>
          {selectedCodes.map((code) => (
            <Pressable key={code} style={styles.selectedChip} onPress={() => toggle(code)}>
              <Text style={styles.selectedText} numberOfLines={1}>
                {catByCode[code] ? nameOf(catByCode[code]) : code}
              </Text>
              <Ionicons name="close" size={14} color={colors.white} />
            </Pressable>
          ))}
        </View>
      ) : null}

      {stack.length > 1 ? (
        <Pressable style={styles.backRow} onPress={goBack}>
          <Ionicons name="chevron-back" size={18} color={colors.primary} />
          <Text style={styles.backText}>
            {catByCode[level.parentCode || '']
              ? nameOf(catByCode[level.parentCode!])
              : level.title}
          </Text>
        </Pressable>
      ) : (
        <Text style={styles.levelHint}>
          {language === 'ru' ? 'Отметьте или откройте ›' : 'Belgilang yoki › bilan ichiga kiring'}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        <ScrollView style={styles.list} nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {level.parentCode ? (
            <Pressable style={styles.row} onPress={() => toggle(level.parentCode!)}>
              <Ionicons
                name={selectedCodes.includes(level.parentCode) ? 'checkbox' : 'square-outline'}
                size={22}
                color={selectedCodes.includes(level.parentCode) ? colors.primary : colors.muted}
              />
              <Text style={styles.rowText}>
                {language === 'ru'
                  ? `Все «${catByCode[level.parentCode] ? nameOf(catByCode[level.parentCode]) : level.title}»`
                  : `Barcha «${catByCode[level.parentCode] ? nameOf(catByCode[level.parentCode]) : level.title}»`}
              </Text>
            </Pressable>
          ) : null}

          {level.items.map((c) => {
            const on = selectedCodes.includes(c.code);
            return (
              <View key={c.code} style={styles.row}>
                <Pressable onPress={() => toggle(c.code)} hitSlop={6} style={styles.checkHit}>
                  <Ionicons
                    name={on ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={on ? colors.primary : colors.muted}
                  />
                </Pressable>
                <Pressable style={styles.rowMain} onPress={() => openChildren(c)}>
                  <Text style={[styles.rowText, on && styles.rowTextOn]} numberOfLines={2}>
                    {nameOf(c)}
                  </Text>
                  {c.hasChildren ? (
                    <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                  ) : null}
                </Pressable>
              </View>
            );
          })}

          {level.items.length === 0 ? (
            <Text style={styles.empty}>{t('categories.blank', "Bo'sh")}</Text>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}
