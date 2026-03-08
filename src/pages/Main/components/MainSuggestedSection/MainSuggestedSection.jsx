// src/pages/Main/components/MainSuggestedSection/MainSuggestedSection.jsx
import { useNavigate } from 'react-router-dom';
import MainSectionBlock from '../MainSectionBlock/MainSectionBlock';
import MainPurposeCard from '../MainPurposeCard/MainPurposeCard';
import './MainSuggestedSection.css';

const SUGGESTED_TOOLTIP =
  'В данном блоке отображаются сценарии, подобранные нейросетью по вашему запросу. Выберите подходящую карточку — откроется страница с готовыми тарифами и списком оборудования.';

export default function MainSuggestedSection({
  aiSuggestedPurposes,
  aiScenarios,
  matchedPurposes,
  aiScenarioLabel,
  aiScenarioDescription,
  selectedPurposeId,
  onPurposeClick,
}) {
  const navigate = useNavigate();
  const showAi = aiSuggestedPurposes.length > 0;

  return (
    <MainSectionBlock title="Предложенные сценарии" tooltipText={SUGGESTED_TOOLTIP}>
      <div className="main-purpose-grid--ai">
        {showAi
          ? aiSuggestedPurposes.map((purpose, index) => {
              const scenario = Array.isArray(aiScenarios) && aiScenarios[index];
              const labelOverride = scenario?.label ?? (index === 0 ? aiScenarioLabel : null);
              const descriptionOverride = scenario?.description ?? (index === 0 ? aiScenarioDescription : null);
              return (
                <MainPurposeCard
                  key={purpose.id}
                  purpose={purpose}
                  labelOverride={labelOverride || null}
                  descriptionOverride={descriptionOverride || null}
                  isActive={purpose.id === selectedPurposeId}
                  onClick={() => {
                    if (labelOverride) {
                      navigate(`/purpose/${purpose.id}`, {
                        state: { customScenarioLabel: labelOverride },
                      });
                    } else {
                      onPurposeClick(purpose.id);
                    }
                  }}
                />
              );
            })
          : matchedPurposes.map((purpose) => (
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
