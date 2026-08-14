const ADDRESS_LINE_RE = /^(?:Адрес|Manzil)\s*:\s*(.+)$/i;
const LANDMARK_LINE_RE = /^(?:Ориентир|Yo['’]?nalish)\s*:\s*(.+)$/i;

export function extractLocationFromDescription(raw?: string | null) {
  const text = (raw || '').replace(/\r\n/g, '\n').trim();
  if (!text) return { description: '', address: '', landmark: '' };

  const lines = text.split('\n');
  let address = '';
  let landmark = '';
  const kept: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      kept.push(line);
      continue;
    }
    const addrMatch = trimmed.match(ADDRESS_LINE_RE);
    if (addrMatch) {
      address = addrMatch[1].trim();
      continue;
    }
    const landmarkMatch = trimmed.match(LANDMARK_LINE_RE);
    if (landmarkMatch) {
      landmark = landmarkMatch[1].trim();
      continue;
    }
    kept.push(line);
  }

  const description = kept.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return { description, address, landmark };
}

export function appendLocationToDescription(
  description: string,
  { address, landmark }: { address?: string; landmark?: string } = {}
) {
  const cleaned = extractLocationFromDescription(description).description;
  const addr = (address || '').trim();
  const mark = (landmark || '').trim();
  if (!addr && !mark) return cleaned;
  const parts: string[] = [];
  if (addr) parts.push(`Manzil: ${addr}`);
  if (mark) parts.push(`Yo'nalish: ${mark}`);
  return cleaned ? `${cleaned}\n\n${parts.join('\n')}` : parts.join('\n');
}
