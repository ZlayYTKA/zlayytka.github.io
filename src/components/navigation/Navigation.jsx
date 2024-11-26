import React from 'react';
import './Navigation.css';
import { DiceIcon, BagIcon, BoxIcon, HandIcon } from '../icons';

const Navigation = ({ activeTab, onTabChange }) => {
  return (
    <nav className="nav-bottom-menu">
      <div className="nav-menu-items">
        <button className={`nav-menu-item ${activeTab === 0 ? 'active' : ''}`} onClick={() => onTabChange(0)}>
          <DiceIcon />
        </button>
        <button className={`nav-menu-item ${activeTab === 1 ? 'active' : ''}`} onClick={() => onTabChange(1)}>
          <HandIcon />
        </button>
        <button className={`nav-menu-item ${activeTab === 2 ? 'active' : ''}`} onClick={() => onTabChange(2)}>
          <BagIcon />
        </button>
        <button className={`nav-menu-item ${activeTab === 3 ? 'active' : ''}`} onClick={() => onTabChange(3)}>
          <BoxIcon />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;