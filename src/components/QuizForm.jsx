function QuizForm({ topic, setTopic, onGenerate }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Enter a topic
      </label>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g. JavaScript, Biology, History"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
      />

      <button
        onClick={onGenerate}
        className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Generate Quiz
      </button>
    </div>
  );
}

export default QuizForm;
