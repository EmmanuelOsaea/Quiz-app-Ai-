import React, { createContext, useContext, useState, useCallback } from 'react';

// 1. Create the Context
const QuizContext = createContext(null);

// 2. Create the Provider Component
export function QuizProvider({ children }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);
  const [agentStatus, setAgentStatus] = useState('idle'); // 'idle' | 'generating' | 'grading'

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAgentStatus('idle');
  }, []);

  const value = {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    score,
    setScore,
    quizHistory,
    setQuizHistory,
    agentStatus,
    setAgentStatus,
    resetQuiz
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

// 3. Create the Custom Hook for easy consumption
export function useQuizContext() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
}

