export const AD_STATUS = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
} as const;

export type AdStatus = (typeof AD_STATUS)[keyof typeof AD_STATUS];

export type MyAdsTabKey = 'active' | 'drafts' | 'pending' | 'archive';

export type MyAdsTab = {
  key: MyAdsTabKey;
  labelKey: string;
  status: string | null;
};

export const MY_ADS_TABS: MyAdsTab[] = [
  { key: 'active', labelKey: 'myAds.tabActive', status: AD_STATUS.ACTIVE },
  { key: 'drafts', labelKey: 'myAds.tabDrafts', status: AD_STATUS.DRAFT },
  { key: 'pending', labelKey: 'myAds.tabPending', status: AD_STATUS.PENDING },
  { key: 'archive', labelKey: 'myAds.tabArchive', status: AD_STATUS.ARCHIVED },
];

export function statusLabelKey(status?: string | null) {
  switch (status) {
    case AD_STATUS.ACTIVE:
      return 'myAds.statusActive';
    case AD_STATUS.ARCHIVED:
      return 'myAds.statusArchive';
    case AD_STATUS.DRAFT:
      return 'myAds.statusDraft';
    case AD_STATUS.PENDING:
      return 'myAds.statusPending';
    default:
      return 'myAds.statusActive';
  }
}

export function filterMyAdsByTab<T extends { status?: string }>(ads: T[], tab: MyAdsTabKey): T[] {
  if (tab === 'active') return ads.filter((a) => a.status === AD_STATUS.ACTIVE);
  if (tab === 'archive') return ads.filter((a) => a.status === AD_STATUS.ARCHIVED);
  if (tab === 'pending') return ads.filter((a) => a.status === AD_STATUS.PENDING);
  if (tab === 'drafts') return ads.filter((a) => a.status === AD_STATUS.DRAFT);
  return ads;
}

export function countMyAdsByTab<T extends { status?: string }>(ads: T[], tab: MyAdsTabKey) {
  return filterMyAdsByTab(ads, tab).length;
}
