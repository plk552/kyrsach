// src/pages/Main/Main.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import data from '../../data/equipment.json';
import { loadSavedTariffs, saveSavedTariffs } from '../../utils/storage';
import { matchesWithTypo, SEARCH_BLOCKLIST } from '../../utils/searchUtils';
import EquipmentModal from '../../components/EquipmentModal/EquipmentModal';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import {
  MainHero,
  MainSuggestedSection,
  MainPopularSection,
  MainSavedSection,
} from './components';
import './Main.css';

const MAIN_SEARCH_STATE_KEY = 'mainSearchState';

export default function Main() {
  const [query, setQuery] = useState('');
  const [savedTariffs, setSavedTariffs] = useState([]);
  const [selectedPurposeId, setSelectedPurposeId] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [paymentTariff, setPaymentTariff] = useState(null);
  const [paymentToast, setPaymentToast] = useState(null);
  const [aiSuggestedPurposeIds, setAiSuggestedPurposeIds] = useState([]);
  const [aiScenarios, setAiScenarios] = useState([]);
  const [aiScenarioLabel, setAiScenarioLabel] = useState(null);
  const [aiScenarioDescription, setAiScenarioDescription] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    if (location.hash === '#saved-tariffs') {
      const el = document.getElementById('saved-tariffs');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    setSavedTariffs(loadSavedTariffs());
    sessionStorage.removeItem('lastPurposePath');
    try {
      const saved = sessionStorage.getItem(MAIN_SEARCH_STATE_KEY);
      if (saved) {
        const o = JSON.parse(saved);
        if (o && typeof o === 'object') {
          if (typeof o.query === 'string') setQuery(o.query);
          if (typeof o.searchTriggered === 'boolean') setSearchTriggered(o.searchTriggered);
          if (Array.isArray(o.aiSuggestedPurposeIds)) setAiSuggestedPurposeIds(o.aiSuggestedPurposeIds);
          if (Array.isArray(o.aiScenarios) && o.aiScenarios.length > 0) {
            setAiScenarios(o.aiScenarios);
          } else if (Array.isArray(o.aiSuggestedPurposeIds) && o.aiSuggestedPurposeIds.length > 0) {
            const purposesByIdMap = (data.purposes || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
            const label = o.aiScenarioLabel || null;
            const desc = o.aiScenarioDescription || null;
            setAiScenarios(
              o.aiSuggestedPurposeIds.slice(0, 3).map((id, i) => ({
                purposeId: id,
                label: i === 0 && label ? label : (purposesByIdMap[id]?.label || id),
                description: i === 0 && desc ? desc : (purposesByIdMap[id]?.description || ''),
              }))
            );
          }
          if (typeof o.aiScenarioLabel === 'string') setAiScenarioLabel(o.aiScenarioLabel);
          if (typeof o.aiScenarioDescription === 'string') setAiScenarioDescription(o.aiScenarioDescription);
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    if (aiLoading) return;
    sessionStorage.setItem(
      MAIN_SEARCH_STATE_KEY,
      JSON.stringify({
        query,
        searchTriggered,
        aiSuggestedPurposeIds,
        aiScenarios,
        aiScenarioLabel: aiScenarioLabel || null,
        aiScenarioDescription: aiScenarioDescription || null,
      })
    );
  }, [query, searchTriggered, aiSuggestedPurposeIds, aiScenarios, aiScenarioLabel, aiScenarioDescription, aiLoading]);

  const purposes = data.purposes || [];
  const presets = data.presets || [];

  const purposesById = useMemo(() => {
    const map = {};
    purposes.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [purposes]);

  const equipmentById = useMemo(() => {
    const map = {};
    (data.equipment || []).forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, []);

  const matchedPurposes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    if (SEARCH_BLOCKLIST.some((w) => q === w || q.startsWith(w + ' ') || q.endsWith(' ' + w))) return [];
    return purposes.filter((p) => {
      if (p.label && matchesWithTypo(q, p.label)) return true;
      return Array.isArray(p.keywords) && p.keywords.some((k) => matchesWithTypo(q, k));
    });
  }, [query, purposes]);

  const handlePurposeClick = (purposeId) => {
    setSelectedPurposeId(purposeId);
    navigate(`/purpose/${purposeId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchTriggered(true);
    if (matchedPurposes.length > 0) {
      setAiError(null);
      setAiSuggestedPurposeIds([]);
      setAiScenarios([]);
      setAiScenarioLabel(null);
      setAiScenarioDescription(null);
    } else {
      fetchAiTariffs();
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setAiSuggestedPurposeIds([]);
    setAiScenarios([]);
    setAiScenarioLabel(null);
    setAiScenarioDescription(null);
    setAiError(null);
    setSearchTriggered(false);
  };

  const fetchAiTariffs = async () => {
    const q = query.trim();
    if (!q) return;
    const qLower = q.toLowerCase();
    if (SEARCH_BLOCKLIST.some((w) => qLower === w || qLower.startsWith(w + ' ') || qLower.endsWith(' ' + w))) {
      setAiError('Введите запрос, связанный с арендой видеооборудования (например: курорт, свадьба, стрим).');
      return;
    }
    setAiLoading(true);
    setAiError(null);
    setAiSuggestedPurposeIds([]);
    setAiScenarios([]);
    setAiScenarioLabel(null);
    try {
      const res = await fetch('/api/suggest-tariffs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = resData.error || resData.detail || resData.hint || (res.status === 500 ? 'Ошибка сервера. Смотрите консоль в терминале, где запущен npm start.' : 'Ошибка запроса');
        const fullMsg = resData.detail ? `${resData.error || 'Ошибка нейросети'}: ${resData.detail}` : msg;
        setAiError(fullMsg);
        return;
      }
      setAiSuggestedPurposeIds(resData.purposeIds || []);
      if (Array.isArray(resData.scenarios) && resData.scenarios.length > 0) {
        setAiScenarios(resData.scenarios);
      } else {
        const ids = resData.purposeIds || [];
        const label = resData.scenarioLabel || null;
        const desc = resData.scenarioDescription || null;
        const purposesByIdMap = (data.purposes || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
        setAiScenarios(
          ids.slice(0, 3).map((id, i) => ({
            purposeId: id,
            label: i === 0 && label ? label : (purposesByIdMap[id]?.label || id),
            description: i === 0 && desc ? desc : (purposesByIdMap[id]?.description || ''),
          }))
        );
      }
      setAiScenarioLabel(resData.scenarioLabel || null);
      setAiScenarioDescription(resData.scenarioDescription || null);
    } catch (err) {
      const isConnectionError = !err.message || /fetch failed|Failed to fetch|NetworkError|Connection refused/i.test(err.message);
      setAiError(isConnectionError
        ? 'Сервер не отвечает. 1) Откройте новый терминал. 2) Выполните: cd kyrsovaya/server и npm start. 3) Должно появиться «Сервер запущен: http://localhost:3001». 4) Проверьте в браузере: откройте http://localhost:3001/api/health — должна открыться страница с {"ok":true}.'
        : `Нейросеть недоступна: ${err.message || 'неизвестная ошибка'}.`);
    } finally {
      setAiLoading(false);
    }
  };

  const aiSuggestedPurposes = useMemo(() => {
    return (aiSuggestedPurposeIds || []).map((id) => purposesById[id]).filter(Boolean);
  }, [aiSuggestedPurposeIds, purposesById]);

  const deleteTariff = (tariffId) => {
    const next = savedTariffs.filter((t) => t.id !== tariffId);
    saveSavedTariffs(next);
    setSavedTariffs(next);
  };

  const editTariff = (tariff) => {
    navigate('/Constructor', { state: { editTariff: tariff } });
  };

  const handlePaymentConfirm = () => {
    setPaymentTariff(null);
    setPaymentToast('Сотрудник свяжется с вами в ближайшее время');
  };

  useEffect(() => {
    if (!paymentToast) return;
    const t = setTimeout(() => setPaymentToast(null), 4000);
    return () => clearTimeout(t);
  }, [paymentToast]);

  const showSuggested =
    searchTriggered && (matchedPurposes.length > 0 || aiSuggestedPurposes.length > 0);

  return (
    <div className="main-page">
      {paymentToast && (
        <div className="main-toast" role="status" aria-live="polite">
          {paymentToast}
        </div>
      )}
      <MainHero
        query={query}
        onQueryChange={handleQueryChange}
        onSearchSubmit={handleSearchSubmit}
        searchTriggered={searchTriggered}
        aiError={aiError}
        aiLoading={aiLoading}
      />

      {showSuggested && (
        <MainSuggestedSection
          aiSuggestedPurposes={aiSuggestedPurposes}
          aiScenarios={aiScenarios}
          matchedPurposes={matchedPurposes}
          aiScenarioLabel={aiScenarioLabel}
          aiScenarioDescription={aiScenarioDescription}
          selectedPurposeId={selectedPurposeId}
          onPurposeClick={handlePurposeClick}
        />
      )}

      <MainPopularSection
        purposes={purposes}
        selectedPurposeId={selectedPurposeId}
        onPurposeClick={handlePurposeClick}
      />

      <MainSavedSection
        savedTariffs={savedTariffs}
        purposes={purposes}
        equipmentById={equipmentById}
        onEditTariff={editTariff}
        onDeleteTariff={deleteTariff}
        onPayTariff={setPaymentTariff}
        onEquipmentClick={setModalItem}
      />

      <EquipmentModal
        item={modalItem}
        isOpen={!!modalItem}
        onClose={() => setModalItem(null)}
        showAddToCart={false}
      />
      <PaymentModal
        tariff={paymentTariff}
        isOpen={!!paymentTariff}
        onClose={() => setPaymentTariff(null)}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
}
