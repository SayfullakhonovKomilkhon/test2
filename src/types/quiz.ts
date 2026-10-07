export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizData {
  title: string;
  topic: string;
  difficulty: Difficulty;
  questions: QuizQuestion[];
}

export interface QuizSettings {
  topic: string;
  numberOfQuestions: number;
  difficulty: Difficulty;
}

export interface DeepExplanationResult {
  whyCorrect: string;
  whyChosenWasIncorrect?: string;
  keyTakeaway: string;
}
