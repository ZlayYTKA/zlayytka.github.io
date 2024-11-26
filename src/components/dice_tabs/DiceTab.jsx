import React, { useState, useEffect } from 'react';
import './DiceTab.css';
import { InfoIcon, SettingsIcon } from '../icons';
import InfoTab from './InfoTab';
import RollDice from './RollDice';
import InfoButton from './InfoButton';
import SettingsButton from './SettingsButton';

const DiceTab = () => {
  const [userInfo, setUserInfo] = useState({
    avatar_svg: localStorage.getItem('avatar_svg'),
    nickname: localStorage.getItem('nickname'),
  });

  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo({
        avatar_svg: localStorage.getItem('avatar_svg'),
        nickname: localStorage.getItem('nickname'),
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleInfoClick = () => {
    setShowInfo(true);
    setShowSettings(false);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setShowInfo(false);
  };

  return (
    <div className="dice-window">
      <div className="dice-top-bar">
        <div className="mini-profile">
          <div className="avatar">
            {userInfo.avatar_svg ? (
              <div dangerouslySetInnerHTML={{ __html: userInfo.avatar_svg }} />
            ) : (
              <div className="avatar-placeholder" />
            )}
          </div>

          <div className="name-container">
            <span className="username">{userInfo.nickname || 'User'}</span>
          </div>

          <button className="circle-button" onClick={handleInfoClick}>
            <InfoIcon />
          </button>

          <button className="circle-button" onClick={handleSettingsClick}>
            <SettingsIcon />
          </button>
        </div>
      </div>

      <div className="dice-content">
        <RollDice />
        <InfoTab />
      </div>

      {showInfo && <InfoButton onClose={() => setShowInfo(false)} />}
      {showSettings && <SettingsButton onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default DiceTab;