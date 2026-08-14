import type { CategoryFilterFlags } from '@/constants/categoryFilters';
import { CONDITION_OPTIONS } from '@/constants/filterOptions';
import { sellerTypeOptionsForCategory } from '@/constants/sellerTypes';
import { FilterChips } from '@/components/FilterChips/FilterChips';
import { useLanguage } from '@/context/LanguageContext';
import type { CategoryDto } from '@/types/api';
import type { CategoryFiltersState } from '@/utils/categoryFiltersState';

import { SectionTitle, ToggleRow } from './FilterFieldRows';

interface Props {
  flags: CategoryFilterFlags;
  draft: CategoryFiltersState;
  patch: (partial: Partial<CategoryFiltersState>) => void;
  categoryCode?: string;
  breadcrumb?: CategoryDto[];
}

export function CommonFiltersSection({
  flags,
  draft,
  patch,
  categoryCode,
  breadcrumb = [],
}: Props) {
  const { t } = useLanguage();
  const sellerOptions = sellerTypeOptionsForCategory(categoryCode, breadcrumb).map((o) => ({
    value: o.value,
    label: t(o.labelKey),
  }));

  const hasExtra =
    flags.urgentBargain ||
    flags.canDeliver ||
    flags.giveAway ||
    flags.handmade ||
    flags.canRent ||
    flags.license ||
    flags.contract;

  return (
    <>
      {flags.sellerType ? (
        <>
          <SectionTitle>{t('ads.sellerType')}</SectionTitle>
          <FilterChips
            options={sellerOptions}
            value={draft.sellerType}
            onChange={(sellerType) => patch({ sellerType })}
          />
        </>
      ) : null}

      {flags.condition ? (
        <>
          <SectionTitle>{t('ads.condition')}</SectionTitle>
          <FilterChips
            options={CONDITION_OPTIONS}
            value={draft.itemCondition}
            onChange={(itemCondition) => patch({ itemCondition })}
          />
        </>
      ) : null}

      {hasExtra ? <SectionTitle>{t('create.extra')}</SectionTitle> : null}
      {flags.urgentBargain ? (
        <ToggleRow
          label={t('ads.urgentBargain')}
          value={draft.urgentBargain}
          onChange={(urgentBargain) => patch({ urgentBargain })}
        />
      ) : null}
      {flags.canDeliver ? (
        <ToggleRow
          label={t('ads.canDeliver')}
          value={draft.canDeliver}
          onChange={(canDeliver) => patch({ canDeliver })}
        />
      ) : null}
      {flags.giveAway ? (
        <ToggleRow
          label={t('ads.giveAway')}
          value={draft.giveAway}
          onChange={(giveAway) => patch({ giveAway })}
        />
      ) : null}
      {flags.handmade ? (
        <ToggleRow
          label="Handmade"
          value={draft.handMadeOnly}
          onChange={(handMadeOnly) => patch({ handMadeOnly })}
        />
      ) : null}
      {flags.canRent ? (
        <ToggleRow
          label={t('ads.canRent')}
          value={draft.canRent}
          onChange={(canRent) => patch({ canRent })}
        />
      ) : null}
      {flags.license ? (
        <ToggleRow
          label={t('ads.hasLicense')}
          value={draft.hasLicense}
          onChange={(hasLicense) => patch({ hasLicense })}
        />
      ) : null}
      {flags.contract ? (
        <ToggleRow
          label={t('ads.worksByContract')}
          value={draft.worksByContract}
          onChange={(worksByContract) => patch({ worksByContract })}
        />
      ) : null}
    </>
  );
}
