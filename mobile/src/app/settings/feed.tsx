import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';

import { referenceApi } from '@/api/client';
import { FeedSettingsSheet } from '@/components/FeedSettingsSheet/FeedSettingsSheet';
import { useLanguage } from '@/context/LanguageContext';
import type { CategoryDto } from '@/types/api';

/** Экран «Настройка ленты» — тот же UI, что sheet в профиле. */
export default function FeedSettingsScreen() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [draftInterests, setDraftInterests] = useState<string[]>([]);
  const [draftRegion, setDraftRegion] = useState('');

  useEffect(() => {
    referenceApi
      .getCategories()
      .then((list) => setCategories(Array.isArray(list) ? (list as CategoryDto[]) : []))
      .catch(() => setCategories([]));
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: t('settings.feed'), headerShown: false }} />
      <FeedSettingsSheet
        visible
        onClose={() => router.back()}
        regionCode={draftRegion}
        categories={categories}
        selectedCodes={draftInterests}
        onChangeInterests={setDraftInterests}
        onChangeRegion={setDraftRegion}
        onSave={() => router.back()}
        onReset={() => {
          setDraftInterests([]);
          setDraftRegion('');
          router.back();
        }}
      />
    </>
  );
}
