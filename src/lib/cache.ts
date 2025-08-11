export interface CacheEntry<T> {
  value: T;
  expiresAt: number; // epoch ms
}

export function setCached<T>(key: string, value: T, ttlSeconds: number) {
  try {
    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {}
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.value as T;
  } catch {
    return null;
  }
}
