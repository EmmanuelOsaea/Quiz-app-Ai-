// agents/DifficultyAdapterAgent.js
import { callLLM } from '../utils/llm.js';

export class DifficultyAdapterAgent {
  /**
   * Adjusts difficulty based on user performance
   * @param {Object} userPerformance - { accuracy: number, recentTopics: array, weakAreas: array }
   * @returns {Object} { recommendedDifficulty: string, reason: string, nextTopics: array }
   */
  async adapt(userPerformance) {
    const prompt = `
You are an adaptive learning expert.
User's recent performance: ${JSON.stringify(userPerformance)}

Decide the best next difficulty level and suggest focus areas.
Return JSON only:
{
  "recommendedDifficulty": "easy" | "medium" | "hard" | "expert",
  "reason": "brief explanation",
  "nextTopics": ["topic1", "topic2"],
  "adjustment": "increased" | "decreased" | "maintained"
}
    `;

    const response = await callLLM(prompt, { temperature: 0.7 });
    return JSON.parse(response);
  }
}
