// src/pages/Main/components/MainPopularSection/MainPopularSection.jsx
import MainSectionBlock from '../MainSectionBlock/MainSectionBlock';
import MainPurposeCard from '../MainPurposeCard/MainPurposeCard';
import './MainPopularSection.css';

const POPULAR_TOOLTIP =
  'В данном блоке вы можете выбрать сценарий, после нажатия на карточку откроется страница с готовыми тарифами и перечнем оборудования.';

export default function MainPopularSection({
  purposes,
  selectedPurposeId,
  onPurposeClick,
}) {
  return (
    <MainSectionBlock title="Популярные сценарии" tooltipText={POPULAR_TOOLTIP}>
      <div className="main-purpose-grid">
        {purposes.map((purpose) => (
          <MainPurposeCard
            key={purpose.id}
            purpose={purpose}
            isActive={purpose.id === selectedPurposeId}
            onClick={() => onPurposeClick(purpose.id)}
          />
        ))}
      </div>
    </MainSectionBlock>
  );
}
