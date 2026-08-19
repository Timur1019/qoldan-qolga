import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CreateAdBasicsSection } from '@/components/CreateAdForm/CreateAdBasicsSection';
import { CreateAdBrandSection } from '@/components/CreateAdForm/CreateAdBrandSection';
import { CreateAdContactsSection } from '@/components/CreateAdForm/CreateAdContactsSection';
import { CreateAdExtrasSection } from '@/components/CreateAdForm/CreateAdExtrasSection';
import { CreateAdLocationSection } from '@/components/CreateAdForm/CreateAdLocationSection';
import { CreateAdLookupSheets } from '@/components/CreateAdForm/CreateAdLookupSheets';
import { CreateAdPhotosSection } from '@/components/CreateAdForm/CreateAdPhotosSection';
import { CreateAdRealEstateSection } from '@/components/CreateAdForm/CreateAdRealEstateSection';
import { CreateAdTransportSection } from '@/components/CreateAdForm/CreateAdTransportSection';
import { EditAdSectionSheet } from '@/components/EditAd/EditAdSectionSheet';
import { EditAdSummary } from '@/components/EditAd/EditAdSummary';
import { useCreateAdScreen } from '@/hooks/useCreateAdScreen';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { colors } from '@/theme/colors';
import { buildEditAdSummary, type EditAdSectionKey } from '@/utils/editAdSummary';
import { localizedName } from '@/utils/localizedName';

import { styles } from '@/styles/screens/createAd.styles';

export default function CreateAdScreen() {
  const params = useLocalSearchParams<{ editId?: string | string[] }>();
  const editId = Array.isArray(params.editId) ? params.editId[0] : params.editId;
  const requireAuth = useRequireAuth();
  const [editSection, setEditSection] = useState<EditAdSectionKey | null>(null);

  const screen = useCreateAdScreen(editId);
  const {
    isEdit,
    isAuthenticated,
    language,
    t,
    form,
    patch,
    existingImageUrls,
    setExistingImageUrls,
    loadingEdit,
    breadcrumb,
    brands,
    models,
    transport,
    realEstate,
    flags,
    categoryOpen,
    setCategoryOpen,
    lookup,
    setLookup,
    submitting,
    error,
    regions,
    selectedRegion,
    regionLabel,
    regionItems,
    districtItems,
    brandItems,
    modelItems,
    pickImages,
    onCategorySelect,
    submit,
  } = screen;

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: isEdit ? t('edit.title') : t('create.title') }} />
        <View style={{ padding: 24, gap: 12 }}>
          <Text style={styles.label}>{t('common.loginRequired')}</Text>
          <Pressable
            style={styles.submit}
            onPress={() =>
              requireAuth(() =>
                router.replace(isEdit && editId ? `/ads/create?editId=${editId}` : '/ads/create')
              )
            }
          >
            <Text style={styles.submitText}>{t('common.login')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (loadingEdit) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: t('edit.title') }} />
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const editSections = buildEditAdSummary(form, {
    existingImageCount: existingImageUrls.length,
    regionLabel: selectedRegion ? localizedName(selectedRegion, language, '') : '',
    language,
    t,
  });

  const sheets = (
    <CreateAdLookupSheets
      categoryOpen={categoryOpen}
      onCloseCategory={() => setCategoryOpen(false)}
      onCategorySelect={onCategorySelect}
      lookup={lookup}
      onCloseLookup={() => setLookup(null)}
      regionItems={regionItems}
      districtItems={districtItems}
      brandItems={brandItems}
      modelItems={modelItems}
      form={form}
      brands={brands}
      models={models}
      language={language}
      patch={patch}
      t={t}
    />
  );

  if (isEdit) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen options={{ title: t('edit.title') }} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <EditAdSummary
            sections={editSections}
            form={form}
            existingImageUrls={existingImageUrls}
            showDeliverToggle={flags.canDeliver}
            onEdit={setEditSection}
            onToggleDeliver={(canDeliver) => patch({ canDeliver })}
          />
        </ScrollView>

        <View style={styles.footer}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            style={[styles.submit, submitting && styles.submitDisabled]}
            onPress={() => void submit()}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitText}>{t('edit.publish')}</Text>
            )}
          </Pressable>
        </View>

        <EditAdSectionSheet
          section={editSection}
          form={form}
          existingImageUrls={existingImageUrls}
          transport={transport}
          realEstate={realEstate}
          flags={flags}
          regionLabel={regionLabel}
          hasDistricts={districtItems.length > 0}
          regions={regions}
          onClose={() => setEditSection(null)}
          patch={patch}
          setExistingImageUrls={setExistingImageUrls}
          onOpenCategory={() => setCategoryOpen(true)}
          onOpenRegion={() => setLookup('region')}
          onOpenDistrict={() => setLookup('district')}
          onOpenBrand={() => setLookup('brand')}
          onOpenModel={() => setLookup('model')}
          hasModels={modelItems.length > 0}
          breadcrumb={breadcrumb}
          onPickImages={() => void pickImages()}
        />
        {sheets}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: t('create.title') }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <CreateAdPhotosSection
          existingImageUrls={existingImageUrls}
          localImages={form.localImages}
          onRemoveExisting={(uri) => setExistingImageUrls((prev) => prev.filter((u) => u !== uri))}
          onRemoveLocal={(uri) => patch({ localImages: form.localImages.filter((u) => u !== uri) })}
          onPickImages={() => void pickImages()}
          t={t}
        />
        <CreateAdBasicsSection
          form={form}
          patch={patch}
          onOpenCategory={() => setCategoryOpen(true)}
          t={t}
          localizedCategory={form.category ? localizedName(form.category, language) : null}
        />
        <CreateAdTransportSection
          flags={transport}
          form={form}
          patch={patch}
          onOpenBrand={() => setLookup('brand')}
          onOpenModel={() => setLookup('model')}
          hasModels={modelItems.length > 0}
        />
        <CreateAdRealEstateSection flags={realEstate} form={form} patch={patch} />
        <CreateAdBrandSection
          visible={!transport.brand && brands.length > 0}
          brandLabel={form.brandLabel}
          onOpen={() => setLookup('brand')}
          t={t}
        />
        <CreateAdExtrasSection flags={flags} form={form} patch={patch} breadcrumb={breadcrumb} />
        <CreateAdLocationSection
          form={form}
          patch={patch}
          regionLabel={regionLabel}
          onOpenRegion={() => setLookup('region')}
          onOpenDistrict={() => setLookup('district')}
          hasDistricts={districtItems.length > 0}
          regions={regions}
        />
        <CreateAdContactsSection form={form} patch={patch} t={t} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.submit, submitting && styles.submitDisabled]}
          onPress={submit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitText}>{t('create.submit')}</Text>
          )}
        </Pressable>
      </View>

      {sheets}
    </SafeAreaView>
  );
}
