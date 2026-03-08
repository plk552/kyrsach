// src/pages/Сonstructor/components/ConstructorSummarySection/ConstructorSummarySection.jsx
import { Link } from 'react-router-dom';
import './ConstructorSummarySection.css';

const SUMMARY_TOOLTIP =
  'В данном блоке укажите название тарифа, при необходимости — описание (для чего этот тариф; оно отобразится на карточке на главной). Выберите сценарий, добавьте оборудование из списка слева и нажмите «Сохранить тариф» — тариф отобразится на главной странице.';

export default function ConstructorSummarySection({
  tariffName,
  onTariffNameChange,
  tariffDescription,
  onTariffDescriptionChange,
  purposeId,
  purposeDropdownOpen,
  onPurposeDropdownToggle,
  purposeOptions,
  selectedPurposeLabel,
  onPurposeSelect,
  customPurposeLabel,
  onCustomPurposeLabelChange,
  dropdownRef,
  selectedGrouped,
  totalPerDay,
  onQuantityChange,
  onRemoveAll,
  onSave,
  canSave,
  editTariff,
  onClear,
}) {
  return (
    <aside className="constructor-summary-section">
      <div className="constructor-section-header">
        <div className="constructor-section-header-text">
          <h2 className="constructor-section-title">Ваш тариф</h2>
        </div>
        <span className="constructor-section-help" aria-label="Подсказка">?</span>
      </div>
      <span className="constructor-section-help-tooltip">
        {SUMMARY_TOOLTIP}
      </span>

      <div className="constructor-summary-form">
        <label className="constructor-label">
          Название тарифа
          <input
            type="text"
            className="constructor-input"
            placeholder="Например: Мой YouTube-набор"
            value={tariffName}
            onChange={(e) => onTariffNameChange(e.target.value)}
          />
        </label>
        <label className="constructor-label">
          Описание тарифа
          <textarea
            className="constructor-input constructor-textarea"
            placeholder="Кратко опишите, для чего этот тариф (необязательно)"
            value={tariffDescription}
            onChange={(e) => onTariffDescriptionChange(e.target.value)}
            rows={3}
          />
        </label>
        <label className="constructor-label">
          Сценарий (для главной)
          <div className="constructor-dropdown" ref={dropdownRef}>
            <button
              type="button"
              className={'constructor-dropdown-trigger' + (purposeDropdownOpen ? ' constructor-dropdown-trigger--open' : '')}
              onClick={() => onPurposeDropdownToggle()}
              aria-expanded={purposeDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className="constructor-dropdown-trigger-text">{selectedPurposeLabel}</span>
              <span className="constructor-dropdown-arrow" aria-hidden>▼</span>
            </button>
            {purposeDropdownOpen && (
              <div
                className="constructor-dropdown-panel"
                role="listbox"
                aria-activedescendant={purposeId}
              >
                {purposeOptions.map((opt) => (
                  <button
                    key={opt.value || '_empty'}
                    type="button"
                    role="option"
                    aria-selected={purposeId === opt.value}
                    className={'constructor-dropdown-option' + (purposeId === opt.value ? ' constructor-dropdown-option--selected' : '')}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onPurposeSelect(opt.value);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </label>
        {purposeId === '__custom__' && (
          <label className="constructor-label">
            Название сценария
            <input
              type="text"
              className="constructor-input"
              placeholder="Например: Съёмка на природе"
              value={customPurposeLabel}
              onChange={(e) => onCustomPurposeLabelChange(e.target.value)}
            />
          </label>
        )}
      </div>

      {selectedGrouped.length > 0 && (
        <>
          <ul className="constructor-selected-list">
            {selectedGrouped.map(({ item, quantity }) => (
              <li key={item.id} className="constructor-selected-item">
                <div className="constructor-selected-item-row constructor-selected-item-row--top">
                  <span className="constructor-selected-name">{item.name}</span>
                  <button
                    type="button"
                    className="constructor-remove"
                    onClick={() => onRemoveAll(item.id)}
                    title="Убрать"
                  >
                    ×
                  </button>
                </div>
                <div className="constructor-selected-item-row constructor-selected-item-row--bottom">
                  <div className="constructor-selected-quantity">
                    <button
                      type="button"
                      className="constructor-quantity-btn"
                      onClick={() => onQuantityChange(item.id, -1)}
                      disabled={quantity <= 1}
                      aria-label="Уменьшить"
                    >
                      −
                    </button>
                    <span className="constructor-quantity-value">{quantity}</span>
                    <button
                      type="button"
                      className="constructor-quantity-btn"
                      onClick={() => onQuantityChange(item.id, 1)}
                      aria-label="Увеличить"
                    >
                      +
                    </button>
                  </div>
                  <span className="constructor-selected-price">
                    {(item.pricePerDay * quantity).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="constructor-clear-wrap">
            <button
              type="button"
              className="constructor-clear"
              onClick={onClear}
              title="Сбросить название, описание, сценарий и оборудование"
            >
              Очистить конструктор
            </button>
          </div>
          <div className="constructor-total">
            <span>Итого за сутки:</span>
            <strong>{totalPerDay.toLocaleString('ru-RU')} ₽</strong>
          </div>
          <button
            type="button"
            className="constructor-save"
            onClick={onSave}
            disabled={!canSave}
          >
            {editTariff ? 'Сохранить изменения' : 'Сохранить тариф'}
          </button>
        </>
      )}
      {selectedGrouped.length === 0 && (
        <div className="constructor-clear-wrap">
          <button
            type="button"
            className="constructor-clear"
            onClick={onClear}
            title="Сбросить название, описание и сценарий"
          >
            Очистить конструктор
          </button>
        </div>
      )}
      <p className="constructor-saved-link-wrap">
        <Link to="/#saved-tariffs" className="constructor-saved-link">
          К сохранённым тарифам на главной
        </Link>
      </p>
    </aside>
  );
}
