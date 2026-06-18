import { useState } from "react";
import QuizForm from "./components/QuizForm";
import QuizDisplay from "./components/QuizDisplay";
import Loading from "./components/Loading";
import { generateQuiz } from "./services/quizApi";

function App() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await generateQuiz(topic);
      setQuestions(result);
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-3xl font-bold">AI Quiz App</h1>

        <QuizForm
          topic={topic}
          setTopic={setTopic}
          onGenerate={handleGenerateQuiz}
        />

        {loading && <Loading />}
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {questions.length > 0 && <QuizDisplay questions={questions} />}
      </div>
    </div>
  );
}

export default App;
