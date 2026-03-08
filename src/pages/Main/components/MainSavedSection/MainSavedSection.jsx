// src/pages/Main/components/MainSavedSection/MainSavedSection.jsx
import MainSectionBlock from '../MainSectionBlock/MainSectionBlock';
import SavedTariffCard from '../SavedTariffCard/SavedTariffCard';
import './MainSavedSection.css';

const SAVED_TOOLTIP =
  'В данном блоке отображаются тарифы, которые вы собрали во вкладке «Конструктор». Они сохраняются в вашем браузере. Вы можете редактировать или удалить любой тариф. Чтобы добавить новый — перейдите в «Конструктор».';

export default function MainSavedSection({
  savedTariffs,
  purposes,
  equipmentById,
  onEditTariff,
  onDeleteTariff,
  onPayTariff,
  onEquipmentClick,
}) {
  return (
    <MainSectionBlock id="saved-tariffs" title="Ваши сохранённые тарифы" tooltipText={SAVED_TOOLTIP}>
      {savedTariffs.length === 0 ? (
        <p className="main-empty">
          У вас пока нет сохранённых тарифов. Перейдите во вкладку
          «Конструктор» и соберите свой первый набор.
        </p>
      ) : (
        <div className="main-preset-grid">
          {savedTariffs.map((tariff) => (
            <SavedTariffCard
              key={tariff.id}
              tariff={tariff}
              purposeLabel={tariff.purposeLabel ?? purposes.find((p) => p.id === tariff.purposeId)?.label}
              equipmentById={equipmentById}
              onEdit={onEditTariff}
              onDelete={onDeleteTariff}
              onPay={onPayTariff}
              onEquipmentClick={onEquipmentClick}
            />
          ))}
        </div>
      )}
      <p className="main-saved-link-wrap">
        <a href="#saved-tariffs" className="main-saved-link">
          Перейти к сохранённым тарифам
        </a>
      </p>
    </MainSectionBlock>
  );
}
