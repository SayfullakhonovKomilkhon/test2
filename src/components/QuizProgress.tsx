import React from 'react';
import { Difficulty } from '../types/quiz';
import { Shield, Zap, Flame } from 'lucide-react';

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  topic: string;
  difficulty: Difficulty;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentIndex,
  totalQuestions,
  topic,
  difficulty,
}) => {
  const currentNumber = currentIndex + 1;
  const progressPercent = Math.round((currentNumber / totalQuestions) * 100);

  const getDifficultyBadge = () => {
    switch (difficulty) {
      case 'easy':
        return (
          <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Shield className="w-3 h-3" />
            <span>Легкий</span>
          </span>
        );
      case 'hard':
        return (
          <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-0.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <Flame className="w-3 h-3" />
            <span>Сложный</span>
          </span>
        );
      case 'medium':
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <Zap className="w-3 h-3" />
            <span>Средний</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-3 mb-6">
      {/* Top row: Topic & Difficulty */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center space-x-2 truncate mr-2">
          <span className="text-slate-400">Тема:</span>
          <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
            {topic}
          </span>
        </div>
        <div>{getDifficultyBadge()}</div>
      </div>

      {/* Counter and Percent */}
      <div className="flex items-center justify-between">
        <span className="text-base sm:text-lg font-bold text-white tracking-tight">
          Вопрос {currentNumber} из {totalQuestions}
        </span>
        <span className="text-sm font-semibold text-indigo-400">
          {progressPercent}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
