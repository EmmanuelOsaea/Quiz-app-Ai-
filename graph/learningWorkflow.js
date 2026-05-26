// graph/learningWorkflow.js
import { StateGraph, START, END } from "@langchain/langgraph";
import { QuestionGeneratorAgent } from "../agents/QuestionGeneratorAgent.js";
import { WeaknessAnalyzerAgent } from "../agents/WeaknessAnalyzerAgent.js";
import { DifficultyAdapterAgent } from "../agents/DifficultyAdapterAgent.js";
import { ContentCuratorAgent } from "../agents/ContentCuratorAgent.js";
import { ProgressTrackerAgent } from "../agents/ProgressTrackerAgent.js";

// Define the overall state of the learning system
const LearningState = {
  topic: "string",                    // Current learning topic
  currentQuestion: "object",          // Current question + options
  userAnswer: "string",               // User's selected answer
  isCorrect: "boolean",
  userPerformance: "object",          // { accuracy, recentTopics, weakAreas }
  sessionHistory: "array",            // Array of past results
  difficulty: "string",               // easy | medium | hard | expert
  curatedContent: "object",           // Extra explanation + examples
  progressReport: "object",
};

// Initialize agents
const questionGen = new QuestionGeneratorAgent();
const weaknessAnalyzer = new WeaknessAnalyzerAgent();
const difficultyAdapter = new DifficultyAdapterAgent();
const contentCurator = new ContentCuratorAgent();
const progressTracker = new ProgressTrackerAgent();

/** Node: Generate next question */
async function generateQuestionNode(state) {
  const result = await questionGen.generate(
    state.topic,
    state.difficulty || "medium",
    state.userPerformance?.weakAreas || []
  );

  return {
    currentQuestion: result,
  };
}

/** Node: Analyze user's answer */
async function analyzeAnswerNode(state) {
  const result = await weaknessAnalyzer.analyze([{
    question: state.currentQuestion.question,
    userAnswer: state.userAnswer,
    correct: state.isCorrect,
  }]);

  return {
    userPerformance: result,
    sessionHistory: [...(state.sessionHistory || []), {
      question: state.currentQuestion.question,
      correct: state.isCorrect,
      topic: state.topic,
    }],
  };
}

/** Node: Adapt difficulty */
async function adaptDifficultyNode(state) {
  const result = await difficultyAdapter.adapt(state.userPerformance || {});

  return {
    difficulty: result.recommendedDifficulty,
  };
}

/** Node: Curate extra learning content (if weak) */
async function curateContentNode(state) {
  if (state.userPerformance?.weakAreas?.length > 0) {
    const result = await contentCurator.curate(
      state.topic,
      state.difficulty,
      state.userPerformance.weakAreas
    );
    return { curatedContent: result };
  }
  return {};
}

/** Node: Track & summarize progress */
async function trackProgressNode(state) {
  const report = await progressTracker.trackProgress(state.sessionHistory || []);
  progressTracker.saveProgress("user123", report); // Update with real user ID later

  return {
    progressReport: report,
  };
}

// Build the graph
const workflow = new StateGraph(LearningState)  // Note: In newer versions you may use Annotation
  .addNode("generateQuestion", generateQuestionNode)
  .addNode("analyzeAnswer", analyzeAnswerNode)
  .addNode("adaptDifficulty", adaptDifficultyNode)
  .addNode("curateContent", curateContentNode)
  .addNode("trackProgress", trackProgressNode)

  .addEdge(START, "generateQuestion")
  .addEdge("generateQuestion", "analyzeAnswer")
  .addEdge("analyzeAnswer", "adaptDifficulty")
  .addEdge("adaptDifficulty", "curateContent")
  .addEdge("curateContent", "trackProgress")
  .addEdge("trackProgress", END);   // Loop back to generateQuestion in your UI logic

// Compile the workflow
export const learningGraph = workflow.compile();

export default learningGraph;
