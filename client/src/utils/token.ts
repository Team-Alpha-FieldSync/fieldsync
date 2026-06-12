import { STORAGE_KEYS } from "./constants";

export function setToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch {
    // Ignore storage errors (e.g. private browsing)
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch {
    return null;
  }
}

export function removeToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch {
    // Ignore storage errors
  }
}
