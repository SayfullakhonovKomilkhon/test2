import { QuizData, QuizSettings, DeepExplanationResult } from '../types/quiz';

export async function generateQuiz(settings: QuizSettings): Promise<QuizData> {
  const response = await fetch('/api/quiz/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Не удалось создать викторину');
  }

  return data as QuizData;
}

export async function explainQuestion(params: {
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
}): Promise<DeepExplanationResult> {
  const response = await fetch('/api/quiz/explain', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Не удалось получить объяснение');
  }

  return data as DeepExplanationResult;
}
