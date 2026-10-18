export async function generateQuiz(topic) {
  const response = await fetch("YOUR_API_ENDPOINT_HERE", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate quiz");
  }

  const data = await response.json();
  return data.questions;
}
