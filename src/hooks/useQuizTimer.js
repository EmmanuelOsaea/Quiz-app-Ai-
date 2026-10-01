import { useState, useEffect, useRef } from 'react';

export function useQuizTimer(initialTime, onTimeout) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);

  useEffect(() => {
    // Start countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (onTimeout) onTimeout(); // Trigger action when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [initialTime, onTimeout]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(initialTime);
  };

  return { timeLeft, resetTimer };
}
