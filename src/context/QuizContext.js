// QuizContext.js (or QuizProvider.js)
import React, { createContext, useContext, useState } from 'react';

// 1. Create the raw context object
const QuizContext = createContext(undefined);

// 2. Create the Provider wrapper component
export function QuizProvider({ children }) {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // Add your other quiz states here...
const [currentFeedback, setCurrentFeedback] = useState("");
  return (
    <QuizContext.Provider value={{ score, setScore, currentQuestion, setCurrentQuestion, currentFeedback, setCurrentFeedback }}>
      {children}
    </QuizContext.Provider>
  );
}

// 3. Put your custom hook right here at the bottom!
export function useQuizContext() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
}
