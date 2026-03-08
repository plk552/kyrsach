// src/pages/Main/components/MainHero/MainHero.jsx
import MainSearchForm from '../MainSearchForm/MainSearchForm';
import './MainHero.css';

export default function MainHero({
  query,
  onQueryChange,
  onSearchSubmit,
  searchTriggered,
  aiError,
  aiLoading,
}) {
  const showSearchResults = query.trim() && searchTriggered && (aiError || aiLoading);

  return (
    <section className="main-hero">
      <h1 className="main-title">Аренда фото и видео техники под вашу задачу</h1>
      <p className="main-subtitle">
        Введите, для чего нужна аренда, или выберите готовый сценарий ниже — мы
        покажем подходящие тарифы и оборудование.
      </p>

      <div className="main-input-wrapper">
        <MainSearchForm
          value={query}
          onChange={onQueryChange}
          onSubmit={onSearchSubmit}
        />
      </div>

      {showSearchResults && (
        <section className="main-search-results">
          {aiError && <p className="main-search-error">{aiError}</p>}
          {aiLoading && (
            <div className="main-search-loading">Подбор сценариев...</div>
          )}
        </section>
      )}
    </section>
  );
}
