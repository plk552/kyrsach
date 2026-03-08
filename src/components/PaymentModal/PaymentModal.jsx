// src/components/PaymentModal/PaymentModal.jsx
import { useEffect, useState } from 'react';
import './PaymentModal.css';

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
  if (!digits) return '+7 ';
  if (digits.startsWith('7')) {
    const d = digits.slice(1);
    const a = d.slice(0, 3);
    const b = d.slice(3, 6);
    const c = d.slice(6, 8);
    const e = d.slice(8, 10);
    if (e.length) return `+7 (${a}) ${b}-${c}-${e}`;
    if (c.length) return `+7 (${a}) ${b}-${c}`;
    if (b.length) return `+7 (${a}) ${b}`;
    if (a.length) return `+7 (${a}`;
    return '+7 ';
  }
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 8);
  const e = digits.slice(8, 10);
  if (e.length) return `+7 (${a}) ${b}-${c}-${e}`;
  if (c.length) return `+7 (${a}) ${b}-${c}`;
  if (b.length) return `+7 (${a}) ${b}`;
  if (a.length) return `+7 (${a}`;
  return '+7 ';
}

function getPhoneDigits(displayValue) {
  return displayValue.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
}

export default function PaymentModal({ tariff, isOpen, onClose, onConfirm }) {
  const [fio, setFio] = useState('');
  const [phone, setPhone] = useState('+7 ');
  const [email, setEmail] = useState('');
  const [days, setDays] = useState('1');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setFio('');
      setPhone('+7 ');
      setEmail('');
      setDays('1');
      setComment('');
      setErrors({});
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePhoneChange = (e) => {
    const next = formatPhone(e.target.value);
    setPhone(next);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
  };

  const validate = () => {
    const next = {};
    const fioTrim = fio.trim();
    if (!fioTrim || fioTrim.length < 3) {
      next.fio = 'Введите ФИО (минимум 3 символа)';
    } else if (!/^[а-яёa-z\s\-]+$/i.test(fioTrim)) {
      next.fio = 'ФИО может содержать только буквы, пробелы и дефис';
    }
    const digits = getPhoneDigits(phone);
    if (digits.length < 11 || !digits.startsWith('7')) {
      next.phone = 'Введите корректный номер телефона: +7 и 10 цифр';
    }
    const emailTrim = email.trim();
    if (!emailTrim) {
      next.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      next.email = 'Введите корректный email (например: name@mail.ru)';
    }
    const daysStr = String(days).trim();
    if (daysStr === '') {
      next.days = 'Укажите количество суток';
    } else {
      const daysNum = parseInt(daysStr, 10);
      if (!Number.isInteger(daysNum)) {
        next.days = 'Введите целое число';
      } else if (daysNum < 1) {
        next.days = 'Количество суток должно быть не менее 1';
      } else if (daysNum > 365) {
        next.days = 'Укажите не более 365 суток';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onConfirm?.();
    onClose();
  };

  if (!isOpen || !tariff) return null;

  return (
    <div className="payment-modal-backdrop">
      <div className="payment-modal">
        <button
          type="button"
          className="payment-modal-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        <span className="payment-modal-help" aria-label="Подсказка">?</span>
        <span className="payment-modal-help-tooltip">
          В этом окне укажите контактные данные и срок аренды. После нажатия кнопки «Подтвердить оплату» заявка будет отправлена, и на экране появится уведомление о том, что наш сотрудник свяжется с вами в ближайшее время.
        </span>
        <div className="payment-modal-content">
          <h2 className="payment-modal-title">Оформить тариф</h2>
          <div className="payment-modal-tariff-info">
            <span className="payment-modal-tariff-name">{tariff.name}</span>
            {typeof tariff.pricePerDay === 'number' && (
              <span className="payment-modal-tariff-price">
                {tariff.pricePerDay.toLocaleString('ru-RU')} ₽/сутки
              </span>
            )}
          </div>
          <form className="payment-modal-form" onSubmit={handleSubmit}>
            <label className="payment-modal-label">
              ФИО
              <input
                type="text"
                className={'payment-modal-input' + (errors.fio ? ' payment-modal-input--error' : '')}
                placeholder="Иванов Иван Иванович"
                value={fio}
                onChange={(e) => {
                  setFio(e.target.value);
                  if (errors.fio) setErrors((prev) => ({ ...prev, fio: null }));
                }}
                autoComplete="name"
              />
              {errors.fio && <span className="payment-modal-hint">{errors.fio}</span>}
            </label>
            <label className="payment-modal-label">
              Телефон
              <input
                type="tel"
                className={'payment-modal-input' + (errors.phone ? ' payment-modal-input--error' : '')}
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={handlePhoneChange}
                autoComplete="tel"
              />
              {errors.phone && <span className="payment-modal-hint">{errors.phone}</span>}
            </label>
            <label className="payment-modal-label">
              Email
              <input
                type="email"
                className={'payment-modal-input' + (errors.email ? ' payment-modal-input--error' : '')}
                placeholder="example@mail.ru"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                autoComplete="email"
              />
              {errors.email && <span className="payment-modal-hint">{errors.email}</span>}
            </label>
            <label className="payment-modal-label">
              Количество суток аренды
              <input
                type="number"
                min={1}
                max={365}
                className={'payment-modal-input' + (errors.days ? ' payment-modal-input--error' : '')}
                placeholder="Количество суток"
                value={days}
                onChange={(e) => {
                  setDays(e.target.value);
                  if (errors.days) setErrors((prev) => ({ ...prev, days: null }));
                }}
              />
              {errors.days && <span className="payment-modal-hint">{errors.days}</span>}
            </label>
            <label className="payment-modal-label">
              Комментарий к заказу
              <textarea
                className="payment-modal-textarea"
                placeholder="Даты аренды, адрес доставки и т.д."
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>
            {typeof tariff.pricePerDay === 'number' && (() => {
              const n = parseInt(String(days).trim(), 10);
              if (!Number.isInteger(n) || n < 1) return null;
              return (
                <div className="payment-modal-total-wrap">
                  <span className="payment-modal-total">
                    Итого к оплате: {(tariff.pricePerDay * n).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              );
            })()}
            <button type="submit" className="payment-modal-submit">
              Подтвердить оплату
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
