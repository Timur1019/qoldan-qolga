const KEY = 'qq_feed_region'
export const FEED_REGION_ALL = '__all__'

export function readFeedRegion() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function writeFeedRegion(code) {
  try {
    localStorage.setItem(KEY, code || FEED_REGION_ALL)
  } catch {
    /* ignore */
  }
}
