import React, { useState, useEffect } from 'react';
import './InfoButton.css';
import { CloseButton } from '../icons';

const SettingsButton = ({ onClose }) => {
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
          <h2 className="panel-title settings-panel-title">Настройки</h2>
          <button className="close-button" onClick={handleClose}>
            <CloseButton />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsButton;