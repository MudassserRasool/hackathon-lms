const QUIZ_GENERATION_PROMPT = (
  prompt
) => `I will provide you a prompt, and you will generate a quiz based on it. The quiz should include the following:
1. A title for the quiz
2. 30 multiple choice questions
3. Each question should have 4 options
4. The correct answer for each question
5. The quiz should be in a JSON format
6. The quiz should be in English
7. The quiz should be suitable according to the prompt
8. quiz should have 10 easy ,10 medium and 10 hard questions
9. each question should also have a hint
So now please generate a quiz based on the following prompt:
${prompt}
For further clarification here is the format of json:
{
  "title": "Quiz Title",
  "description": "Quiz Description",
  "difficulty": "easy/medium/hard",
  "totalQuestions": 30,
  "totalMarks": 30,
  "questions": [
    {
      "question": "Question 1?",
      "options": [
        {
          "optionText": "Option A",
          "isCorrect": true
        },
        {
          "optionText": "Option B",
          "isCorrect": false
        },
        {
          "optionText": "Option C",
          "isCorrect": false
        },
        {
          "optionText": "Option D",
          "isCorrect": false
        }
      ],
      "hint":"hint for question"
    },
    ...
  ]
}
`;

export { QUIZ_GENERATION_PROMPT };
