import React, { useState, useEffect } from 'react';
import './ContainerTab.css';
import { InfoIcon, USDTIcon, CoinsIcon } from '../icons';
import InfoButton from '../dice_tabs/InfoButton';

const BACKEND_URL = 'https://nothingcube.ru';

const ContainerTab = () => {
  const [userInfo, setUserInfo] = useState({
    usdt: parseFloat(localStorage.getItem('usdt')) || 0,
    coins: parseInt(localStorage.getItem('coins')) || 0,
  });

  const [showInfo, setShowInfo] = useState(false);
  const [activeType, setActiveType] = useState('free');
  const [containers, setContainers] = useState([]);

  const fetchContainers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/containers/containers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch containers');
      }

      const data = await response.json();
      setContainers(data);
    } catch (error) {
      console.error('Error fetching containers:', error);
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
    fetchContainers();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const formatUSDT = (value) => {
    return Number(value).toFixed(2);
  };

  const filterContainers = (type) => {
    return containers
      .filter(container => container.type === type)
      .sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));
  };

  const handleOpenContainer = async (containerId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/containers/containers/${containerId}/open`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to open container');
      }

      const data = await response.json();
      if (data.success) {
        console.log('Выпал предмет:', data.item);
      } else {
        console.error('Ошибка при открытии:', data.message);
      }
    } catch (error) {
      console.error('Error opening container:', error);
    }
  };

  return (
    <div className="container-window">
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
        <div className="container-navigation">
          <div className="container-menu-items">
            <button
              className={`container-menu-item ${activeType === 'free' ? 'active' : ''}`}
              onClick={() => setActiveType('free')}
            >
              <span className="container-menu-text">Бесплатные</span>
            </button>
            <button
              className={`container-menu-item ${activeType === 'coins' ? 'active' : ''}`}
              onClick={() => setActiveType('coins')}
            >
              <span className="container-menu-text">Монеты</span>
            </button>
            <button
              className={`container-menu-item ${activeType === 'usdt' ? 'active' : ''}`}
              onClick={() => setActiveType('usdt')}
            >
              <span className="container-menu-text">USDT</span>
            </button>
          </div>
        </div>

        <div className="containers-grid">
          {filterContainers(activeType).map((container) => (
            <div key={container.id} className="container-wrapper">
              <div className="container-box">
                <div className="glow-effect">
                  <div className="glow-circle glow-1"></div>
                  <div className="glow-circle glow-2"></div>
                  <div className="glow-circle glow-3"></div>
                  <div className="glow-circle glow-4"></div>
                </div>
              </div>
              <button
                className="container-button"
                onClick={() => handleOpenContainer(container.id)}
              >
                {container.type === 'free' ? 'Открыть' :
                 container.type === 'coins' ? (
                   <>
                     <CoinsIcon />
                     <span>{container.cost}</span>
                   </>
                 ) : (
                   <>
                     <USDTIcon />
                     <span>{container.cost}</span>
                   </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showInfo && <InfoButton onClose={() => setShowInfo(false)} />}
    </div>
  );
};

export default ContainerTab;