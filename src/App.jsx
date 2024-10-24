import React, { useState } from 'react';
import Auth from './components/Auth';
import './styles/style.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleAuthSuccess = (data) => {
    setIsAuthenticated(true);
    setUserData(data);
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <div className="main-container">
          <div className="user-info">
            <p>
              Монеты: <span>{userData.coins}</span>
              Броски: <span>{userData.dices}</span>
            </p>
            <p>Ваш уровень: <span>{userData.level}</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;