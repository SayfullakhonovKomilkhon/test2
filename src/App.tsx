import React, { useState } from 'react';
import { QuizData, QuizSettings, Difficulty } from './types/quiz';
import { generateQuiz } from './services/api';
import { QuizSetup } from './components/QuizSetup';
import { QuizLoading } from './components/QuizLoading';
import { QuizProgress } from './components/QuizProgress';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { ErrorMessage } from './components/ErrorMessage';
import { Brain, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  // Setup & Configuration State
  const [topic, setTopic] = useState<string>('');
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  // Quiz Execution State
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Status & Error State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | undefined>(undefined);

  // Generate a new quiz with specific settings
  const handleStartQuiz = async (settings: QuizSettings) => {
    setTopic(settings.topic);
    setNumberOfQuestions(settings.numberOfQuestions);
    setDifficulty(settings.difficulty);

    setIsLoading(true);
    setErrorMessage(null);
    setErrorDetails(undefined);
    setQuizCompleted(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);

    try {
      const data = await generateQuiz(settings);
      setGeneratedQuiz(data);
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      setErrorMessage('Не удалось создать викторину');
      setErrorDetails(err?.message || 'Ошибка соединения с AI сервисом');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-generate using identical topic and settings
  const handleRetrySameTopic = () => {
    if (!topic) {
      handleResetToSetup();
      return;
    }
    handleStartQuiz({
      topic,
      numberOfQuestions,
      difficulty,
    });
  };

  // Return to Setup Screen
  const handleResetToSetup = () => {
    setGeneratedQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setErrorMessage(null);
  };

  // Answer selection handler
  const handleSelectAnswer = (optionIndex: number) => {
    if (!generatedQuiz) return;
    const currentQ = generatedQuiz.questions[currentQuestionIndex];
    if (!currentQ) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  // Navigation handlers
  const handleNextQuestion = () => {
    if (!generatedQuiz) return;
    if (currentQuestionIndex < generatedQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed quiz
      setQuizCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative">
      {/* Background radial glow spots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToSetup}
            className="flex items-center space-x-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 group-hover:border-indigo-400/60 transition-all">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-lg text-white tracking-tight leading-none group-hover:text-indigo-300 transition-colors">
                AI Quiz
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider">
                Powered by Gemini
              </span>
            </div>
          </button>

          <div className="flex items-center space-x-3">
            {generatedQuiz && !quizCompleted && (
              <button
                type="button"
                onClick={handleResetToSetup}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer flex items-center space-x-1.5"
                title="Вернуться к созданию нового теста"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Новая тема</span>
              </button>
            )}

            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Умная генерация вопросов</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main App Content Body */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-6 sm:py-10">
        {/* State 1: Error Screen */}
        {errorMessage && !isLoading && (
          <ErrorMessage
            message={errorMessage}
            details={errorDetails}
            onRetry={handleRetrySameTopic}
            onBackToSetup={handleResetToSetup}
          />
        )}

        {/* State 2: Loading State */}
        {isLoading && (
          <QuizLoading topic={topic} numberOfQuestions={numberOfQuestions} />
        )}

        {/* State 3: Quiz Finished -> Results & Review */}
        {!isLoading && !errorMessage && quizCompleted && generatedQuiz && (
          <QuizResults
            quiz={generatedQuiz}
            selectedAnswers={selectedAnswers}
            onRetrySameTopic={handleRetrySameTopic}
            onNewQuiz={handleResetToSetup}
            isRetrying={isLoading}
          />
        )}

        {/* State 4: Active Quiz Taking Screen */}
        {!isLoading && !errorMessage && !quizCompleted && generatedQuiz && (
          <div className="w-full max-w-2xl mx-auto px-4">
            <QuizProgress
              currentIndex={currentQuestionIndex}
              totalQuestions={generatedQuiz.questions.length}
              topic={generatedQuiz.topic}
              difficulty={generatedQuiz.difficulty}
            />

            <QuizQuestion
              question={generatedQuiz.questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={generatedQuiz.questions.length}
              selectedAnswerIndex={
                selectedAnswers[generatedQuiz.questions[currentQuestionIndex].id]
              }
              onSelectAnswer={handleSelectAnswer}
              onNext={handleNextQuestion}
              onPrev={handlePrevQuestion}
              isFirst={currentQuestionIndex === 0}
              isLast={
                currentQuestionIndex === generatedQuiz.questions.length - 1
              }
            />
          </div>
        )}

        {/* State 5: Initial Setup Screen */}
        {!isLoading && !errorMessage && !quizCompleted && !generatedQuiz && (
          <QuizSetup
            initialSettings={{ topic, numberOfQuestions, difficulty }}
            onSubmit={handleStartQuiz}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-4 text-center text-xs text-slate-500">
        <p>
          AI Quiz — Интеллектуальные викторины на любую тему с детальным разбором ответов
        </p>
      </footer>
    </div>
  );
}
