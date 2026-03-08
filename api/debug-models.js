// api/debug-models.js
import { getGigaChatToken, getGigaChatModels } from './_shared.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const gigachatId = process.env.GIGACHAT_CLIENT_ID;
  const gigachatSecret = process.env.GIGACHAT_CLIENT_SECRET;
  if (!gigachatId || !gigachatSecret) {
    return res.status(503).json({ error: 'Нет ключей в .env' });
  }
  try {
    const token = await getGigaChatToken(gigachatId, gigachatSecret);
    const list = await getGigaChatModels(token);
    const names = list.map((m) => m?.id ?? m?.name ?? m?.title ?? JSON.stringify(m));
    res.status(200).json({ ok: true, models: list, modelNames: names });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}
