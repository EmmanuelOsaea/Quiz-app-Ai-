// agents/ProgressTrackerAgent.js
import { callLLM } from '../utils/llm.js';

export class ProgressTrackerAgent {
  /**
   * Tracks and summarizes overall learning progress
   * @param {Array} sessionHistory - array of past quiz results
   * @returns {Object} progress report
   */
  async trackProgress(sessionHistory) {
    const prompt = `
You are a learning progress analyst.
Here is the user's quiz history: ${JSON.stringify(sessionHistory)}

Generate a comprehensive progress summary.
Return JSON:
{
  "overallMastery": "75%",
  "strongAreas": ["Arrays", "Functions"],
  "weakAreas": ["State Management", "Async Programming"],
  "improvementTrend": "improving" | "stable" | "declining",
  "motivationalMessage": "encouraging short message",
  "suggestedFocus": "React Hooks"
}
    `;

    const response = await callLLM(prompt, { temperature: 0.5 });
    return JSON.parse(response);
  }

  /**
   * Simple helper to save progress (you can expand this with localStorage or backend)
   */
  saveProgress(userId, data) {
    // Example: localStorage or send to your backend
    console.log(`Progress saved for user ${userId}:`, data);
    // Later: connect to Supabase / Firebase / your backend
  }
}
