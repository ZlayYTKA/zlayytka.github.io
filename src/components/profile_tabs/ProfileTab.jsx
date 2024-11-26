import React, { useState, useEffect } from 'react';
import './ProfileTab.css';
import { RoundAvatar, USDTIcon, CoinsIcon, DicesIcon, InfoIcon, SettingsIcon } from '../icons';
import ProfileInfoButton from './ProfileInfoButton';
import SettingsButton from '../dice_tabs/SettingsButton';
import ProfileNavigation from './ProfileNavigation';
import LevelItem from './LevelItem';
import ReferralPanel from './ReferralPanel';

const ProfileTab = () => {
  const [userInfo, setUserInfo] = useState({
    nickname: localStorage.getItem('nickname'),
    level: parseInt(localStorage.getItem('level')) || 1,
    usdt: parseFloat(localStorage.getItem('usdt')) || 0,
    coins: parseInt(localStorage.getItem('coins')) || 0,
    dices: parseInt(localStorage.getItem('dices')) || 0,
  });

  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState(0);

  const levelPrices = [
    0,
    500,
    1000,
    5000,
    10000,
    50000,
    100000,
    500000,
    1000000,
    10000000
  ];

  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo({
        nickname: localStorage.getItem('nickname'),
        level: parseInt(localStorage.getItem('level')) || 1,
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

  const handleInfoClick = () => {
    setShowInfo(true);
    setShowSettings(false);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setShowInfo(false);
  };

  const handleProfileTabChange = (tabIndex) => {
    setActiveProfileTab(tabIndex);
  };

  const renderProfileContent = () => {
    switch(activeProfileTab) {
      case 0:
        return (
          <div className="profile-content-section">
            {levelPrices.map((price, index) => (
              <LevelItem
                key={index + 1}
                level={index + 1}
                currentLevel={userInfo.level}
                price={price}
              />
            ))}
          </div>
        );
      case 1:
        return (
          <div className="profile-content-section">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 'calc(100vh - 400px)',
              color: '#FFFFFF',
              fontFamily: 'Montserrat',
              fontSize: '24px',
              opacity: '0.8'
            }}>
              Пока пусто...
            </div>
          </div>
        );
      case 2:
        return (
          <div className="profile-content-section referrals">
            <ReferralPanel />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-window">
      <div className="profile-top-frame">
        <div className="profile-controls">
          <button className="control-button" onClick={handleInfoClick}>
            <InfoIcon />
          </button>
          <button className="control-button" onClick={handleSettingsClick}>
            <SettingsIcon />
          </button>
        </div>

        <div className="round-avatar">
          <RoundAvatar />
          <div
            className="user-avatar"
            dangerouslySetInnerHTML={{ __html: localStorage.getItem('avatar_svg') }}
          />
        </div>

        <div className="profile-info-window">
          <div className="profile-name-container">
            <span className="profile-username">{userInfo.nickname || 'User'}</span>
          </div>
          <div className="profile-level-container">
            <span className="profile-level-text">уровень {userInfo.level}</span>
          </div>

          <div className="profile-stats-container">
            <div className="profile-stat-circle">
              <div className="profile-stat-icon">
                <USDTIcon />
              </div>
              <span className="profile-stat-value">{formatUSDT(userInfo.usdt)}</span>
            </div>

            <div className="profile-stat-circle">
              <div className="profile-stat-icon">
                <CoinsIcon />
              </div>
              <span className="profile-stat-value">{userInfo.coins}</span>
            </div>

            <div className="profile-stat-circle">
              <div className="profile-stat-icon">
                <DicesIcon />
              </div>
              <span className="profile-stat-value">{userInfo.dices}</span>
            </div>
          </div>
        </div>
      </div>

      <ProfileNavigation
        activeTab={activeProfileTab}
        onTabChange={handleProfileTabChange}
      />

      {renderProfileContent()}

      {showInfo && <ProfileInfoButton onClose={() => setShowInfo(false)} />}
      {showSettings && <SettingsButton onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default ProfileTab;