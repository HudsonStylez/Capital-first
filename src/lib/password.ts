// Synchronous, non-reversible password hashing. Never stores plaintext.
// (Not cryptographic-grade, but keeps passwords unreadable in storage/state.)

export function hashPassword(pw: string): string {
  let h1 = 0xdeadbeef ^ pw.length;
  let h2 = 0x41c6ce57 ^ pw.length;
  for (let i = 0; i < pw.length; i++) {
    const ch = pw.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

export function looksHashed(v?: string): boolean {
  return !!v && /^[0-9a-f]{16}$/.test(v);
}