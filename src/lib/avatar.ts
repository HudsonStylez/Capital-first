// Deterministic, fully-offline avatar generation (no network / no external service).

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const PALETTES: [string, string][] = [
  ['#005C9D', '#7DB9E8'],
  ['#0B5394', '#2E8BC0'],
  ['#1F4E79', '#4A90C2'],
  ['#2C5F8A', '#6FA8DC'],
  ['#14507A', '#5FA8D3'],
  ['#003865', '#3E7CB1'],
];

export function initials(name: string): string {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Deterministic gradient initials avatar as a data URL (works offline). */
export function avatarDataUrl(name: string, seed?: string): string {
  const key = (seed || name || 'user').toLowerCase();
  const [c1, c2] = PALETTES[hashCode(key) % PALETTES.length];
  const text = initials(name);
  const fontSize = text.length > 1 ? 104 : 132;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="256" height="256" rx="56" fill="url(#g)"/><text x="50%" y="52%" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Avatar to display: the user's uploaded image first, otherwise an automatic
 * avatar derived from their email (or name).
 */
export function resolveAvatar(user: {
  avatarUrl?: string;
  email?: string;
  firstName: string;
  lastName: string;
}): string {
  if (user.avatarUrl) return user.avatarUrl;
  return avatarDataUrl(`${user.firstName} ${user.lastName}`, user.email || undefined);
}