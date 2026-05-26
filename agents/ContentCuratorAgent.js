// agents/ContentCuratorAgent.js
import { callLLM } from '../utils/llm.js';

export class ContentCuratorAgent {
  /**
   * Pulls or generates relevant learning content
   * @param {string} topic 
   * @param {string} difficulty
   * @param {Array} userWeaknesses
   * @returns {Object} { explanation: string, examples: array, resources: array }
   */
  async curate(topic, difficulty, userWeaknesses = []) {
    const prompt = `
You are a world-class educational content curator.
Topic: ${topic}
Difficulty: ${difficulty}
User weaknesses: ${JSON.stringify(userWeaknesses)}

Provide:
1. A clear short explanation
2. 2-3 practical examples
3. 1-2 external resource links (or suggest search terms if no real links)

Return JSON:
{
  "explanation": "...",
  "examples": ["example 1...", "example 2..."],
  "resources": [
    { "title": "...", "url": "https://..." }
  ]
}
    `;

    const response = await callLLM(prompt, { temperature: 0.6 });
    return JSON.parse(response);
  }
}
