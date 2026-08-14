import {
  BUILDING_TYPE_OPTIONS,
  DEAL_TYPE_OPTIONS,
  RENOVATION_OPTIONS,
  ROOMS_OPTIONS,
} from '@/constants/filterOptions';
import type { RealEstateFieldFlags } from '@/constants/categoryFilters';
import { FilterChips } from '@/components/FilterChips/FilterChips';
import type { CategoryFiltersState } from '@/utils/categoryFiltersState';

import { FieldLabel, RangeInputs, SectionTitle, ToggleRow } from './FilterFieldRows';

interface Props {
  flags: RealEstateFieldFlags;
  draft: CategoryFiltersState;
  patch: (partial: Partial<CategoryFiltersState>) => void;
}

export function RealEstateFiltersSection({ flags, draft, patch }: Props) {
  if (!flags.realEstate) return null;

  return (
    <>
      <SectionTitle>Ko'chmas mulk</SectionTitle>
      {flags.dealType ? (
        <>
          <FieldLabel>Bitim turi</FieldLabel>
          <FilterChips options={DEAL_TYPE_OPTIONS} value={draft.dealType} onChange={(dealType) => patch({ dealType })} />
        </>
      ) : null}
      {flags.rooms ? (
        <>
          <FieldLabel>Xonalar</FieldLabel>
          <FilterChips options={ROOMS_OPTIONS} value={draft.rooms} onChange={(rooms) => patch({ rooms })} />
        </>
      ) : null}
      {flags.area ? (
        <>
          <FieldLabel>Maydon (m²)</FieldLabel>
          <RangeInputs
            from={draft.areaFrom}
            to={draft.areaTo}
            fromPh="dan"
            toPh="gacha"
            onFrom={(areaFrom) => patch({ areaFrom })}
            onTo={(areaTo) => patch({ areaTo })}
          />
        </>
      ) : null}
      {flags.landArea ? (
        <>
          <FieldLabel>Yer maydoni (m²)</FieldLabel>
          <RangeInputs
            from={draft.landAreaFrom}
            to={draft.landAreaTo}
            fromPh="dan"
            toPh="gacha"
            onFrom={(landAreaFrom) => patch({ landAreaFrom })}
            onTo={(landAreaTo) => patch({ landAreaTo })}
          />
        </>
      ) : null}
      {flags.floor ? (
        <>
          <FieldLabel>Qavat</FieldLabel>
          <RangeInputs
            from={draft.floorFrom}
            to={draft.floorTo}
            fromPh="dan"
            toPh="gacha"
            onFrom={(floorFrom) => patch({ floorFrom })}
            onTo={(floorTo) => patch({ floorTo })}
          />
        </>
      ) : null}
      {flags.buildingType ? (
        <>
          <FieldLabel>Uy turi</FieldLabel>
          <FilterChips
            options={BUILDING_TYPE_OPTIONS}
            value={draft.buildingType}
            onChange={(buildingType) => patch({ buildingType })}
          />
        </>
      ) : null}
      {flags.renovation ? (
        <>
          <FieldLabel>Ta'mir</FieldLabel>
          <FilterChips
            options={RENOVATION_OPTIONS}
            value={draft.renovation}
            onChange={(renovation) => patch({ renovation })}
          />
        </>
      ) : null}
      {flags.furnished ? (
        <ToggleRow label="Mebel bilan" value={draft.furnished} onChange={(furnished) => patch({ furnished })} />
      ) : null}
    </>
  );
}
