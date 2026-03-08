// src/components/HelpArticles/HotlineCard/HotlineCard.jsx
import React from 'react';
import './HotlineCard.css';

const HotlineCard = ({ children, className = '' }) => {
  return <div className={`hotline-card ${className}`.trim()}>{children}</div>;
};

HotlineCard.Icon = ({ children }) => {
  return <div className="hotline-icon">{children}</div>;
};

HotlineCard.Content = ({ children }) => {
  return <div className="hotline-content">{children}</div>;
};

HotlineCard.TextGroup = ({ children }) => {
  return <div className="hotline-text-group">{children}</div>;
};

HotlineCard.TextGroup = ({ children }) => {
  return <div className="hotline-text-group">{children}</div>;
};


HotlineCard.Title = ({ children }) => {
  return <h3 className="hotline-title">{children}</h3>;
};

HotlineCard.Subtitle = ({ children }) => {
  return <p className="hotline-subtitle">{children}</p>;
};

HotlineCard.Number = ({ children, tel }) => {
  const cleanTel = tel ? tel.replace(/\D/g, '') : '';
  return (
    <a
      href={cleanTel ? `tel:${cleanTel}` : '#'}
      className="hotline-number"
      aria-label={cleanTel ? `Позвонить по номеру ${children}` : undefined}
    >
      {children}
    </a>
  );
};

export default HotlineCard;