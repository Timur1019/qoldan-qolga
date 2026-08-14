import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';

import { styles } from './LookupSheet.styles';

export interface LookupItem {
  value: string;
  label: string;
}

interface Props {
  visible: boolean;
  title: string;
  items: LookupItem[];
  value: string;
  onClose: () => void;
  onSelect: (value: string) => void;
  allowClear?: boolean;
  clearLabel?: string;
  searchPlaceholder?: string;
  /**
   * overlay — внутри уже открытой Modal (фильтры).
   * modal — отдельное окно (по умолчанию).
   */
  mode?: 'modal' | 'overlay';
}

function LookupContent({
  title,
  items,
  value,
  onClose,
  onSelect,
  allowClear = true,
  clearLabel = 'Barchasi',
  searchPlaceholder = 'Qidirish...',
  resetKey,
}: Omit<Props, 'visible' | 'mode'> & { resetKey: boolean }) {
  const [q, setQ] = useState('');

  useEffect(() => {
    if (resetKey) setQ('');
  }, [resetKey]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (i) => i.label.toLowerCase().includes(needle) || i.value.toLowerCase().includes(needle)
    );
  }, [items, q]);

  return (
    <View style={styles.sheetInner}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={8} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={onClose} hitSlop={8}>
          <Ionicons name="close" size={22} color={colors.muted} />
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder={searchPlaceholder}
          placeholderTextColor={colors.muted}
          value={q}
          onChangeText={setQ}
          autoCorrect={false}
          autoFocus
        />
      </View>

      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={(i) => i.value}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          allowClear ? (
            <Pressable
              style={[styles.row, !value && styles.rowOn]}
              onPress={() => {
                onSelect('');
                onClose();
              }}
            >
              <Text style={[styles.rowText, !value && styles.rowTextOn]}>{clearLabel}</Text>
              {!value ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
            </Pressable>
          ) : null
        }
        renderItem={({ item }) => {
          const on = value === item.value;
          return (
            <Pressable
              style={[styles.row, on && styles.rowOn]}
              onPress={() => {
                onSelect(item.value);
                onClose();
              }}
            >
              <Text style={[styles.rowText, on && styles.rowTextOn]}>{item.label}</Text>
              {on ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>{items.length === 0 ? "Ro'yxat bo'sh" : 'Topilmadi'}</Text>
        }
      />
    </View>
  );
}

export function LookupSheet({
  visible,
  mode = 'modal',
  ...rest
}: Props) {
  if (!visible) return null;

  if (mode === 'overlay') {
    return (
      <View style={styles.overlayFill}>
        <LookupContent {...rest} resetKey={visible} />
      </View>
    );
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={rest.onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <LookupContent {...rest} resetKey={visible} />
        </View>
      </View>
    </Modal>
  );
}
