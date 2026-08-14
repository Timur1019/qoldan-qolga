import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { businessApplicationsApi } from '@/api/client';
import {
  BUSINESS_PRODUCT_CATEGORIES,
  BUSINESS_TYPES,
} from '@/constants/businessSignup';
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { colors } from '@/theme/colors';
import {
  clearBusinessApplicationPending,
  getBusinessApplicationPending,
  markBusinessApplicationPending,
} from '@/utils/businessPending';

import { styles } from '@/styles/screens/business.styles';

type DocPick = { uri: string; name: string } | null;

export default function BusinessScreen() {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const requireAuth = useRequireAuth();

  const storeVerified = Boolean(user?.storeVerified);
  const [pendingAt, setPendingAt] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
  const [businessType, setBusinessType] = useState('self');
  const [city, setCity] = useState('');
  const [productCategory, setProductCategory] = useState('fashion');
  const [shopUrl, setShopUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [passport, setPassport] = useState<DocPick>(null);
  const [registration, setRegistration] = useState<DocPick>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof user?.displayName === 'string') setFullName(user.displayName);
    if (typeof user?.phone === 'string') setPhone(user.phone);
  }, [user?.displayName, user?.phone]);

  useEffect(() => {
    void getBusinessApplicationPending().then((v) => setPendingAt(v));
  }, []);

  useEffect(() => {
    if (storeVerified) {
      void clearBusinessApplicationPending().then(() => setPendingAt(null));
    }
  }, [storeVerified]);

  const pickDoc = async (kind: 'passport' | 'registration') => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError('Galereyaga kirishga ruxsat bering');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (res.canceled || !res.assets[0]) return;
    const asset = res.assets[0];
    const pick = { uri: asset.uri, name: asset.fileName || `${kind}.jpg` };
    if (kind === 'passport') setPassport(pick);
    else setRegistration(pick);
  };

  const submit = async () => {
    setError('');
    if (!fullName.trim() || !shopName.trim() || !city.trim() || !phone.trim()) {
      setError("Majburiy maydonlarni to'ldiring");
      return;
    }
    if (!passport || !registration) {
      setError("Pasport va ro‘yxatdan o‘tish hujjatini yuklang");
      return;
    }
    if (!agreement) {
      setError('Shartlarga rozilik kerak');
      return;
    }
    setSubmitting(true);
    try {
      await businessApplicationsApi.submit({
        fullName,
        shopName,
        businessType,
        city,
        productCategory,
        shopUrl,
        phone: phone.startsWith('+') ? phone : `+998${phone.replace(/\D/g, '')}`,
        agreement,
        passportUri: passport.uri,
        registrationUri: registration.uri,
      });
      await markBusinessApplicationPending();
      setPendingAt(new Date().toISOString());
      setSuccess(true);
      await refreshUser();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Biznes uchun' }} />
        <View style={styles.content}>
          <Text style={styles.heroTitle}>Kirish kerak</Text>
          <Pressable style={styles.submit} onPress={() => requireAuth(() => router.replace('/business'))}>
            <Text style={styles.submitText}>Kirish</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Biznes uchun' }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          {storeVerified ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PRO · MAGAZIN ULANGAN</Text>
            </View>
          ) : pendingAt || success ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ARIZA KO‘RIB CHIQILMOQDA</Text>
            </View>
          ) : (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PRO ULASH</Text>
            </View>
          )}
          <Text style={styles.heroTitle}>Qoldan Qolga biznes uchun</Text>
          <Text style={styles.heroText}>
            Do‘kon sifatida e‘lon joylashtiring, brendingizni ko‘rsating va ko‘proq xaridorlarga
            chiqing.
          </Text>
        </View>

        {storeVerified ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Pro magazin faol</Text>
            <Text style={styles.successText}>
              Profilingizda «Magazin» belgisi chiqadi. E‘lonlarda sotuvchi turi Biznes / magazin
              sifatida ko‘rinadi.
            </Text>
            <Pressable style={styles.submit} onPress={() => router.push('/(tabs)/sell')}>
              <Text style={styles.submitText}>Mening e'lonlarim</Text>
            </Pressable>
          </View>
        ) : success || pendingAt ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Ariza yuborildi</Text>
            <Text style={styles.successText}>
              Maʼlumotlar tekshirilgach Pro magazin holati avtomatik yoqiladi. Holatni shu
              bo‘limda kuzatishingiz mumkin.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                <Text style={styles.benefitText}>Magazin belgisi va ishonch</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                <Text style={styles.benefitText}>Biznes sifatida e'lonlar</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                <Text style={styles.benefitText}>Ko‘proq xaridorlarga chiqish</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View>
                <Text style={styles.label}>F.I.Sh *</Text>
                <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
              </View>
              <View>
                <Text style={styles.label}>Do‘kon nomi *</Text>
                <TextInput style={styles.input} value={shopName} onChangeText={setShopName} />
              </View>
              <View>
                <Text style={styles.label}>Biznes turi *</Text>
                <View style={styles.chipRow}>
                  {BUSINESS_TYPES.map((t) => {
                    const on = businessType === t.value;
                    return (
                      <Pressable
                        key={t.value}
                        style={[styles.chip, on && styles.chipOn]}
                        onPress={() => setBusinessType(t.value)}
                      >
                        <Text style={[styles.chipText, on && styles.chipTextOn]}>{t.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              <View>
                <Text style={styles.label}>Shahar *</Text>
                <TextInput style={styles.input} value={city} onChangeText={setCity} />
              </View>
              <View>
                <Text style={styles.label}>Yo‘nalish *</Text>
                <View style={styles.chipRow}>
                  {BUSINESS_PRODUCT_CATEGORIES.map((c) => {
                    const on = productCategory === c.value;
                    return (
                      <Pressable
                        key={c.value}
                        style={[styles.chip, on && styles.chipOn]}
                        onPress={() => setProductCategory(c.value)}
                      >
                        <Text style={[styles.chipText, on && styles.chipTextOn]}>{c.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              <View>
                <Text style={styles.label}>Telefon *</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="+998..."
                  placeholderTextColor={colors.muted}
                />
              </View>
              <View>
                <Text style={styles.label}>Sayt / Instagram (ixtiyoriy)</Text>
                <TextInput
                  style={styles.input}
                  value={shopUrl}
                  onChangeText={setShopUrl}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.card}>
              <Pressable
                style={[styles.fileBtn, passport && styles.fileBtnOn]}
                onPress={() => void pickDoc('passport')}
              >
                <Text style={styles.fileTitle}>Pasport *</Text>
                <Text style={styles.fileHint}>{passport ? passport.name : 'Rasm tanlang'}</Text>
              </Pressable>
              <Pressable
                style={[styles.fileBtn, registration && styles.fileBtnOn]}
                onPress={() => void pickDoc('registration')}
              >
                <Text style={styles.fileTitle}>Ro‘yxatdan o‘tish hujjati *</Text>
                <Text style={styles.fileHint}>
                  {registration ? registration.name : 'Rasm tanlang'}
                </Text>
              </Pressable>
              <View style={styles.checkRow}>
                <Switch
                  value={agreement}
                  onValueChange={setAgreement}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
                <Text style={styles.checkText}>
                  Maʼlumotlarim to‘g‘ri ekaniga va Pro magazin qoidalariga roziman.
                </Text>
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={[styles.submit, submitting && styles.submitDisabled]}
              onPress={() => void submit()}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitText}>Pro ulash · ariza yuborish</Text>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
