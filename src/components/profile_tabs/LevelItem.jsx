import React from 'react';
import './LevelItem.css';
import { BoughtLVLIcon, BuyLVLIcon, CoinsIcon } from '../icons';

const LevelItem = ({ level, currentLevel, price }) => {
  const getStatus = () => {
    if (level <= currentLevel) return 'bought';
    if (level === currentLevel + 1) return 'available';
    return 'locked';
  };

  const status = getStatus();

  const formatPrice = (price) => {
    if (price === 0) return 'бесплатно';
    return price.toLocaleString();
  };

  return (
    <div className={`level-item ${status}`}>
      <div className="level-icon-frame">
        <div className="level-icon">
          {status === 'bought' ? <BoughtLVLIcon /> : <BuyLVLIcon />}
        </div>
      </div>

      <div className="level-title">
        {level} уровень
      </div>

      <div className="level-info">
        {status === 'bought' ? (
          <span className="level-status">куплено</span>
        ) : (
          <div className="price">
            <span>{formatPrice(price)}</span>
            {price !== 0 && <CoinsIcon />}
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelItem;