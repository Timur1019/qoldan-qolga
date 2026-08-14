/** Только заголовки + slug. Текст документов — на сайте /rules/:slug */
export type LegalDocMeta = {
  slug: string;
  titleKey: string;
};

export const LEGAL_DOCS: LegalDocMeta[] = [
  { slug: 'privacy', titleKey: 'legal.privacy' },
  { slug: 'terms', titleKey: 'legal.terms' },
  { slug: 'ads', titleKey: 'legal.ads' },
  { slug: 'cookies', titleKey: 'legal.cookies' },
];
