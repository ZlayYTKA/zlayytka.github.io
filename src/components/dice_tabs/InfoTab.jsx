import React, { useState, useEffect } from 'react';
import './InfoTab.css';
import { USDTIcon, CoinsIcon, DicesIcon } from '../icons';

const InfoTab = () => {
  const [stats, setStats] = useState({
    level: parseInt(localStorage.getItem('level')) || 0,
    usdt: parseFloat(localStorage.getItem('usdt')) || 0,
    coins: parseInt(localStorage.getItem('coins')) || 0,
    dices: parseInt(localStorage.getItem('dices')) || 0,
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setStats({
        level: parseInt(localStorage.getItem('level')) || 0,
        usdt: parseFloat(localStorage.getItem('usdt')) || 0,
        coins: parseInt(localStorage.getItem('coins')) || 0,
        dices: parseInt(localStorage.getItem('dices')) || 0,
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const formatUSDT = (value) => {
    return Number(value).toFixed(2);
  };

  return (
    <div className="info-window">
      <div className="level-container">
        <span className="level-text">Уровень {stats.level}</span>
      </div>

      <div className="stats-container">
        <div className="stat-circle">
          <div className="stat-icon">
            <USDTIcon />
          </div>
          <span className="stat-value">{formatUSDT(stats.usdt)}</span>
        </div>

        <div className="stat-circle">
          <div className="stat-icon">
            <CoinsIcon />
          </div>
          <span className="stat-value">{stats.coins}</span>
        </div>

        <div className="stat-circle">
          <div className="stat-icon">
            <DicesIcon />
          </div>
          <span className="stat-value">{stats.dices}</span>
        </div>
      </div>
    </div>
  );
};

export default InfoTab;