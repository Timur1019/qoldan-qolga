export function formatPromoMoney(price: number | null | undefined): string {
  if (price == null) return '';
  return `${Number(price).toLocaleString('ru-RU')} сум`;
}

export function isMockPaymentUrl(url?: string | null): boolean {
  if (!url) return false;
  return /[?&]mock=1(?:&|$)/.test(url);
}
