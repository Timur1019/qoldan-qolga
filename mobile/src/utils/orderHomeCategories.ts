import type { CategoryDto } from '@/types/api';

/** Приоритет крупных плиток на главной (коды из бэкенда). */
const HOME_PRIORITY = [
  'Transport',
  'Nedvizhimost',
  'Elektronika',
  'Ish',
  'Xizmatlar',
  'Mebel_i_interer',
  'Odezhda_obuv',
  'Bytovaya_tekhnika',
  'Stroyka_remont',
];

export function orderHomeCategories(categories: CategoryDto[]): CategoryDto[] {
  const byCode = new Map(categories.map((c) => [c.code, c]));
  const ordered: CategoryDto[] = [];
  for (const code of HOME_PRIORITY) {
    const hit = byCode.get(code);
    if (hit) {
      ordered.push(hit);
      byCode.delete(code);
    }
  }
  for (const c of categories) {
    if (byCode.has(c.code)) ordered.push(c);
  }
  return ordered;
}
