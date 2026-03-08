// src/components/Header/Header.jsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const LAST_PURPOSE_PATH_KEY = 'lastPurposePath';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMainClick = (e) => {
    const lastPath = sessionStorage.getItem(LAST_PURPOSE_PATH_KEY);
    if (lastPath && location.pathname !== '/') {
      e.preventDefault();
      navigate(lastPath);
    }
  };

  const handleLogoClick = () => {
    sessionStorage.removeItem(LAST_PURPOSE_PATH_KEY);
  };

  return (
    <header className="header">
      <NavLink to="/" className="logo-link" end onClick={handleLogoClick}>
        <Label />
      </NavLink>

      <nav className="navbar">
        <NavLink 
          to="/" 
          className={({ isActive }) => {
            const onMain = isActive || location.pathname.startsWith('/purpose/');
            return onMain ? "nav-link active" : "nav-link";
          }}
          end={false}
          title="Главная"
          onClick={handleMainClick}
        >
          <HomeIcon />
          <span className="nav-text">Главная</span>
        </NavLink>
        
        <NavLink 
          to="/Constructor" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          title="Конструктор"
        >
          <GridIcon />
          <span className="nav-text">Конструктор</span>
        </NavLink>
        
        <NavLink 
          to="/About" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          title="О нас"
        >
          <CartIcon />
          <span className="nav-text">О нас</span>
        </NavLink>
        
        <NavLink 
          to="/Help" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          title="Поддержка"
        >
          <HeadphonesIcon />
          <span className="nav-text">Поддержка</span>
        </NavLink>
      </nav>
    </header>
  );
}

function Label() {
  return (
    <svg
      className="logo-svg"
      width="210"
      height="50"
      viewBox="0 0 210 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.44606 17.482H23.5901V22.032H9.44606V17.482ZM24.0841 9.5V14.05H9.62806L12.2021 11.476V29H6.82006V9.5H24.0841ZM30.5967 18.028H37.6947C38.5613 18.028 39.2373 17.8287 39.7227 17.43C40.208 17.0313 40.4507 16.4767 40.4507 15.766C40.4507 15.038 40.208 14.4833 39.7227 14.102C39.2373 13.7033 38.5613 13.504 37.6947 13.504H29.8427L32.2607 10.93V29H26.8787V9.5H38.4487C39.9393 9.5 41.2393 9.76867 42.3487 10.306C43.458 10.826 44.3247 11.554 44.9487 12.49C45.5727 13.4087 45.8847 14.5007 45.8847 15.766C45.8847 16.9967 45.5727 18.08 44.9487 19.016C44.3247 19.952 43.458 20.68 42.3487 21.2C41.2393 21.72 39.9393 21.98 38.4487 21.98H30.5967V18.028ZM33.5087 19.874H39.5667L46.5607 29H40.3207L33.5087 19.874ZM52.409 25.256V20.914H65.851V25.256H52.409ZM62.783 9.5L71.649 29H65.903L58.467 11.788H60.027L52.565 29H46.819L55.685 9.5H62.783ZM101.992 9.5V29H96.8698V11.424L98.0138 11.554L90.4738 29H85.0138L77.4478 11.606L78.6178 11.476V29H73.4958V9.5H81.8158L88.8098 26.244H86.7298L93.6718 9.5H101.992ZM122.306 17.3V21.2H108.032V17.3H122.306ZM111.698 19.25L110.424 27.076L108.24 24.632H123.164V29H105.042L106.524 19.25L105.042 9.5H123.034V13.868H108.24L110.424 11.424L111.698 19.25ZM130.001 18.028H137.099C137.966 18.028 138.642 17.8287 139.127 17.43C139.612 17.0313 139.855 16.4767 139.855 15.766C139.855 15.038 139.612 14.4833 139.127 14.102C138.642 13.7033 137.966 13.504 137.099 13.504H129.247L131.665 10.93V29H126.283V9.5H137.853C139.344 9.5 140.644 9.76867 141.753 10.306C142.862 10.826 143.729 11.554 144.353 12.49C144.977 13.4087 145.289 14.5007 145.289 15.766C145.289 16.9967 144.977 18.08 144.353 19.016C143.729 19.952 142.862 20.68 141.753 21.2C140.644 21.72 139.344 21.98 137.853 21.98H130.001V18.028ZM132.913 19.874H138.971L145.965 29H139.725L132.913 19.874ZM151.813 25.256V20.914H165.255V25.256H151.813ZM162.187 9.5L171.053 29H165.307L157.871 11.788H159.431L151.969 29H146.223L155.089 9.5H162.187ZM175.887 11.866H181.295V29H175.887V11.866ZM168.451 9.5H188.731V14.284H168.451V9.5ZM207.72 17.3V21.2H193.446V17.3H207.72ZM197.112 19.25L195.838 27.076L193.654 24.632H208.578V29H190.456L191.938 19.25L190.456 9.5H208.448V13.868H193.654L195.838 11.424L197.112 19.25Z"
        fill="currentColor"
      />
      <rect
        x="1"
        y="1"
        width="126"
        height="36"
        stroke="currentColor"
        stroke-width="4"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      viewBox="0 0 24 24"
    >
      <title>Home-alt1 SVG Icon</title>
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path d="M21 19v-6.733a4 4 0 0 0-1.245-2.9L13.378 3.31a2 2 0 0 0-2.755 0L4.245 9.367A4 4 0 0 0 3 12.267V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2" />
        <path d="M9 15a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6H9z" />
      </g>
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      viewBox="0 0 16 16"
    >
      <title>Grid SVG Icon</title>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      viewBox="0 0 24 24"
    >
      <title>Info SVG Icon</title>
      <g fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <path stroke-linecap="round" d="M12 7h.01" />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10 11h2v5m-2 0h4"
        />
      </g>
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      viewBox="0 0 16 16"
    >
      <title>Headphones SVG Icon</title>
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M1.75 11.75c0-2.5 3.5-2 3.5-2v4.5s-3.5.5-3.5-2.5v-3.5c0-3 .5-6.5 6.25-6.5s6.25 3.5 6.25 6.5v3.5c0 3-3.5 2.5-3.5 2.5v-4.5s3.5-.5 3.5 2"
      />
    </svg>
  );
}
