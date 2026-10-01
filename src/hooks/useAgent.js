import { useState } from 'react';
import { useQuizContext } from './useQuizContext';

export function useAgent() {
  const { setAgentStatus } = useQuizContext();
  const [agentFeedback, setAgentFeedback] = useState('');

  const askAgentToGrade = async (question, userAnswer) => {
    setAgentStatus('grading');
    setAgentFeedback('Agent is verifying your submission...');

    try {
      // 1. Point this directly to your local or deployed backend endpoint
      const response = await fetch('/api/quiz/grade', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          questionText: question.text, 
          correctAnswer: question.correctAnswer,
          userAnswer: userAnswer 
        }),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      // 2. Parse the payload coming back from your LLM backend
      const data = await response.json();
      
      // Update state with the explanation the LLM generated
      setAgentFeedback(data.explanation); 
      return data.isCorrect; // returns true or false to your component

    } catch (error) {
      console.error('Agent connectivity error:', error);
      setAgentFeedback('Failed to get feedback from the AI agent.');
      return false;
    } finally {
      setAgentStatus('idle');
    }
  };

  return { askAgentToGrade, agentFeedback };
}
