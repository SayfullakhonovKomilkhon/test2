import React, { useState } from 'react';
import { QuizQuestion as IQuizQuestion } from '../types/quiz';
import { ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: IQuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswerIndex: number | undefined;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  onPrev?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswerIndex,
  onSelectAnswer,
  onNext,
  onPrev,
  isFirst,
  isLast,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNextClick = () => {
    if (selectedAnswerIndex === undefined) {
      setValidationError('Выберите один из вариантов ответа');
      return;
    }
    setValidationError(null);
    onNext();
  };

  const handleOptionClick = (index: number) => {
    setValidationError(null);
    onSelectAnswer(index);
  };

  return (
    <div className="w-full">
      <div className="backdrop-blur-xl bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 sm:space-y-8">
        {/* Question Text */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Вопрос {questionNumber}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed tracking-tight">
            {question.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswerIndex === idx;
            const letter = OPTION_LETTERS[idx] || `${idx + 1}`;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionClick(idx)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center space-x-3.5 group relative overflow-hidden ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] border-2'
                    : 'border-white/10 bg-white/[0.02] text-slate-200 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                {/* Radio Indicator */}
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-500 text-white shadow-sm'
                      : 'border-slate-500/60 bg-slate-800/40 text-transparent group-hover:border-slate-400'
                  }`}
                >
                  {isSelected ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-300">
                      {letter}
                    </span>
                  )}
                </div>

                {/* Option Text */}
                <span className="text-sm sm:text-base font-medium flex-1">
                  {option}
                </span>

                {isSelected && (
                  <span className="hidden sm:inline-flex items-center text-xs font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    Выбрано
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Validation Warning */}
        {validationError && (
          <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl text-sm animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-3">
          {/* Back button */}
          {!isFirst && onPrev ? (
            <button
              type="button"
              onClick={onPrev}
              className="py-3 px-4 sm:px-5 rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all font-medium text-sm flex items-center space-x-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
          ) : (
            <div />
          )}

          {/* Next / Finish Button */}
          <button
            type="button"
            onClick={handleNextClick}
            className={`py-3.5 px-6 sm:px-8 rounded-xl font-bold text-white text-sm sm:text-base transition-all duration-200 cursor-pointer flex items-center space-x-2 border shadow-lg ${
              isLast
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
            }`}
          >
            <span>{isLast ? 'Завершить тест' : 'Следующий вопрос'}</span>
            {isLast ? (
              <Check className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
            ) : (
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
