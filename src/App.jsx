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
    <div className="app">
      <h1>AI Quiz App</h1>

      <QuizForm
        topic={topic}
        setTopic={setTopic}
        onGenerate={handleGenerateQuiz}
      />

      {loading && <Loading />}
      {error && <p className="error">{error}</p>}
      {questions.length > 0 && <QuizDisplay questions={questions} />}
    </div>
  );
}

export default App;
