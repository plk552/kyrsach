// src/pages/Сonstructor/components/ConstructorHeader/ConstructorHeader.jsx
import './ConstructorHeader.css';

export default function ConstructorHeader() {
  return (
    <header className="constructor-header">
      <h1 className="constructor-title">Конструктор тарифа</h1>
      <p className="constructor-subtitle">
        Выберите оборудование из списка. Нажмите на карточку — откроется описание и кнопка «Добавить в конструктор». Сохраните тариф, чтобы он отображался на главной.
      </p>
    </header>
  );
}
