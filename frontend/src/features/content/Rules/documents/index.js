import { adsDoc } from './ads'
import { cookiesDoc } from './cookies'
import { privacyDoc } from './privacy'
import { termsDoc } from './terms'

export const LEGAL_DOCS = [privacyDoc, termsDoc, adsDoc, cookiesDoc]

export function getLegalDoc(slug) {
  return LEGAL_DOCS.find((doc) => doc.slug === slug) || null
}
