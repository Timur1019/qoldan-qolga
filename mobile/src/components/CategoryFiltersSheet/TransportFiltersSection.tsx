import {
  BODY_TYPE_OPTIONS,
  DRIVE_TYPE_OPTIONS,
  FUEL_TYPE_OPTIONS,
  OWNERS_COUNT_OPTIONS,
  SEATS_OPTIONS,
  STEERING_OPTIONS,
  TRANSMISSION_OPTIONS,
} from '@/constants/filterOptions';
import type { TransportFieldFlags } from '@/constants/categoryFilters';
import { FilterChips } from '@/components/FilterChips/FilterChips';
import type { CategoryFiltersState } from '@/utils/categoryFiltersState';

import { FieldLabel, RangeInputs, SectionTitle } from './FilterFieldRows';

interface Props {
  flags: TransportFieldFlags;
  draft: CategoryFiltersState;
  patch: (partial: Partial<CategoryFiltersState>) => void;
}

export function TransportFiltersSection({ flags, draft, patch }: Props) {
  if (!flags.transport) return null;
  if (
    !flags.year &&
    !flags.mileage &&
    !flags.engineVolume &&
    !flags.bodyType &&
    !flags.transmission &&
    !flags.fuelType &&
    !flags.driveType &&
    !flags.steering &&
    !flags.ownersCount &&
    !flags.seats
  ) {
    return null;
  }

  return (
    <>
      <SectionTitle>Transport</SectionTitle>
      {flags.year ? (
        <>
          <FieldLabel>Yil</FieldLabel>
          <RangeInputs
            from={draft.yearFrom}
            to={draft.yearTo}
            fromPh="dan"
            toPh="gacha"
            onFrom={(yearFrom) => patch({ yearFrom })}
            onTo={(yearTo) => patch({ yearTo })}
          />
        </>
      ) : null}
      {flags.mileage ? (
        <>
          <FieldLabel>Yurgani (km)</FieldLabel>
          <RangeInputs
            from={draft.mileageFrom}
            to={draft.mileageTo}
            fromPh="dan"
            toPh="gacha"
            onFrom={(mileageFrom) => patch({ mileageFrom })}
            onTo={(mileageTo) => patch({ mileageTo })}
          />
        </>
      ) : null}
      {flags.engineVolume ? (
        <>
          <FieldLabel>Dvigatel hajmi</FieldLabel>
          <RangeInputs
            from={draft.engineVolumeFrom}
            to={draft.engineVolumeTo}
            fromPh="dan"
            toPh="gacha"
            onFrom={(engineVolumeFrom) => patch({ engineVolumeFrom })}
            onTo={(engineVolumeTo) => patch({ engineVolumeTo })}
          />
        </>
      ) : null}
      {flags.bodyType ? (
        <>
          <FieldLabel>Kuzov</FieldLabel>
          <FilterChips options={BODY_TYPE_OPTIONS} value={draft.bodyType} onChange={(bodyType) => patch({ bodyType })} />
        </>
      ) : null}
      {flags.transmission ? (
        <>
          <FieldLabel>Uzatma</FieldLabel>
          <FilterChips
            options={TRANSMISSION_OPTIONS}
            value={draft.transmission}
            onChange={(transmission) => patch({ transmission })}
          />
        </>
      ) : null}
      {flags.fuelType ? (
        <>
          <FieldLabel>Yoqilg'i</FieldLabel>
          <FilterChips options={FUEL_TYPE_OPTIONS} value={draft.fuelType} onChange={(fuelType) => patch({ fuelType })} />
        </>
      ) : null}
      {flags.driveType ? (
        <>
          <FieldLabel>Privod</FieldLabel>
          <FilterChips options={DRIVE_TYPE_OPTIONS} value={draft.driveType} onChange={(driveType) => patch({ driveType })} />
        </>
      ) : null}
      {flags.steering ? (
        <>
          <FieldLabel>Rul</FieldLabel>
          <FilterChips options={STEERING_OPTIONS} value={draft.steering} onChange={(steering) => patch({ steering })} />
        </>
      ) : null}
      {flags.ownersCount ? (
        <>
          <FieldLabel>Egalar soni</FieldLabel>
          <FilterChips
            options={OWNERS_COUNT_OPTIONS}
            value={draft.ownersCount}
            onChange={(ownersCount) => patch({ ownersCount })}
          />
        </>
      ) : null}
      {flags.seats ? (
        <>
          <FieldLabel>O'rindiqlar</FieldLabel>
          <FilterChips options={SEATS_OPTIONS} value={draft.seats} onChange={(seats) => patch({ seats })} />
        </>
      ) : null}
    </>
  );
}
