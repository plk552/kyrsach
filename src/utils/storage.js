// src/utils/storage.js
const TARIFFS_KEY = 'savedTariffs';
const USER_KEY = 'rentalUser';
const CART_KEY = 'rentalCart';
const CONSTRUCTOR_DRAFT_KEY = 'constructorDraft';

export function loadConstructorDraft() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(CONSTRUCTOR_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveConstructorDraft(draft) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(CONSTRUCTOR_DRAFT_KEY, JSON.stringify(draft));
  } catch {
  }
}

export function clearConstructorDraft() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(CONSTRUCTOR_DRAFT_KEY);
  } catch {
  }
}

export function loadSavedTariffs() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(TARIFFS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSavedTariffs(tariffs) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TARIFFS_KEY, JSON.stringify(tariffs));
  } catch {
  }
}

export function loadUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUser(user) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
  }
}

export function clearUser() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(USER_KEY);
  } catch {
  }
}

export function loadCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
  }
}

export function addToCart(equipmentId) {
  const cart = loadCart();
  if (cart.includes(equipmentId)) return cart;
  const next = [...cart, equipmentId];
  saveCart(next);
  return next;
}

