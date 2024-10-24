import React, { useEffect, useState } from 'react';

const Auth = ({ onAuthSuccess }) => {
  const [authStatus, setAuthStatus] = useState('Ожидание аутентификации...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const tg = window.Telegram.WebApp;
        tg.expand();

        const initData = tg.initData || '';
        const hashStr = tg.initDataUnsafe.hash || '';

        const response = await fetch('https://nothingcube-startup.onrender.com/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ init_data: initData, hash: hashStr })
        });

        const data = await response.json();

        if (data.authorized) {
          setAuthStatus('Да, пользователь авторизован');
          console.log("Аутентификация успешна!", data);
          onAuthSuccess(data);
        } else {
          setAuthStatus('Нет, пользователь не авторизован');
          console.log("Ошибка аутентификации");
        }
      } catch (error) {
        console.error('Ошибка при авторизации:', error);
        setAuthStatus('Ошибка при проверке авторизации');
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, [onAuthSuccess]);

  return (
    <div className="auth-container">
      <h1>Это всего-лишь заглушка</h1>
      <p className="auth-status">{authStatus}</p>
      {isLoading && <div className="loader" />}
    </div>
  );
};

export default Auth;