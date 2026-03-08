// src/pages/Сonstructor/components/ConstructorEquipmentSection/ConstructorEquipmentSection.jsx
import './ConstructorEquipmentSection.css';

const EQUIPMENT_TOOLTIP =
  'В данном блоке вы можете выбрать оборудование для тарифа. Строка поиска позволяет искать оборудование по названию: введите часть названия — список отфильтруется и покажет только подходящие позиции. Кнопки под поиском переключают категории (камеры, объективы и т.д.). Нажмите на карточку — откроется описание и кнопка «Добавить в конструктор». Сохранённый тариф появится на главной в блоке «Ваши сохранённые тарифы».';

export default function ConstructorEquipmentSection({
  categories,
  categoryFilter,
  onCategoryFilterChange,
  equipmentSearchQuery,
  onEquipmentSearchQueryChange,
  filteredEquipment,
  selectedIds,
  onCardClick,
  onDescriptionClick,
}) {
  return (
    <section className="constructor-equipment-section">
      <div className="constructor-section-header">
        <div className="constructor-section-header-text">
          <h2 className="constructor-section-title">Оборудование</h2>
        </div>
        <span className="constructor-section-help" aria-label="Подсказка">?</span>
      </div>
      <span className="constructor-section-help-tooltip">
        {EQUIPMENT_TOOLTIP}
      </span>

      <div className="constructor-equipment-search">
        <input
          type="search"
          className="constructor-equipment-search-input"
          placeholder="Поиск по названию..."
          value={equipmentSearchQuery}
          onChange={(e) => onEquipmentSearchQueryChange(e.target.value)}
          aria-label="Поиск оборудования по названию"
        />
        <button
          type="button"
          className="constructor-equipment-search-submit"
          onClick={() => document.querySelector('.constructor-equipment-search-input')?.focus()}
          aria-label="К поиску"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="constructor-filters">
        <div className="constructor-filters-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={
                'constructor-filter-btn' +
                (categoryFilter === cat ? ' constructor-filter-btn--active' : '')
              }
              onClick={() => onCategoryFilterChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ul className="constructor-equipment-grid">
        {filteredEquipment.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <li key={item.id} className="constructor-grid-item">
              <div
                className={
                  'constructor-card' +
                  (isSelected ? ' constructor-card--selected' : '')
                }
                onClick={(e) => onCardClick(item, e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCardClick(item, e);
                  }
                }}
                aria-label={isSelected ? 'Убрать из тарифа' : 'Добавить в тариф'}
              >
                {item.imageUrl ? (
                  <div className="constructor-card-image">
                    <img src={item.imageUrl} alt="" loading="lazy" />
                  </div>
                ) : (
                  <div className="constructor-card-image constructor-card-image--placeholder" />
                )}
                <div className="constructor-card-body">
                  <div className="constructor-card-top">
                    <span className="constructor-card-name">{item.name}</span>
                    <span className="constructor-card-category">{item.category}</span>
                  </div>
                  <span className="constructor-card-price">
                    {item.pricePerDay.toLocaleString('ru-RU')} ₽/сутки
                  </span>
                  <button
                    type="button"
                    className="constructor-card-description-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDescriptionClick(item);
                    }}
                  >
                    Описание
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
