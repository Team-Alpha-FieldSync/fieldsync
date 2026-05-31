import type { User } from "../types/auth";
import { STORAGE_KEYS } from "../utils/constants";
import { removeToken, setToken } from "../utils/token";

export { getToken } from "../utils/token";

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function persistSession(token: string, user: User): void {
  setToken(token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function clearSession(): void {
  removeToken();
  localStorage.removeItem(STORAGE_KEYS.USER);
}
