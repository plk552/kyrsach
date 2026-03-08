// src/pages/Main/components/MainPurposeCard/MainPurposeCard.jsx
import './MainPurposeCard.css';

export default function MainPurposeCard({
  purpose,
  labelOverride,
  descriptionOverride,
  isActive,
  onClick,
}) {
  return (
    <button
      type="button"
      className={'main-purpose-card' + (isActive ? ' main-purpose-card--active' : '')}
      onClick={onClick}
    >
      <div className="main-purpose-label">
        {labelOverride != null ? labelOverride : purpose.label}
      </div>
      <p className="main-purpose-description">
        {descriptionOverride != null ? descriptionOverride : purpose.description}
      </p>
    </button>
  );
}
