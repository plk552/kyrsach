// src/pages/Main/components/MainSearchForm/MainSearchForm.jsx
import './MainSearchForm.css';

export default function MainSearchForm({ value, onChange, onSubmit }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form className="main-search-form" onSubmit={onSubmit}>
      <input
        type="text"
        className="main-input"
        placeholder="Введите идею: курорт, день рождения, стрим, корпоратив..."
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="main-search-submit" aria-label="Найти">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}
