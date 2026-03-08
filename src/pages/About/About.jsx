// src/pages/About/About.jsx
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1 className="about-title">О компании FrameRate</h1>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Чем мы занимаемся</h2>
        <p className="about-text">
          FrameRate предоставляет в аренду камеры, объективы, свет, звук и аксессуары. Вы можете выбрать готовый тариф под любой сценарий или собрать свой набор в конструкторе на сайте. Оборудование выдаётся на сутки и дольше с доставкой или самовывозом.
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Наша миссия</h2>
        <p className="about-text about-mission">
          Наша миссия — делать профессиональную видеосъёмку доступной для проектов любого масштаба: от личного блога до корпоративного мероприятия. Мы верим, что качественное оборудование должно быть в шаговой доступности, без лишних барьеров и скрытых условий.
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Наши ценности</h2>
        <ul className="about-values-list">
          <li className="about-value-item">
            <span className="about-value-name">Качество</span>
            <span className="about-value-desc">Только проверенная техника, регулярный сервис и честное описание состояния</span>
          </li>
          <li className="about-value-item">
            <span className="about-value-name">Прозрачность</span>
            <span className="about-value-desc">Понятные тарифы, никаких скрытых платежей и неожиданных доплат</span>
          </li>
          <li className="about-value-item">
            <span className="about-value-name">Клиентоориентированность</span>
            <span className="about-value-desc">Помогаем подобрать оборудование под любую задачу и сроки</span>
          </li>
          <li className="about-value-item">
            <span className="about-value-name">Надёжность</span>
            <span className="about-value-desc">Соблюдаем договорённости по срокам, доставке и возврату</span>
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Почему мы</h2>
        <ul className="about-reasons-list">
          <li className="about-reason-item">
            <span className="about-reason-text">Проверенная техника и регулярное обслуживание</span>
          </li>
          <li className="about-reason-item">
            <span className="about-reason-text">Понятные тарифы без скрытых платежей</span>
          </li>
          <li className="about-reason-item">
            <span className="about-reason-text">Консультация по подбору оборудования под задачу</span>
          </li>
          <li className="about-reason-item">
            <span className="about-reason-text">Гибкие условия аренды и доставки</span>
          </li>
          <li className="about-reason-item">
            <span className="about-reason-text">Сценарии и тарифы под любую задачу</span>
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Наши контакты</h2>
        <p className="about-text">
          Телефон: <a href="tel:+78005553535" className="about-link">8 (800) 555-35-35</a><br />
          Почта: <a href="mailto:rent@framerate.example" className="about-link">rent@framerate.example</a>
        </p>
      </section>
    </div>
  );
}
