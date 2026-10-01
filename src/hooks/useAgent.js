import { useState } from 'react';
import { useQuizContext } from './useQuizContext';

export function useAgent() {
  const { setAgentStatus } = useQuizContext();
  const [agentFeedback, setAgentFeedback] = useState('');

  const askAgentToGrade = async (question, userAnswer) => {
    setAgentStatus('grading');
    setAgentFeedback('Agent is verifying your submission...');

    try {
      // Replace with your actual agent endpoint or LLM SDK call
      const response = await fetch('/api/agent/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer: userAnswer }),
      });
      const data = await response.json();
      
      setAgentFeedback(data.explanation); // "Correct! You remembered that..."
      return data.isCorrect;
    } catch (error) {
      console.error('Agent error:', error);
      setAgentFeedback('Failed to get agent feedback.');
    } finally {
      setAgentStatus('idle');
    }
  };

  return { askAgentToGrade, agentFeedback };
}

