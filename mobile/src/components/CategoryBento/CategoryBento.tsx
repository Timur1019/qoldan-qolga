import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { categoryIonicon } from '@/constants/categoryIonicons';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { CategoryDto } from '@/types/api';
import { localizedName } from '@/utils/localizedName';

import { styles } from './CategoryBento.styles';

interface Props {
  categories: CategoryDto[];
  onPress: (category: CategoryDto) => void;
  onAllPress?: () => void;
}

/** Крупный блок категорий для главной — не копия Avito, своя сетка под Qoldan. */
export function CategoryBento({ categories, onPress, onAllPress }: Props) {
  const { language, t } = useLanguage();

  if (!categories.length) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.emptyText}>{t('categories.empty', 'Kategoriyalar yuklanmadi')}</Text>
        {onAllPress ? (
          <Pressable style={styles.allBtn} onPress={onAllPress}>
            <Text style={styles.allBtnText}>{t('categories.openCatalog', 'Katalogni ochish')}</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  const [hero, second, third, ...rest] = categories;
  const rowTiles = rest.slice(0, 4);

  return (
    <View style={styles.wrap}>
      <View style={styles.heroRow}>
        {hero ? (
          <Pressable style={[styles.tile, styles.heroTile]} onPress={() => onPress(hero)}>
            <Text
              style={styles.tileTitle}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {localizedName(hero, language)}
            </Text>
            <View style={styles.heroIconWrap}>
              <Ionicons name={categoryIonicon(hero.code)} size={36} color={colors.primary} />
            </View>
          </Pressable>
        ) : null}

        <View style={styles.sideCol}>
          {second ? (
            <Pressable style={[styles.tile, styles.sideTile]} onPress={() => onPress(second)}>
              <Text
                style={styles.tileTitleSm}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {localizedName(second, language)}
              </Text>
              <Ionicons name={categoryIonicon(second.code)} size={22} color={colors.primary} />
            </Pressable>
          ) : null}
          {third ? (
            <Pressable style={[styles.tile, styles.sideTile]} onPress={() => onPress(third)}>
              <Text
                style={styles.tileTitleSm}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {localizedName(third, language)}
              </Text>
              <Ionicons name={categoryIonicon(third.code)} size={22} color={colors.primary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {rowTiles.length > 0 ? (
        <View style={styles.row}>
          {rowTiles.map((c) => (
            <Pressable key={c.code} style={[styles.tile, styles.smallTile]} onPress={() => onPress(c)}>
              <Text
                style={styles.tileTitleSm}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {localizedName(c, language)}
              </Text>
              <Ionicons name={categoryIonicon(c.code)} size={20} color={colors.primary} />
            </Pressable>
          ))}
        </View>
      ) : null}

      {onAllPress ? (
        <Pressable style={styles.allBtn} onPress={onAllPress}>
          <Text style={styles.allBtnText}>{t('categories.all', 'Barcha kategoriyalar')}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}
