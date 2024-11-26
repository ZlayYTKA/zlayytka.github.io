import React, { useState, useEffect } from 'react';
import '../dice_tabs/InfoButton.css';
import { CloseButton } from '../icons';

const ReferralInfoButton = ({ onClose }) => {
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
          <h2 className="panel-title">Рефералы</h2>
          <button className="close-button" onClick={handleClose}>
            <CloseButton />
          </button>
        </div>
        <div className="panel-content">
          <div className="info-text-container">
            <div className="dot-separator"></div>
            <p className="info-text">Пока пусто...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralInfoButton;