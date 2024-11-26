import React, { useState, useEffect } from 'react';
import {
  ThroughDice,
  TimeDotsDice,
  BlueBackDice,
  DiceOne,
  DiceTwo,
  DiceThree,
  DiceFour,
  DiceFive,
  DiceSix
} from '../icons';
import './RollDice.css';

const RollDice = () => {
  const [currentDice, setCurrentDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [dices, setDices] = useState(parseInt(localStorage.getItem('dices')) || 0);

  useEffect(() => {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    setCurrentDice(randomDice);
  }, []);

  const handleRoll = async () => {
    if (dices <= 0 || isRolling) return;

    setIsRolling(true);

    try {
      const response = await fetch('https://nothingcube.ru/dice/roll', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        for (let i = 0; i < 5; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setCurrentDice(Math.floor(Math.random() * 6) + 1);
        }

        setCurrentDice(data.roll_result);

        localStorage.setItem('dices', data.dices.toString());
        localStorage.setItem('coins', data.coins.toString());
        if (data.next_replenishment) {
          localStorage.setItem('next_replenishment', data.next_replenishment);
        }

        setDices(data.dices);

        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error rolling dice:', error);
    } finally {
      setTimeout(() => setIsRolling(false), 500);
    }
  };

  const renderDice = () => {
    switch (currentDice) {
      case 1:
        return <DiceOne />;
      case 2:
        return <DiceTwo />;
      case 3:
        return <DiceThree />;
      case 4:
        return <DiceFour />;
      case 5:
        return <DiceFive />;
      case 6:
        return <DiceSix />;
      default:
        return <DiceOne />;
    }
  };

  return (
      <div className="roll-dice-container">
        <div className="through-dice">
          <ThroughDice />
        </div>
        <div className="time-dots-container">
          <TimeDotsDice />
        </div>
        <div className="blue-back-container">
          <button
            onClick={handleRoll}
            disabled={dices <= 0 || isRolling}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              cursor: dices > 0 ? 'pointer' : 'not-allowed',
              opacity: dices > 0 ? 1 : 0.6,
              zIndex: 1000,
              padding: 0,
              margin: 0,
              pointerEvents: dices > 0 ? 'auto' : 'none'
            }}
            aria-label="Roll dice"
          />
          <BlueBackDice />
          <div
              className="dice-value"
              style={{
                width: '80%',
                height: '80%'
              }}
            >
              {renderDice()}
            </div>
        </div>
      </div>
    );
};

export default RollDice;