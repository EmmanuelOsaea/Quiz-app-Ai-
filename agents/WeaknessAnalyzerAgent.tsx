export class WeaknessAnalyzerAgent {
  async analyze(answers) {
    const prompt = `Analyze these quiz answers and identify knowledge gaps...`;
    const result = await callLLM(prompt);
    return JSON.parse(result); // e.g. { weakTopics: ["React Hooks", "State Management"] }
  }
}
