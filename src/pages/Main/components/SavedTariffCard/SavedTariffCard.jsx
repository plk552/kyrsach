// src/pages/Main/components/SavedTariffCard/SavedTariffCard.jsx
import './SavedTariffCard.css';

export default function SavedTariffCard({
  tariff,
  purposeLabel,
  equipmentById,
  onEdit,
  onDelete,
  onPay,
  onEquipmentClick,
}) {
  return (
    <div className="main-preset-card main-preset-card--saved">
      <div className="main-preset-card--saved-top">
        <div className="main-preset-name">{tariff.name}</div>
        <span className="main-preset-purpose">{purposeLabel || 'Ваш тариф'}</span>
        {tariff.description && (
          <p className="main-preset-description">{tariff.description}</p>
        )}
        {typeof tariff.pricePerDay === 'number' && (
          <span className="main-preset-price">
            {tariff.pricePerDay.toLocaleString('ru-RU')} ₽/сутки
          </span>
        )}
      </div>

      {Array.isArray(tariff.equipmentIds) && tariff.equipmentIds.length > 0 && (
        <ul className="main-equipment-list main-equipment-list--compact">
          {tariff.equipmentIds
            .map((id) => equipmentById[id])
            .filter(Boolean)
            .map((item) => (
              <li key={item.id} className="main-equipment-item main-equipment-item--compact">
                <button
                  type="button"
                  className="main-equipment-item-btn"
                  onClick={() => onEquipmentClick(item)}
                >
                  <span className="main-equipment-name">{item.name}</span>
                  <span className="main-equipment-category">{item.category}</span>
                </button>
              </li>
            ))}
        </ul>
      )}

      <div className="main-preset-actions">
        <button
          type="button"
          className="main-preset-btn main-preset-btn--delete"
          onClick={() => onDelete(tariff.id)}
        >
          Удалить
        </button>
        <button
          type="button"
          className="main-preset-btn main-preset-btn--edit"
          onClick={() => onEdit(tariff)}
        >
          Редактировать
        </button>
        <button
          type="button"
          className="main-preset-btn main-preset-btn--pay"
          onClick={() => onPay && onPay(tariff)}
        >
          Оформить
        </button>
      </div>
    </div>
  );
}
