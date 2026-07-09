// Mëso Shqip🦅 — Certificate code generator
// Produces a unique-ish code like "MSQ-XXXXXX" where X is an uppercase
// alphanumeric character (ambiguous chars like 0/O and 1/I are excluded).
// The slug is mixed into the entropy pool so two certificates generated in
// the same millisecond for different lessons are unlikely to clash.

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 31 chars, no 0/O/1/I

export function generateCertCode(slug: string): string {
  // Deterministic component derived from the lesson slug (FNV-1a-ish hash)
  let hash = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  // Pull 6 chars from the alphabet, mixing in fresh randomness each step so
  // repeated calls for the same slug still produce different codes.
  let seed = hash;
  let chars = "";
  for (let i = 0; i < 6; i++) {
    const rand = Math.floor(Math.random() * 0x10000);
    seed = (Math.imul(seed, 0x01000193) ^ rand ^ (i * 0x9e3779b1)) >>> 0;
    chars += ALPHABET[seed % ALPHABET.length];
  }

  return `MSQ-${chars}`;
}
