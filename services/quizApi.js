function QuizDisplay({ questions }) {
  return (
    <div className="mt-6 space-y-4">
      {questions.map((question, index) => (
        <div key={index} className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-lg font-semibold">
            {index + 1}. {question.question}
          </h2>

          <ul className="space-y-2">
            {question.options.map((option, i) => (
              <li
                key={i}
                className="rounded-lg border border-gray-200 px-4 py-2"
              >
                {option}
              </li>
            ))}
          </ul>

          <p className="mt-3 text-sm text-green-600">
            Answer: {question.answer}
          </p>
        </div>
      ))}
    </div>
  );
}

export default QuizDisplay;

