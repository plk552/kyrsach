// src/pages/Help/Help.jsx
import { useState, useEffect } from 'react';
import HotlineCard from '../../components/HelpArticles/HotlineCard/HotlineCard';
import './Help.css';

const SUCCESS_MESSAGE = 'Сотрудник свяжется с вами в ближайшее время';

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  let d = digits;
  if (d.startsWith('8')) d = '7' + d.slice(1);
  else if (!d.startsWith('7')) d = '7' + d;
  if (d.length <= 1) return '+7';
  if (d.length <= 4) return `+7 (${d.slice(1)}`;
  if (d.length <= 7) return `+7 (${d.slice(1, 4)}) ${d.slice(4)}`;
  if (d.length <= 9) return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
}

export default function Help() {
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    if (!formSuccess) return;
    const t = setTimeout(() => setFormSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [formSuccess]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormName('');
    setFormPhone('');
    setFormSubject('');
    setFormMessage('');
    setFormSuccess(true);
  };

  return (
    <div className="help-page">
      {formSuccess && (
        <div className="help-toast" role="status" aria-live="polite">
          {SUCCESS_MESSAGE}
        </div>
      )}
      <section className="help-hero">
        <h1 className="help-title">Центр Поддержки</h1>
        <p className="help-lead">
          Мы всегда на связи, чтобы помочь вам с выбором техники
        </p>
      </section>

      <div className="help-contact-layout-wrap">
        <div className="help-contact-layout">
          <div className="help-contact-column">
            <HotlineCard>
              <div className="help-hotline-inner">
                <HotlineCard.Icon>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18.7881 14.7644C17.4497 13.4433 15.9296 15.1939 14.9258 16.1847C11.8965 16.7827 6.44379 11.4006 7.6555 9.00853C8.65932 8.01771 10.4328 6.51729 9.09441 5.1962C7.75599 3.87511 5.85724 3.60737 4.85342 4.59819C4.02037 5.42046 3.41451 7.21449 4.92915 11.1016C6.44379 14.9887 8.86722 17.3807 13.0072 19.0751C17.1473 20.7694 18.5609 19.7728 19.394 18.9505C20.3978 17.9597 20.1265 16.0855 18.7881 14.7644Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </HotlineCard.Icon>
                <div className="hotline-body">
                  <HotlineCard.TextGroup>
                    <HotlineCard.Title>Горячая линия</HotlineCard.Title>
                    <HotlineCard.Subtitle>Круглосуточно, без выходных</HotlineCard.Subtitle>
                  </HotlineCard.TextGroup>
                  <HotlineCard.Number tel="88005553535">
                    8 (800) 555-35-35
                  </HotlineCard.Number>
                </div>
              </div>
            </HotlineCard>

            <div className="help-contact-card">
              <div className="help-contact-card-icon">✉</div>
              <div className="help-contact-card-body">
                <h3 className="help-contact-card-title">Email</h3>
                <p className="help-contact-card-subtitle">Нажмите, чтобы написать</p>
                <a href="mailto:rent@framerate.example" className="help-contact-card-link">
                  rent@framerate.example
                </a>
              </div>
            </div>

            <div className="help-contact-card">
              <div className="help-contact-card-icon help-contact-card-icon--green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="help-contact-card-body">
                <h3 className="help-contact-card-title">Главный офис</h3>
                <p className="help-contact-card-subtitle">Пункт выдачи и возврата</p>
                <p className="help-contact-card-text">
                  Москва, ул. Тверская 1, БЦ «Премьер»
                </p>
                <p className="help-contact-card-hours">Пн-Вс: 10:00 – 22:00</p>
              </div>
            </div>
          </div>

          <div className="help-form-column">
            <div className="help-form-card">
              <h2 className="help-form-title">Напишите нам</h2>
              <form className="help-form" onSubmit={handleFormSubmit}>
                <div className="help-form-row">
                  <label className="help-form-label">
                    Имя
                    <input
                      type="text"
                      className="help-form-input"
                      placeholder="Иван"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </label>
                  <label className="help-form-label">
                    Телефон
                    <input
                      type="tel"
                      className="help-form-input"
                      placeholder="+7 (999) 123-45-67"
                      value={formPhone}
                      onChange={(e) => setFormPhone(formatPhone(e.target.value))}
                    />
                  </label>
                </div>
                <label className="help-form-label">
                  Тема обращения
                  <input
                    type="text"
                    className="help-form-input"
                    placeholder="Помощь с подбором техники"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                  />
                </label>
                <label className="help-form-label">
                  Сообщение
                  <textarea
                    className="help-form-textarea"
                    placeholder="Опишите вашу задачу..."
                    rows={4}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                  />
                </label>
                <button type="submit" className="help-form-submit">
                  Отправить сообщение
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <section className="help-section">
        <h2 className="help-section-title">Частые вопросы</h2>
        <div className="help-faq-grid">
          <div className="help-faq-card">
            <h3 className="help-faq-card-question">Нужен ли залог?</h3>
            <p className="help-faq-card-answer">
              Да, для новых клиентов предусмотрен залог. Для постоянных клиентов доступна аренда без залога.
            </p>
          </div>
          <div className="help-faq-card">
            <h3 className="help-faq-card-question">Есть ли доставка?</h3>
            <p className="help-faq-card-answer">
              Мы доставляем технику по Москве в пределах МКАД за 500 ₽. При заказе от 10 000 ₽ — бесплатно.
            </p>
          </div>
          <div className="help-faq-card">
            <h3 className="help-faq-card-question">Как считать сутки?</h3>
            <p className="help-faq-card-answer">
              Одни сутки аренды — это 24 часа с момента получения техники.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
