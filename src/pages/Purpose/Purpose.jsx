// src/pages/Purpose/Purpose.jsx
import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import data from '../../data/equipment.json';
import EquipmentModal from '../../components/EquipmentModal/EquipmentModal';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import './Purpose.css';

export default function Purpose() {
  const { purposeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalItem, setModalItem] = useState(null);
  const [paymentPreset, setPaymentPreset] = useState(null);
  const [paymentToast, setPaymentToast] = useState(null);

  const customPreset = location.state?.customPreset;
  const customScenarioLabel = location.state?.customScenarioLabel;

  const purposeFromData = data.purposes.find((item) => item.id === purposeId) || null;

  const purpose = customPreset
    ? { id: purposeId, label: customPreset.name, description: 'Подборка оборудования под ваш запрос. Нажмите на оборудование для описания.' }
    : customScenarioLabel && purposeFromData
      ? { ...purposeFromData, label: customScenarioLabel }
      : purposeFromData;

  const presets = customPreset
    ? [customPreset]
    : data.presets.filter((preset) => preset.purposeId === purposeId);

  const equipmentById = useMemo(() => {
    const map = {};
    (data.equipment || []).forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, []);

  useEffect(() => {
    if (purpose && location.pathname.startsWith('/purpose/')) {
      sessionStorage.setItem('lastPurposePath', location.pathname);
    }
  }, [purpose, location.pathname]);

  const handleBack = () => {
    sessionStorage.removeItem('lastPurposePath');
    navigate('/');
  };

  const openEquipmentModal = (item) => {
    setModalItem(item);
  };

  const closeModal = () => {
    setModalItem(null);
  };

  const handlePaymentConfirm = () => {
    setPaymentPreset(null);
    setPaymentToast('Сотрудник свяжется с вами в ближайшее время');
  };

  useEffect(() => {
    if (!paymentToast) return;
    const t = setTimeout(() => setPaymentToast(null), 4000);
    return () => clearTimeout(t);
  }, [paymentToast]);

  if (!purpose) {
    return (
      <div className="purpose-page">
        <button type="button" className="purpose-back" onClick={handleBack}>
          ← Назад на главную
        </button>
        <h1 className="purpose-title">Сценарий не найден</h1>
        <p className="purpose-text">
          Похоже, такой сценарий больше не доступен. Вернитесь на главную и
          выберите другой.
        </p>
      </div>
    );
  }

  return (
    <div className="purpose-page">
      {paymentToast && (
        <div className="purpose-toast" role="status" aria-live="polite">
          {paymentToast}
        </div>
      )}
      <button type="button" className="purpose-back" onClick={handleBack}>
        ← На главную
      </button>

      <section className="purpose-section">
        <div className="purpose-section-header">
          <div className="purpose-section-header-text">
            <h2 className="purpose-section-title">
              Готовые тарифы по сценарию «{purpose.label}»
            </h2>
          </div>
          <span className="purpose-section-help" aria-label="Подсказка">?</span>
        </div>
        <span className="purpose-section-help-tooltip">
          В данном блоке вы можете выбрать тариф и посмотреть описание оборудования при нажатии на карточку оборудования.
        </span>

        <div className="purpose-tariff-grid">
          {presets.map((preset) => {
            const purposeLabel = purposeFromData?.label || '';
            const escapedLabel = purposeLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const nameWithoutPurpose = escapedLabel
              ? (preset.name.replace(new RegExp(`^${escapedLabel}\\s+`, 'i'), '').trim() || preset.name)
              : preset.name;
            const tariffDisplayName = customScenarioLabel
              ? `${customScenarioLabel} — ${nameWithoutPurpose}`
              : preset.name;
            return (
            <article key={preset.id} className="purpose-tariff-card">
              <div className="purpose-tariff-header">
                <h3 className="purpose-tariff-name">{tariffDisplayName}</h3>
                <div className="purpose-tariff-price">
                  от {(preset.pricePerDay || 0).toLocaleString('ru-RU')} ₽/сутки
                </div>
              </div>
              <p className="purpose-tariff-description">
                {preset.shortDescription}
              </p>

              <ul className="purpose-equipment-list">
                {(preset.equipmentIds || []).map((id) => {
                  const item = equipmentById[id];
                  if (!item) return null;

                  return (
                    <li key={item.id} className="purpose-equipment-item">
                      <button
                        type="button"
                        className="purpose-equipment-item-btn"
                        onClick={() => openEquipmentModal(item)}
                      >
                        {item.imageUrl && (
                          <div className="purpose-equipment-image-wrap">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="purpose-equipment-image"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="purpose-equipment-main">
                          <div className="purpose-equipment-name">
                            {item.name}
                          </div>
                          <div className="purpose-equipment-meta">
                            <span className="purpose-equipment-category">
                              {item.category}
                            </span>
                            <span className="purpose-equipment-price">
                              {item.pricePerDay.toLocaleString('ru-RU')} ₽/сутки
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                className="purpose-tariff-order-btn"
                onClick={() => setPaymentPreset({ name: tariffDisplayName, pricePerDay: preset.pricePerDay || 0 })}
              >
                Оформить
              </button>
            </article>
            );
          })}
        </div>
      </section>

      <EquipmentModal
        item={modalItem}
        isOpen={!!modalItem}
        onClose={closeModal}
        showAddToCart={false}
      />
      <PaymentModal
        tariff={paymentPreset}
        isOpen={!!paymentPreset}
        onClose={() => setPaymentPreset(null)}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
}
