const quizPayload = (quizData) => {
  const payload = {
    //

    title: quizData.title,
    description: quizData.description,
    quiz: {
      title: quizData.title,
      description: quizData.description,
      questions: quizData.questions || [],
    },
    isPaper: quizData.isPaper || false,
    score: 0,
    totalQuestions: quizData.quiz?.questions?.length || 0,
  };
  return payload;
};

export { quizPayload };
