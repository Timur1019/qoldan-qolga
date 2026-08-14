import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LEGAL_DOCS } from '@/constants/legalDocs';
import { siteRulesUrl } from '@/constants/siteUrls';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import { openWebPage } from '@/utils/openWebPage';

import { styles } from '@/styles/screens/legal.styles';

export default function LegalScreen() {
  const { t } = useLanguage();

  const openDoc = (slug: string) => {
    void openWebPage(siteRulesUrl(slug));
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: t('settings.legal') }} />
      <ScrollView contentContainerStyle={styles.content}>
        {LEGAL_DOCS.map((doc) => (
          <Pressable key={doc.slug} style={styles.row} onPress={() => openDoc(doc.slug)}>
            <View style={styles.iconWrap}>
              <Ionicons name="document-text-outline" size={18} color={colors.text} />
            </View>
            <Text style={styles.rowLabel} numberOfLines={2}>
              {t(doc.titleKey)}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        ))}

        <Text style={styles.hint}>{t('legal.openOnSiteHint')}</Text>

        <Pressable
          style={[styles.row, { marginTop: 8, borderBottomWidth: 0 }]}
          onPress={() => void openWebPage(siteRulesUrl())}
        >
          <View style={styles.iconWrap}>
            <Ionicons name="globe-outline" size={18} color={colors.primary} />
          </View>
          <Text style={[styles.rowLabel, { color: colors.primary }]}>{t('legal.allOnSite')}</Text>
          <Ionicons name="open-outline" size={18} color={colors.primary} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
