// api/_shared.js
import https from 'https';
import { readFileSync } from 'fs';
import { join } from 'path';

export const INTIMATE_KEYWORDS = ['порно', 'секс', 'porno', 'sex', 'xxx', 'порнография', 'porn', 'конча'];
export const OFFENSIVE_WORDS = ['сука', 'блять', 'блядь', 'бля ', 'хуй', 'хуя', 'хуе', 'пизд', 'пизда', 'ебать', 'ебал', 'нахуй', 'похуй', 'заеб', 'выеб', 'мудак', 'мудил'];

function tokenLooksLikeGibberish(token) {
  if (!token || token.length < 2) return false;
  const s = token.toLowerCase();
  const len = s.length;
  const vowels = /[аеёиоуыэюяaeiouy]/gi;
  const vowelCount = (s.match(vowels) || []).length;
  const vowelRatio = vowelCount / len;
  const uniqueRatio = new Set(s.split('')).size / len;
  if (len <= 5 && vowelRatio < 0.4) return true;
  if (len >= 6 && (vowelRatio < 0.25 || uniqueRatio <= 0.5)) return true;
  return false;
}

export function looksLikeGibberish(str) {
  if (typeof str !== 'string') return false;
  const s = str.toLowerCase().trim();
  const len = s.length;
  if (len < 3) return false;
  const vowels = /[аеёиоуыэюяaeiouy]/gi;
  const vowelCount = (s.match(vowels) || []).length;
  const vowelRatio = vowelCount / len;
  const uniqueCount = new Set(s.split('')).size;
  const uniqueRatio = uniqueCount / len;
  if (len >= 5 && vowelRatio < 0.25) return true;
  if (len >= 6 && uniqueRatio < 0.5) return true;
  if (len >= 8 && uniqueRatio < 0.6) return true;
  const tokens = s.split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length > 0 && tokens.every((t) => tokenLooksLikeGibberish(t))) return true;
  return false;
}

const equipmentPath = () => join(process.cwd(), 'src', 'data', 'equipment.json');

let equipmentData = null;

export function loadEquipment() {
  if (equipmentData) return equipmentData;
  try {
    equipmentData = JSON.parse(readFileSync(equipmentPath(), 'utf-8'));
  } catch (e) {
    console.error('Failed to load equipment.json:', e.message);
  }
  return equipmentData;
}

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined;
    const headers = { ...options.headers };
    if (body) headers['Content-Length'] = Buffer.byteLength(body, 'utf-8');
    const req = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        method: options.method || 'GET',
        headers,
        agent: httpsAgent,
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf-8');
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            text: () => Promise.resolve(raw),
            json: () => Promise.resolve(JSON.parse(raw || '{}')),
          });
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

export async function getGigaChatToken(clientId, clientSecret) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const rqUid = crypto.randomUUID();
  const body = new URLSearchParams({ scope: 'GIGACHAT_API_PERS' }).toString();
  const res = await httpsRequest('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      RqUID: rqUid,
      Authorization: `Basic ${credentials}`,
    },
    body,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `Token HTTP ${res.status}`);
  }
  const data = await res.json();
  const token = data?.access_token;
  if (!token) throw new Error('Нет access_token в ответе GigaChat');
  return token;
}

export async function getGigaChatModels(token) {
  const res = await httpsRequest('https://gigachat.devices.sberbank.ru/api/v1/models', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const t = await res.text();
    console.error('GET /models:', res.status, t?.slice(0, 300));
    return [];
  }
  const data = await res.json();
  const list = data?.data ?? data?.models ?? (Array.isArray(data) ? data : []);
  return Array.isArray(list) ? list : [];
}

const GIGACHAT_MODEL = 'GigaChat';

export async function callGigaChat(clientId, clientSecret, systemPrompt, userMessage) {
  const token = await getGigaChatToken(clientId, clientSecret);

  const doRequest = () =>
    httpsRequest('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: GIGACHAT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.6,
        max_tokens: 2000,
        stream: false,
      }),
    });

  let res = await doRequest();
  const bodyText = await res.text();

  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 4000));
    res = await doRequest();
    const retryText = await res.text();
    if (!res.ok) {
      const msg = res.status === 429
        ? 'Слишком много запросов к GigaChat. Подождите минуту и попробуйте снова.'
        : (retryText?.slice(0, 200) || `HTTP ${res.status}`);
      throw new Error(msg);
    }
    const data = JSON.parse(retryText);
    const text = data?.choices?.[0]?.message?.content;
    if (text) return text.trim();
    throw new Error('Пустой ответ от GigaChat');
  }

  if (!res.ok) {
    const msg = bodyText?.slice(0, 300) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  const data = JSON.parse(bodyText);
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Пустой ответ от GigaChat');
  return text.trim();
}
