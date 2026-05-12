import React from 'react';

const HomeScreen = ({ onStartQuiz, onPauseQuiz, onResumeQuiz,  onViewResults }) => {
  return (
    <div className="home-screen">
      <h1>Welcome to the Quiz App</h1>
{quizState === 'notStarted' && <button onClick={onStartQuiz}>Start Quiz</button>
{quizState === 'running' && (
  <>
  <button onClick={onPauseQuiz}>Pause Quiz</button>
  <button onClick={onEndQuiz}>End Quiz</button>
  </>
)}
      {quizState === 'paused' && (
        <>
  <button onClick={onResumeQuiz}>Resume Quiz</button>
  <button onClick={onViewResults}>View Results</button>
 </>
  )}
  <button onClick={onViewResults}>View Results</button>
     </div>
  );
};

export default HomeScreen;
