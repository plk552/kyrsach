// src/pages/Main/components/MainSectionBlock/MainSectionBlock.jsx
import './MainSectionBlock.css';

export default function MainSectionBlock({ title, tooltipText, children, id }) {
  return (
    <section className="main-section" id={id || undefined}>
      <div className="main-section-header">
        <div className="main-section-header-text">
          <h2 className="main-section-title">{title}</h2>
        </div>
        <span className="main-section-help" aria-label="Подсказка">?</span>
      </div>
      <span className="main-section-help-tooltip">{tooltipText}</span>
      {children}
    </section>
  );
}
