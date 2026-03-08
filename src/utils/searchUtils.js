// src/utils/searchUtils.js
export function levenshtein(a, b) {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = 1 + Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]);
      }
    }
  }
  return matrix[b.length][a.length];
}

export function matchesWithTypo(query, str) {
  if (!str) return false;
  const q = query.trim().toLowerCase();
  const s = str.toLowerCase();
  if (q === s || s.includes(q) || q.includes(s)) return true;
  const maxDist = q.length <= 4 ? 1 : 2;
  return levenshtein(q, s) <= maxDist;
}

export const SEARCH_BLOCKLIST = [
  'колбаса', 'хлеб', 'молоко', 'тест', 'привет', 'пока', 'как дела',
  'что', 'зачем', 'нет', 'да', 'сыр', 'мясо', 'суп',
];
