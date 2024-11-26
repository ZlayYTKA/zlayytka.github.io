// App.jsx
import React, { useState } from 'react';
import Auth from './components/Auth';
import Navigation from './components/navigation/Navigation';
import DiceTab from './components/dice_tabs/DiceTab';
import ProfileTab from './components/profile_tabs/ProfileTab';
import ContainerTab from './components/containers_tabs/ContainerTab';
import MarketTab from './components/market_tabs/MarketTab';
import './styles/style.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleAuthSuccess = (data) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const renderActiveTab = () => {
    switch(activeTab) {
      case 0:
        return <DiceTab userData={userData} />;
      case 1:
        return <ProfileTab />;
      case 2:
        return <ContainerTab />;
      case 3:
        return <MarketTab />;
      default:
        return <DiceTab userData={userData} />;
    }
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <div className="main-container">
          {renderActiveTab()}
          <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}
    </div>
  );
};

export default App;