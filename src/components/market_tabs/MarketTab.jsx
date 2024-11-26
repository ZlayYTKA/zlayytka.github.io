import React, { useState, useEffect } from 'react';
import './MarketTab.css';
import { InfoIcon, USDTIcon, CoinsIcon } from '../icons';
import InfoButton from '../dice_tabs/InfoButton';

const BACKEND_URL = 'https://nothingcube.ru';

const MarketTab = () => {
  const [userInfo, setUserInfo] = useState({
    usdt: parseFloat(localStorage.getItem('usdt')) || 0,
    coins: parseInt(localStorage.getItem('coins')) || 0,
  });

  const [showInfo, setShowInfo] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Genshin Impact');
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/shop/shop`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo({
        usdt: parseFloat(localStorage.getItem('usdt')) || 0,
        coins: parseInt(localStorage.getItem('coins')) || 0,
      });
    };

    window.addEventListener('storage', handleStorageChange);
    fetchItems();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const formatUSDT = (value) => {
    return Number(value).toFixed(2);
  };

  const filterItems = (category) => {
    return items.filter(item => item.category === category);
  };

  return (
    <div className="market-window">
      <div className="top-bar">
        <div className="top-bar-content">
          <button className="circle-button" onClick={() => setShowInfo(true)}>
            <InfoIcon />
          </button>

          <div className="stat-circle">
            <div className="stat-icon">
              <USDTIcon />
            </div>
            <span className="stat-value">{formatUSDT(userInfo.usdt)}</span>
          </div>

          <div className="stat-circle">
            <div className="stat-icon">
              <CoinsIcon />
            </div>
            <span className="stat-value">{userInfo.coins}</span>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="market-navigation">
          <div className="market-menu-items">
            <button
              className={`market-menu-item ${activeCategory === 'Genshin Impact' ? 'active' : ''}`}
              onClick={() => setActiveCategory('Genshin Impact')}
            >
              <span className="market-menu-text">Genshin Impact</span>
            </button>
            <button
              className={`market-menu-item ${activeCategory === 'Honkai: Star Rail' ? 'active' : ''}`}
              onClick={() => setActiveCategory('Honkai: Star Rail')}
            >
              <span className="market-menu-text">Honkai: Star Rail</span>
            </button>
            <button
              className={`market-menu-item ${activeCategory === 'Zenless Zone Zero' ? 'active' : ''}`}
              onClick={() => setActiveCategory('Zenless Zone Zero')}
            >
              <span className="market-menu-text">Zenless Zone Zero</span>
            </button>
          </div>
        </div>

        <div className="items-grid">
          {filterItems(activeCategory).map((item) => (
            <div key={item.id} className="item-wrapper">
              <div className="item-box">
                <div className="glow-effect">
                  <div className="glow-circle glow-1"></div>
                  <div className="glow-circle glow-2"></div>
                  <div className="glow-circle glow-3"></div>
                  <div className="glow-circle glow-4"></div>
                </div>
                <img
                  src={`data:image/png;base64,${item.item.image_data}`}
                  alt={item.item.name}
                  className="item-image"
                />
              </div>
              <button className="buy-button">
                <USDTIcon />
                <span>{item.cost}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {showInfo && <InfoButton onClose={() => setShowInfo(false)} />}
    </div>
  );
};

export default MarketTab;