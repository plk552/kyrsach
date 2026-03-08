// api/suggest-tariffs.js
import { loadEquipment, getGigaChatToken, callGigaChat, INTIMATE_KEYWORDS, OFFENSIVE_WORDS, looksLikeGibberish } from './_shared.js';

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешён' });
  }
  let body = {};
  try {
    body = await readBody(req);
  } catch (_) {
    return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
  }
  const { query } = body;
  const q = typeof query === 'string' ? query.trim() : '';
  if (!q) {
    return res.status(400).json({ error: 'Укажите запрос (query)' });
  }
  const qLower = q.toLowerCase();

  const data = loadEquipment();
  if (!data || !Array.isArray(data.equipment)) {
    return res.status(500).json({
      error: 'Данные оборудования недоступны',
      detail: 'Файл equipment.json не найден или пуст.',
    });
  }
  const purposes = data.purposes || [];
  const validPurposeIds = Array.isArray(purposes) ? purposes.map((p) => p.id) : [];

  if (OFFENSIVE_WORDS.some((w) => qLower.includes(w))) {
    return res.status(400).json({
      error: 'Некорректный запрос',
      detail: 'Пожалуйста, сформулируйте запрос корректно и без нецензурной лексики. Например: свадьба, стрим, мероприятие.',
    });
  }
  if (looksLikeGibberish(q)) {
    return res.status(400).json({
      error: 'Некорректный запрос',
      detail: 'Пожалуйста, введите осмысленный запрос. Например: свадьба, стрим, ночная съемка, мероприятие.',
    });
  }
  if (INTIMATE_KEYWORDS.some((w) => qLower.includes(w))) {
    const purposeIds = validPurposeIds.length >= 3 ? validPurposeIds.slice(0, 3) : ['event', 'interview', 'stream'];
    return res.status(200).json({
      scenarioLabel: 'Интимная съемка',
      scenarioDescription: 'Подборка оборудования под ваш запрос. Нажмите на карточку, чтобы посмотреть тарифы.',
      purposeIds,
    });
  }

  let gigachatClientId = process.env.GIGACHAT_CLIENT_ID;
  let gigachatClientSecret = process.env.GIGACHAT_CLIENT_SECRET;
  const gigachatCredentials = process.env.GIGACHAT_CREDENTIALS;
  if (!gigachatClientId && gigachatCredentials) {
    try {
      const decoded = Buffer.from(gigachatCredentials, 'base64').toString('utf-8');
      const [id, secret] = decoded.split(':');
      gigachatClientId = id;
      gigachatClientSecret = secret;
    } catch (_) {}
  }

  if (!gigachatClientId || !gigachatClientSecret) {
    return res.status(503).json({
      error: 'Нейросеть недоступна',
      hint: 'Задайте GIGACHAT_CLIENT_ID и GIGACHAT_CLIENT_SECRET в настройках Vercel. Регистрация: developers.sber.ru.',
    });
  }

  if (!Array.isArray(purposes) || purposes.length === 0) {
    return res.status(500).json({
      error: 'Список сценариев недоступен',
      detail: 'В equipment.json должен быть непустой массив purposes.',
    });
  }
  const purposeList = purposes.map((p) => `${p.id}: ${p.label}`).join(', ');
  const labelToId = {};
  purposes.forEach((p) => {
    if (p.label) labelToId[p.label.toLowerCase().trim()] = p.id;
  });

  const systemPrompt = `Ты помощник сервиса аренды видеооборудования. Пользователь вводит идею в строку поиска: например "лето", "вода", "пейзаж", "свадьба" и т.д.

Твоя задача: подобрать ровно 3 сценария из списка ниже, все три связаны с запросом, и для КАЖДОГО сценария придумать своё название и описание в духе запроса.

Пример для запроса "лето":
- Первый сценарий (например wedding): название "Лето на пляже", описание "Съёмка свадьбы или праздника на пляже в летний день."
- Второй (например event): название "Лето в саду", описание "Мероприятия и концерты на открытом воздухе, пикники, фестивали."
- Третий (например youtube): название "Летний влог", описание "Контент для блога: путешествия, природа, летняя атмосфера."

Для "вода": три варианта вроде "Съёмка на воде", "Свадьба у воды", "Мероприятие у водоёма" — каждый со своим кратким описанием. Не используй дефолтные названия из списка (Мероприятие, Стрим) — придумывай свои, связанные с запросом.

Список сценариев (используй только purposeId из первого столбца):
${purposeList}

Ответь СТРОГО в формате JSON, без markdown и без текста до/после:
{"scenarios": [{"purposeId": "id1", "label": "Название первого", "description": "Краткое описание первого."}, {"purposeId": "id2", "label": "Название второго", "description": "Краткое описание второго."}, {"purposeId": "id3", "label": "Название третьего", "description": "Краткое описание третьего."}]}

Допустимые purposeId: youtube, wedding, interview, event, birthday, corporate, stream, education.`;

  const userMessage = `Запрос пользователя: «${q}». Подбери ровно 3 сценария из списка (все по теме запроса). Для каждого придумай своё название (label) и короткое описание (description), связанные с запросом — не используй стандартные названия типа "Мероприятие" или "Стрим". Ответ — только JSON: {"scenarios": [{"purposeId": "...", "label": "...", "description": "..."}, ...]}.`;

  try {
    const content = await callGigaChat(gigachatClientId, gigachatClientSecret, systemPrompt, userMessage);
    let raw = content.replace(/```\w*\n?/g, '').replace(/\n?```/g, '').trim();
    const objMatch = raw.match(/\{[\s\S]*\}/);
    let scenarios = null;
    let scenarioLabel = null;
    let scenarioDescription = null;
    let suggested = null;

    const mapToId = (v) => {
      if (typeof v !== 'string') return null;
      const s = v.trim().toLowerCase();
      if (validPurposeIds.includes(s)) return s;
      return labelToId[s] || null;
    };

    if (objMatch) {
      try {
        const parsed = JSON.parse(objMatch[0]);
        if (Array.isArray(parsed.scenarios) && parsed.scenarios.length > 0) {
          scenarios = parsed.scenarios
            .slice(0, 3)
            .map((s) => {
              const purposeId = mapToId(s.purposeId);
              if (!purposeId) return null;
              return {
                purposeId,
                label: typeof s.label === 'string' && s.label.trim() ? s.label.trim() : purposes.find((p) => p.id === purposeId)?.label || purposeId,
                description: typeof s.description === 'string' && s.description.trim() ? s.description.trim() : '',
              };
            })
            .filter(Boolean);
        }
        if (!scenarios && Array.isArray(parsed.purposeIds) && parsed.purposeIds.length > 0) {
          suggested = parsed.purposeIds;
          if (parsed.scenarioLabel) scenarioLabel = parsed.scenarioLabel.trim();
          if (parsed.scenarioDescription) scenarioDescription = parsed.scenarioDescription.trim();
        }
      } catch (_) {}
    }
    if (!scenarios && suggested) {
      const purposeIds = suggested.map(mapToId).filter(Boolean);
      const uniqueIds = [...new Set(purposeIds)].slice(0, 3);
      if (uniqueIds.length > 0) {
        scenarios = uniqueIds.map((id, i) => {
          const p = purposes.find((x) => x.id === id);
          return {
            purposeId: id,
            label: i === 0 && scenarioLabel ? scenarioLabel : (p?.label || id),
            description: i === 0 && scenarioDescription ? scenarioDescription : (p?.description || ''),
          };
        });
      }
    }
    if (!scenarios || scenarios.length === 0) {
      const fallbackIds = validPurposeIds.slice(0, 3);
      const fallbackLabel = scenarioLabel || q.trim().replace(/^\w/, (c) => c.toUpperCase());
      const fallbackDesc = scenarioDescription || `Подборка оборудования под сценарий «${fallbackLabel}». Нажмите на карточку, чтобы посмотреть тарифы.`;
      return res.status(200).json({
        scenarios: fallbackIds.map((id, i) => {
          const p = purposes.find((x) => x.id === id);
          return {
            purposeId: id,
            label: i === 0 ? fallbackLabel : (p?.label || id),
            description: i === 0 ? fallbackDesc : (p?.description || ''),
          };
        }),
        purposeIds: fallbackIds,
      });
    }

    const purposeIds = scenarios.map((s) => s.purposeId);
    res.status(200).json({
      scenarios,
      purposeIds,
    });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({
      error: 'Ошибка нейросети',
      detail: err.message || 'Попробуйте позже',
    });
  }
}
