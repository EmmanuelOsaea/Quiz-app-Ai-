// agents/QuestionGeneratorAgent.js
import { callLLM } from '../utils/llm.js';

export class QuestionGeneratorAgent {
  async generate(topic, difficulty, userWeaknesses) {
    const prompt = `
You are an expert quiz question generator.
Topic: ${topic}
Difficulty: ${difficulty}
User weaknesses: ${JSON.stringify(userWeaknesses)}

Generate 1 high-quality multiple choice question with 4 options.
Return JSON format:
{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A",
  "explanation": "..."
}
    `;

    const response = await callLLM(prompt);
    return JSON.parse(response);
  }
}
