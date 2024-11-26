import React from 'react';
import './ProfileNavigation.css';

const ProfileNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="profile-navigation">
      <button
        className={`profile-nav-button ${activeTab === 0 ? 'active' : ''}`}
        onClick={() => onTabChange(0)}
      >
        <span className="profile-nav-text">Уровни</span>
      </button>
      <button
        className={`profile-nav-button ${activeTab === 1 ? 'active' : ''}`}
        onClick={() => onTabChange(1)}
      >
        <span className="profile-nav-text">Предметы</span>
      </button>
      <button
        className={`profile-nav-button ${activeTab === 2 ? 'active' : ''}`}
        onClick={() => onTabChange(2)}
      >
        <span className="profile-nav-text">Рефералы</span>
      </button>
    </div>
  );
};

export default ProfileNavigation;