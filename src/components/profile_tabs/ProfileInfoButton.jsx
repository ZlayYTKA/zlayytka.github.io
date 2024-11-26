import React, { useState, useEffect } from 'react';
import '../dice_tabs/InfoButton.css';
import { CloseButton } from '../icons';

const ProfileInfoButton = ({ onClose }) => {
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
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className={`info-panel-container ${isActive ? 'active' : ''} ${isClosing ? 'closing' : ''}`}>
      <div className="overlay" onClick={handleClose}></div>
      <div className="blue-panel"></div>
      <div className="dark-panel">
        <div className="panel-header">
          <h2 className="panel-title">Уровни</h2>
          <button className="close-button" onClick={handleClose}>
            <CloseButton />
          </button>
        </div>
        <div className="panel-content">
          <div className="info-text-container">
            <div className="dot-separator"></div>
            <p className="info-text">Всего существует 10 уровней. Каждый уровень дает +1 бросок в час. Например, на 2-м уровне у пользователя 2 броска в час, на 7-м уровне 7 бросков в час</p>
          </div>
          <div className="info-text-container">
            <div className="dot-separator"></div>
            <p className="info-text">Приглашайте друзей и получайте особые бонусы:</p>
          </div>
          <div className="info-text-container">
            <div className="dot-separator"></div>
            <p className="info-text">🎁 Оба получаете по доп.броску.</p>
          </div>
          <div className="info-text-container">
            <div className="dot-separator"></div>
            <p className="info-text">💵 Вы получаете 1% usdt от каждого пополнения ваших друзей! Всегда!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoButton;