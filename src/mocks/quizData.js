export const mockQuizData = {
  // 1. ALL YOUR FOOD CONFIGURATION THEMES
  themes: {
    coffee: {
      background: '#fcfaf7',
      surface:    '#f3ece3',
      primary:    '#6f4e37',
      secondary:  '#b8860b',
      text:       '#2c1e14',
    },
    cake: {
      background: '#fff9fb',
      surface:    '#fbe3e9',
      primary:    '#d25d78',
      secondary:  '#e8a7b6',
      text:       '#3d141d',
    },

  // 2. SAMPLE QUIZ DATA TO TEST YOUR UI
  questions: [
    {
      id: 1,
      question: "What makes a snack taste stay fresh for a long time?",
      options: ["Salt", "Yeast", "Sugar", "Preservative"],
      correctAnswer: "Preservative"
    },
    {
      id: 2,
      question: "What makes a coffee hot?",
      options: ["Warm water", "Cold water", "Hot water", "Frozen wateri"],
      correctAnswer: "Hot water"
    }
  ]
};
