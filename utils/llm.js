// utils/llm.js
import OpenAI from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';

// Initialize clients (use environment variables in production)
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
});

/**
 * Central LLM calling function used by all agents
 * @param {string} prompt - The prompt to send
 * @param {Object} options - Optional settings
 * @returns {Promise<string>} - The LLM response as text
 */
export async function callLLM(prompt, options = {}) {
  const {
    model = "gpt-4o",           // Default model
    temperature = 0.7,
    maxTokens = 1500,
    provider = "openai"         // "openai" or "anthropic"
  } = options;

  try {
    if (provider === "anthropic") {
      // Claude / Anthropic
      const response = await anthropic.messages.create({
        model: model === "gpt-4o" ? "claude-3-5-sonnet-20240620" : model,
        max_tokens: maxTokens,
        temperature: temperature,
        messages: [{ role: "user", content: prompt }],
      });

      return response.content[0].text;
    } 
    else {
      // OpenAI (default)
      const response = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
        max_tokens: maxTokens,
      });

      return response.choices[0].message.content;
    }
  } catch (error) {
    console.error("LLM Call Error:", error);
    
    // Fallback response for development
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Using fallback response in development mode");
      return JSON.stringify({
        error: "LLM call failed",
        fallback: true
      });
    }
    
    throw new Error(`LLM call failed: ${error.message}`);
  }
}

// Optional: Add a streaming version later if needed
export async function* callLLMStream(prompt, options = {}) {
  // Can be implemented later for real-time responses
  console.log("Streaming not implemented yet");
}

export default callLLM;
