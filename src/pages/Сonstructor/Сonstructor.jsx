// src/pages/Сonstructor/Сonstructor.jsx
import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import data from '../../data/equipment.json';
import { loadSavedTariffs, saveSavedTariffs, loadConstructorDraft, saveConstructorDraft, clearConstructorDraft } from '../../utils/storage';
import EquipmentModal from '../../components/EquipmentModal/EquipmentModal';
import ConstructorHeader from './components/ConstructorHeader/ConstructorHeader';
import ConstructorEquipmentSection from './components/ConstructorEquipmentSection/ConstructorEquipmentSection';
import ConstructorSummarySection from './components/ConstructorSummarySection/ConstructorSummarySection';
import './Сonstructor.css';

const ALL_CATEGORIES = 'Все';
const CUSTOM_PURPOSE_ID = '__custom__';

const purposeOptions = [
  { value: '', label: '— Не выбран —' },
  { value: CUSTOM_PURPOSE_ID, label: 'Свой вариант' },
  ...(data.purposes || []).map((p) => ({ value: p.id, label: p.label })),
];

export default function Constructor() {
  const navigate = useNavigate();
  const location = useLocation();
  const editTariff = location.state?.editTariff ?? null;
  const dropdownRef = useRef(null);

  const [tariffName, setTariffName] = useState('');
  const [tariffDescription, setTariffDescription] = useState('');
  const [purposeId, setPurposeId] = useState(data.purposes?.[0]?.id || '');
  const [customPurposeLabel, setCustomPurposeLabel] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const [equipmentSearchQuery, setEquipmentSearchQuery] = useState('');
  const [modalItem, setModalItem] = useState(null);
  const [purposeDropdownOpen, setPurposeDropdownOpen] = useState(false);
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPurposeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setPurposeDropdownOpen(false);
  }, [purposeId]);

  useEffect(() => {
    if (editTariff) {
      setTariffName(editTariff.name || '');
      setTariffDescription(editTariff.description || '');
      if (editTariff.purposeLabel) {
        setPurposeId(CUSTOM_PURPOSE_ID);
        setCustomPurposeLabel(editTariff.purposeLabel);
      } else {
        setPurposeId(editTariff.purposeId || '');
        setCustomPurposeLabel('');
      }
      setSelectedIds(Array.isArray(editTariff.equipmentIds) ? [...editTariff.equipmentIds] : []);
      saveConstructorDraft({
        tariffName: editTariff.name || '',
        tariffDescription: editTariff.description || '',
        purposeId: editTariff.purposeLabel ? CUSTOM_PURPOSE_ID : (editTariff.purposeId || ''),
        customPurposeLabel: editTariff.purposeLabel || '',
        selectedIds: Array.isArray(editTariff.equipmentIds) ? editTariff.equipmentIds : [],
        categoryFilter: ALL_CATEGORIES,
        equipmentSearchQuery: '',
      });
    } else {
      const draft = loadConstructorDraft();
      if (draft) {
        const equipmentIds = (data.equipment || []).map((e) => e.id);
        if (typeof draft.tariffName === 'string') setTariffName(draft.tariffName);
        if (typeof draft.tariffDescription === 'string') setTariffDescription(draft.tariffDescription);
        if (draft.purposeId !== undefined) setPurposeId(draft.purposeId);
        if (typeof draft.customPurposeLabel === 'string') setCustomPurposeLabel(draft.customPurposeLabel);
        if (Array.isArray(draft.selectedIds)) {
          setSelectedIds(draft.selectedIds.filter((id) => equipmentIds.includes(id)));
        }
        if (draft.categoryFilter !== undefined) setCategoryFilter(draft.categoryFilter);
        if (typeof draft.equipmentSearchQuery === 'string') setEquipmentSearchQuery(draft.equipmentSearchQuery);
      }
    }
  }, [editTariff]);

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    saveConstructorDraft({
      tariffName,
      tariffDescription,
      purposeId,
      customPurposeLabel,
      selectedIds,
      categoryFilter,
      equipmentSearchQuery,
    });
  }, [tariffName, tariffDescription, purposeId, customPurposeLabel, selectedIds, categoryFilter, equipmentSearchQuery]);

  const equipment = data.equipment || [];

  const categories = useMemo(() => {
    const set = new Set(equipment.map((e) => e.category).filter(Boolean));
    return [ALL_CATEGORIES, ...Array.from(set).sort()];
  }, [equipment]);

  const filteredEquipment = useMemo(() => {
    let list = equipment;
    if (categoryFilter !== ALL_CATEGORIES) {
      list = list.filter((e) => e.category === categoryFilter);
    }
    const q = (equipmentSearchQuery || '').trim().toLowerCase();
    if (q) {
      list = list.filter((e) => (e.name || '').toLowerCase().includes(q));
    }
    return list;
  }, [equipment, categoryFilter, equipmentSearchQuery]);

  const selectedItems = useMemo(() => {
    return selectedIds
      .map((id) => equipment.find((e) => e.id === id))
      .filter(Boolean);
  }, [selectedIds, equipment]);

  const selectedGrouped = useMemo(() => {
    const map = new Map();
    selectedIds.forEach((id) => {
      const item = equipment.find((e) => e.id === id);
      if (!item) return;
      const prev = map.get(id);
      map.set(id, prev ? { item, quantity: prev.quantity + 1 } : { item, quantity: 1 });
    });
    return Array.from(map.values());
  }, [selectedIds, equipment]);

  const totalPerDay = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (item.pricePerDay || 0), 0);
  }, [selectedItems]);

  const changeQuantity = (id, delta) => {
    if (delta > 0) {
      setSelectedIds((prev) => [...prev, id]);
    } else if (delta < 0) {
      const idx = selectedIds.indexOf(id);
      if (idx !== -1) {
        setSelectedIds((prev) => prev.filter((_, i) => i !== idx));
      }
    }
  };

  const removeAllOf = (id) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleAddToCartFromModal = (equipmentId) => {
    setSelectedIds((prev) => [...prev, equipmentId]);
    setModalItem(null);
  };

  const handleCardClick = (item, e) => {
    if (e.target.closest('.constructor-card-description-btn')) return;
    setSelectedIds((prev) => [...prev, item.id]);
  };

  const handleSave = () => {
    const name = tariffName.trim() || 'Мой тариф';
    const list = loadSavedTariffs();
    const isCustomPurpose = purposeId === CUSTOM_PURPOSE_ID;
    const payload = {
      id: editTariff ? editTariff.id : 'custom_' + Date.now(),
      name,
      description: tariffDescription.trim() || undefined,
      purposeId: isCustomPurpose ? undefined : (purposeId || undefined),
      purposeLabel: isCustomPurpose ? (customPurposeLabel.trim() || undefined) : undefined,
      equipmentIds: [...selectedIds],
      pricePerDay: totalPerDay,
    };
    const next = editTariff
      ? list.map((t) => (t.id === editTariff.id ? payload : t))
      : [...list, payload];
    saveSavedTariffs(next);
    clearConstructorDraft();
    navigate('/');
  };

  const canSave = selectedIds.length > 0;
  const selectedPurposeLabel = purposeOptions.find((o) => o.value === purposeId)?.label ?? '— Не выбран —';

  const handleClear = () => {
    setTariffName('');
    setTariffDescription('');
    setPurposeId(data.purposes?.[0]?.id || '');
    setCustomPurposeLabel('');
    setSelectedIds([]);
    setCategoryFilter(ALL_CATEGORIES);
    setEquipmentSearchQuery('');
    clearConstructorDraft();
  };

  return (
    <div className="constructor-page">
      <div className="constructor-layout">
        <div className="constructor-main-column">
          <ConstructorHeader />

          <ConstructorEquipmentSection
            categories={categories}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            equipmentSearchQuery={equipmentSearchQuery}
            onEquipmentSearchQueryChange={setEquipmentSearchQuery}
            filteredEquipment={filteredEquipment}
            selectedIds={selectedIds}
            onCardClick={handleCardClick}
            onDescriptionClick={setModalItem}
          />
        </div>

        <ConstructorSummarySection
          tariffName={tariffName}
          onTariffNameChange={setTariffName}
          tariffDescription={tariffDescription}
          onTariffDescriptionChange={setTariffDescription}
          purposeId={purposeId}
          purposeDropdownOpen={purposeDropdownOpen}
          onPurposeDropdownToggle={() => setPurposeDropdownOpen((v) => !v)}
          purposeOptions={purposeOptions}
          selectedPurposeLabel={selectedPurposeLabel}
          onPurposeSelect={(value) => {
            setPurposeId(value);
            setPurposeDropdownOpen(false);
          }}
          customPurposeLabel={customPurposeLabel}
          onCustomPurposeLabelChange={setCustomPurposeLabel}
          dropdownRef={dropdownRef}
          selectedGrouped={selectedGrouped}
          totalPerDay={totalPerDay}
          onQuantityChange={changeQuantity}
          onRemoveAll={removeAllOf}
          onSave={handleSave}
          canSave={canSave}
          editTariff={editTariff}
          onClear={handleClear}
        />
      </div>

      <EquipmentModal
        item={modalItem}
        isOpen={!!modalItem}
        onClose={() => setModalItem(null)}
        onAddToCart={handleAddToCartFromModal}
        showAddToCart={true}
      />
    </div>
  );
}
