 // src/hooks/useAgent.js
import { useState } from 'react';
import { useQuizContext } from './useQuizContext';
import { OPENAI_AGENT_ENDPOINTS } from '../config/apiConfig'; 

export function useAgent() {
  const { setAgentStatus } = useQuizContext();
  const [agentFeedback, setAgentFeedback] = useState('');

  const askOpenAiToGrade = async (question, userAnswer) => {
    setAgentStatus('grading');
    setAgentFeedback('Sending answer to OpenAI agent...');

    try {
      // Points exactly to your backend route via the constant
      const response = await fetch(OPENAI_AGENT_ENDPOINTS.GRADE_ANSWER, {
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
        throw new Error('Network error or server failed to respond.');
      }

      const data = await response.json(); // Parses { isCorrect, explanation }
      setAgentFeedback(data.explanation); 
      return data.isCorrect; 

    } catch (error) {
      console.error('OpenAI proxy integration error:', error);
      setAgentFeedback('Failed to receive response from OpenAI.');
      return false;
    } finally {
      setAgentStatus('idle');
    }
  };

  return { askOpenAiToGrade, agentFeedback };
}
                        
