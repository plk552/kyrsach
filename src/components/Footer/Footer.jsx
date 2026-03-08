// src/components/Footer/Footer.jsx
import { Link } from 'react-router-dom';
import './Footer.css';

const LAST_PURPOSE_PATH_KEY = 'lastPurposePath';

export default function Footer() {
  const year = new Date().getFullYear();

  const handleMainClick = () => {
    sessionStorage.removeItem(LAST_PURPOSE_PATH_KEY);
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-column">
          <div className="footer-logo">FrameRate</div>
          <p className="footer-text">
            Аренда фото и видео техники под любые задачи: от домашнего блога до
            большого события.
          </p>
        </div>

        <div className="footer-column">
          <div className="footer-title">Навигация</div>
          <nav className="footer-nav">
            <Link to="/" onClick={handleMainClick}>Главная</Link>
            <Link to="/Constructor">Конструктор</Link>
            <Link to="/About">О нас</Link>
            <Link to="/Help">Поддержка</Link>
          </nav>
        </div>

        <div className="footer-column">
          <div className="footer-title">Контакты</div>
          <p className="footer-text">
            Телефон: <a href="tel:+78005553535">8 (800) 555-35-35</a>
            <br />
            Почта: <a href="mailto:rent@example.com">rent@example.com</a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} FrameRate. Все права защищены.</span>
        <span className="footer-bottom-links">
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Договор аренды (пример)</a>
        </span>
      </div>
    </footer>
  );
}

