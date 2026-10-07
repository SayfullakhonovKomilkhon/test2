import React from 'react';
import { QuizData } from '../types/quiz';
import { QuestionReview } from './QuestionReview';
import { RotateCcw, PlusCircle, CheckCircle, XCircle, Award, Target } from 'lucide-react';

interface QuizResultsProps {
  quiz: QuizData;
  selectedAnswers: Record<number, number>;
  onRetrySameTopic: () => void;
  onNewQuiz: () => void;
  isRetrying?: boolean;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  selectedAnswers,
  onRetrySameTopic,
  onNewQuiz,
  isRetrying = false,
}) => {
  const total = quiz.questions.length;
  const correctCount = quiz.questions.filter(
    (q) => selectedAnswers[q.id] === q.correctAnswer
  ).length;
  const incorrectCount = total - correctCount;
  const percentage = Math.round((correctCount / total) * 100);

  // Score evaluation text as mandated in prompt
  const getEvaluation = () => {
    if (percentage >= 90) {
      return {
        text: 'Отличный результат! 🔥',
        subtext: 'Вы великолепно разбираетесь в этой теме!',
        color: 'text-emerald-400',
        ringColor: '#10b981',
      };
    }
    if (percentage >= 70) {
      return {
        text: 'Очень хороший результат!',
        subtext: 'Уверенные знания и глубокое понимание материала.',
        color: 'text-indigo-400',
        ringColor: '#6366f1',
      };
    }
    if (percentage >= 50) {
      return {
        text: 'Неплохо! Есть куда расти.',
        subtext: 'Хорошая база, еще немного практики — и будет идеально!',
        color: 'text-amber-400',
        ringColor: '#f59e0b',
      };
    }
    return {
      text: 'Попробуйте еще раз и улучшите результат!',
      subtext: 'Каждая ошибка — это шаг к новым знаниям.',
      color: 'text-rose-400',
      ringColor: '#f43f5e',
    };
  };

  const evalInfo = getEvaluation();

  // SVG Ring calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Result Card */}
      <div className="backdrop-blur-xl bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-teal-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header */}
        <div className="text-center relative space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Тест завершен</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Результаты викторины
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Тема: <span className="text-white font-medium">«{quiz.topic}»</span>
          </p>
        </div>

        {/* Big Score with Radial Ring Progress */}
        <div className="flex flex-col items-center justify-center relative py-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-800"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={evalInfo.ringColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner text inside circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {correctCount} <span className="text-slate-500 text-2xl font-bold">/</span> {total}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent mt-0.5">
                {percentage}%
              </div>
            </div>
          </div>

          {/* Feedback Evaluation */}
          <div className="text-center mt-5 space-y-1">
            <div className={`text-xl sm:text-2xl font-bold ${evalInfo.color}`}>
              {evalInfo.text}
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {evalInfo.subtext}
            </p>
          </div>
        </div>

        {/* Stats Grid: Correct & Incorrect */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
          {/* Correct */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">
                Правильных ответов
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">
                {correctCount}
              </div>
            </div>
          </div>

          {/* Incorrect */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">
                Неправильных ответов
              </div>
              <div className="text-xl sm:text-2xl font-black text-rose-300">
                {incorrectCount}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: "Пройти еще раз" & "Новая викторина" */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-white/10 max-w-md mx-auto">
          <button
            type="button"
            disabled={isRetrying}
            onClick={onRetrySameTopic}
            className="w-full sm:w-1/2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all cursor-pointer flex items-center justify-center space-x-2 border border-indigo-400/30 active:scale-[0.99] disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>Пройти еще раз</span>
          </button>

          <button
            type="button"
            disabled={isRetrying}
            onClick={onNewQuiz}
            className="w-full sm:w-1/2 py-3.5 px-5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-white font-semibold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Новая викторина</span>
          </button>
        </div>

        {/* Question Review Component */}
        <QuestionReview
          questions={quiz.questions}
          selectedAnswers={selectedAnswers}
          topic={quiz.topic}
        />
      </div>
    </div>
  );
};
