// src/components/EquipmentModal/EquipmentModal.jsx
import { useEffect } from 'react';
import './EquipmentModal.css';

export default function EquipmentModal({ item, isOpen, onClose, onAddToCart, showAddToCart = true }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleAdd = () => {
    if (onAddToCart) onAddToCart(item.id);
    onClose();
  };

  return (
    <div className="equipment-modal-backdrop" onClick={onClose}>
      <div className="equipment-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="equipment-modal-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        <div className="equipment-modal-content">
          {item.imageUrl && (
            <div className="equipment-modal-image-wrap">
              <img src={item.imageUrl} alt={item.name} className="equipment-modal-image" />
            </div>
          )}
          <div className="equipment-modal-body">
            <h2 className="equipment-modal-title">{item.name}</h2>
            <p className="equipment-modal-description">{item.description}</p>
            <div className="equipment-modal-meta">
              <span className="equipment-modal-category">{item.category}</span>
              <div className="equipment-modal-price">
                {item.pricePerDay.toLocaleString('ru-RU')} ₽ / сутки
              </div>
            </div>
            {showAddToCart && (
              <button
                type="button"
                className="equipment-modal-add-cart"
                onClick={handleAdd}
              >
                Добавить в конструктор
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
