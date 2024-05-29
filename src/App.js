import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Импортируем CSS

function App() {
  const [dinoPos, setDinoPos] = useState(150); // Позиция динозавра
  const [cactusLeft, setCactusLeft] = useState(700); // Позиция кактуса
  const [isJumping, setIsJumping] = useState(false); // Флаг прыжка
  const [isGameOver, setIsGameOver] = useState(false); // Флаг конца игры
  const gameRef = useRef(null); // Реф для доступа к элементу игры

  // Обработчик прыжка
  const handleJump = () => {
    if (!isJumping && !isGameOver) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 300);
    }
  };

  // Обработчик нажатия клавиши
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' || event.key === ' ') {
        handleJump();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isJumping, isGameOver]); // Перезапускаем useEffect при изменении isJumping и isGameOver

  // Логика игры
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isGameOver) {
        setCactusLeft((prevCactusLeft) => {
          if (prevCactusLeft <= -20) {
            return 700;
          } else {
            return prevCactusLeft - 5;
          }
        });
      }
    }, 10);

    // Проверка на столкновение
    if (
      cactusLeft < 60 &&
      cactusLeft > 0 &&
      dinoPos >= 140 &&
      !isGameOver
    ) {
      setIsGameOver(true);
      clearInterval(intervalId);
      alert('Game Over!');
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [cactusLeft, dinoPos, isGameOver]);

  // Анимация прыжка
  useEffect(() => {
    let jumpTimeout;
    if (isJumping) {
      setDinoPos(80); // Поднимаем динозавра вверх
      jumpTimeout = setTimeout(() => {
        setDinoPos(150); // Возвращаем динозавра вниз
      }, 300);
    }
    return () => clearTimeout(jumpTimeout);
  }, [isJumping]);

  return (
    <div className="game" ref={gameRef}>
      <div
        id="dino"
        style={{ top: `${dinoPos}px` }}
        className={isJumping ? 'jump' : ''}
      />
      <div id="cactus" style={{ left: `${cactusLeft}px` }} />
    </div>
  );
}

export default App;
