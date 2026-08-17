import { useEffect, useState } from 'react'
import { referenceApi } from '@/api/reference'
import { FALLBACK_VEHICLE_SPEC_OPTIONS } from '../../../constants/vehicleSpecOptions'

function normalizeGroups(data) {
  if (!data || typeof data !== 'object') return FALLBACK_VEHICLE_SPEC_OPTIONS
  return {
    bodyType: Array.isArray(data.bodyType) && data.bodyType.length ? data.bodyType : FALLBACK_VEHICLE_SPEC_OPTIONS.bodyType,
    transmission: Array.isArray(data.transmission) && data.transmission.length ? data.transmission : FALLBACK_VEHICLE_SPEC_OPTIONS.transmission,
    fuelType: Array.isArray(data.fuelType) && data.fuelType.length ? data.fuelType : FALLBACK_VEHICLE_SPEC_OPTIONS.fuelType,
    driveType: Array.isArray(data.driveType) && data.driveType.length ? data.driveType : FALLBACK_VEHICLE_SPEC_OPTIONS.driveType,
    exteriorColor: Array.isArray(data.exteriorColor) && data.exteriorColor.length ? data.exteriorColor : FALLBACK_VEHICLE_SPEC_OPTIONS.exteriorColor,
    seats: Array.isArray(data.seats) && data.seats.length ? data.seats : FALLBACK_VEHICLE_SPEC_OPTIONS.seats,
    steering: Array.isArray(data.steering) && data.steering.length ? data.steering : FALLBACK_VEHICLE_SPEC_OPTIONS.steering,
    ownersCount: Array.isArray(data.ownersCount) && data.ownersCount.length ? data.ownersCount : FALLBACK_VEHICLE_SPEC_OPTIONS.ownersCount,
  }
}

/** Справочник характеристик авто из БД (кэш на клиенте через referenceApi). */
export default function useVehicleSpecOptions() {
  const [options, setOptions] = useState(FALLBACK_VEHICLE_SPEC_OPTIONS)

  useEffect(() => {
    let cancelled = false
    referenceApi.getVehicleSpecOptions()
      .then((data) => {
        if (!cancelled) setOptions(normalizeGroups(data))
      })
      .catch(() => {
        if (!cancelled) setOptions(FALLBACK_VEHICLE_SPEC_OPTIONS)
      })
    return () => { cancelled = true }
  }, [])

  return options
}
