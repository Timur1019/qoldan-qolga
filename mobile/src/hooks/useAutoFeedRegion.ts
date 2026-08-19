import { useCallback, useEffect, useState } from 'react';

import { useRegions } from '@/context/RegionsContext';
import { detectDeviceLocation } from '@/location/detectDeviceLocation';
import {
  FEED_REGION_ALL,
  readFeedRegion,
  writeFeedRegion,
} from '@/location/feedRegionStorage';

export function useAutoFeedRegion() {
  const { regions } = useRegions();
  const [region, setRegionState] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const stored = await readFeedRegion();
      if (!alive) return;
      if (stored === FEED_REGION_ALL) {
        setRegionState('');
        setReady(true);
        return;
      }
      if (stored) {
        setRegionState(stored);
        setReady(true);
        return;
      }
      if (!regions.length) return;
      try {
        const loc = await detectDeviceLocation(regions);
        if (!alive) return;
        if (loc?.regionCode) {
          await writeFeedRegion(loc.regionCode);
          setRegionState(loc.regionCode);
        }
      } catch {
        /* permission denied or GPS unavailable */
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [regions]);

  const setRegion = useCallback(async (code: string) => {
    setRegionState(code);
    await writeFeedRegion(code || FEED_REGION_ALL);
  }, []);

  return { region, setRegion, ready };
}
