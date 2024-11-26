import React, { useState, useEffect } from 'react';
import './InfoButton.css';
import { CloseButton } from '../icons';

const InfoButton = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsActive(true);
    }, 50);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className={`info-panel-container ${isActive ? 'active' : ''} ${isClosing ? 'closing' : ''}`}>
      <div className="overlay" onClick={handleClose}></div>
      <div className="blue-panel"></div>
      <div className="dark-panel">
        <div className="panel-header">
          <h2 className="panel-title">Бросок кубика</h2>
          <button className="close-button" onClick={handleClose}>
            <CloseButton />
          </button>
        </div>
        <div className="panel-content">
          <div className="info-text-container">
            <div className="dot-separator"></div>
            <p className="info-text">Быстрая анимация броска кубика от 1 до 6. Выпадение рандомное. Цифра на кубике дает столько же монет.</p>
          </div>
          <div className="info-text-container">
            <div className="dot-separator"></div>
            <p className="info-text">Каждый час дается новый бросок.</p>
          </div>
          <div className="info-text-container">
            <div className="dot-separator"></div>
            <p className="info-text">Количество выдаваемых бросков зависит от уровня.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoButton;