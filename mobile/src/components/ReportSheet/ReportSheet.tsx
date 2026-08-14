import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

import { adsApi, isAuthError } from '@/api/client';
import { REPORT_REASONS } from '@/constants/adDetail';
import { colors } from '@/theme/colors';

import { styles } from './ReportSheet.styles';

interface Props {
  visible: boolean;
  adId: string;
  onClose: () => void;
  onSubmitted?: () => void;
  onAuthRequired?: () => void;
}

export function ReportSheet({ visible, adId, onClose, onSubmitted, onAuthRequired }: Props) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const close = () => {
    setReason('');
    setError('');
    setDone(false);
    onClose();
  };

  const submit = async () => {
    if (!reason) return;
    setSubmitting(true);
    setError('');
    try {
      await adsApi.report(adId, { reason });
      setDone(true);
      onSubmitted?.();
    } catch (e) {
      if (isAuthError(e)) {
        onAuthRequired?.();
        close();
        return;
      }
      setError(e instanceof Error ? e.message : 'Xatolik');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={close} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{done ? 'Yuborildi' : 'Shikoyat'}</Text>
            <Pressable onPress={close} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>

          {done ? (
            <View style={styles.body}>
              <Text style={styles.doneText}>Shikoyatingiz qabul qilindi. Tekshiramiz.</Text>
              <Pressable style={styles.submit} onPress={close}>
                <Text style={styles.submitText}>Yopish</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.body}>
              {REPORT_REASONS.map((r) => {
                const on = reason === r.value;
                return (
                  <Pressable key={r.value} style={styles.row} onPress={() => setReason(r.value)}>
                    <Ionicons
                      name={on ? 'radio-button-on' : 'radio-button-off'}
                      size={22}
                      color={on ? colors.primary : colors.muted}
                    />
                    <Text style={[styles.rowText, on && styles.rowTextOn]}>{r.label}</Text>
                  </Pressable>
                );
              })}
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Pressable
                style={[styles.submit, (!reason || submitting) && styles.submitDisabled]}
                onPress={submit}
                disabled={!reason || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.submitText}>Yuborish</Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
