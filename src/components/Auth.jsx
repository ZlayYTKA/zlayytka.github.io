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

        const response = await fetch('https://nothingcube.ru/startup/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ init_data: initData, hash: hashStr })
        });

        const data = await response.json();

        if (data.authorized) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('nickname', data.nickname);
          localStorage.setItem('is_banned', JSON.stringify(data.is_banned));
          localStorage.setItem('coins', data.coins.toString());
          localStorage.setItem('dices', data.dices.toString());
          localStorage.setItem('level', data.level.toString());
          localStorage.setItem('next_replenishment', data.next_replenishment);
          localStorage.setItem('avatar_id', data.avatar_id.toString());
          localStorage.setItem('avatar_svg', data.avatar_svg);

          const userData = {
            token: data.token,
            nickname: data.nickname,
            is_banned: data.is_banned,
            coins: data.coins,
            dices: data.dices,
            level: data.level,
            next_replenishment: data.next_replenishment,
            avatar_id: data.avatar_id,
            avatar_svg: data.avatar_svg
          };

          setAuthStatus('Да, пользователь авторизован');
          onAuthSuccess(userData);
        } else {
          setAuthStatus('Нет, пользователь не авторизован');
        }
      } catch (error) {
        setAuthStatus('Ошибка при проверке авторизации');
        console.error('Auth Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, [onAuthSuccess]);

  return (
    <div className="auth-container">
      <p className="auth-status">{authStatus}</p>
      {isLoading && <div className="loader" />}
    </div>
  );
};

export default Auth;
/*
import React, { useEffect } from 'react';

const Auth = ({ onAuthSuccess }) => {
  useEffect(() => {
    const mockUserData = {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6InVzZXJfMDAwMDAwMDEiLCJpc19iYW5uZWQiOmZhbHNlLCJ0bWFfaWQiOjEsImV4cCI6MTczMDMzMDU2MH0.xuJyYvgShIjHsh9TQfZ-kW4Hefjzaj7Zu0qIaibzaPo",
      nickname: "user_00000001",
      is_banned: false,
      usdt: 0,
      coins: 0,
      dices: 6,
      level: 3,
      next_replenishment: null,
      avatar_id: 1,
      avatar_svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="circleClip_1">
                        <circle cx="100" cy="100" r="100"/>
                    </clipPath>
                </defs>
                <image 
                    width="200" 
                    height="200" 
                    clip-path="url(#circleClip_1)"
                    href="data:image/jpeg;base64,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"
                />
            </svg>`
    };

    setTimeout(() => {
      localStorage.setItem('token', mockUserData.token);
      localStorage.setItem('nickname', mockUserData.nickname);
      localStorage.setItem('is_banned', JSON.stringify(mockUserData.is_banned));
      localStorage.setItem('usdt', mockUserData.usdt.toString());
      localStorage.setItem('coins', mockUserData.coins.toString());
      localStorage.setItem('dices', mockUserData.dices.toString());
      localStorage.setItem('level', mockUserData.level.toString());
      localStorage.setItem('next_replenishment', mockUserData.next_replenishment);
      localStorage.setItem('avatar_id', mockUserData.avatar_id.toString());
      localStorage.setItem('avatar_svg', mockUserData.avatar_svg);

      onAuthSuccess(mockUserData);
    }, 100);
  }, [onAuthSuccess]);

  return null;
};

export default Auth;
*/